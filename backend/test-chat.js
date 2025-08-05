import { io } from 'socket.io-client';

// Test Socket.IO connection
async function testSocketConnection() {
  console.log('🔌 Testing Socket.IO connection...');
  
  try {
    const socket = io('http://localhost:3000', {
      auth: {
        token: 'test_token' // This will fail authentication, but we can test connection
      }
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.log('❌ Socket connection failed (expected without valid token):', error.message);
    });

    socket.on('error', (error) => {
      console.log('❌ Socket error:', error);
    });

    // Disconnect after 3 seconds
    setTimeout(() => {
      socket.disconnect();
      console.log('🔌 Socket disconnected');
    }, 3000);

  } catch (error) {
    console.error('❌ Socket test failed:', error);
  }
}

// Test HTTP API endpoints
async function testHTTPEndpoints() {
  console.log('\n🌐 Testing HTTP API endpoints...');
  
  const baseURL = 'http://localhost:3000/api/chat';
  
  try {
    // Test health endpoint first
    const healthResponse = await fetch('http://localhost:3000/api/health');
    if (healthResponse.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server is not responding');
      return;
    }

    // Test chat endpoints (will fail without auth, but we can test if they exist)
    const endpoints = [
      '/conversations',
      '/unread-count'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${baseURL}${endpoint}`, {
          headers: {
            'Authorization': 'Bearer invalid_token'
          }
        });
        
        if (response.status === 401) {
          console.log(`✅ ${endpoint} - Endpoint exists (auth required as expected)`);
        } else {
          console.log(`⚠️  ${endpoint} - Unexpected status: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint} - Error:`, error.message);
      }
    }

  } catch (error) {
    console.error('❌ HTTP test failed:', error);
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Starting Chat System Tests...\n');
  
  await testHTTPEndpoints();
  await testSocketConnection();
  
  console.log('\n✅ Chat system tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Start the server: npm run dev');
  console.log('2. Test with valid JWT tokens');
  console.log('3. Create conversations by accepting offers');
  console.log('4. Test real-time messaging');
}

// Run tests
runTests().catch(console.error); 