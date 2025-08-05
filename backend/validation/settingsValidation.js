import { body } from 'express-validator';
import { handleValidationErrors } from './userValidation.js';

// Settings update validation
export const validateSettingsUpdate = [
  body('notifications.app')
    .optional()
    .isBoolean()
    .withMessage('App notifications must be a boolean'),
  
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  
  body('notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notifications must be a boolean'),
  
  body('notifications.marketing')
    .optional()
    .isBoolean()
    .withMessage('Marketing notifications must be a boolean'),
  
  body('privacy.profileVisibility')
    .optional()
    .isIn(['public', 'private', 'friends'])
    .withMessage('Profile visibility must be public, private, or friends'),
  
  body('privacy.showPhone')
    .optional()
    .isBoolean()
    .withMessage('Show phone must be a boolean'),
  
  body('privacy.showEmail')
    .optional()
    .isBoolean()
    .withMessage('Show email must be a boolean'),
  
  body('privacy.allowMessages')
    .optional()
    .isBoolean()
    .withMessage('Allow messages must be a boolean'),
  
  body('theme.mode')
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme mode must be light, dark, or system'),
  
  body('theme.language')
    .optional()
    .isIn(['ar', 'en'])
    .withMessage('Language must be ar or en'),
  
  body('account.twoFactorAuth')
    .optional()
    .isBoolean()
    .withMessage('Two factor auth must be a boolean'),
  
  body('account.sessionTimeout')
    .optional()
    .isInt({ min: 5, max: 1440 })
    .withMessage('Session timeout must be between 5 and 1440 minutes'),
  
  body('account.dataRetention')
    .optional()
    .isIn(['indefinite', '1year', '6months'])
    .withMessage('Data retention must be indefinite, 1year, or 6months'),
  
  handleValidationErrors
]; 