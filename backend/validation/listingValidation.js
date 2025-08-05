import { body, param, query, validationResult } from 'express-validator';

export const validateCreateListing = [
  body('title')
    .isString().withMessage('Title must be a string')
    .isLength({ min: 10, max: 100 }).withMessage('Title must be 10-100 characters'),
  body('description')
    .isString().withMessage('Description must be a string')
    .isLength({ min: 20, max: 2000 }).withMessage('Description must be 20-2000 characters'),
  body('category')
    .isString().withMessage('Category is required'),
  body('budget.min')
    .isFloat({ min: 0 }).withMessage('Minimum budget must be a positive number'),
  body('budget.max')
    .isFloat({ min: 0 }).withMessage('Maximum budget must be a positive number'),
  body('budget.currency')
    .optional().isIn(['EGP', 'USD', 'EUR']).withMessage('Invalid currency'),
  body('status')
    .optional().isIn(['active', 'paused', 'archived']).withMessage('Invalid status'),
  body('workingDays')
    .isArray({ min: 1 }).withMessage('At least one working day must be selected'),
  body('startTime')
    .isString().withMessage('Start time is required'),
  body('endTime')
    .isString().withMessage('End time is required'),
  body('location.government')
    .isString().withMessage('Government is required'),
  body('location.city')
    .isString().withMessage('City is required'),
];

export const validateUpdateListing = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .isLength({ min: 10, max: 100 }).withMessage('Title must be 10-100 characters'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ min: 20, max: 2000 }).withMessage('Description must be 20-2000 characters'),
  body('category')
    .optional()
    .isString().withMessage('Category is required'),
  body('budget.min')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum budget must be a positive number'),
  body('budget.max')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum budget must be a positive number'),
  body('budget.currency')
    .optional().isIn(['EGP', 'USD', 'EUR']).withMessage('Invalid currency'),
  body('status')
    .optional().isIn(['active', 'paused', 'archived']).withMessage('Invalid status'),
  body('workingDays')
    .optional().isArray({ min: 1 }).withMessage('At least one working day must be selected'),
  body('startTime')
    .optional().isString().withMessage('Start time is required'),
  body('endTime')
    .optional().isString().withMessage('End time is required'),
  body('location.government')
    .optional().isString().withMessage('Government is required'),
  body('location.city')
    .optional().isString().withMessage('City is required'),
];

export const validateListingId = [
  param('id').isMongoId().withMessage('Invalid listing ID'),
];

export const validateListingQuery = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('status').optional().isIn(['active', 'paused', 'archived']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('provider').optional().isMongoId(),
  query('search').optional().isString(),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array()
      },
      timestamp: new Date().toISOString()
    });
  }
  next();
}; 