import { searchCurseForgeMods } from './curseforgeClient.js';
import { searchModrinthMods } from './modrinthClient.js';
import { saveModsWithSource, combineAndUpsertMods, getModsCount } from './databaseOperations.js';
import { normalizeModData, delay } from './utils.js';
import {
  LOADERS_LIST,
  CATEGORIES_LIST,
  PERFORMANCE_SETTINGS,
  REQUIRED_ENV_VARS,
} from './config.js';

/**
 * Perform a complete scan of addons from all sources
 * @param {Object} databases - Appwrite Databases instance
 * @param {string} curseforgeApiKey - CurseForge API key
 * @param {Object} options - Scan options
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Scan results
 */
export async function performFullScan(databases, curseforgeApiKey, options = {}, log) {
  const {
    maxIterations = PERFORMANCE_SETTINGS.MAX_ITERATIONS,
    batchSize = PERFORMANCE_SETTINGS.SCAN_BATCH_SIZE,
    iterationDelay = PERFORMANCE_SETTINGS.ITERATION_DELAY,
    requestDelay = PERFORMANCE_SETTINGS.REQUEST_DELAY,
    searchQuery = 'create',
  } = options;

  const startTime = Date.now();
  let iteration = 1;
  let offset = 0;
  const allMods = [];
  const results = {
    iterations: 0,
    totalMods: 0,
    curseforge: { fetched: 0, saved: 0 },
    modrinth: { fetched: 0, saved: 0 },
    combined: { created: 0, updated: 0 },
    errors: [],
    executionTimeMs: 0,
  };

  log(`🚀 Starting full addon scan...`);
  log(
    `📋 Configuration: maxIterations=${maxIterations}, batchSize=${batchSize}, query="${searchQuery}"`
  );

  try {
    // Get initial count
    const initialCount = await getModsCount(databases, log);
    log(`📊 Initial mod count in database: ${initialCount}`);

    while (iteration <= maxIterations) {
      log(`\n⏳ Iteration ${iteration}/${maxIterations} (offset: ${offset})...`);

      // Fetch from both sources in parallel
      const [curseforgeResponse, modrinthMods] = await Promise.all([
        searchCurseForgeMods(
          curseforgeApiKey,
          offset,
          batchSize,
          searchQuery,
          undefined,
          log
        ).catch((err) => {
          log(`❌ CurseForge error: ${err.message}`);
          results.errors.push(`CurseForge iteration ${iteration}: ${err.message}`);
          return { data: [] };
        }),
        searchModrinthMods(offset, batchSize, searchQuery, undefined, log).catch((err) => {
          log(`❌ Modrinth error: ${err.message}`);
          results.errors.push(`Modrinth iteration ${iteration}: ${err.message}`);
          return [];
        }),
      ]);

      const curseforgeMods = curseforgeResponse.data || [];

      // Check if we should stop (no more data)
      if (curseforgeMods.length === 0 && modrinthMods.length === 0) {
        log('❌ No more data found. Stopping iterations.');
        break;
      }

      log(`📦 Fetched: ${curseforgeMods.length} CurseForge, ${modrinthMods.length} Modrinth`);

      // Update counters
      results.curseforge.fetched += curseforgeMods.length;
      results.modrinth.fetched += modrinthMods.length;

      // Normalize data - filter out null results from invalid mods
      const normalizedCurseforge = curseforgeMods
        .map((mod) => normalizeModData(mod, 'CurseForge', LOADERS_LIST, CATEGORIES_LIST))
        .filter(mod => mod !== null);

      const normalizedModrinth = modrinthMods
        .map((mod) => normalizeModData(mod, 'Modrinth', LOADERS_LIST, CATEGORIES_LIST))
        .filter(mod => mod !== null);

      // Log statistics about filtered mods
      const filteredCurseforge = curseforgeMods.length - normalizedCurseforge.length;
      const filteredModrinth = modrinthMods.length - normalizedModrinth.length;
      
      if (filteredCurseforge > 0) {
        log(`⚠️  Filtered out ${filteredCurseforge} CurseForge mods due to missing names`);
      }
      if (filteredModrinth > 0) {
        log(`⚠️  Filtered out ${filteredModrinth} Modrinth mods due to missing names`);
      }

      // Add to all mods collection for final combination
      allMods.push(...normalizedCurseforge, ...normalizedModrinth);

      // Delay before database operations
      await delay(requestDelay);

      // Save mods with source tracking
      try {
        const curseforgeResults = await saveModsWithSource(
          databases,
          normalizedCurseforge,
          'CurseForge',
          log
        );
        results.curseforge.saved += curseforgeResults.created + curseforgeResults.updated;

        const modrinthResults = await saveModsWithSource(
          databases,
          normalizedModrinth,
          'Modrinth',
          log
        );
        results.modrinth.saved += modrinthResults.created + modrinthResults.updated;
      } catch (error) {
        log(`❌ Error saving mods in iteration ${iteration}: ${error.message}`);
        results.errors.push(`Save iteration ${iteration}: ${error.message}`);
      }

      // Update iteration counters
      results.iterations = iteration;
      offset += batchSize;
      iteration++;

      // Delay between iterations
      if (iteration <= maxIterations) {
        log(`⏸️  Waiting ${iterationDelay}ms before next iteration...`);
        await delay(iterationDelay);
      }
    }

    log(`\n🔄 Combining and deduplicating ${allMods.length} total mods...`);

    // Final combination and deduplication
    try {
      const combinedResults = await combineAndUpsertMods(databases, allMods, log);
      results.combined = combinedResults;
    } catch (error) {
      log(`❌ Error in final combination: ${error.message}`);
      results.errors.push(`Final combination: ${error.message}`);
    }

    // Get final count
    const finalCount = await getModsCount(databases, log);
    results.totalMods = finalCount;

    results.executionTimeMs = Date.now() - startTime;

    log(`\n✅ Scan completed!`);
    log(`📊 Final Results:`);
    log(`   - Iterations: ${results.iterations}`);
    log(`   - Total mods in database: ${results.totalMods}`);
    log(
      `   - CurseForge: ${results.curseforge.fetched} fetched, ${results.curseforge.saved} saved`
    );
    log(`   - Modrinth: ${results.modrinth.fetched} fetched, ${results.modrinth.saved} saved`);
    log(`   - Combined: ${results.combined.created} created, ${results.combined.updated} updated`);
    log(`   - Execution time: ${Math.round(results.executionTimeMs / 1000)}s`);
    log(`   - Errors: ${results.errors.length}`);

    return results;
  } catch (error) {
    results.executionTimeMs = Date.now() - startTime;
    results.errors.push(`Fatal error: ${error.message}`);
    log(`❌ Fatal error during scan: ${error.message}`);
    throw error;
  }
}

