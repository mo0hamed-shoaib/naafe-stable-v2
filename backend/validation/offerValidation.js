import { body, param, validationResult } from 'express-validator';

// Validation rules for creating an offer
const createOfferValidation = [
  body('budget.min')
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  body('budget.max')
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number'),
  body('budget.currency')
    .isIn(['EGP', 'USD', 'EUR'])
    .withMessage('Currency must be EGP, USD, or EUR'),
  body('message')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  body('estimatedTimeDays')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated time must be at least 1 day'),
  body('availableDates')
    .optional()
    .isArray()
    .withMessage('Available dates must be an array'),
  body('availableDates.*')
    .optional()
    .isISO8601()
    .withMessage('Each date must be a valid ISO date string'),
  body('timePreferences')
    .optional()
    .isArray()
    .withMessage('Time preferences must be an array'),
  body('timePreferences.*')
    .optional()
    .isIn(['morning', 'afternoon', 'evening', 'flexible'])
    .withMessage('Time preference must be one of: morning, afternoon, evening, flexible')
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
  body('estimatedTimeDays')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated time must be at least 1 day'),
  body('availableDates')
    .optional()
    .isArray()
    .withMessage('Available dates must be an array'),
  body('availableDates.*')
    .optional()
    .isISO8601()
    .withMessage('Each date must be a valid ISO date string'),
  body('timePreferences')
    .optional()
    .isArray()
    .withMessage('Time preferences must be an array'),
  body('timePreferences.*')
    .optional()
    .isIn(['morning', 'afternoon', 'evening', 'flexible'])
    .withMessage('Time preference must be one of: morning, afternoon, evening, flexible')
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
  handleValidationErrors
}; 