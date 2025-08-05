import express from 'express';
import reviewController from '../controllers/reviewController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create a review (authenticated)
router.post('/', authenticateToken, reviewController.createReview);

// Get reviews for a user by role
router.get('/user/:userId', reviewController.getUserReviews);

export default router; 