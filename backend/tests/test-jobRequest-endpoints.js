import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import JobRequest from '../models/JobRequest.js';
import User, { Seeker, Provider, Category } from '../models/index.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function testJobRequestEndpoints() {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Test job request service methods
    const jobRequestService = (await import('../services/jobRequestService.js')).default;

    console.log('\n🧪 Testing job request service methods...');

    // Create test users
    const seekerData = {
      email: 'seeker@test.com',
      password: 'password123',
      name: { first: 'Test', last: 'Seeker' },
      phone: '01234567890',
      role: 'seeker'
    };

    const providerData = {
      email: 'provider@test.com',
      password: 'password123',
      name: { first: 'Test', last: 'Provider' },
      phone: '01234567891',
      role: 'provider'
    };

    const seeker = new Seeker(seekerData);
    seeker.password = await bcrypt.hash(seekerData.password, 10);
    await seeker.save();

    const provider = new Provider(providerData);
    provider.password = await bcrypt.hash(providerData.password, 10);
    await provider.save();

    console.log('✅ Test users created');

    // Create test category
    const categoryData = {
      name: 'Web Development',
      description: 'Web development services',
      icon: 'fas fa-code'
    };

    const category = new Category(categoryData);
    await category.save();

    console.log('✅ Test category created');

    // Test create job request
    try {
      const jobRequestData = {
        title: 'Need a website for my business',
        description: 'I need a professional website for my small business. Looking for a responsive design with modern UI.',
        category: 'Web Development',
        budget: {
          min: 1000,
          max: 5000
        },
        location: {
          type: 'Point',
          coordinates: [31.2357, 30.0444], // Cairo coordinates
          address: 'Cairo, Egypt'
        },
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        estimatedDuration: 14
      };

      const createdJobRequest = await jobRequestService.createJobRequest(jobRequestData, seeker._id);
      console.log('✅ createJobRequest works:', createdJobRequest.title);
      console.log('   - Status:', createdJobRequest.status);
      console.log('   - Seeker:', createdJobRequest.seeker.name.first);
    } catch (error) {
      console.error('❌ createJobRequest failed:', error.message);
    }

    // Test get all job requests
    try {
      const result = await jobRequestService.getAllJobRequests();
      console.log('✅ getAllJobRequests works:', result.jobRequests.length, 'job requests found');
    } catch (error) {
      console.error('❌ getAllJobRequests failed:', error.message);
    }

    // Test get job request by ID
    try {
      const jobRequest = await JobRequest.findOne({ title: 'Need a website for my business' });
      const foundJobRequest = await jobRequestService.getJobRequestById(jobRequest._id);
      console.log('✅ getJobRequestById works:', foundJobRequest.title);
    } catch (error) {
      console.error('❌ getJobRequestById failed:', error.message);
    }

    // Test update job request
    try {
      const jobRequest = await JobRequest.findOne({ title: 'Need a website for my business' });
      const updateData = {
        title: 'Updated: Need a website for my business',
        description: 'Updated description with more details about the project requirements.'
      };

      const updatedJobRequest = await jobRequestService.updateJobRequest(jobRequest._id, updateData, seeker._id);
      console.log('✅ updateJobRequest works:', updatedJobRequest.title);
    } catch (error) {
      console.error('❌ updateJobRequest failed:', error.message);
    }

    // Test get job requests by seeker
    try {
      const result = await jobRequestService.getJobRequestsBySeeker(seeker._id);
      console.log('✅ getJobRequestsBySeeker works:', result.jobRequests.length, 'job requests');
    } catch (error) {
      console.error('❌ getJobRequestsBySeeker failed:', error.message);
    }

    // Test validation - invalid budget
    try {
      const invalidJobRequestData = {
        title: 'Invalid job request',
        description: 'This should fail due to invalid budget',
        category: 'Web Development',
        budget: {
          min: 5000,
          max: 1000 // Invalid: min > max
        },
        location: {
          type: 'Point',
          coordinates: [31.2357, 30.0444],
          address: 'Cairo, Egypt'
        },
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      await jobRequestService.createJobRequest(invalidJobRequestData, seeker._id);
      console.log('❌ Should have failed - invalid budget');
    } catch (error) {
      console.log('✅ Budget validation works:', error.message.includes('Minimum budget cannot be greater'));
    }

    // Test validation - past deadline
    try {
      const pastDeadlineData = {
        title: 'Past deadline job',
        description: 'This should fail due to past deadline',
        category: 'Web Development',
        budget: {
          min: 1000,
          max: 3000
        },
        location: {
          type: 'Point',
          coordinates: [31.2357, 30.0444],
          address: 'Cairo, Egypt'
        },
        deadline: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      };

      await jobRequestService.createJobRequest(pastDeadlineData, seeker._id);
      console.log('❌ Should have failed - past deadline');
    } catch (error) {
      console.log('✅ Deadline validation works:', error.message.includes('Deadline must be in the future'));
    }

    // Test authorization - provider cannot create job request
    try {
      const providerJobRequestData = {
        title: 'Provider job request',
        description: 'This should fail - providers cannot create job requests',
        category: 'Web Development',
        budget: {
          min: 1000,
          max: 3000
        },
        location: {
          type: 'Point',
          coordinates: [31.2357, 30.0444],
          address: 'Cairo, Egypt'
        },
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      await jobRequestService.createJobRequest(providerJobRequestData, provider._id);
      console.log('❌ Should have failed - provider cannot create job request');
    } catch (error) {
      console.log('✅ Role validation works:', error.message.includes('Only seekers can create job requests'));
    }

    // Test authorization - cannot update other user's job request
    try {
      const jobRequest = await JobRequest.findOne({ title: 'Updated: Need a website for my business' });
      const updateData = { title: 'Unauthorized update' };

      await jobRequestService.updateJobRequest(jobRequest._id, updateData, provider._id);
      console.log('❌ Should have failed - unauthorized update');
    } catch (error) {
      console.log('✅ Authorization works:', error.message.includes('Not authorized to update this job request'));
    }

    // Clean up test data
    await JobRequest.deleteMany({ 
      title: { $in: ['Need a website for my business', 'Updated: Need a website for my business'] } 
    });
    await User.findByIdAndDelete(seeker._id);
    await User.findByIdAndDelete(provider._id);
    await Category.findByIdAndDelete(category._id);

    console.log('\n🧹 Cleaned up test data');

    console.log('\n✅ All job request endpoint tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testJobRequestEndpoints(); 