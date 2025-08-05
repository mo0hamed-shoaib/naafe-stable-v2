import Category from '../models/Category.js';

class CategoryService {
  /**
   * Get all active categories
   * @param {Object} options - Query options
   * @returns {Array} Array of categories
   */
  async getAllCategories(options = {}) {
    try {
      const { includeInactive = false } = options;
      
      let query = {};
      if (!includeInactive) {
        query.isActive = true;
      }

      const categories = await Category.find(query)
        .sort({ name: 1 });

      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @returns {Object} Category object
   */
  async getCategoryById(categoryId) {
    try {
      const category = await Category.findById(categoryId);

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    } catch (error) {
      throw error;
    }
  }



  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Object} Created category
   */
  async createCategory(categoryData) {
    try {
      // Check if category with same name already exists
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') }
      });

      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }

      const category = new Category(categoryData);
      await category.save();

      return category;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update category
   * @param {string} categoryId - Category ID
   * @param {Object} updateData - Update data
   * @returns {Object} Updated category
   */
  async updateCategory(categoryId, updateData) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      // Check if name is being updated and if it conflicts with existing category
      if (updateData.name && updateData.name !== category.name) {
        const existingCategory = await Category.findOne({ 
          name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
          _id: { $ne: categoryId }
        });

        if (existingCategory) {
          throw new Error('Category with this name already exists');
        }
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        updateData,
        { 
          new: true, 
          runValidators: true 
        }
      );

      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete category
   * @param {string} categoryId - Category ID
   * @returns {boolean} Success status
   */
  async deleteCategory(categoryId) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }



      // Check if category is being used in jobs or services
      // This would require checking JobRequest and ServiceListing models
      // For now, we'll just delete the category
      await Category.findByIdAndDelete(categoryId);

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle category active status
   * @param {string} categoryId - Category ID
   * @returns {Object} Updated category
   */
  async toggleCategoryStatus(categoryId) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      category.isActive = !category.isActive;
      await category.save();

      return category;
    } catch (error) {
      throw error;
    }
  }

}

export default new CategoryService(); 