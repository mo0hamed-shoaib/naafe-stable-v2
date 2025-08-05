import jobRequestService from '../services/jobRequestService.js';
import { logger } from '../middlewares/logging.middleware.js';

class JobRequestController {
  /**
   * Create a new job request
   * POST /api/requests
   */
  async createJobRequest(req, res) {
    try {
      logger.info(`Creating job request for user: ${req.user._id}`);
      logger.debug(`Request body: ${JSON.stringify(req.body, null, 2)}`);
      
      const jobRequestData = req.body;
      const seekerId = req.user._id;

      const jobRequest = await jobRequestService.createJobRequest(jobRequestData, seekerId);

      logger.info(`Job request created successfully: ${jobRequest._id}`);

      res.status(201).json({
        success: true,
        data: {
          jobRequest
        },
        message: 'Job request created successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Error creating job request: ${error.message}`);
      
      if (error.message.includes('Only seekers can create job requests')) {
        logger.warn(`Authorization error: ${error.message}`);
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Category does not exist')) {
        logger.warn(`Category validation error: ${error.message}`);
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Deadline must be in the future')) {
        logger.warn(`Deadline validation error: ${error.message}`);
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Minimum budget cannot be greater')) {
        logger.warn(`Budget validation error: ${error.message}`);
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        logger.error(`Mongoose validation error: ${JSON.stringify(error.errors)}`);
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }));

        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: validationErrors
          },
          timestamp: new Date().toISOString()
        });
      }

      logger.error(`Internal server error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get all job requests with filtering
   * GET /api/requests
   */
  async getAllJobRequests(req, res) {
    try {
      logger.info(`Getting all job requests with filters: ${JSON.stringify(req.query)}`);
      
      const filters = {
        category: req.query.category,
        status: req.query.status,
        minBudget: req.query.minBudget ? parseFloat(req.query.minBudget) : undefined,
        maxBudget: req.query.maxBudget ? parseFloat(req.query.maxBudget) : undefined,
        location: req.query.location,
        city: req.query.city,
        lat: req.query.lat ? parseFloat(req.query.lat) : undefined,
        lng: req.query.lng ? parseFloat(req.query.lng) : undefined,
        radius: req.query.radius ? parseInt(req.query.radius) : undefined,
        search: req.query.search,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20
      };

      const result = await jobRequestService.getAllJobRequests(filters);

      logger.info(`Retrieved ${result.jobRequests.length} job requests out of ${result.totalCount} total`);

      res.status(200).json({
        success: true,
        data: {
          jobRequests: result.jobRequests,
          pagination: {
            page: result.page,
            limit: result.limit,
            totalCount: result.totalCount,
            totalPages: result.totalPages,
            hasNext: result.page < result.totalPages,
            hasPrev: result.page > 1
          }
        },
        message: 'Job requests retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Error getting job requests: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get job request by ID
   * GET /api/requests/:id
   */
  async getJobRequestById(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Getting job request by ID: ${id}`);
      
      const jobRequest = await jobRequestService.getJobRequestById(id);

      logger.info(`Job request retrieved successfully: ${id}`);

      res.status(200).json({
        success: true,
        data: {
          jobRequest
        },
        message: 'Job request retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Error getting job request by ID: ${error.message}`);
      
      if (error.message.includes('Job request not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update job request
   * PATCH /api/requests/:id
   */
  async updateJobRequest(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user._id;

      const jobRequest = await jobRequestService.updateJobRequest(id, updateData, userId);

      res.status(200).json({
        success: true,
        data: {
          jobRequest
        },
        message: 'Job request updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('Job request not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Not authorized')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Category does not exist') || 
          error.message.includes('Deadline must be in the future') ||
          error.message.includes('Minimum budget cannot be greater') ||
          error.message.includes('Provider must be assigned') ||
          error.message.includes('Assigned user must be a provider')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }));

        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: validationErrors
          },
          timestamp: new Date().toISOString()
        });
      }

      logger.error(`Update job request error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Delete job request
   * DELETE /api/requests/:id
   */
  async deleteJobRequest(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      await jobRequestService.deleteJobRequest(id, userId);

      res.status(200).json({
        success: true,
        data: {
          message: 'Job request deleted successfully'
        },
        message: 'Job request deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('Job request not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Not authorized')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Can only delete job requests with open status')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      logger.error(`Delete job request error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get job requests by current user (seeker)
   * GET /api/users/me/requests
   */
  async getMyJobRequests(req, res) {
    try {
      const userId = req.user._id;
      const filters = {
        status: req.query.status,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20
      };

      const result = await jobRequestService.getJobRequestsBySeeker(userId, filters);

      res.status(200).json({
        success: true,
        data: {
          jobRequests: result.jobRequests,
          pagination: {
            page: result.page,
            limit: result.limit,
            totalCount: result.totalCount,
            totalPages: result.totalPages,
            hasNext: result.page < result.totalPages,
            hasPrev: result.page > 1
          }
        },
        message: 'Job requests retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Get my job requests error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get all offers for a specific job request
   * GET /api/requests/:id/offers
   */
  async getOffersForJobRequest(req, res) {
    try {
      const { id: jobRequestId } = req.params;
      const userId = req.user._id;
      const filters = {
        status: req.query.status
      };

      const offers = await jobRequestService.getOffersForJobRequest(jobRequestId, userId, filters);

      res.status(200).json({
        success: true,
        data: {
          offers,
          totalCount: offers.length
        },
        message: 'Offers retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Get offers for job request error: ${error.message}`);
      
      if (error.message.includes('Job request not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Not authorized')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Assign a selected offer to the job request
   * POST /api/requests/:id/assign/:offerId
   */
  async assignOfferToJobRequest(req, res) {
    try {
      const { id: jobRequestId, offerId } = req.params;
      const seekerId = req.user._id;

      const result = await jobRequestService.assignOfferToJobRequest(jobRequestId, offerId, seekerId);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Offer assigned successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Assign offer to job request error: ${error.message}`);
      
      if (error.message.includes('Job request not found') || error.message.includes('Offer not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Not authorized') || error.message.includes('Access denied')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Job request is not open') || 
          error.message.includes('Offer is not pending') ||
          error.message.includes('Offer does not belong to this job request')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Mark a job request as completed
   * POST /api/requests/:id/complete
   */
  async completeJobRequest(req, res) {
    try {
      const { id: jobRequestId } = req.params;
      const providerId = req.user._id;
      const completionData = req.body;

      const result = await jobRequestService.completeJobRequest(jobRequestId, providerId, completionData);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Job request completed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Complete job request error: ${error.message}`);
      
      if (error.message.includes('Job request not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Not authorized') || error.message.includes('Access denied')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Job request is not assigned') || 
          error.message.includes('You are not the assigned provider')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Submit a review for a job request
   * POST /api/requests/:id/review
   */
  async submitReviewForJobRequest(req, res) {
    try {
      const { id: jobRequestId } = req.params;
      const reviewerId = req.user._id;
      const { rating, comment } = req.body;
      const review = await jobRequestService.submitReviewForJobRequest(jobRequestId, reviewerId, { rating, comment });
      res.status(201).json({
        success: true,
        data: { review },
        message: 'Review submitted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Submit review error: ${error.message}`);
      let status = 400;
      let code = 'VALIDATION_ERROR';
      if (error.message.includes('Job request not found')) {
        status = 404; code = 'NOT_FOUND';
      } else if (error.message.includes('already reviewed')) {
        status = 409; code = 'CONFLICT';
      } else if (error.message.includes('Only participants can review')) {
        status = 403; code = 'FORBIDDEN';
      }
      res.status(status).json({
        success: false,
        error: { code, message: error.message },
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new JobRequestController(); 