import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} Created user object (without password)
   */
  async register(userData) {
    try {
      // Default role is seeker
      let roles = ['seeker'];
      let seekerProfile = {};
      let providerProfile = {};

      // If admin is creating a provider, allow provider role
      if (userData.roles && Array.isArray(userData.roles) && userData.roles.includes('provider')) {
        roles = ['provider'];
        providerProfile = {};
      }

      // Check if user already exists by email
      const existingUserByEmail = await User.findOne({ email: userData.email });
      if (existingUserByEmail) {
        throw new Error('البريد الإلكتروني مسجل مسبقاً');
      }

      // Check if user already exists by phone
      const existingUserByPhone = await User.findOne({ phone: userData.phone });
      if (existingUserByPhone) {
        throw new Error('رقم الهاتف مسجل مسبقاً');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create new user
      const newUser = new User({
        ...userData,
        password: hashedPassword,
        roles,
        seekerProfile,
        providerProfile
      });

      await newUser.save();

      // Return user without password
      const userResponse = newUser.toObject();
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check email and phone availability
   * @param {string} email - Email to check
   * @param {string} phone - Phone to check
   * @returns {Object} Availability status
   */
  async checkAvailability(email, phone) {
    try {
      const result = {
        email: { available: true, message: '' },
        phone: { available: true, message: '' }
      };

      // Check email availability
      if (email) {
        const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingUserByEmail) {
          result.email.available = false;
          result.email.message = 'البريد الإلكتروني مسجل مسبقاً';
        }
      }

      // Check phone availability
      if (phone) {
        const existingUserByPhone = await User.findOne({ phone });
        if (existingUserByPhone) {
          result.phone.available = false;
          result.phone.message = 'رقم الهاتف مسجل مسبقاً';
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Authenticate user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} User object and tokens
   */
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }

      // Check if user is blocked
      if (user.isBlocked) {
        throw new Error('الحساب محظور. يرجى التواصل مع الدعم الفني.');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('الحساب معطل. يرجى التواصل مع الدعم الفني.');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Return user data and tokens
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate access token
   * @param {Object} user - User object
   * @returns {string} JWT access token
   */
  generateAccessToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      roles: user.roles // include the array of roles
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
  }

  /**
   * Generate refresh token
   * @param {Object} user - User object
   * @returns {string} JWT refresh token
   */
  generateRefreshToken(user) {
    const payload = {
      userId: user._id,
      type: 'refresh'
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });
  }

  /**
   * Verify access token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('الرمز المميز غير صالح أو منتهي الصلاحية');
    }
  }

  /**
   * Verify refresh token
   * @param {string} token - JWT refresh token
   * @returns {Object} Decoded token payload
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('رمز التحديث غير صالح أو منتهي الصلاحية');
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - JWT refresh token
   * @returns {Object} New access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || user.isBlocked || !user.isActive) {
        throw new Error('المستخدم غير موجود أو الحساب محظور');
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);

      return {
        accessToken: newAccessToken
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user from token
   * @param {string} token - JWT access token
   * @returns {Object} User object
   */
  async getCurrentUser(token) {
    try {
      const decoded = this.verifyAccessToken(token);
      
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      if (user.isBlocked) {
        throw new Error('الحساب محظور');
      }

      if (!user.isActive) {
        throw new Error('الحساب معطل');
      }

      // Return user data without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Object} Success message
   */
  async forgotPassword(email) {
    try {
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('البريد الإلكتروني غير مسجل');
      }

      // Check if user is blocked
      if (user.isBlocked) {
        throw new Error('الحساب محظور. يرجى التواصل مع الدعم الفني.');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('الحساب معطل. يرجى التواصل مع الدعم الفني.');
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Save reset token to user
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();

      // For development - log to console
      console.log(`\n🔗 Reset Password Link for ${email}:`);
      console.log(`http://localhost:5173/reset-password?token=${resetToken}`);
      console.log(`⏰ Expires at: ${resetTokenExpiry.toLocaleString('ar-EG')}`);
      console.log(`\n📋 Instructions:`);
      console.log(`1. Copy the link above`);
      console.log(`2. Open it in your browser`);
      console.log(`3. Enter your new password`);
      console.log(`4. The link will expire in 1 hour\n`);

      return { 
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
        resetToken: resetToken // Only for development
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password using token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Object} Success message
   */
  async resetPassword(token, newPassword) {
    try {
      // Find user by reset token
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية');
      }

      // Check if user is blocked
      if (user.isBlocked) {
        throw new Error('الحساب محظور. يرجى التواصل مع الدعم الفني.');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('الحساب معطل. يرجى التواصل مع الدعم الفني.');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      console.log(`✅ Password reset successful for ${user.email}`);

      return { 
        message: 'تم إعادة تعيين كلمة المرور بنجاح' 
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change current password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Object} Success message
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      // Check if account is blocked
      if (user.isBlocked) {
        throw new Error('الحساب محظور');
      }

      // Check if account is inactive
      if (!user.isActive) {
        throw new Error('الحساب معطل');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('كلمة المرور الحالية غير صحيحة');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update user password
      user.password = hashedPassword;
      await user.save();

      console.log(`✅ Password changed successfully for ${user.email}`);

      return { message: 'تم تغيير كلمة المرور بنجاح' };
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(); 