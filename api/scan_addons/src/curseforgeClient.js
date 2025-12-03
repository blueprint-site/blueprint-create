import axios from 'axios';
import { CURSEFORGE_MINECRAFT_GAME_ID } from './config.js';

/**
 * Get categories from CurseForge API
 * @param {string} apiKey - CurseForge API key
 * @param {Function} log - Logging function
 * @returns {Promise<Array>} Array of categories
 */
export async function getCategories(apiKey, log) {
  const url = 'https://api.curseforge.com/v1/categories';

  const headers = {
    'x-api-key': apiKey,
  };

  const params = {
    gameId: CURSEFORGE_MINECRAFT_GAME_ID.toString(),
  };

  try {
    const response = await axios.get(url, {
      headers,
      params,
    });

    log(`✅ Retrieved ${response.data.data.length} categories from CurseForge`);
    return response.data.data;
  } catch (error) {
    log(`❌ Error retrieving categories from CurseForge: ${error.message}`);
    throw error;
  }
}

/**
 * Get categories excluding modpacks
 * @param {string} apiKey - CurseForge API key
 * @param {Function} log - Logging function
 * @returns {Promise<Array>} Array of category IDs
 */
export async function getCategoriesExcludingModpacks(apiKey, log) {
  const categories = await getCategories(apiKey, log);

  // Filter out modpacks (ID 4471)
  const filteredCategories = categories.filter((category) => category.id !== 4471);

  // Extract category IDs
  const categoryIds = filteredCategories.map((category) => category.id);

  log(`📋 Filtered to ${categoryIds.length} categories (excluding modpacks)`);
  return categoryIds;
}

/**
 * Search CurseForge mods with pagination
 * @param {string} apiKey - CurseForge API key
 * @param {number} index - Starting index for pagination
 * @param {number} pageSize - Number of results per page
 * @param {string} searchFilter - Search term filter
 * @param {Array} gameVersions - Minecraft versions to include
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} CurseForge API response
 */
export async function searchCurseForgeMods(
  apiKey,
  index = 0,
  pageSize = 50,
  searchFilter = 'create',
  gameVersions = ['1.20.1', '1.20', '1.20.2', '1.20.3', '1.20.4', '1.19.2'],
  log = console.log
) {
  const url = 'https://api.curseforge.com/v1/mods/search';

  const headers = {
    'x-api-key': apiKey,
  };

  const params = {
    gameId: CURSEFORGE_MINECRAFT_GAME_ID,
    searchFilter: searchFilter,
    index: index,
    pageSize: pageSize,
    modLoaderTypes: ['Forge', 'Fabric', 'NeoForge'],
    gameVersion: gameVersions,
    sortOrder: 'desc',
    sortField: 'downloadCount',
    classId: 6, // Mods class ID
  };

  try {
    log(`🔍 Searching CurseForge: index=${index}, pageSize=${pageSize}, filter="${searchFilter}"`);

    const response = await axios.get(url, {
      headers,
      params,
    });

    log(`✅ Retrieved ${response.data.data?.length || 0} mods from CurseForge`);
    return response.data;
  } catch (error) {
    log(`❌ Error searching CurseForge mods: ${error.message}`);
    if (error.response) {
      log(`Response status: ${error.response.status}`);
      log(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}
