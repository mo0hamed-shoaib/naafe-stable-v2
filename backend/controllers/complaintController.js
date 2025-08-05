import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import JobRequest from '../models/JobRequest.js';
import AdminAction from '../models/AdminAction.js';

class ComplaintController {
  /**
   * Submit a new complaint
   * POST /api/complaints
   */
  async submitComplaint(req, res) {
    try {
      const { user } = req;
      const { reportedUserId, jobRequestId, problemType, description } = req.body;

      // Validate required fields
      if (!reportedUserId || !jobRequestId || !problemType || !description) {
        return res.status(400).json({
          success: false,
          error: { message: 'جميع الحقول مطلوبة' }
        });
      }

      // Validate problem type
      const validProblemTypes = ['late', 'no_show', 'incomplete_work', 'poor_quality', 'rude_behavior', 'price_dispute', 'other'];
      if (!validProblemTypes.includes(problemType)) {
        return res.status(400).json({
          success: false,
          error: { message: 'نوع المشكلة غير صحيح' }
        });
      }

      // Check if user is reporting themselves
      if (user._id.toString() === reportedUserId) {
        return res.status(400).json({
          success: false,
          error: { message: 'لا يمكنك الإبلاغ عن نفسك' }
        });
      }

      // Verify reported user exists
      const reportedUser = await User.findById(reportedUserId);
      if (!reportedUser) {
        return res.status(404).json({
          success: false,
          error: { message: 'المستخدم المبلغ عنه غير موجود' }
        });
      }

      // Verify job request exists and user is involved
      const jobRequest = await JobRequest.findById(jobRequestId);
      if (!jobRequest) {
        return res.status(404).json({
          success: false,
          error: { message: 'طلب الخدمة غير موجود' }
        });
      }

      // Check if user is involved in this job request
      const isSeeker = jobRequest.seeker && jobRequest.seeker.toString() === user._id.toString();
      const isProvider = jobRequest.assignedTo && jobRequest.assignedTo.toString() === user._id.toString();
      
      if (!isSeeker && !isProvider) {
        return res.status(403).json({
          success: false,
          error: { message: 'غير مصرح لك بالإبلاغ عن هذا الطلب' }
        });
      }

      // Check if user is reporting the correct person
      const reportedUserInJob = isSeeker ? jobRequest.assignedTo : jobRequest.seeker;
      
      if (!reportedUserInJob) {
        return res.status(400).json({
          success: false,
          error: { message: 'لا يمكن الإبلاغ عن طلب لم يتم تعيين مقدم خدمة له بعد' }
        });
      }
      
      if (reportedUserInJob.toString() !== reportedUserId) {
        return res.status(400).json({
          success: false,
          error: { message: 'المستخدم المبلغ عنه غير متورط في هذا الطلب' }
        });
      }

      // Check if complaint already exists for this job request from this user
      const existingComplaint = await Complaint.findOne({
        reporterId: user._id,
        jobRequestId: jobRequestId,
        status: { $in: ['pending', 'investigating'] }
      });

      if (existingComplaint) {
        return res.status(400).json({
          success: false,
          error: { message: 'لديك بلاغ قيد المعالجة لهذا الطلب بالفعل' }
        });
      }

      // Create the complaint
      const complaint = new Complaint({
        reporterId: user._id,
        reportedUserId,
        jobRequestId,
        problemType,
        description: description.trim()
      });

      await complaint.save();

      res.status(201).json({
        success: true,
        data: { complaint },
        message: 'تم إرسال البلاغ بنجاح'
      });

    } catch (error) {
      console.error('Error submitting complaint:', error);
      res.status(500).json({
        success: false,
        error: { message: 'حدث خطأ أثناء إرسال البلاغ' }
      });
    }
  }

