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

// Update profile validation
export const validateUpdateProfile = [
  body('name.first')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .trim()
    .escape(),
  
  body('name.last')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .trim()
    .escape(),
  
  body('phone')
    .optional()
    .matches(/^(\+20|0)?1[0125][0-9]{8}$/)
    .withMessage('Please enter a valid Egyptian phone number'),
  
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  
  body('profile.bio')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Bio cannot exceed 200 characters')
    .trim()
    .escape(),
  

  
  body('profile.location.type')
    .optional()
    .isIn(['Point'])
    .withMessage('Location type must be "Point"'),
  
  body('profile.location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),
  
  body('profile.location.coordinates.*')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Coordinates must be valid longitude (-180 to 180) and latitude (-90 to 90)'),
  
  body('profile.location.address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters')
    .trim()
    .escape(),
  
  handleValidationErrors
];

// User ID parameter validation
export const validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  handleValidationErrors
];

// Optional user ID parameter validation (for public profiles)
export const validateOptionalUserId = [
  param('id')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  handleValidationErrors
]; 