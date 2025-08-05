import jwt from 'jsonwebtoken';
import authService from '../services/authService.js';
import { logger } from './logging.middleware.js';

/**
 * Socket.IO authentication middleware
 * Verifies JWT token from handshake auth
 */
export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Verify token and get user
    const user = await authService.getCurrentUser(token);
    if (!user) {
      return next(new Error('Invalid or expired token'));
    }

    // Attach user to socket
    socket.user = user;
    socket.userId = user._id.toString();
    
    logger.info(`Socket authenticated: ${user._id} (${user.email})`);
    next();
  } catch (error) {
    logger.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
};

/**
 * Optional socket authentication middleware
 * Sets socket.user if token is valid, but doesn't require it
 */
export const optionalSocketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (token) {
      const user = await authService.getCurrentUser(token);
      if (user) {
        socket.user = user;
        socket.userId = user._id.toString();
        logger.info(`Socket optionally authenticated: ${user._id} (${user.email})`);
      }
    }
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    logger.warn('Optional socket authentication failed:', error.message);
    next();
  }
}; 