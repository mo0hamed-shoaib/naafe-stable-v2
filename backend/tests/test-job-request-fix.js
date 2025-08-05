import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testJobRequestCreation() {
  console.log('🧪 Testing Job Request Creation Fix');
  console.log('=====================================');

  try {
    // Step 1: Register a seeker user
    console.log('\n1. Registering a seeker user...');
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'seeker@test.com',
        password: 'Password123!',
        name: {
          first: 'John',
          last: 'Doe'
        },
        phone: '01234567890',
        role: 'seeker'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Register response:', registerData);

    if (!registerData.success) {
      throw new Error(`Registration failed: ${registerData.error?.message}`);
    }

    // Step 2: Login to get token
    console.log('\n2. Logging in to get access token...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'seeker@test.com',
        password: 'Password123!'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      throw new Error(`Login failed: ${loginData.error?.message}`);
    }

    const token = loginData.data.accessToken;

    // Step 3: Create a category first (if needed)
    console.log('\n3. Creating a test category...');
    const categoryResponse = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test Category',
        description: 'A test category for job requests',
        icon: 'test-icon'
      })
    });

    const categoryData = await categoryResponse.json();
    console.log('Category response:', categoryData);

    // Step 4: Create a job request
    console.log('\n4. Creating a job request...');
    const jobRequestResponse = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Job Request',
        description: 'This is a test job request to verify the fix',
        category: 'Test Category',
        budget: {
          min: 100,
          max: 500
        },
        location: {
          type: 'Point',
          coordinates: [31.2357, 30.0444], // Cairo coordinates
          address: 'Cairo, Egypt'
        },
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        estimatedDuration: 3
      })
    });

    const jobRequestData = await jobRequestResponse.json();
    console.log('Job Request response:', jobRequestData);

    if (jobRequestData.success) {
      console.log('\n✅ SUCCESS: Job request creation is working!');
      console.log('The "Seeker not found" issue has been resolved.');
    } else {
      console.log('\n❌ FAILED: Job request creation still has issues');
      console.log('Error:', jobRequestData.error?.message);
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
  }
}

// Run the test
testJobRequestCreation(); 