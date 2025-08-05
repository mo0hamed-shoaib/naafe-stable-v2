import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

// GET /api/upgrade-requests/me - Get all upgrade requests for the current user
router.get('/me', authenticateToken, userController.getAllMyUpgradeRequests);
// PATCH /api/upgrade-requests/viewed - Mark all unviewed requests as viewed
router.patch('/viewed', authenticateToken, userController.markUpgradeRequestsViewed);

export default router; 