import express from 'express';
import listingController from '../controllers/listingController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';
import {
  validateCreateListing,
  validateUpdateListing,
  validateListingId,
  validateListingQuery,
  handleValidationErrors
} from '../validation/listingValidation.js';

const router = express.Router();

// List own listings (provider dashboard)
router.get('/users/me/listings', authenticateToken, requireRole(['provider']), validateListingQuery, handleValidationErrors, listingController.listOwnListings);

// Create a new listing
router.post('/listings', authenticateToken, requireRole(['seeker', 'provider']), validateCreateListing, handleValidationErrors, listingController.createListing);

// Get a single listing by ID
router.get('/listings/:id', validateListingId, handleValidationErrors, listingController.getListingById);

// Update own listing
router.patch('/listings/:id', authenticateToken, requireRole(['provider']), validateListingId, validateUpdateListing, handleValidationErrors, listingController.updateListing);

// Delete (archive) own listing
router.delete('/listings/:id', authenticateToken, requireRole(['provider']), validateListingId, handleValidationErrors, listingController.deleteListing);

// Public: Get all listings with search/filter
router.get('/listings', validateListingQuery, handleValidationErrors, listingController.getAllListings);

export default router; 