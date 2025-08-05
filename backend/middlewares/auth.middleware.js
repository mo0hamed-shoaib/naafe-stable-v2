import authService from '../services/authService.js';
import { logger } from './logging.middleware.js';

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'الرمز المميز مطلوب'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Verify token and get user
    const user = await authService.getCurrentUser(token);
    req.user = user;
    logger.info(`User authenticated: ${user._id} (${user.email})`);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message || 'الرمز المميز غير صالح أو منتهي الصلاحية'
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {string[]} roles - Array of allowed roles
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'المصادقة مطلوبة'
        },
        timestamp: new Date().toISOString()
      });
    }

    // FIX: Check if any of the user's roles are allowed
    if (!req.user.roles || !req.user.roles.some(r => roles.includes(r))) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'الوصول مرفوض'
        },
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Sets req.user if token is valid, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = await authService.getCurrentUser(token);
      req.user = user;
    }
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};
