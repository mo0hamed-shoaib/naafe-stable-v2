import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';
let providerToken, seekerToken, adminToken;
let jobRequestId, offerId;

// Test data
const testProvider = {
  email: 'provider@test.com',
  password: 'password123',
  name: { first: 'John', last: 'Provider' },
  phone: '01012345678',
  role: 'provider'
};

const testSeeker = {
  email: 'seeker@test.com',
  password: 'password123',
  name: { first: 'Jane', last: 'Seeker' },
  phone: '01087654321',
  role: 'seeker'
};

const testJobRequest = {
  title: 'Test Job Request for Offers',
  description: 'This is a test job request to test offer functionality',
  category: 'Web Development',
  budget: { min: 1000, max: 5000 },
  location: {
    type: 'Point',
    coordinates: [31.2357, 30.0444], // Cairo coordinates
    address: 'Cairo, Egypt'
  },
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
};

const testOffer = {
  price: {
    amount: 2500,
    currency: 'EGP'
  },
  message: 'I can complete this job efficiently and on time',
  estimatedTimeDays: 3
};

// Helper function to log responses
const logResponse = (testName, response) => {
  console.log(`\n✅ ${testName}:`);
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
};

const logError = (testName, error) => {
  console.log(`\n❌ ${testName}:`);
  console.log(`Status: ${error.response?.status || 'No response'}`);
  console.log('Error:', error.response?.data || error.message);
};

// Test functions
const testAuth = async () => {
  console.log('\n🔐 Testing Authentication...');
  
  try {
    // Register provider
    const providerReg = await axios.post(`${BASE_URL}/auth/register`, testProvider);
    logResponse('Provider Registration', providerReg);
    
    // Register seeker
    const seekerReg = await axios.post(`${BASE_URL}/auth/register`, testSeeker);
    logResponse('Seeker Registration', seekerReg);
    
    // Login provider
    const providerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: testProvider.email,
      password: testProvider.password
    });
    providerToken = providerLogin.data.data.token;
    logResponse('Provider Login', providerLogin);
    
    // Login seeker
    const seekerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: testSeeker.email,
      password: testSeeker.password
    });
    seekerToken = seekerLogin.data.data.token;
    logResponse('Seeker Login', seekerLogin);
    
  } catch (error) {
    logError('Authentication Test', error);
  }
};

const testCreateJobRequest = async () => {
  console.log('\n📝 Testing Job Request Creation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/requests`, testJobRequest, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    jobRequestId = response.data.data._id;
    logResponse('Job Request Creation', response);
  } catch (error) {
    logError('Job Request Creation', error);
  }
};

const testCreateOffer = async () => {
  console.log('\n💰 Testing Offer Creation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/offer/requests/${jobRequestId}`, testOffer, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    offerId = response.data.data._id;
    logResponse('Offer Creation', response);
  } catch (error) {
    logError('Offer Creation', error);
  }
};

const testGetOffersByJobRequest = async () => {
  console.log('\n📋 Testing Get Offers by Job Request...');
  
  try {
    const response = await axios.get(`${BASE_URL}/offer/requests/${jobRequestId}`, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    logResponse('Get Offers by Job Request', response);
  } catch (error) {
    logError('Get Offers by Job Request', error);
  }
};

const testGetOwnOffers = async () => {
  console.log('\n👤 Testing Get Own Offers...');
  
  try {
    const response = await axios.get(`${BASE_URL}/offer`, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    logResponse('Get Own Offers', response);
  } catch (error) {
    logError('Get Own Offers', error);
  }
};

const testGetOfferById = async () => {
  console.log('\n🔍 Testing Get Offer by ID...');
  
  try {
    const response = await axios.get(`${BASE_URL}/offer/${offerId}`, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    logResponse('Get Offer by ID', response);
  } catch (error) {
    logError('Get Offer by ID', error);
  }
};

const testUpdateOffer = async () => {
  console.log('\n✏️ Testing Update Offer...');
  
  try {
    const updateData = {
      price: {
        amount: 3000,
        currency: 'EGP'
      },
      message: 'Updated offer message with better terms',
      estimatedTimeDays: 2
    };
    
    const response = await axios.patch(`${BASE_URL}/offer/${offerId}`, updateData, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    logResponse('Update Offer', response);
  } catch (error) {
    logError('Update Offer', error);
  }
};

const testAcceptOffer = async () => {
  console.log('\n✅ Testing Accept Offer...');
  
  try {
    const response = await axios.post(`${BASE_URL}/offer/${offerId}/accept`, {}, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    logResponse('Accept Offer', response);
  } catch (error) {
    logError('Accept Offer', error);
  }
};

const testRejectOffer = async () => {
  console.log('\n❌ Testing Reject Offer...');
  
  try {
    // Create another offer first
    const anotherOffer = {
      price: {
        amount: 4000,
        currency: 'EGP'
      },
      message: 'Another offer to test rejection',
      estimatedTimeDays: 5
    };
    
    const createResponse = await axios.post(`${BASE_URL}/offer/requests/${jobRequestId}`, anotherOffer, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    
    const newOfferId = createResponse.data.data._id;
    
    const response = await axios.post(`${BASE_URL}/offer/${newOfferId}/reject`, {}, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    logResponse('Reject Offer', response);
  } catch (error) {
    logError('Reject Offer', error);
  }
};

const testValidationErrors = async () => {
  console.log('\n🚫 Testing Validation Errors...');
  
  try {
    // Test invalid price
    const invalidOffer = {
      price: {
        amount: -100,
        currency: 'EGP'
      },
      message: 'Invalid offer',
      estimatedTimeDays: 0
    };
    
    const response = await axios.post(`${BASE_URL}/offer/requests/${jobRequestId}`, invalidOffer, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    logResponse('Invalid Offer Creation (should fail)', response);
  } catch (error) {
    logError('Invalid Offer Creation (expected)', error);
  }
  
  try {
    // Test price outside budget range
    const outOfBudgetOffer = {
      price: {
        amount: 10000, // Outside the 1000-5000 range
        currency: 'EGP'
      },
      message: 'Out of budget offer',
      estimatedTimeDays: 1
    };
    
    const response = await axios.post(`${BASE_URL}/offer/requests/${jobRequestId}`, outOfBudgetOffer, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    logResponse('Out of Budget Offer Creation (should fail)', response);
  } catch (error) {
    logError('Out of Budget Offer Creation (expected)', error);
  }
};

const testAccessControl = async () => {
  console.log('\n🔒 Testing Access Control...');
  
  try {
    // Try to create offer as seeker (should fail)
    const response = await axios.post(`${BASE_URL}/offer/requests/${jobRequestId}`, testOffer, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    logResponse('Create Offer as Seeker (should fail)', response);
  } catch (error) {
    logError('Create Offer as Seeker (expected)', error);
  }
  
  try {
    // Try to get own offers as seeker (should fail)
    const response = await axios.get(`${BASE_URL}/offer`, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    logResponse('Get Own Offers as Seeker (should fail)', response);
  } catch (error) {
    logError('Get Own Offers as Seeker (expected)', error);
  }
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Starting Offer Endpoints Tests...\n');
  
  await testAuth();
  await testCreateJobRequest();
  await testCreateOffer();
  await testGetOffersByJobRequest();
  await testGetOwnOffers();
  await testGetOfferById();
  await testUpdateOffer();
  await testAcceptOffer();
  await testRejectOffer();
  await testValidationErrors();
  await testAccessControl();
  
  console.log('\n🎉 All tests completed!');
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export default runTests; 