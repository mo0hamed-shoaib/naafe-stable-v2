import authService from '../services/authService.js';

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const userData = req.body;
      const user = await authService.register(userData);

      res.status(201).json({
        success: true,
        data: {
          user,
          message: 'User registered successfully'
        },
        message: 'Registration successful',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Handle duplicate email/phone errors
      if (error.message.includes('مسجل مسبقاً')) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle MongoDB duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const message = field === 'email' ? 'البريد الإلكتروني مسجل مسبقاً' : 
                       field === 'phone' ? 'رقم الهاتف مسجل مسبقاً' : 
                       'البيانات مسجلة مسبقاً';
        return res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: message
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle validation errors from mongoose
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

      // Handle other errors
      console.error('Registration error:', error);
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
   * Check email and phone availability
   * POST /api/auth/check-availability
   */
  async checkAvailability(req, res) {
    try {
      const { email, phone } = req.body;
      const result = await authService.checkAvailability(email, phone);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Availability check completed',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: error.message
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        },
        message: 'Login successful',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Handle authentication errors
      if (error.message.includes('البريد الإلكتروني أو كلمة المرور غير صحيحة') || 
          error.message.includes('الحساب محظور') ||
          error.message.includes('الحساب معطل')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle other errors
      console.error('Login error:', error);
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
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      // In a more sophisticated implementation, you might want to:
      // 1. Add the token to a blacklist
      // 2. Update user's last logout time
      // 3. Clear any server-side sessions
      
      // For now, we'll just return a success response
      // The client will handle clearing local storage and tokens
      
      res.status(200).json({
        success: true,
        message: 'Logout successful',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Logout error:', error);
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
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken
        },
        message: 'Token refreshed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('رمز التحديث غير صالح أو منتهي الصلاحية') ||
          error.message.includes('المستخدم غير موجود أو الحساب محظور')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      console.error('Token refresh error:', error);
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
   * Request password reset
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Password reset request successful',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Handle specific errors
      if (error.message.includes('البريد الإلكتروني غير مسجل') ||
          error.message.includes('الحساب محظور') ||
          error.message.includes('الحساب معطل')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle other errors
      console.error('Forgot password error:', error);
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
   * Reset password using token
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Password reset successful',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Handle specific errors
      if (error.message.includes('رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية') ||
          error.message.includes('الحساب محظور') ||
          error.message.includes('الحساب معطل')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle other errors
      console.error('Reset password error:', error);
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
   * Change current password
   * POST /api/auth/change-password
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;
      const result = await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Password changed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Handle incorrect current password error
      if (error.message.includes('كلمة المرور الحالية غير صحيحة')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle other errors
      console.error('Password change error:', error);
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

export default new AuthController(); 