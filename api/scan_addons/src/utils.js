/**
 * Throws an error if any required environment variables are missing
 * @param {Object} env - Environment variables object
 * @param {string[]} requiredVars - Array of required environment variable names
 */
export function throwIfMissing(env, requiredVars) {
  const missing = requiredVars.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Get environment variable with optional default value
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if key is not found
 * @returns {string} Environment variable value or default
 */
export function getEnvVar(key, defaultValue = null) {
  return process.env[key] || defaultValue || null;
}

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the delay
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff for rate limiting
 * @param {Function} func - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay in milliseconds
 * @param {Function} log - Logging function
 * @returns {Promise} Promise that resolves with the function result
 */
export async function retryOnRateLimit(
  func,
  maxRetries = 5,
  initialDelay = 1000,
  log = console.log
) {
  let attempt = 0;
  let delayTime = initialDelay;

  while (attempt < maxRetries) {
    try {
      return await func();
    } catch (error) {
      if (error.code === 429) {
        // Rate limit exceeded
        attempt++;
        log(
          `❌ Rate limit exceeded. Retrying in ${delayTime / 1000} seconds... (${attempt}/${maxRetries})`
        );
        await delay(delayTime);
        delayTime *= 2; // Exponential backoff
      } else {
        throw error; // If the error is not rate limit related, re-throw it
      }
    }
  }
  throw new Error('Max retries exceeded for rate limit error');
}

/**
 * Check if a string is a valid Minecraft version
 * @param {string} str - String to check
 * @returns {boolean} True if valid Minecraft version
 */
export function isMinecraftVersion(str) {
  return (
    typeof str === 'string' &&
    (str.match(/^\d+\.\d+(\.\d+)?$/) || // Standard format (e.g., 1.19.2)
      str.match(/^\d+w\d+[a-z]$/) || // Snapshot format (e.g., 23w13a)
      str === 'snapshot')
  ); // Generic "snapshot" tag
}

/**
 * Extract a valid name from mod data with fallback logic
 * @param {Object} mod - Raw mod data
 * @param {string} source - Source platform
 * @returns {string|null} Valid name or null if none found
 */
function extractValidName(mod, source) {
  if (source === 'CurseForge') {
    // Try multiple fields in order of preference
    const candidates = [
      mod.name,
      mod.displayName,
      mod.title,
      mod.slug
    ];
    
    for (const candidate of candidates) {
      if (candidate && typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate.trim();
      }
    }
    
    // Last resort: use ID with prefix
    if (mod.id) {
      return `CurseForge-${mod.id}`;
    }
  } else if (source === 'Modrinth') {
    // Try multiple fields in order of preference
    const candidates = [
      mod.title,
      mod.name,
      mod.displayName,
      mod.slug
    ];
    
    for (const candidate of candidates) {
      if (candidate && typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate.trim();
      }
    }
    
    // Last resort: use project_id with prefix
    if (mod.project_id) {
      return `Modrinth-${mod.project_id}`;
    }
  }
  
  return null;
}

/**
 * Normalize mod data structure
 * @param {Object} mod - Raw mod data
 * @param {string} source - Source platform (CurseForge or Modrinth)
 * @param {Array} loadersList - List of valid loaders
 * @param {Array} categoriesList - List of valid categories
 * @returns {Object|null} Normalized mod data or null if invalid
 */
export function normalizeModData(mod, source, loadersList, categoriesList) {
  // Extract a valid name - this is critical for deduplication
  const name = extractValidName(mod, source);
  
  if (!name) {
    console.warn(`⚠️  Skipping mod due to missing name/title in ${source}:`, {
      id: mod.id || mod.project_id,
      availableFields: Object.keys(mod)
    });
    return null; // Return null for mods without valid names
  }

  if (source === 'CurseForge') {
    // Extract tags from CurseForge mod files
    const allTags = [...new Set(mod.latestFiles?.flatMap((file) => file.gameVersions || []) || [])];

    const modLoaders = allTags.filter(
      (tag) => typeof tag === 'string' && loadersList.includes(tag.toLowerCase())
    );

    const minecraftVersions = allTags.filter(
      (tag) => typeof tag === 'string' && isMinecraftVersion(tag)
    );

    const categories = (mod.categories || []).filter(
      (category) => typeof category === 'string' && categoriesList.includes(category.toLowerCase())
    );

    return {
      curseforge_id: mod.id?.toString() || '',
      modrinth_id: null,
      name: name,
      description: mod.summary || mod.description || '',
      slug: mod.slug || '',
      sources: [source],
      icon: mod.logo?.thumbnailUrl || '',
      created_at: mod.dateCreated || '',
      updated_at: mod.dateModified || '',
      authors: (mod.authors || []).map((a) => a.name || ''),
      categories: categories,
      downloads: mod.downloadCount || 0,
      curseforge_raw: JSON.stringify(mod),
      minecraft_versions: minecraftVersions,
      loaders: modLoaders,
    };
  } else if (source === 'Modrinth') {
    const categories = (mod.categories || []).filter(
      (category) => typeof category === 'string' && categoriesList.includes(category.toLowerCase())
    );

    const modLoaders = (mod.categories || []).filter(
      (category) => typeof category === 'string' && loadersList.includes(category.toLowerCase())
    );

    const minecraftVersions = (mod.game_versions || mod.versions || []).filter(
      (version) => typeof version === 'string' && isMinecraftVersion(version)
    );

    return {
      curseforge_id: null,
      modrinth_id: mod.project_id || '',
      name: name,
      slug: mod.slug || '',
      description: mod.description || mod.body || '',
      sources: [source],
      icon: mod.icon_url || '',
      created_at: mod.date_created || '',
      updated_at: mod.date_modified || '',
      authors: [mod.author || ''],
      categories: categories,
      downloads: mod.downloads || 0,
      modrinth_raw: JSON.stringify(mod),
      minecraft_versions: minecraftVersions,
      loaders: modLoaders,
    };
  }

  throw new Error(`Unknown source: ${source}`);
}

/**
 * Combine duplicate mods from different sources
 * @param {Array} mods - Array of mod objects
 * @returns {Array} Array of combined mod objects
 */
export function combineDuplicateMods(mods) {
  const modMap = new Map();

  mods.forEach((mod) => {
    if (modMap.has(mod.name)) {
      const existingMod = modMap.get(mod.name);
      existingMod.sources = Array.from(new Set([...existingMod.sources, ...mod.sources]));
      existingMod.downloads += mod.downloads;
      existingMod.description = existingMod.description || mod.description;
      existingMod.icon = existingMod.icon || mod.icon;
      existingMod.categories = Array.from(new Set([...existingMod.categories, ...mod.categories]));
      existingMod.minecraft_versions = Array.from(
        new Set([...(existingMod.minecraft_versions || []), ...(mod.minecraft_versions || [])])
      );
      existingMod.loaders = Array.from(
        new Set([...(existingMod.loaders || []), ...(mod.loaders || [])])
      );
      existingMod.authors = Array.from(
        new Set([...(existingMod.authors || []), ...(mod.authors || [])])
      );
      existingMod.created_at = existingMod.created_at || mod.created_at;
      existingMod.updated_at = existingMod.updated_at || mod.updated_at;
      existingMod.curseforge_id = existingMod.curseforge_id || mod.curseforge_id;
      existingMod.modrinth_id = existingMod.modrinth_id || mod.modrinth_id;
      existingMod.curseforge_raw = existingMod.curseforge_raw || mod.curseforge_raw;
      existingMod.modrinth_raw = existingMod.modrinth_raw || mod.modrinth_raw;
      existingMod.modrinth_raw = existingMod.modrinth_raw || mod.modrinth_raw;
    } else {
      modMap.set(mod.name, { ...mod });
    }
  });

  return Array.from(modMap.values());
}

import { REQUIRED_ENV_VARS } from './config.js';

/**
 * Validate required environment variables
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateEnvironment() {
  const errors = [];

  REQUIRED_ENV_VARS.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
