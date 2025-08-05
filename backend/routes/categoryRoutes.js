import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { validateCreateCategory, validateUpdateCategory, validateCategoryId } from '../validation/categoryValidation.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', validateCategoryId, categoryController.getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private (Admin only)
 */
router.post('/', authenticateToken, requireRole(['admin']), validateCreateCategory, categoryController.createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private (Admin only)
 */
router.put('/:id', authenticateToken, requireRole(['admin']), validateCategoryId, validateUpdateCategory, categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, requireRole(['admin']), validateCategoryId, categoryController.deleteCategory);

export default router; 