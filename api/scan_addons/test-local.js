#!/usr/bin/env node

/**
 * Local testing script for Scan Addons function
 * This script allows you to test the function locally before deploying
 */

import dotenv from 'dotenv';
import { manualExecution } from './src/main.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Test different function actions
 */
async function runTests() {
  console.log('🧪 Starting local tests for Scan Addons function...\n');

  try {
    // Test 1: Health Check
    console.log('='.repeat(50));
    console.log('🔍 TEST 1: Health Check');
    console.log('='.repeat(50));

    const healthResult = await manualExecution('health');

    if (healthResult.success) {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed');
    }

    console.log('\n');

    // Test 2: Quick Scan (only if health check passes)
    if (healthResult.success && healthResult.data.status === 'healthy') {
      console.log('='.repeat(50));
      console.log('⚡ TEST 2: Quick Scan (5 iterations)');
      console.log('='.repeat(50));

      const quickResult = await manualExecution('quick', {
        maxIterations: 2,
        batchSize: 10,
        searchQuery: 'create',
      });

      if (quickResult.success) {
        console.log('✅ Quick scan completed successfully');
        console.log(`📊 Results: ${quickResult.data.totalMods} mods processed`);
      } else {
        console.log('❌ Quick scan failed');
      }

      console.log('\n');
    }

    // Test 3: Environment Variables Check
    console.log('='.repeat(50));
    console.log('🔧 TEST 3: Environment Variables');
    console.log('='.repeat(50));

    const requiredVars = [
      'APPWRITE_FUNCTION_API_ENDPOINT',
      'APPWRITE_FUNCTION_PROJECT_ID',
      'APPWRITE_FUNCTION_API_KEY',
      'CURSEFORGE_API_KEY',
    ];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length === 0) {
      console.log('✅ All required environment variables are set');
    } else {
      console.log('❌ Missing environment variables:', missingVars.join(', '));
      console.log('\nPlease set these variables in your .env file or environment:');
      missingVars.forEach((varName) => {
        console.log(`  ${varName}=your_value_here`);
      });
    }
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
  }
}

/**
 * Manual test execution with custom parameters
 */
async function runManualTest() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node test-local.js [action] [options]');
    console.log('');
    console.log('Actions:');
    console.log('  health    - Run health check');
    console.log('  quick     - Run quick scan (few iterations)');
    console.log('  full      - Run full scan (many iterations)');
    console.log('  test      - Run all tests');
    console.log('');
    console.log('Examples:');
    console.log('  node test-local.js test');
    console.log('  node test-local.js health');
    console.log('  node test-local.js quick');
    console.log('  node test-local.js full');
    return;
  }

  const action = args[0];

  if (action === 'test') {
    await runTests();
    return;
  }

  try {
    console.log(`🚀 Running ${action} action...`);

    const options = {};

    // Parse additional arguments as options
    for (let i = 1; i < args.length; i += 2) {
      if (args[i].startsWith('--') && args[i + 1]) {
        const key = args[i].substring(2);
        const value = isNaN(args[i + 1]) ? args[i + 1] : parseInt(args[i + 1]);
        options[key] = value;
      }
    }

    const result = await manualExecution(action, options);

    if (result.success) {
      console.log('✅ Action completed successfully');
    } else {
      console.log('❌ Action failed');
    }
  } catch (error) {
    console.error('💥 Manual test failed:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
  }
}

// Run the appropriate test
if (process.argv.includes('test') || process.argv.length === 2) {
  runTests();
} else {
  runManualTest();
}
