import express from 'express';
import jobRequestController from '../controllers/jobRequestController.js';
import { 
  validateCreateJobRequest, 
  validateUpdateJobRequest, 
  validateJobRequestId,
  validateJobRequestQuery,
  validateCompleteJobRequest,
  validateOfferId
} from '../validation/jobRequestValidation.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';
import { 
  createOfferValidation, 
  handleValidationErrors as offerValidationErrors 
} from '../validation/offerValidation.js';
import offerController from '../controllers/offerController.js';

const router = express.Router();

/**
 * @route   POST /api/requests
 * @desc    Create a new job request
 * @access  Private (Seeker only)
 */
router.post('/', 
  authenticateToken, 
  requireRole(['seeker', 'provider']), 
  validateCreateJobRequest, 
  jobRequestController.createJobRequest
);

/**
 * @route   GET /api/requests
 * @desc    Get all job requests with filtering
 * @access  Public
 */
router.get('/', validateJobRequestQuery, jobRequestController.getAllJobRequests);

/**
 * @route   GET /api/requests/:id
 * @desc    Get job request by ID
 * @access  Public
 */
router.get('/:id', validateJobRequestId, jobRequestController.getJobRequestById);

/**
 * @route   PATCH /api/requests/:id
 * @desc    Update job request
 * @access  Private (Seeker who created it or Admin)
 */
router.patch('/:id', 
  authenticateToken, 
  validateJobRequestId, 
  validateUpdateJobRequest, 
  jobRequestController.updateJobRequest
);

/**
 * @route   DELETE /api/requests/:id
 * @desc    Delete job request
 * @access  Private (Seeker who created it or Admin)
 */
router.delete('/:id', 
  authenticateToken, 
  validateJobRequestId, 
  jobRequestController.deleteJobRequest
);

/**
 * @route   POST /api/requests/:id/offers
 * @desc    Create an offer for a specific job request
 * @access  Private (Providers only)
 * @param   {string} id - ID of the job request
 * @body    {object} price - Price object with amount and currency
 * @body    {string} [message] - Optional message from provider

 * @returns {object} Created offer with populated provider and job request details
 */
router.post('/:id/offers', 
  authenticateToken, 
  requireRole(['provider']), 
  validateJobRequestId,
  createOfferValidation,
  offerValidationErrors,
  offerController.createOffer
);

/**
 * @route   GET /api/requests/:id/offers
 * @desc    Get all offers for a specific job request
 * @access  Private (Job request owner or Admin)
 * @param   {string} id - ID of the job request
 * @query   {string} [status] - Filter by offer status
 * @returns {object} Array of offers with populated provider details
 */
router.get('/:id/offers', 
  authenticateToken, 
  validateJobRequestId,
  jobRequestController.getOffersForJobRequest
);

/**
 * @route   POST /api/requests/:id/assign/:offerId
 * @desc    Assign a selected offer to the job request
 * @access  Private (Job request owner only)
 * @param   {string} id - ID of the job request
 * @param   {string} offerId - ID of the offer to assign
 * @returns {object} Updated job request with assigned provider
 */
router.post('/:id/assign/:offerId', 
  authenticateToken, 
  requireRole(['seeker']), 
  validateJobRequestId,
  validateOfferId,
  jobRequestController.assignOfferToJobRequest
);

/**
 * @route   POST /api/requests/:id/complete
 * @desc    Mark a job request as completed
 * @access  Private (Assigned provider only)
 * @param   {string} id - ID of the job request
 * @body    {array} [proofImages] - Array of proof image URLs
 * @body    {string} [description] - Completion description
 * @returns {object} Updated job request with completion details
 */
router.post('/:id/complete', 
  authenticateToken, 
  requireRole(['provider']), 
  validateJobRequestId,
  validateCompleteJobRequest,
  jobRequestController.completeJobRequest
);

/**
 * @route   POST /api/requests/:id/review
 * @desc    Submit a review for a completed job request
 * @access  Private (Seeker or Provider who participated)
 */
router.post('/:id/review', 
  authenticateToken, 
  validateJobRequestId,
  jobRequestController.submitReviewForJobRequest
);

export default router; 