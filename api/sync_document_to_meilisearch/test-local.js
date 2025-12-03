/**
 * Local testing script for the real-time sync function
 * This simulates Appwrite events for testing purposes
 */

import main from './src/main.js';

// Mock environment variables for testing
process.env.APPWRITE_FUNCTION_API_ENDPOINT = 'https://cloud.appwrite.io/v1';
process.env.APPWRITE_FUNCTION_PROJECT_ID = 'your-project-id';
process.env.MEILISEARCH_ENDPOINT = 'http://localhost:7700';
process.env.MEILISEARCH_ADMIN_API_KEY = 'your-meilisearch-admin-key';

// Mock logging functions
const log = (...args) => console.log('[LOG]', ...args);
const error = (...args) => console.error('[ERROR]', ...args);

// Mock response object
const mockRes = {
  json: (data, status = 200) => {
    console.log(`[RESPONSE ${status}]`, JSON.stringify(data, null, 2));
    return data;
  },
  text: (data, status = 200, headers = {}) => {
    console.log(`[RESPONSE ${status}]`, data);
    return data;
  },
};

// Test cases
const testCases = [
  {
    name: 'Document Create Event',
    request: {
      method: 'POST',
      headers: {
        'x-appwrite-key': 'your-api-key',
      },
      body: {
        events: ['databases.main.collections.addons.documents.test-doc-1.create'],
        payload: {
          $id: 'test-doc-1',
          $collectionId: 'addons',
          $databaseId: 'main',
          $permissions: [],
          name: 'Test Addon',
          description: 'A test addon for development',
          version: '1.0.0',
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
        },
      },
    },
  },
  {
    name: 'Document Update Event',
    request: {
      method: 'POST',
      headers: {
        'x-appwrite-key': 'your-api-key',
      },
      body: {
        events: ['databases.main.collections.addons.documents.test-doc-1.update'],
        payload: {
          $id: 'test-doc-1',
          $collectionId: 'addons',
          $databaseId: 'main',
          $permissions: [],
          name: 'Updated Test Addon',
          description: 'An updated test addon for development',
          version: '1.1.0',
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
        },
      },
    },
  },
  {
    name: 'Document Delete Event',
    request: {
      method: 'POST',
      headers: {
        'x-appwrite-key': 'your-api-key',
      },
      body: {
        events: ['databases.main.collections.addons.documents.test-doc-1.delete'],
        payload: {
          $id: 'test-doc-1',
          $collectionId: 'addons',
          $databaseId: 'main',
        },
      },
    },
  },
  {
    name: 'Unsupported Collection Event',
    request: {
      method: 'POST',
      headers: {
        'x-appwrite-key': 'your-api-key',
      },
      body: {
        events: ['databases.main.collections.unsupported.documents.test-doc-2.create'],
        payload: {
          $id: 'test-doc-2',
          $collectionId: 'unsupported',
          $databaseId: 'main',
          $permissions: [],
          data: 'test',
        },
      },
    },
  },
  {
    name: 'Invalid Event Format',
    request: {
      method: 'POST',
      headers: {
        'x-appwrite-key': 'your-api-key',
      },
      body: {
        events: ['invalid.event.format'],
        payload: {},
      },
    },
  },
  {
    name: 'No Event Data',
    request: {
      method: 'POST',
      headers: {
        'x-appwrite-key': 'your-api-key',
      },
      body: {},
    },
  },
];

// Run tests
async function runTests() {
  console.log('🧪 Starting local tests for real-time sync function\n');

  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log('─'.repeat(50));

    try {
      await main({
        req: testCase.request,
        res: mockRes,
        log,
        error,
      });
    } catch (err) {
      console.error('[TEST ERROR]', err.message);
    }

    console.log(''); // Empty line for readability
  }

  console.log('✅ All tests completed');
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('⚠️  Before running tests:');
  console.log('   1. Update environment variables in this file');
  console.log('   2. Ensure Meilisearch is running and accessible');
  console.log('   3. Ensure you have valid Appwrite API credentials\n');

  runTests().catch(console.error);
}

export default runTests;
