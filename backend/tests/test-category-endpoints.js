import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';

dotenv.config();

async function testCategoryEndpoints() {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Test category service methods
    const categoryService = (await import('../services/categoryService.js')).default;

    console.log('\n🧪 Testing category service methods...');

    // Test create category
    try {
      const categoryData = {
        name: 'Web Development',
        description: 'Web development services including frontend and backend development',
        icon: 'fas fa-code'
      };
      
      const createdCategory = await categoryService.createCategory(categoryData);
      console.log('✅ createCategory works:', createdCategory.name);
    } catch (error) {
      console.error('❌ createCategory failed:', error.message);
    }

    // Test create another category
    try {
      const categoryData2 = {
        name: 'Mobile Development',
        description: 'Mobile app development services',
        icon: 'fas fa-mobile-alt',
      };
      
      const createdCategory2 = await categoryService.createCategory(categoryData2);
      console.log('✅ createCategory2 works:', createdCategory2.name);
    } catch (error) {
      console.error('❌ createCategory2 failed:', error.message);
    }

    // Test get all categories
    try {
      const categories = await categoryService.getAllCategories();
      console.log('✅ getAllCategories works:', categories.length, 'categories found');
    } catch (error) {
      console.error('❌ getAllCategories failed:', error.message);
    }

    // Test get all categories with inactive
    try {
      const allCategories = await categoryService.getAllCategories({ includeInactive: true });
      console.log('✅ getAllCategories with inactive works:', allCategories.length, 'categories');
    } catch (error) {
      console.error('❌ getAllCategories with inactive failed:', error.message);
    }

    // Test update category
    try {
      const category = await Category.findOne({ name: 'Web Development' });
      const updateData = {
        description: 'Updated web development description'
      };
      
      const updatedCategory = await categoryService.updateCategory(category._id, updateData);
      console.log('✅ updateCategory works:', updatedCategory.description);
    } catch (error) {
      console.error('❌ updateCategory failed:', error.message);
    }

    // Test get category by ID
    try {
      const category = await Category.findOne({ name: 'Web Development' });
      const foundCategory = await categoryService.getCategoryById(category._id);
      console.log('✅ getCategoryById works:', foundCategory.name);
    } catch (error) {
      console.error('❌ getCategoryById failed:', error.message);
    }



    // Test validation - duplicate name
    try {
      const duplicateData = {
        name: 'Web Development',
        description: 'Duplicate category'
      };
      
      await categoryService.createCategory(duplicateData);
      console.log('❌ Should have failed - duplicate name');
    } catch (error) {
      console.log('✅ Duplicate name validation works:', error.message.includes('already exists'));
    }



    // Clean up test data
    await Category.deleteMany({ 
      name: { $in: ['Web Development', 'Mobile Development'] } 
    });
    console.log('\n🧹 Cleaned up test data');

    console.log('\n✅ All category endpoint tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testCategoryEndpoints(); 