/**
 * Perform an incremental scan (single iteration)
 * @param {Object} databases - Appwrite Databases instance
 * @param {string} curseforgeApiKey - CurseForge API key
 * @param {Object} options - Scan options
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Scan results
 */
export async function performIncrementalScan(databases, curseforgeApiKey, options = {}, log) {
  const {
    offset = 0,
    batchSize = PERFORMANCE_SETTINGS.SCAN_BATCH_SIZE,
    searchQuery = 'create',
  } = options;

  log(`🔄 Starting incremental scan: offset=${offset}, batchSize=${batchSize}`);

  const startTime = Date.now();
  const results = {
    offset,
    batchSize,
    curseforge: { fetched: 0, saved: 0 },
    modrinth: { fetched: 0, saved: 0 },
    errors: [],
    executionTimeMs: 0,
  };

  try {
    // Fetch from both sources
    const [curseforgeResponse, modrinthMods] = await Promise.all([
      searchCurseForgeMods(curseforgeApiKey, offset, batchSize, searchQuery, undefined, log),
      searchModrinthMods(offset, batchSize, searchQuery, undefined, log),
    ]);

    const curseforgeMods = curseforgeResponse.data || [];

    results.curseforge.fetched = curseforgeMods.length;
    results.modrinth.fetched = modrinthMods.length;

    // Normalize and save - filter out null results from invalid mods
    const normalizedCurseforge = curseforgeMods
      .map((mod) => normalizeModData(mod, 'CurseForge', LOADERS_LIST, CATEGORIES_LIST))
      .filter(mod => mod !== null);

    const normalizedModrinth = modrinthMods
      .map((mod) => normalizeModData(mod, 'Modrinth', LOADERS_LIST, CATEGORIES_LIST))
      .filter(mod => mod !== null);

    // Log statistics about filtered mods
    const filteredCurseforge = curseforgeMods.length - normalizedCurseforge.length;
    const filteredModrinth = modrinthMods.length - normalizedModrinth.length;
    
    if (filteredCurseforge > 0) {
      log(`⚠️  Filtered out ${filteredCurseforge} CurseForge mods due to missing names`);
    }
    if (filteredModrinth > 0) {
      log(`⚠️  Filtered out ${filteredModrinth} Modrinth mods due to missing names`);
    }

    // Save to database
    const curseforgeResults = await saveModsWithSource(
      databases,
      normalizedCurseforge,
      'CurseForge',
      log
    );

    const modrinthResults = await saveModsWithSource(
      databases,
      normalizedModrinth,
      'Modrinth',
      log
    );

    results.curseforge.saved = curseforgeResults.created + curseforgeResults.updated;
    results.modrinth.saved = modrinthResults.created + modrinthResults.updated;

    results.executionTimeMs = Date.now() - startTime;

    log(`✅ Incremental scan completed in ${Math.round(results.executionTimeMs / 1000)}s`);
    return results;
  } catch (error) {
    results.executionTimeMs = Date.now() - startTime;
    results.errors.push(error.message);
    log(`❌ Error in incremental scan: ${error.message}`);
    throw error;
  }
}

