import axios from 'axios';

/**
 * Search Modrinth mods with pagination
 * @param {number} offset - Starting offset for pagination
 * @param {number} limit - Number of results per page
 * @param {string} query - Search query
 * @param {Array} facets - Search facets for filtering
 * @param {Function} log - Logging function
 * @returns {Promise<Array>} Array of mod objects
 */
export async function searchModrinthMods(
  offset = 0,
  limit = 50,
  query = 'create',
  facets = [['project_type:mod']],
  log = console.log
) {
  const url = 'https://api.modrinth.com/v2/search';

  const params = {
    query: query,
    limit: limit,
    offset: offset,
    facets: JSON.stringify(facets),
  };

  try {
    log(`🔍 Searching Modrinth: offset=${offset}, limit=${limit}, query="${query}"`);

    const response = await axios.get(url, { params });

    log(`✅ Retrieved ${response.data.hits?.length || 0} mods from Modrinth`);
    return response.data.hits || [];
  } catch (error) {
    log(`❌ Error searching Modrinth mods: ${error.message}`);
    if (error.response) {
      log(`Response status: ${error.response.status}`);
      log(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    return []; // Return empty array on error
  }
}

/**
 * Get dependencies for a specific Modrinth project
 * @param {string} projectId - Project ID
 * @param {Function} log - Logging function
 * @returns {Promise<Array>} Array of dependency objects
 */
export async function getModrinthDependencies(projectId, log = console.log) {
  const url = `https://api.modrinth.com/v2/project/${projectId}/dependencies`;

  try {
    const response = await axios.get(url);
    log(`📦 Retrieved dependencies for project ${projectId}`);
    return response.data || [];
  } catch (error) {
    log(`❌ Error retrieving dependencies for project ${projectId}: ${error.message}`);
    return []; // Return empty array on error
  }
}

/**
 * Search Modrinth mods and include their dependencies
 * @param {number} offset - Starting offset for pagination
 * @param {number} limit - Number of results per page
 * @param {string} query - Search query
 * @param {Array} facets - Search facets for filtering
 * @param {Function} log - Logging function
 * @returns {Promise<Array>} Array of mod objects with dependencies
 */
export async function searchModrinthModsWithDependencies(
  offset = 0,
  limit = 50,
  query = 'create',
  facets = [['project_type:mod']],
  log = console.log
) {
  const mods = await searchModrinthMods(offset, limit, query, facets, log);
  const modsWithDependencies = [];

  log(`🔗 Fetching dependencies for ${mods.length} mods...`);

  for (const mod of mods) {
    try {
      const dependencies = await getModrinthDependencies(mod.project_id, log);
      mod.dependencies = dependencies;
      modsWithDependencies.push(mod);
    } catch (error) {
      log(`❌ Failed to fetch dependencies for mod ${mod.project_id}: ${error.message}`);
      mod.dependencies = []; // Ensure dependencies is always an array
      modsWithDependencies.push(mod);
    }
  }

  log(`✅ Completed dependency fetching for ${modsWithDependencies.length} mods`);
  return modsWithDependencies;
}

/**
 * Get detailed project information from Modrinth
 * @param {string} projectId - Project ID
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Project details
 */
export async function getModrinthProject(projectId, log = console.log) {
  const url = `https://api.modrinth.com/v2/project/${projectId}`;

  try {
    const response = await axios.get(url);
    log(`📋 Retrieved project details for ${projectId}`);
    return response.data;
  } catch (error) {
    log(`❌ Error retrieving project ${projectId}: ${error.message}`);
    throw error;
  }
}
