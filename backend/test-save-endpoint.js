import fetch from 'node-fetch';

async function testSaveEndpoint() {
  try {
    // Test the check endpoint
    const response = await fetch('http://localhost:3000/api/users/me/saved-services/test-service-id', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
    } else {
      console.log('Error response:', response.statusText);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSaveEndpoint(); 