/**
 * Perform a quick scan (reduced iterations for faster execution)
 * @param {Object} databases - Appwrite Databases instance
 * @param {string} curseforgeApiKey - CurseForge API key
 * @param {Object} options - Scan options
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Scan results
 */
export async function performQuickScan(databases, curseforgeApiKey, options = {}, log) {
  const quickOptions = {
    ...options,
    maxIterations: Math.min(
      options.maxIterations || PERFORMANCE_SETTINGS.QUICK_MAX_ITERATIONS,
      PERFORMANCE_SETTINGS.QUICK_MAX_ITERATIONS * 2
    ),
    batchSize: Math.min(
      options.batchSize || PERFORMANCE_SETTINGS.QUICK_BATCH_SIZE,
      PERFORMANCE_SETTINGS.SCAN_BATCH_SIZE
    ),
    iterationDelay: Math.max(
      options.iterationDelay || PERFORMANCE_SETTINGS.QUICK_ITERATION_DELAY,
      1000
    ),
    requestDelay: Math.max(options.requestDelay || PERFORMANCE_SETTINGS.QUICK_REQUEST_DELAY, 250),
  };

  log(`⚡ Starting quick scan with reduced parameters...`);
  return await performFullScan(databases, curseforgeApiKey, quickOptions, log);
}

/**
 * Perform health check of the addon scanning system
 * @param {Object} databases - Appwrite Databases instance
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Health check results
 */
export async function performHealthCheck(databases, log) {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    checks: {},
    timestamp: new Date().toISOString(),
    executionTimeMs: 0,
  };

  try {
    log('🔍 Starting health check...');

    // Check database connectivity
    try {
      const dbTest = await databases.list();
      health.checks.database = {
        status: 'healthy',
        message: `Connected to ${dbTest.total} databases`,
      };
      log(`✅ Database connectivity: OK`);
    } catch (error) {
      health.checks.database = {
        status: 'unhealthy',
        message: `Database connection failed: ${error.message}`,
      };
      health.status = 'unhealthy';
      log(`❌ Database connectivity: FAILED - ${error.message}`);
    }

    // Check addons collection
    try {
      const modsCount = await getModsCount(databases, log);
      health.checks.addonsCollection = {
        status: 'healthy',
        message: `Collection accessible with ${modsCount} documents`,
        count: modsCount,
      };
      log(`✅ Addons collection: OK (${modsCount} documents)`);
    } catch (error) {
      health.checks.addonsCollection = {
        status: 'unhealthy',
        message: `Collection access failed: ${error.message}`,
      };
      health.status = 'unhealthy';
      log(`❌ Addons collection: FAILED - ${error.message}`);
    }

    // Check CurseForge API
    try {
      const testResult = await searchCurseForgeMods(process.env.CURSEFORGE_API_KEY, 0, 1, 'test');
      health.checks.curseforgeApi = {
        status: 'healthy',
        message: `API accessible, returned ${testResult.data?.length || 0} results`,
      };
      log(`✅ CurseForge API: OK`);
    } catch (error) {
      health.checks.curseforgeApi = {
        status: 'unhealthy',
        message: `API access failed: ${error.message}`,
      };
      health.status = 'degraded';
      log(`⚠️ CurseForge API: FAILED - ${error.message}`);
    }

    // Check Modrinth API
    try {
      const testResult = await searchModrinthMods(0, 1, 'test');
      health.checks.modrinthApi = {
        status: 'healthy',
        message: `API accessible, returned ${testResult.hits?.length || 0} results`,
      };
      log(`✅ Modrinth API: OK`);
    } catch (error) {
      health.checks.modrinthApi = {
        status: 'unhealthy',
        message: `API access failed: ${error.message}`,
      };
      health.status = 'degraded';
      log(`⚠️ Modrinth API: FAILED - ${error.message}`);
    }

    // Check environment variables
    const missingEnvVars = REQUIRED_ENV_VARS.filter((varName) => !process.env[varName]);

    if (missingEnvVars.length === 0) {
      health.checks.environment = {
        status: 'healthy',
        message: 'All required environment variables are set',
      };
      log(`✅ Environment variables: OK`);
    } else {
      health.checks.environment = {
        status: 'unhealthy',
        message: `Missing environment variables: ${missingEnvVars.join(', ')}`,
        missing: missingEnvVars,
      };
      health.status = 'unhealthy';
      log(`❌ Environment variables: MISSING - ${missingEnvVars.join(', ')}`);
    }

    health.executionTimeMs = Date.now() - startTime;

    const statusIcon =
      health.status === 'healthy' ? '✅' : health.status === 'degraded' ? '⚠️' : '❌';
    log(
      `${statusIcon} Health check completed: ${health.status.toUpperCase()} (${Math.round(health.executionTimeMs)}ms)`
    );

    return health;
  } catch (error) {
    health.status = 'unhealthy';
    health.error = error.message;
    health.executionTimeMs = Date.now() - startTime;

    log(`❌ Health check failed: ${error.message}`);
    throw error;
  }
}
