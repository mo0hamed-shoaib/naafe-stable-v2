import settingsService from '../services/settingsService.js';
import { logger } from '../middlewares/logging.middleware.js';

class SettingsController {
  /**
   * Get user settings
   * GET /api/settings
   */
  async getUserSettings(req, res) {
    try {
      const userId = req.user._id;
      const settings = await settingsService.getUserSettings(userId);

      res.status(200).json({
        success: true,
        data: {
          settings
        },
        message: 'User settings retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('User not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      logger.error(`Get user settings error: ${error.message}`);
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
   * Update user settings
   * PATCH /api/settings
   */
  async updateUserSettings(req, res) {
    try {
      const userId = req.user._id;
      const updateData = req.body;

      const updatedSettings = await settingsService.updateUserSettings(userId, updateData);

      res.status(200).json({
        success: true,
        data: {
          settings: updatedSettings
        },
        message: 'Settings updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('User not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

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

      logger.error(`Update user settings error: ${error.message}`);
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
   * Update notification settings
   * PATCH /api/settings/notifications
   */
  async updateNotificationSettings(req, res) {
    try {
      const userId = req.user._id;
      const notificationSettings = req.body;

      const updatedSettings = await settingsService.updateNotificationSettings(userId, notificationSettings);

      res.status(200).json({
        success: true,
        data: {
          settings: updatedSettings
        },
        message: 'Notification settings updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Update notification settings error: ${error.message}`);
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
   * Update privacy settings
   * PATCH /api/settings/privacy
   */
  async updatePrivacySettings(req, res) {
    try {
      const userId = req.user._id;
      const privacySettings = req.body;

      const updatedSettings = await settingsService.updatePrivacySettings(userId, privacySettings);

      res.status(200).json({
        success: true,
        data: {
          settings: updatedSettings
        },
        message: 'Privacy settings updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Update privacy settings error: ${error.message}`);
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
   * Update theme settings
   * PATCH /api/settings/theme
   */
  async updateThemeSettings(req, res) {
    try {
      const userId = req.user._id;
      const themeSettings = req.body;

      const updatedSettings = await settingsService.updateThemeSettings(userId, themeSettings);

      res.status(200).json({
        success: true,
        data: {
          settings: updatedSettings
        },
        message: 'Theme settings updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Update theme settings error: ${error.message}`);
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
}

export default new SettingsController(); 