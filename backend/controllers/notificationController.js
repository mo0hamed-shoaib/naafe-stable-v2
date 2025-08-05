import Notification from '../models/Notification.js';

class NotificationController {
  // List notifications for the current user (paginated)
  async getNotifications(req, res) {
    try {
      const userId = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        Notification.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Notification.countDocuments({ userId })
      ]);

      res.status(200).json({
        success: true,
        data: {
          notifications,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        },
        message: 'Notifications retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message },
        timestamp: new Date().toISOString()
      });
    }
  }

  // Mark a notification as read
  async markAsRead(req, res) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const notification = await Notification.findOneAndUpdate(
        { _id: id, userId },
        { isRead: true },
        { new: true }
      );
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Notification not found' },
          timestamp: new Date().toISOString()
        });
      }
      res.status(200).json({
        success: true,
        data: { notification },
        message: 'Notification marked as read',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message },
        timestamp: new Date().toISOString()
      });
    }
  }

  // Mark all notifications as read for the user
  async markAllAsRead(req, res) {
    try {
      const userId = req.user._id;
      const result = await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
      res.status(200).json({
        success: true,
        data: { modifiedCount: result.modifiedCount },
        message: 'All notifications marked as read',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message },
        timestamp: new Date().toISOString()
      });
    }
  }

  // Delete a notification (optional)
  async deleteNotification(req, res) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const result = await Notification.deleteOne({ _id: id, userId });
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Notification not found' },
          timestamp: new Date().toISOString()
        });
      }
      res.status(200).json({
        success: true,
        message: 'Notification deleted',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message },
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new NotificationController(); 