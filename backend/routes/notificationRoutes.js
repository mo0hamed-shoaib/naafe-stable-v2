import express from 'express';
import notificationController from '../controllers/notificationController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// List notifications (paginated)
router.get('/', authenticateToken, notificationController.getNotifications);
// Mark a notification as read
router.patch('/:id/read', authenticateToken, notificationController.markAsRead);
// Mark all as read
router.patch('/read-all', authenticateToken, notificationController.markAllAsRead);
// Delete a notification
router.delete('/:id', authenticateToken, notificationController.deleteNotification);

export default router; 