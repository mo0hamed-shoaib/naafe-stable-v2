import express from 'express';
import reportController from '../controllers/reportController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/reports
 * @desc    Create a new report
 * @access  Private
 */
router.post('/', authenticateToken, reportController.createReport);

/**
 * @route   GET /api/reports
 * @desc    Get user's own reports
 * @access  Private
 */
router.get('/', authenticateToken, reportController.getMyReports);

/**
 * @route   GET /api/admin/reports
 * @desc    Get all reports (admin only)
 * @access  Private (Admin)
 */
router.get('/admin', authenticateToken, requireRole(['admin']), reportController.getAllReports);

/**
 * @route   PATCH /api/admin/reports/:id
 * @desc    Update report status (admin only)
 * @access  Private (Admin)
 */
router.patch('/admin/:id', authenticateToken, requireRole(['admin']), reportController.updateReportStatus);

export default router; 