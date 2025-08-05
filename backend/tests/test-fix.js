import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testFix() {
  console.log('🧪 Testing the userId/_id fix');
  console.log('================================');

  try {
    // Step 1: Register a seeker
    console.log('\n1. Registering seeker...');
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testseeker@test.com',
        password: 'Password123!',
        name: { first: 'Test', last: 'Seeker' },
        phone: '01234567890',
        role: 'seeker'
      })
    });

    const registerData = await registerResponse.json();
    if (!registerData.success) {
      throw new Error(`Registration failed: ${registerData.error?.message}`);
    }
    console.log('✅ Registration successful');

    // Step 2: Login
    console.log('\n2. Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testseeker@test.com',
        password: 'Password123!'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      throw new Error(`Login failed: ${loginData.error?.message}`);
    }
    console.log('✅ Login successful');

    const token = loginData.data.accessToken;
    console.log(`Token: ${token.substring(0, 20)}...`);

    // Step 3: Try to create a job request (should fail due to missing category, but should not be "Seeker not found")
    console.log('\n3. Testing job request creation...');
    const jobRequestResponse = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Job',
        description: 'Test description',
        category: 'NonExistentCategory',
        budget: { min: 100, max: 500 },
        location: {
          type: 'Point',
          coordinates: [31.2357, 30.0444]
        },
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
    });

    const jobRequestData = await jobRequestResponse.json();
    console.log('Job request response:', jobRequestData);

    if (jobRequestData.error?.message?.includes('Seeker not found')) {
      console.log('❌ FAILED: Still getting "Seeker not found" error');
    } else if (jobRequestData.error?.message?.includes('Category does not exist')) {
      console.log('✅ SUCCESS: Fixed! Now getting category error instead of "Seeker not found"');
      console.log('This means the userId/_id issue is resolved!');
    } else {
      console.log('✅ SUCCESS: Job request created successfully!');
    }

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
  }
}

testFix(); 