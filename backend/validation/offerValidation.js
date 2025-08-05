import { body, param, validationResult } from 'express-validator';

// Validation rules for creating an offer
const createOfferValidation = [
  body('budget.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  body('budget.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number'),
  body('budget.currency')
    .optional()
    .isIn(['EGP', 'USD', 'EUR'])
    .withMessage('Currency must be EGP, USD, or EUR'),
  body('message')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  body('selectedScheduleItems')
    .optional()
    .isArray()
    .withMessage('Selected schedule items must be an array'),
  body('selectedScheduleItems.*.date')
    .optional()
    .isString()
    .withMessage('Schedule item date must be a string'),
  body('selectedScheduleItems.*.timeSlot')
    .optional()
    .isIn(['morning', 'afternoon', 'evening', 'full_day', 'custom'])
    .withMessage('Time slot must be one of: morning, afternoon, evening, full_day, custom'),
  body('selectedScheduleItems.*.customTimeRange.startTime')
    .optional()
    .isString()
    .withMessage('Custom time range start time must be a string'),
  body('selectedScheduleItems.*.customTimeRange.endTime')
    .optional()
    .isString()
    .withMessage('Custom time range end time must be a string')
];

// Validation rules for updating an offer
const updateOfferValidation = [
  body('budget.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  body('budget.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number'),
  body('budget.currency')
    .optional()
    .isIn(['EGP', 'USD', 'EUR'])
    .withMessage('Currency must be EGP, USD, or EUR'),
  body('message')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  body('selectedScheduleItems')
    .optional()
    .isArray()
    .withMessage('Selected schedule items must be an array'),
  body('selectedScheduleItems.*.date')
    .optional()
    .isString()
    .withMessage('Schedule item date must be a string'),
  body('selectedScheduleItems.*.timeSlot')
    .optional()
    .isIn(['morning', 'afternoon', 'evening', 'full_day', 'custom'])
    .withMessage('Time slot must be one of: morning, afternoon, evening, full_day, custom'),
  body('selectedScheduleItems.*.customTimeRange.startTime')
    .optional()
    .isString()
    .withMessage('Custom time range start time must be a string'),
  body('selectedScheduleItems.*.customTimeRange.endTime')
    .optional()
    .isString()
    .withMessage('Custom time range end time must be a string')
];

// Validation for offer ID parameter
const offerIdValidation = [
  param('offerId')
    .isMongoId()
    .withMessage('Invalid offer ID format')
];

// Validation for job request ID parameter
const jobRequestIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid job request ID format')
];

// Validation for updating negotiation terms
const updateNegotiationValidation = [
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('materials')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Materials description cannot exceed 500 characters'),
  body('scope')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Scope description cannot exceed 500 characters'),
  body('selectedScheduleIndex')
    .optional()
    .custom((value) => {
      const num = parseInt(value);
      return !isNaN(num) && num >= 0;
    })
    .withMessage('Selected schedule index must be a non-negative integer')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
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
      }
    });
  }
  
  next();
};

export {
  createOfferValidation,
  updateOfferValidation,
  offerIdValidation,
  jobRequestIdValidation,
  updateNegotiationValidation,
  handleValidationErrors
}; 