import Offer from '../models/Offer.js';
import User from '../models/User.js';
import JobRequest from '../models/JobRequest.js';
import Schedule from '../models/Schedule.js';

/**
 * GET /api/schedule/:providerId
 * Returns comprehensive schedule for a provider including services, reservations, and availability
 */
export const getProviderSchedule = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Only allow the provider themselves or an admin to access
    if (req.user._id.toString() !== providerId && !req.user.roles.includes('admin')) {
      return res.status(403).json({ success: false, error: { message: 'Not authorized' } });
    }

    // Set default date range if not provided (current month)
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Fetch schedule items
    const scheduleItems = await Schedule.getProviderSchedule(providerId, start, end);

    // Fetch offers for this provider in the date range
    const offers = await Offer.find({ 
      provider: providerId,
      'payment.scheduledDate': { $gte: start, $lte: end }
    })
    .populate('jobRequest', 'title seeker location')
    .populate('provider', 'name');

    // Map offers to schedule items if they don't already exist
    const offerScheduleItems = offers.map(offer => {
      // Check if schedule item already exists for this offer
      const existingItem = scheduleItems.find(item => item.offer && item.offer.toString() === offer._id.toString());
      if (existingItem) return null;

      // Determine status for calendar
      let status = 'pending';
      if (['pending', 'negotiating'].includes(offer.status)) {
        status = 'pending';
      } else if (
        ['agreement_reached', 'accepted', 'in_progress'].includes(offer.status)
        && offer.payment && offer.payment.status === 'escrowed'
      ) {
        status = 'confirmed';
      } else if (offer.status === 'completed') {
        status = 'completed';
      } else if (offer.status === 'cancelled' || offer.status === 'rejected' || offer.status === 'withdrawn') {
        return null; // Don't show cancelled/rejected/withdrawn offers
      }

      const scheduledDate = offer.payment?.scheduledDate || (offer.availableDates && offer.availableDates[0]);
      const timeSlot = offer.payment?.scheduledTime || (offer.timePreferences && offer.timePreferences[0]) || 'morning';
      
      // Get seeker name
      let seekerName = '';
      if (offer.jobRequest && offer.jobRequest.seeker) {
        if (typeof offer.jobRequest.seeker === 'object' && offer.jobRequest.seeker.name) {
          seekerName = offer.jobRequest.seeker.name.first + ' ' + offer.jobRequest.seeker.name.last;
        } else {
          seekerName = 'طالب الخدمة';
        }
      }

      return {
        id: offer._id,
        date: scheduledDate ? new Date(scheduledDate).toISOString().slice(0, 10) : '',
        timeSlot,
        status,
        type: 'service',
        title: offer.jobRequest?.title || 'خدمة',
        description: offer.message || '',
        seekerName,
        location: offer.jobRequest?.location || 'غير محدد',
        offer: offer._id,
        jobRequest: offer.jobRequest?._id
      };
    }).filter(Boolean);

    // Combine schedule items
    const allScheduleItems = [
      ...scheduleItems.map(item => ({
        id: item._id,
        date: item.date.toISOString().slice(0, 10),
        timeSlot: item.timeSlot,
        customTimeRange: item.customTimeRange,
        status: item.status,
        type: item.type,
        title: item.title || '',
        description: item.description || '',
        seekerName: item.reservation?.clientName || '',
        location: item.reservation?.notes || '',
        offer: item.offer,
        jobRequest: item.jobRequest,
        reservation: item.reservation
      })),
      ...offerScheduleItems
    ];

    console.log('Schedule items with custom time ranges:', allScheduleItems.filter(item => item.customTimeRange));
    
    res.status(200).json({
      success: true,
      data: { schedule: allScheduleItems },
      message: 'Schedule retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

/**
 * POST /api/schedule/availability
 * Create availability slots for a provider
 */
export const createAvailability = async (req, res) => {
  try {
    const { dates, timeSlots, customTimeRanges, isRecurring, recurringPattern } = req.body;
    const providerId = req.user._id;
    
    console.log('Availability creation request:', {
      dates,
      timeSlots,
      customTimeRanges,
      isRecurring,
      recurringPattern
    });

    // Validate provider role
    if (!req.user.roles.includes('provider')) {
      return res.status(403).json({ success: false, error: { message: 'Only providers can create availability' } });
    }

    const slots = [];

    if (isRecurring && recurringPattern) {
      // Create recurring availability
      const createdSlots = await Schedule.createRecurringAvailability(providerId, recurringPattern);
      slots.push(...createdSlots);
    } else {
      // Create specific date/time slots (allow multiple slots per day)
      for (const date of dates) {
        for (let i = 0; i < timeSlots.length; i++) {
          const timeSlot = timeSlots[i];
          
          // Create new slot
          const slotData = {
            provider: providerId,
            date: new Date(date),
            timeSlot,
            type: 'available',
            status: 'available'
          };

          // Add custom time range if it's a custom slot
          if (timeSlot === 'custom' && customTimeRanges && customTimeRanges[i]) {
            slotData.customTimeRange = customTimeRanges[i];
          }

          console.log('Creating slot:', slotData);
          const slot = new Schedule(slotData);
          slots.push(slot);
        }
      }
    }

    await Schedule.insertMany(slots);

    res.status(201).json({
      success: true,
      data: { slots: slots.length },
      message: 'Availability created successfully'
    });
  } catch (error) {
    console.error('Availability creation error:', error);
    if (error.code === 11000) {
      res.status(400).json({ success: false, error: { message: 'Some slots already exist for the specified dates and times' } });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, error: { message: error.message } });
    } else {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
};

/**
 * POST /api/schedule/reservation
 * Create a reservation for a provider
 */
export const createReservation = async (req, res) => {
  try {
    const { date, timeSlot, customTimeRange, title, description, clientName, clientPhone, clientEmail, notes, estimatedDuration, estimatedCost } = req.body;
    const providerId = req.user._id;
    
    console.log('Reservation creation request:', {
      date,
      timeSlot,
      customTimeRange,
      title,
      description
    });

    // Validate provider role
    if (!req.user.roles.includes('provider')) {
      return res.status(403).json({ success: false, error: { message: 'Only providers can create reservations' } });
    }

    // Create new reservation slot (allow multiple slots per day)
    const reservationData = {
      provider: providerId,
      date: new Date(date),
      timeSlot,
      type: 'reserved',
      status: 'pending',
      title,
      description,
      reservation: {
        clientName,
        clientPhone,
        clientEmail,
        notes,
        estimatedDuration,
        estimatedCost
      }
    };

    // Add custom time range if it's a custom slot
    if (timeSlot === 'custom' && customTimeRange) {
      reservationData.customTimeRange = customTimeRange;
    }

    console.log('Creating reservation:', reservationData);
    const reservation = new Schedule(reservationData);
    await reservation.save();

    res.status(201).json({
      success: true,
      data: { reservation },
      message: 'Reservation created successfully'
    });
  } catch (error) {
    console.error('Reservation creation error:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, error: { message: error.message } });
    } else {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
};

/**
 * PUT /api/schedule/:scheduleId
 * Update a schedule item
 */
export const updateScheduleItem = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updateData = req.body;
    const providerId = req.user._id;

    const scheduleItem = await Schedule.findById(scheduleId);

    if (!scheduleItem) {
      return res.status(404).json({ success: false, error: { message: 'Schedule item not found' } });
    }

    // Check authorization
    if (scheduleItem.provider.toString() !== providerId.toString() && !req.user.roles.includes('admin')) {
      return res.status(403).json({ success: false, error: { message: 'Not authorized' } });
    }

    // Update the item
    Object.assign(scheduleItem, updateData);
    await scheduleItem.save();

    res.status(200).json({
      success: true,
      data: { scheduleItem },
      message: 'Schedule item updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

/**
 * DELETE /api/schedule/:scheduleId
 * Delete a schedule item
 */
export const deleteScheduleItem = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const providerId = req.user._id;

    const scheduleItem = await Schedule.findById(scheduleId);

    if (!scheduleItem) {
      return res.status(404).json({ success: false, error: { message: 'Schedule item not found' } });
    }

    // Check authorization
    if (scheduleItem.provider.toString() !== providerId.toString() && !req.user.roles.includes('admin')) {
      return res.status(403).json({ success: false, error: { message: 'Not authorized' } });
    }

    // Don't allow deletion of service-related items
    if (scheduleItem.type === 'service') {
      return res.status(400).json({ success: false, error: { message: 'Cannot delete service-related schedule items' } });
    }

    await Schedule.findByIdAndDelete(scheduleId);

    res.status(200).json({
      success: true,
      message: 'Schedule item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

/**
 * GET /api/schedule/availability/:providerId
 * Get available slots for a provider on a specific date
 */
export const getAvailableSlots = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, error: { message: 'Date parameter is required' } });
    }

    const availableSlots = await Schedule.getAvailableSlots(providerId, new Date(date));

    res.status(200).json({
      success: true,
      data: { availableSlots },
      message: 'Available slots retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
}; 