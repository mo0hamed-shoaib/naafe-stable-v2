import { body, param, validationResult } from 'express-validator';

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

// Create category validation
export const validateCreateCategory = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim()
    .escape(),
  
  body('icon')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Icon cannot exceed 100 characters')
    .trim(),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  handleValidationErrors
];

// Update category validation
export const validateUpdateCategory = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim()
    .escape(),
  
  body('icon')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Icon cannot exceed 100 characters')
    .trim(),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  handleValidationErrors
];

// Category ID parameter validation
export const validateCategoryId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category ID format'),
  
  handleValidationErrors
]; 