/**
 * Health check and monitoring utilities for the real-time sync function
 */

import { MeiliSearch } from 'meilisearch';
import { COLLECTION_INDEX_MAPPING } from './config.js';

/**
 * Check the health of Meilisearch connection
 * @param {string} endpoint - Meilisearch endpoint
 * @param {string} apiKey - Meilisearch API key
 * @returns {Promise<Object>} Health check result
 */
export async function checkMeilisearchHealth(endpoint, apiKey) {
  try {
    const client = new MeiliSearch({ host: endpoint, apiKey });
    const health = await client.health();
    const version = await client.getVersion();

    return {
      status: 'healthy',
      endpoint,
      health,
      version: version.pkgVersion,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      endpoint,
      error: error.message,
    };
  }
}

/**
 * Check if all configured indexes exist in Meilisearch
 * @param {string} endpoint - Meilisearch endpoint
 * @param {string} apiKey - Meilisearch API key
 * @returns {Promise<Object>} Index status check result
 */
export async function checkIndexes(endpoint, apiKey) {
  try {
    const client = new MeiliSearch({ host: endpoint, apiKey });
    const indexes = await client.getIndexes();
    const existingIndexNames = indexes.results.map((index) => index.uid);

    const configuredIndexes = Object.values(COLLECTION_INDEX_MAPPING);
    const missingIndexes = configuredIndexes.filter(
      (indexName) => !existingIndexNames.includes(indexName)
    );

    return {
      status: missingIndexes.length === 0 ? 'all_present' : 'some_missing',
      configured: configuredIndexes,
      existing: existingIndexNames,
      missing: missingIndexes,
      total: existingIndexNames.length,
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
    };
  }
}

/**
 * Get basic statistics about an index
 * @param {string} endpoint - Meilisearch endpoint
 * @param {string} apiKey - Meilisearch API key
 * @param {string} indexName - Index name to check
 * @returns {Promise<Object>} Index statistics
 */
export async function getIndexStats(endpoint, apiKey, indexName) {
  try {
    const client = new MeiliSearch({ host: endpoint, apiKey });
    const index = client.index(indexName);

    const stats = await index.getStats();
    const settings = await index.getSettings();

    return {
      status: 'success',
      indexName,
      documentCount: stats.numberOfDocuments,
      isIndexing: stats.isIndexing,
      settings: {
        searchableAttributes: settings.searchableAttributes,
        displayedAttributes: settings.displayedAttributes,
        primaryKey: settings.primaryKey,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      indexName,
      error: error.message,
    };
  }
}

/**
 * Comprehensive health check for the sync system
 * @param {string} endpoint - Meilisearch endpoint
 * @param {string} apiKey - Meilisearch API key
 * @returns {Promise<Object>} Complete health check result
 */
export async function performHealthCheck(endpoint, apiKey) {
  const startTime = Date.now();

  try {
    const [meilisearchHealth, indexStatus] = await Promise.all([
      checkMeilisearchHealth(endpoint, apiKey),
      checkIndexes(endpoint, apiKey),
    ]);

    // Get detailed stats for each configured index
    const indexStats = {};
    if (indexStatus.status !== 'error') {
      for (const indexName of Object.values(COLLECTION_INDEX_MAPPING)) {
        if (indexStatus.existing.includes(indexName)) {
          indexStats[indexName] = await getIndexStats(endpoint, apiKey, indexName);
        }
      }
    }

    const executionTime = Date.now() - startTime;

    return {
      timestamp: new Date().toISOString(),
      executionTimeMs: executionTime,
      overall: {
        status:
          meilisearchHealth.status === 'healthy' && indexStatus.status !== 'error'
            ? 'healthy'
            : 'degraded',
      },
      meilisearch: meilisearchHealth,
      indexes: indexStatus,
      indexStats,
      configuration: {
        totalCollections: Object.keys(COLLECTION_INDEX_MAPPING).length,
        mappings: COLLECTION_INDEX_MAPPING,
      },
    };
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime,
      overall: { status: 'error' },
      error: error.message,
    };
  }
}

/**
 * Format health check results for display
 * @param {Object} healthCheck - Health check result
 * @returns {string} Formatted health check report
 */
export function formatHealthReport(healthCheck) {
  const lines = [];

  lines.push(`🏥 Sync System Health Report`);
  lines.push(`📅 Generated: ${healthCheck.timestamp}`);
  lines.push(`⏱️  Execution Time: ${healthCheck.executionTimeMs}ms`);
  lines.push(`📊 Overall Status: ${healthCheck.overall.status.toUpperCase()}`);
  lines.push('');

  // Meilisearch health
  lines.push(`🔍 Meilisearch Health:`);
  lines.push(`   Status: ${healthCheck.meilisearch.status}`);
  if (healthCheck.meilisearch.version) {
    lines.push(`   Version: ${healthCheck.meilisearch.version}`);
  }
  if (healthCheck.meilisearch.error) {
    lines.push(`   Error: ${healthCheck.meilisearch.error}`);
  }
  lines.push('');

  // Index status
  lines.push(`📚 Index Status:`);
  lines.push(`   Configured: ${healthCheck.indexes.configured?.length || 0}`);
  lines.push(`   Existing: ${healthCheck.indexes.existing?.length || 0}`);
  if (healthCheck.indexes.missing?.length > 0) {
    lines.push(`   Missing: ${healthCheck.indexes.missing.join(', ')}`);
  }
  lines.push('');

  // Index statistics
  if (healthCheck.indexStats && Object.keys(healthCheck.indexStats).length > 0) {
    lines.push(`📈 Index Statistics:`);
    for (const [indexName, stats] of Object.entries(healthCheck.indexStats)) {
      if (stats.status === 'success') {
        lines.push(
          `   ${indexName}: ${stats.documentCount} documents${stats.isIndexing ? ' (indexing)' : ''}`
        );
      } else {
        lines.push(`   ${indexName}: Error - ${stats.error}`);
      }
    }
  }

  return lines.join('\n');
}

// Export health check function for use in the main function if needed
export { performHealthCheck as default };
