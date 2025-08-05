import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: ['morning', 'afternoon', 'evening', 'full_day', 'custom']
  },
  // Custom time range for when timeSlot is 'custom'
  customTimeRange: {
    startTime: {
      type: String, // Format: "HH:mm" (24-hour)
      required: function() { return this.timeSlot === 'custom'; }
    },
    endTime: {
      type: String, // Format: "HH:mm" (24-hour)
      required: function() { return this.timeSlot === 'custom'; }
    }
  },
  type: {
    type: String,
    enum: ['available', 'reserved', 'service'],
    default: 'available'
  },
  title: {
    type: String,
    required: function() { return this.type === 'reserved' || this.type === 'service'; }
  },
  description: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'confirmed', 'completed', 'cancelled'],
    default: 'available'
  },
  // For service-related schedules
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  },
  jobRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRequest'
  },
  // For reservations
  reservation: {
    clientName: String,
    clientPhone: String,
    clientEmail: String,
    notes: String,
    estimatedDuration: Number, // in hours
    estimatedCost: Number
  },
  // Recurring availability
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    daysOfWeek: [{
      type: Number, // 0-6 (Sunday-Saturday)
      min: 0,
      max: 6
    }],
    endDate: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
scheduleSchema.index({ provider: 1, date: 1 });
scheduleSchema.index({ provider: 1, date: 1, timeSlot: 1 });
scheduleSchema.index({ provider: 1, type: 1 });
scheduleSchema.index({ provider: 1, status: 1 });
scheduleSchema.index({ offer: 1 });
scheduleSchema.index({ jobRequest: 1 });

// Helper methods
scheduleSchema.methods.isAvailable = function() {
  return this.type === 'available' && this.status === 'available';
};

scheduleSchema.methods.isService = function() {
  return this.type === 'service';
};

scheduleSchema.methods.isReservation = function() {
  return this.type === 'reserved';
};

// Helper method to get formatted time range
scheduleSchema.methods.getFormattedTimeRange = function() {
  if (this.timeSlot === 'custom' && this.customTimeRange) {
    const formatTime12hr = (time24) => {
      const [hours, minutes] = time24.split(':').map(Number);
      const hour12 = ((hours % 12) || 12);
      const ampm = hours < 12 ? 'ص' : 'م';
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };
    
    return `${formatTime12hr(this.customTimeRange.startTime)} - ${formatTime12hr(this.customTimeRange.endTime)}`;
  }
  
  // Default time ranges for predefined slots
  const timeRanges = {
    morning: '8:00 ص - 12:00 م',
    afternoon: '12:00 م - 4:00 م',
    evening: '4:00 م - 8:00 م',
    full_day: '8:00 ص - 8:00 م'
  };
  
  return timeRanges[this.timeSlot] || this.timeSlot;
};

// Static methods
scheduleSchema.statics.getProviderSchedule = async function(providerId, startDate, endDate) {
  return this.find({
    provider: providerId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('offer jobRequest').sort({ date: 1, timeSlot: 1 });
};

scheduleSchema.statics.getAvailableSlots = async function(providerId, date) {
  return this.find({
    provider: providerId,
    date: date,
    type: 'available',
    status: 'available'
  }).sort({ timeSlot: 1 });
};

scheduleSchema.statics.createRecurringAvailability = async function(providerId, pattern) {
  const slots = [];
  const startDate = new Date();
  const endDate = pattern.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (pattern.frequency === 'daily' || 
        (pattern.frequency === 'weekly' && pattern.daysOfWeek.includes(currentDate.getDay()))) {
      
      for (const timeSlot of ['morning', 'afternoon', 'evening']) {
        const slot = new this({
          provider: providerId,
          date: new Date(currentDate),
          timeSlot: timeSlot,
          type: 'available',
          status: 'available',
          isRecurring: true,
          recurringPattern: pattern
        });
        slots.push(slot);
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return this.insertMany(slots);
};

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule; 