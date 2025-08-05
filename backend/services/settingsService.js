import User from '../models/User.js';

class SettingsService {
  /**
   * Get user settings
   */
  async getUserSettings(userId) {
    const user = await User.findById(userId).lean();
    if (!user) throw new Error('User not found');

    // Return default settings structure
    return {
      notifications: {
        app: true,
        email: false,
        sms: false,
        marketing: false
      },
      privacy: {
        profileVisibility: 'public',
        showPhone: false,
        showEmail: false,
        allowMessages: true
      },
      theme: {
        mode: 'system', // 'light', 'dark', 'system'
        language: 'ar' // 'ar', 'en'
      },
      account: {
        twoFactorAuth: false,
        sessionTimeout: 30, // minutes
        dataRetention: 'indefinite' // 'indefinite', '1year', '6months'
      }
    };
  }

  /**
   * Update user settings
   */
  async updateUserSettings(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // For now, we'll store settings in a settings field
    // In a real implementation, you might want a separate Settings model
    const currentSettings = await this.getUserSettings(userId);
    const updatedSettings = { ...currentSettings, ...updateData };

    // Update user with settings (you might want to create a separate Settings model)
    user.settings = updatedSettings;
    await user.save();

    return updatedSettings;
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(userId, notificationSettings) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const currentSettings = await this.getUserSettings(userId);
    const updatedSettings = {
      ...currentSettings,
      notifications: { ...currentSettings.notifications, ...notificationSettings }
    };

    user.settings = updatedSettings;
    await user.save();

    return updatedSettings;
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(userId, privacySettings) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const currentSettings = await this.getUserSettings(userId);
    const updatedSettings = {
      ...currentSettings,
      privacy: { ...currentSettings.privacy, ...privacySettings }
    };

    user.settings = updatedSettings;
    await user.save();

    return updatedSettings;
  }

  /**
   * Update theme settings
   */
  async updateThemeSettings(userId, themeSettings) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const currentSettings = await this.getUserSettings(userId);
    const updatedSettings = {
      ...currentSettings,
      theme: { ...currentSettings.theme, ...themeSettings }
    };

    user.settings = updatedSettings;
    await user.save();

    return updatedSettings;
  }
}

export default new SettingsService(); 