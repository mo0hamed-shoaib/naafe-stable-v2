import express from 'express';
import complaintController from '../controllers/complaintController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User routes (authenticated users can submit complaints)
router.post('/', authenticateToken, complaintController.submitComplaint.bind(complaintController));

// Admin routes (only admins can access)
router.get('/admin', authenticateToken, requireRole(['admin']), complaintController.getComplaints.bind(complaintController));
router.patch('/admin/:id', authenticateToken, requireRole(['admin']), complaintController.updateComplaint.bind(complaintController));
router.get('/admin/stats', authenticateToken, requireRole(['admin']), complaintController.getComplaintStats.bind(complaintController));
router.get('/admin/:id/actions', authenticateToken, requireRole(['admin']), complaintController.getComplaintActions.bind(complaintController));

export default router; 