import express from 'express';
import settingsController from '../controllers/settingsController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateSettingsUpdate } from '../validation/settingsValidation.js';

const router = express.Router();

/**
 * @route   GET /api/settings
 * @desc    Get user settings
 * @access  Private
 */
router.get('/', authenticateToken, settingsController.getUserSettings);

/**
 * @route   PATCH /api/settings
 * @desc    Update user settings
 * @access  Private
 */
router.patch('/', authenticateToken, validateSettingsUpdate, settingsController.updateUserSettings);

/**
 * @route   PATCH /api/settings/notifications
 * @desc    Update notification preferences
 * @access  Private
 */
router.patch('/notifications', authenticateToken, settingsController.updateNotificationSettings);

/**
 * @route   PATCH /api/settings/privacy
 * @desc    Update privacy settings
 * @access  Private
 */
router.patch('/privacy', authenticateToken, settingsController.updatePrivacySettings);

/**
 * @route   PATCH /api/settings/theme
 * @desc    Update theme preference
 * @access  Private
 */
router.patch('/theme', authenticateToken, settingsController.updateThemeSettings);

export default router; 