  /**
   * Get complaints for admin (with filters)
   * GET /api/admin/complaints
   */
  async getComplaints(req, res) {
    try {
      const { status, search, page = 1, limit = 20 } = req.query;
      
      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }

      // Search functionality
      let searchMatch = {};
      if (search) {
        searchMatch = {
          $or: [
            { 'reporter.name.first': { $regex: search, $options: 'i' } },
            { 'reporter.name.last': { $regex: search, $options: 'i' } },
            { 'reporter.email': { $regex: search, $options: 'i' } },
            { 'reportedUser.name.first': { $regex: search, $options: 'i' } },
            { 'reportedUser.name.last': { $regex: search, $options: 'i' } },
            { 'reportedUser.email': { $regex: search, $options: 'i' } },
            { 'jobRequest.title': { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Aggregate pipeline to get populated data
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'reporterId',
            foreignField: '_id',
            as: 'reporter'
          }
        },
        { $unwind: '$reporter' },
        {
          $lookup: {
            from: 'users',
            localField: 'reportedUserId',
            foreignField: '_id',
            as: 'reportedUser'
          }
        },
        { $unwind: '$reportedUser' },
        {
          $lookup: {
            from: 'jobrequests',
            localField: 'jobRequestId',
            foreignField: '_id',
            as: 'jobRequest'
          }
        },
        { $unwind: '$jobRequest' },
        ...(search ? [{ $match: searchMatch }] : []),
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ];

      const complaints = await Complaint.aggregate(pipeline);
      const total = await Complaint.countDocuments(query);

      // Add virtual fields to complaints
      const complaintsWithVirtuals = complaints.map(complaint => {
        const complaintDoc = new Complaint(complaint);
        return {
          ...complaint,
          problemTypeLabel: complaintDoc.problemTypeLabel,
          statusLabel: complaintDoc.statusLabel,
          adminActionLabel: complaintDoc.adminActionLabel
        };
      });

      res.json({
        success: true,
        data: {
          complaints: complaintsWithVirtuals,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Error getting complaints:', error);
      res.status(500).json({
        success: false,
        error: { message: 'حدث خطأ أثناء جلب البلاغات' }
      });
    }
  }

  /**
   * Update complaint status and admin action
   * PATCH /api/admin/complaints/:id
   */
  async updateComplaint(req, res) {
    try {
      const { id } = req.params;
      const { status, adminAction, adminNotes, actionType } = req.body;
      const { user } = req; // Get admin from auth middleware (admin is a user with role)

      const complaint = await Complaint.findById(id);
      if (!complaint) {
        return res.status(404).json({
          success: false,
          error: { message: 'البلاغ غير موجود' }
        });
      }

      // Validate status
      const validStatuses = ['pending', 'investigating', 'resolved', 'dismissed'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: { message: 'حالة البلاغ غير صحيحة' }
        });
      }

      // Validate admin action
      const validActions = ['warning', 'suspension', 'ban', 'refund', 'none'];
      if (adminAction && !validActions.includes(adminAction)) {
        return res.status(400).json({
          success: false,
          error: { message: 'الإجراء الإداري غير صحيح' }
        });
      }

      // Store previous values for tracking
      const previousStatus = complaint.status;
      const previousAdminAction = complaint.adminAction;

      // Update complaint
      const updateData = {};
      if (status) updateData.status = status;
      if (adminAction) updateData.adminAction = adminAction;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      
      // Set resolvedAt if status is resolved or dismissed
      if (status === 'resolved' || status === 'dismissed') {
        updateData.resolvedAt = new Date();
      }

      const updatedComplaint = await Complaint.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      // Create admin action record
      const adminActionRecord = new AdminAction({
        complaintId: id,
        adminId: user._id,
        actionType: actionType || 'update', // Default to 'update' if not specified
        previousStatus,
        newStatus: updatedComplaint.status,
        previousAdminAction,
        newAdminAction: updatedComplaint.adminAction,
        notes: adminNotes,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      await adminActionRecord.save();

      // If admin action is ban, block the reported user
      if (adminAction === 'ban') {
        await User.findByIdAndUpdate(complaint.reportedUserId, { isBlocked: true });
      }

      res.json({
        success: true,
        data: { complaint: updatedComplaint },
        message: 'تم تحديث البلاغ بنجاح'
      });

    } catch (error) {
      console.error('Error updating complaint:', error);
      res.status(500).json({
        success: false,
        error: { message: 'حدث خطأ أثناء تحديث البلاغ' }
      });
    }
  }

  /**
   * Get complaint statistics for admin dashboard
   * GET /api/admin/complaints/stats
   */
  async getComplaintStats(req, res) {
    try {
      const stats = await Complaint.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalComplaints = await Complaint.countDocuments();
      const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
      const investigatingComplaints = await Complaint.countDocuments({ status: 'investigating' });

      // Convert to object format
      const statusStats = stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          total: totalComplaints,
          pending: pendingComplaints,
          investigating: investigatingComplaints,
          byStatus: statusStats
        }
      });

    } catch (error) {
      console.error('Error getting complaint stats:', error);
      res.status(500).json({
        success: false,
        error: { message: 'حدث خطأ أثناء جلب إحصائيات البلاغات' }
      });
    }
  }

  /**
   * Get admin actions for a specific complaint
   * GET /api/admin/complaints/:id/actions
   */
  async getComplaintActions(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Verify complaint exists
      const complaint = await Complaint.findById(id);
      if (!complaint) {
        return res.status(404).json({
          success: false,
          error: { message: 'البلاغ غير موجود' }
        });
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get admin actions with admin details
      const pipeline = [
        { $match: { complaintId: complaint._id } },
        {
          $lookup: {
            from: 'users', // Admin is a User discriminator, so use 'users' collection
            localField: 'adminId',
            foreignField: '_id',
            as: 'admin'
          }
        },
        { $unwind: '$admin' },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ];

      const actions = await AdminAction.aggregate(pipeline);
      const total = await AdminAction.countDocuments({ complaintId: complaint._id });

      // Add virtual fields to actions
      const actionsWithVirtuals = actions.map(action => {
        const actionDoc = new AdminAction(action);
        return {
          ...action,
          actionTypeLabel: actionDoc.actionTypeLabel,
          previousStatusLabel: actionDoc.previousStatusLabel,
          newStatusLabel: actionDoc.newStatusLabel,
          previousAdminActionLabel: actionDoc.previousAdminActionLabel,
          newAdminActionLabel: actionDoc.newAdminActionLabel
        };
      });

      res.json({
        success: true,
        data: {
          actions: actionsWithVirtuals,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Error getting complaint actions:', error);
      res.status(500).json({
        success: false,
        error: { message: 'حدث خطأ أثناء جلب إجراءات البلاغ' }
      });
    }
  }
}

export default new ComplaintController(); 