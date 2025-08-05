import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';
let providerToken, seekerToken;
let jobRequestId, offerId;

// Test data
const testProvider = {
  email: 'provider2@test.com',
  password: 'password123',
  name: { first: 'John', last: 'Provider' },
  phone: '01012345679',
  role: 'provider'
};

const testSeeker = {
  email: 'seeker2@test.com',
  password: 'password123',
  name: { first: 'Jane', last: 'Seeker' },
  phone: '01087654322',
  role: 'seeker'
};

const testJobRequest = {
  title: 'Test Job Request for Refactored Offers',
  description: 'This is a test job request to test refactored offer functionality',
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
  console.log('\n💰 Testing Refactored Offer Creation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/offer/requests/${jobRequestId}`, testOffer, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    offerId = response.data.data._id;
    logResponse('Offer Creation (New Path)', response);
  } catch (error) {
    logError('Offer Creation (New Path)', error);
  }
};

const testGetOffersByJobRequest = async () => {
  console.log('\n📋 Testing Get Offers by Job Request (New Path)...');
  
  try {
    const response = await axios.get(`${BASE_URL}/offer/requests/${jobRequestId}`, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    logResponse('Get Offers by Job Request (New Path)', response);
  } catch (error) {
    logError('Get Offers by Job Request (New Path)', error);
  }
};

const testGetOwnOffers = async () => {
  console.log('\n👤 Testing Get Own Offers (New Path)...');
  
  try {
    const response = await axios.get(`${BASE_URL}/offer`, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    logResponse('Get Own Offers (New Path)', response);
  } catch (error) {
    logError('Get Own Offers (New Path)', error);
  }
};

const testGetOfferById = async () => {
  console.log('\n🔍 Testing Get Offer by ID (New Path)...');
  
  try {
    const response = await axios.get(`${BASE_URL}/offer/${offerId}`, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    logResponse('Get Offer by ID (New Path)', response);
  } catch (error) {
    logError('Get Offer by ID (New Path)', error);
  }
};

const testUpdateOffer = async () => {
  console.log('\n✏️ Testing Update Offer (New Path)...');
  
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
    logResponse('Update Offer (New Path)', response);
  } catch (error) {
    logError('Update Offer (New Path)', error);
  }
};

const testValidationErrors = async () => {
  console.log('\n🚫 Testing Validation Errors (Express-Validator)...');
  
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
    // Test invalid currency
    const invalidCurrencyOffer = {
      price: {
        amount: 2000,
        currency: 'INVALID'
      },
      message: 'Invalid currency offer',
      estimatedTimeDays: 1
    };
    
    const response = await axios.post(`${BASE_URL}/offer/requests/${jobRequestId}`, invalidCurrencyOffer, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    logResponse('Invalid Currency Offer Creation (should fail)', response);
  } catch (error) {
    logError('Invalid Currency Offer Creation (expected)', error);
  }
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Starting Refactored Offer Endpoints Tests...\n');
  
  await testAuth();
  await testCreateJobRequest();
  await testCreateOffer();
  await testGetOffersByJobRequest();
  await testGetOwnOffers();
  await testGetOfferById();
  await testUpdateOffer();
  await testValidationErrors();
  
  console.log('\n🎉 All refactored tests completed!');
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export default runTests; 