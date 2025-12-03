import { Client, Databases } from 'node-appwrite';
import { performFullScan, performQuickScan, performHealthCheck } from './scanner.js';
import { validateEnvironment } from './utils.js';
import { PERFORMANCE_SETTINGS } from './config.js';

/**
 * Main Appwrite Function handler for Scan Addons
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function main({ req, res, log: appwriteLog, error: appwriteError }) {
  const startTime = Date.now();

  // Enhanced logging that writes to both Appwrite logs and function output
  const logMessage = (message, level = 'info') => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;

    // Log to Appwrite function logs
    if (appwriteLog) {
      appwriteLog(logEntry);
    } else {
      console.log(logEntry);
    }
  };

  const logError = (message, errorObj = null) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ERROR: ${message}`;

    if (appwriteError) {
      appwriteError(logEntry);
    } else {
      console.error(logEntry);
    }

    if (errorObj) {
      console.error(errorObj);
    }
  };

  try {
    logMessage('🚀 Scan Addons function started');

    // Validate environment variables
    const envValidation = validateEnvironment();
    if (!envValidation.isValid) {
      const errorMsg = `❌ Environment validation failed: ${envValidation.errors.join(', ')}`;
      logError(errorMsg);
      return res.json(
        {
          success: false,
          error: 'Environment validation failed',
          details: envValidation.errors,
          timestamp: new Date().toISOString(),
        },
        400
      );
    }

    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const databases = new Databases(client);
    const curseforgeApiKey = process.env.CURSEFORGE_API_KEY;

    // Parse request parameters
    const method = req.method || 'GET';
    const path = req.path || '/';
    const query = req.query || {};
    const body = req.bodyRaw ? JSON.parse(req.bodyRaw) : {};

    logMessage(`📋 Request: ${method} ${path}`);
    logMessage(`🔧 Query params: ${JSON.stringify(query)}`);

    // Route handling
    let result;

    if (path === '/health' || query.action === 'health') {
      // Health check endpoint
      logMessage('🔍 Performing health check...');
      result = await performHealthCheck(databases, logMessage);
    } else if (path === '/quick' || query.action === 'quick') {
      // Quick scan (fewer iterations, faster execution)
      logMessage('⚡ Performing quick scan...');
      const options = {
        maxIterations: parseInt(query.maxIterations) || PERFORMANCE_SETTINGS.QUICK_MAX_ITERATIONS,
        batchSize: parseInt(query.batchSize) || PERFORMANCE_SETTINGS.QUICK_BATCH_SIZE,
        searchQuery: query.searchQuery || 'create',
      };

      result = await performQuickScan(databases, curseforgeApiKey, options, logMessage);
    } else {
      // Full scan (default action)
      logMessage('🔄 Performing full scan...');
      const options = {
        maxIterations: parseInt(query.maxIterations) || PERFORMANCE_SETTINGS.MAX_ITERATIONS,
        batchSize: parseInt(query.batchSize) || PERFORMANCE_SETTINGS.SCAN_BATCH_SIZE,
        iterationDelay: parseInt(query.iterationDelay) || PERFORMANCE_SETTINGS.ITERATION_DELAY,
        requestDelay: parseInt(query.requestDelay) || PERFORMANCE_SETTINGS.REQUEST_DELAY,
        searchQuery: query.searchQuery || 'create',
      };

      result = await performFullScan(databases, curseforgeApiKey, options, logMessage);
    }

    // Calculate execution time
    const executionTime = Date.now() - startTime;
    result.executionTimeMs = executionTime;
    result.executionTimeFormatted = `${(executionTime / 1000).toFixed(2)}s`;

    logMessage(`✅ Scan completed successfully in ${result.executionTimeFormatted}`);
    logMessage(
      `📊 Summary: ${JSON.stringify({
        totalMods: result.totalMods || 0,
        iterations: result.iterations || 0,
        curseforge: result.curseforge || {},
        modrinth: result.modrinth || {},
        combined: result.combined || {},
      })}`
    );

    return res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      executionTime: result.executionTimeFormatted,
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    const errorMsg = `💥 Function execution failed: ${error.message}`;

    logError(errorMsg, error);

    return res.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        executionTime: `${(executionTime / 1000).toFixed(2)}s`,
      },
      500
    );
  }
}

/**
 * For manual execution and testing
 */
export async function manualExecution(action = 'full', options = {}) {
  const mockReq = {
    method: 'GET',
    path: action === 'health' ? '/health' : action === 'quick' ? '/quick' : '/',
    query: options,
    bodyRaw: null,
  };

  const mockRes = {
    json: (data, status = 200) => {
      console.log(`Response (${status}):`, JSON.stringify(data, null, 2));
      return data;
    },
  };

  return await main({
    req: mockReq,
    res: mockRes,
    log: console.log,
    error: console.error,
  });
}

// Export main as default for Appwrite Functions
export default main;
