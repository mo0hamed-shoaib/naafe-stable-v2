import express from 'express';
import authController from '../controllers/authController.js';
import { validateRegister, validateLogin, validateRefreshToken, validateCheckAvailability, validateForgotPassword, validateResetPassword, validateChangePassword } from '../validation/authValidation.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/auth/check-availability
 * @desc    Check if email and phone are available
 * @access  Public
 */
router.post('/check-availability', validateCheckAvailability, authController.checkAvailability);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', validateRefreshToken, authController.refreshToken);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password', validateResetPassword, authController.resetPassword);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change current password
 * @access  Private
 */
router.post('/change-password', authenticateToken, validateChangePassword, authController.changePassword);

export default router;