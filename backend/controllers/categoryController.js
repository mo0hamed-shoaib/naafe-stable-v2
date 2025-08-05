import categoryService from '../services/categoryService.js';

class CategoryController {
  /**
   * Get all categories
   * GET /api/categories
   */
  async getAllCategories(req, res) {
    try {
      const { includeInactive } = req.query;
      
      const options = {
        includeInactive: includeInactive === 'true'
      };

      const categories = await categoryService.getAllCategoriesWithStats(options);

      res.status(200).json({
        success: true,
        data: {
          categories
        },
        message: 'Categories retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get categories error:', error);
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
   * Get category by ID
   * GET /api/categories/:id
   */
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);

      res.status(200).json({
        success: true,
        data: {
          category
        },
        message: 'Category retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('Category not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      console.error('Get category by ID error:', error);
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
   * Create a new category
   * POST /api/categories
   */
  async createCategory(req, res) {
    try {
      const categoryData = req.body;
      const category = await categoryService.createCategory(categoryData);

      res.status(201).json({
        success: true,
        data: {
          category
        },
        message: 'Category created successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }



      // Handle mongoose validation errors
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

      console.error('Create category error:', error);
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
   * Update category
   * PUT /api/categories/:id
   */
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const category = await categoryService.updateCategory(id, updateData);

      res.status(200).json({
        success: true,
        data: {
          category
        },
        message: 'Category updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('Category not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('already exists')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle mongoose validation errors
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

      console.error('Update category error:', error);
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
   * Delete category
   * DELETE /api/categories/:id
   */
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);

      res.status(200).json({
        success: true,
        data: {
          message: 'Category deleted successfully'
        },
        message: 'Category deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('Category not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }



      console.error('Delete category error:', error);
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

export default new CategoryController(); 