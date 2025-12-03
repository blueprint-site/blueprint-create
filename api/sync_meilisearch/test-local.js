#!/usr/bin/env node

/**
 * Local test harness for the Sync Meilisearch function
 * 
 * Usage:
 *   node test-local.js                    # Incremental sync
 *   node test-local.js --force-full       # Force full sync
 *   node test-local.js --serve            # Start local server
 */

import syncFunction from './src/main.js';
import { createServer } from 'http';
import { URL } from 'url';

// Mock the Appwrite function runtime environment
function createMockContext(options = {}) {
  const { method = 'POST', body = {}, query = {}, forceFullSync = false } = options;
  
  // Mock request object
  const req = {
    method,
    headers: {
      'x-appwrite-key': process.env.APPWRITE_API_KEY || 'your-api-key-here',
      'content-type': 'application/json'
    },
    body: {
      ...body,
      ...(forceFullSync && { forceFullSync: true })
    },
    query: {
      ...query,
      ...(forceFullSync && { forceFullSync: 'true' })
    }
  };

  // Mock response object
  const res = {
    json: (data, status = 200, headers = {}) => {
      console.log(`\n📤 Response (${status}):`);
      console.log(JSON.stringify(data, null, 2));
      return { status, data, headers };
    },
    text: (text, status = 200, headers = {}) => {
      console.log(`\n📤 Response (${status}):`);
      console.log(text);
      return { status, data: text, headers };
    }
  };

  // Mock log function with timestamps
  const log = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  };

  // Mock error function with timestamps
  const error = (message) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${message}`);
  };

  return { req, res, log, error };
}

// Check required environment variables
function validateEnvironment() {
  const required = [
    'APPWRITE_FUNCTION_API_ENDPOINT',
    'APPWRITE_FUNCTION_PROJECT_ID',
    'MEILISEARCH_ENDPOINT',
    'MEILISEARCH_ADMIN_API_KEY',
    'MEILISEARCH_SEARCH_API_KEY'
  ];

  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(env => console.error(`   - ${env}`));
    console.error('\n💡 Create a .env file or set these variables manually');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
}

// Load .env file if it exists
async function loadEnvFile() {
  try {
    const { readFile } = await import('fs/promises');
    const { existsSync } = await import('fs');
    const { resolve } = await import('path');
    
    const envPath = resolve('.env');
    if (existsSync(envPath)) {
      const envContent = await readFile(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          if (value && !process.env[key]) {
            process.env[key] = value;
          }
        }
      });
      console.log('📄 Loaded environment variables from .env file');
    }
  } catch (error) {
    // .env loading is optional
  }
}

// Run a single sync test
async function runSyncTest(forceFullSync = false) {
  console.log('🚀 Starting local sync test...');
  console.log(`📊 Sync type: ${forceFullSync ? 'FULL' : 'INCREMENTAL'}`);
  
  const context = createMockContext({ forceFullSync });
  
  try {
    const result = await syncFunction(context);
    console.log('\n✅ Sync completed successfully!');
    return result;
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Start a local HTTP server for testing
async function startServer(port = 3000) {
  console.log(`🌐 Starting local server on port ${port}...`);
  
  const server = createServer(async (req, res) => {
    console.log(`📨 ${req.method} ${req.url}`);
    
    const url = new URL(req.url, `http://localhost:${port}`);
    const query = Object.fromEntries(url.searchParams);
    
    let body = {};
    if (req.method === 'POST') {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const bodyStr = Buffer.concat(chunks).toString();
      try {
        body = JSON.parse(bodyStr || '{}');
      } catch {
        body = {};
      }
    }
    
    const context = createMockContext({
      method: req.method,
      body,
      query,
      forceFullSync: query.forceFullSync === 'true' || body.forceFullSync === true
    });
    
    // Override response to use HTTP response
    context.res.json = (data, status = 200) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data, null, 2));
    };
    
    context.res.text = (text, status = 200, headers = {}) => {
      res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...headers });
      res.end(text);
    };
    
    try {
      await syncFunction(context);
    } catch (error) {
      console.error('❌ Server error:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
  
  server.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
    console.log(`📱 Test URLs:`);
    console.log(`   GET  http://localhost:${port}/ (demo page)`);
    console.log(`   POST http://localhost:${port}/ (incremental sync)`);
    console.log(`   POST http://localhost:${port}/?forceFullSync=true (full sync)`);
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const forceFullSync = args.includes('--force-full');
  const serve = args.includes('--serve');
  const port = parseInt(args.find(arg => arg.startsWith('--port='))?.split('=')[1]) || 3000;
  
  await loadEnvFile();
  validateEnvironment();
  
  if (serve) {
    await startServer(port);
  } else {
    await runSyncTest(forceFullSync);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { createMockContext, runSyncTest, startServer };
