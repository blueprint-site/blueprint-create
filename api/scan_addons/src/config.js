/**
 * Configuration for the Scan Addons function
 */

/**
 * Environment variables required for the function
 */
export const REQUIRED_ENV_VARS = [
  'APPWRITE_FUNCTION_API_ENDPOINT',
  'APPWRITE_FUNCTION_PROJECT_ID',
  'APPWRITE_FUNCTION_API_KEY',
  'CURSEFORGE_API_KEY',
];

/**
 * Performance tuning constants (hardcoded for consistency)
 */
export const PERFORMANCE_SETTINGS = {
  // Scanning settings - optimized for 15-minute timeout limit
  MAX_ITERATIONS: 15, // Reduced to fit within 900-second timeout (approx 750 mods max)
  SCAN_BATCH_SIZE: 50,
  ITERATION_DELAY: 3000, // Reduced to 3 seconds between iterations
  REQUEST_DELAY: 800, // Reduced to 0.8 seconds between requests
  MAX_RETRIES: 3, // Reduced retries to save time

  // Quick scan settings (reduced for faster execution)
  QUICK_MAX_ITERATIONS: 5,
  QUICK_BATCH_SIZE: 20,
  QUICK_ITERATION_DELAY: 2000,
  QUICK_REQUEST_DELAY: 500,

  // API timeout settings
  API_TIMEOUT: 30000, // 30 seconds
  HEALTH_CHECK_TIMEOUT: 10000, // 10 seconds
};

/**
 * Supported mod loaders for filtering
 */
export const LOADERS_LIST = [
  'forge',
  'fabric',
  'quilt',
  'liteloader',
  'rift',
  'bukkit',
  'spigot',
  'paper',
  'fabric-api',
  'fml',
  'bedrock',
  'sponge',
  'tconstruct',
  'curseforge',
  'neoforge',
];

/**
 * Supported categories for filtering
 */
export const CATEGORIES_LIST = [
  'storage',
  'food',
  'technology',
  'utility',
  'transportation',
  'management',
  'game-mechanics',
  'adventure',
  'worldgen',
  'equipment',
  'decoration',
  'cursed',
  'minigame',
  'mobs',
  'optimisation',
  'economy',
  'datapack',
  'magic',
  'social',
  'library',
  'optimization',
];

/**
 * Special tags for client/server designation
 */
export const SPECIAL_TAGS = ['client', 'server'];

/**
 * CurseForge Minecraft game ID
 */
export const CURSEFORGE_MINECRAFT_GAME_ID = 432;
