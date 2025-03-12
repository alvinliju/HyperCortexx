// test-cortex-routes.js
const axios = require('axios');
const assert = require('assert');

// Configuration
const API_URL = 'http://localhost:8000/'; // Change to your server URL
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkzNjRjOGQ3LTA0OTYtNGY5OS1hYmNhLWIzYzBkOTlmZWY3MyIsImdvb2dsZUlkIjpudWxsLCJlbWFpbCI6InJlYXBlcjY5QHR1dGEuaW8iLCJuYW1lIjpudWxsLCJwYXNzd29yZCI6IiQyYiQxMCQzWFBUUkpabHk2bXo4YmpNb1FJWWRlUTZibnlCMjV0UE80UVoub2w5UXRtZU8vcmxnSURrcSIsImF1dGhUeXBlIjoiZW1haWwiLCJjcmVhdGVkQXQiOiIyMDI1LTAzLTExVDE0OjA3OjA1LjgxNVoiLCJ1cGRhdGVkQXQiOiIyMDI1LTAzLTExVDE0OjA3OjA1LjgxNVoiLCJpYXQiOjE3NDE3MDIwMjUsImV4cCI6MTc0MTcwNTYyNX0.lwrM50-mSXZL5eUfDlScCZv4OCu3tMcJtVUq_XmqQek'; // Replace with valid JWT token

// Helper for API requests with authentication
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  }
});

// Test data
const testCortexItem = {
  type: 'article',
  title: 'Test Cortex Item',
  description: 'This is a test description',
  link: 'https://example.com/test',
  language: 'c++',
  content: 'Test content for the cortex item',
  tags: ['test', 'api', 'cortex'],
  isPublic: true
};

// Main testing function
async function testCortexRoutes() {
  try {
    console.log('🧪 Starting Cortex Routes Test');
    
    // Test 1: GET cortex items
    console.log('\n🔍 Test 1: Getting all cortex items');
    const getResponse = await apiClient.get('/cortex');
    assert(getResponse.status === 200, `Expected status 200, got ${getResponse.status}`);
    assert(Array.isArray(getResponse.data.cortexes), 'Response should contain cortexes array');
    console.log('✅ GET /cortex successful');
    console.log(`📊 Found ${getResponse.data.cortexes.length} cortex items`);
    
    // Test 2: Create a new cortex item
    console.log('\n🔍 Test 2: Creating a new cortex item');
    const postResponse = await apiClient.post('/cortex', testCortexItem);
    assert(postResponse.status === 201, `Expected status 201, got ${postResponse.status}`);
    assert(postResponse.data.cortex, 'Response should contain a cortex object');
    assert(postResponse.data.cortex.id, 'New cortex should have an ID');
    assert(postResponse.data.cortex.title === testCortexItem.title, 'Title should match');
    console.log('✅ POST /cortex successful');
    console.log(`📝 Created cortex item with ID: ${postResponse.data.cortex.id}`);
    
    // Test 3: Verify the created item appears in GET
    console.log('\n🔍 Test 3: Verifying created item exists');
    const verifyResponse = await apiClient.get('/cortex');
    const createdItem = verifyResponse.data.cortexes.find(
      item => item.id === postResponse.data.cortex.id
    );
    assert(createdItem, 'Created item should appear in GET request');
    console.log('✅ Verification successful');
    
    // Test 4: Test validation (missing required fields)
    console.log('\n🔍 Test 4: Testing validation - missing required fields');
    try {
      const invalidItem = { type: 'article' }; // Missing title and link
      await apiClient.post('/cortex', invalidItem);
      assert(false, 'Should have thrown an error for invalid data');
    } catch (error) {
      assert(error.response.status === 400, `Expected status 400, got ${error.response.status}`);
      console.log('✅ Validation test passed - correctly rejected invalid data');
    }
    
    // Test 5: Test unauthenticated access
    console.log('\n🔍 Test 5: Testing unauthenticated access');
    try {
      const unauthClient = axios.create({
        baseURL: API_URL,
        headers: { 'Content-Type': 'application/json' }
      });
      await unauthClient.get('/cortex');
      assert(false, 'Should have thrown an error for unauthenticated request');
    } catch (error) {
      assert(error.response.status === 401, `Expected status 401, got ${error.response.status}`);
      console.log('✅ Authentication test passed - correctly rejected unauthenticated request');
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error(error);
    }
  }
}

// Run the tests
testCortexRoutes();