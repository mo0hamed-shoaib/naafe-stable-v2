import { body, param, query, validationResult } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      },
      timestamp: new Date().toISOString()
    });
  }
  next();
};

// Create job request validation
export const validateCreateJobRequest = [
  body('title')
    .isLength({ min: 10, max: 100 })
    .withMessage('Title must be between 10 and 100 characters')
    .trim()
    .escape(),
  
  body('description')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters')
    .trim()
    .escape(),
  
  body('category')
    .isString()
    .withMessage('Category must be a string')
    .trim(),
  
  body('budget.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  
  body('budget.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number'),
  
  body('budget')
    .optional()
    .custom((value) => {
      if (value && value.min && value.max && value.min > value.max) {
        throw new Error('Minimum budget cannot be greater than maximum budget');
      }
      return true;
    }),
  
  body('location.type')
    .optional()
    .isIn(['Point'])
    .withMessage('Location type must be "Point"'),
  
  body('location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),
  
  body('location.coordinates.*')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Coordinates must be valid longitude (-180 to 180) and latitude (-90 to 90)'),
  
  body('location.address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters')
    .trim(),
  
  body('location.government')
    .optional()
    .isString()
    .withMessage('Government must be a string')
    .trim(),
  
  body('location.city')
    .optional()
    .isString()
    .withMessage('City must be a string')
    .trim(),
  
  body('deadline')
    .isISO8601()
    .withMessage('Deadline must be a valid date')
    .custom((value) => {
      const deadline = new Date(value);
      if (deadline <= new Date()) {
        throw new Error('Deadline must be in the future');
      }
      return true;
    }),
  
  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 day'),
  
  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array'),
  
  body('attachments.*.url')
    .optional()
    .isURL()
    .withMessage('Attachment URL must be a valid URL'),
  
  body('attachments.*.filename')
    .optional()
    .isString()
    .withMessage('Attachment filename must be a string'),
  
  handleValidationErrors
];

// Update job request validation
export const validateUpdateJobRequest = [
  body('title')
    .optional()
    .isLength({ min: 10, max: 100 })
    .withMessage('Title must be between 10 and 100 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters')
    .trim()
    .escape(),
  
  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string')
    .trim(),
  
  body('budget.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  
  body('budget.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number'),
  
  body('budget')
    .optional()
    .custom((value) => {
      if (value && value.min && value.max && value.min > value.max) {
        throw new Error('Minimum budget cannot be greater than maximum budget');
      }
      return true;
    }),
  
  body('location.type')
    .optional()
    .isIn(['Point'])
    .withMessage('Location type must be "Point"'),
  
  body('location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),
  
  body('location.coordinates.*')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Coordinates must be valid longitude (-180 to 180) and latitude (-90 to 90)'),
  
  body('location.address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters')
    .trim(),
  
  body('location.government')
    .optional()
    .isString()
    .withMessage('Government must be a string')
    .trim(),
  
  body('location.city')
    .optional()
    .isString()
    .withMessage('City must be a string')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['open', 'assigned', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: open, assigned, in_progress, completed, cancelled'),
  
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Assigned user must be a valid MongoDB ID'),
  
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date')
    .custom((value) => {
      const deadline = new Date(value);
      if (deadline <= new Date()) {
        throw new Error('Deadline must be in the future');
      }
      return true;
    }),
  
  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 day'),
  
  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array'),
  
  body('attachments.*.url')
    .optional()
    .isURL()
    .withMessage('Attachment URL must be a valid URL'),
  
  body('attachments.*.filename')
    .optional()
    .isString()
    .withMessage('Attachment filename must be a string'),
  
  handleValidationErrors
];

// Job request ID parameter validation
export const validateJobRequestId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid job request ID format'),
  
  handleValidationErrors
];

// Query parameters validation for getting job requests
export const validateJobRequestQuery = [
  query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
  
  query('status')
    .optional()
    .isIn(['open', 'assigned', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: open, assigned, in_progress, completed, cancelled'),
  
  query('minBudget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  
  query('maxBudget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number'),
  
  query('lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  query('lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  query('radius')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Radius must be a positive integer'),
  
  query('search')
    .optional()
    .isString()
    .withMessage('Search must be a string'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

// Validation for completing a job request
export const validateCompleteJobRequest = [
  body('proofImages')
    .optional()
    .isArray()
    .withMessage('Proof images must be an array'),
  
  body('proofImages.*')
    .optional()
    .isURL()
    .withMessage('Proof image URL must be a valid URL'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Completion description cannot exceed 1000 characters')
    .trim()
    .escape(),
  
  handleValidationErrors
];

// Validation for offer ID parameter
export const validateOfferId = [
  param('offerId')
    .isMongoId()
    .withMessage('Invalid offer ID format'),
  
  handleValidationErrors
];