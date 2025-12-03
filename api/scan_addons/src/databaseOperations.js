import { Query } from 'node-appwrite';
import { retryOnRateLimit, combineDuplicateMods } from './utils.js';

/**
 * Save or update mods in the database
 * @param {Object} databases - Appwrite Databases instance
 * @param {Array} mods - Array of mod objects
 * @param {string} source - Source platform name
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Operation results
 */
export async function saveModsWithSource(databases, mods, source, log) {
  let created = 0;
  let updated = 0;
  let errors = 0;
  let skipped = 0;

  log(`💾 Saving ${mods.length} mods from ${source}...`);

  for (const mod of mods) {
    try {
      // Additional validation to ensure we have a valid name
      if (!mod.name || typeof mod.name !== 'string' || mod.name.trim().length === 0) {
        log(`⚠️  Skipping mod without valid name: ${JSON.stringify({ 
          curseforge_id: mod.curseforge_id, 
          modrinth_id: mod.modrinth_id,
          slug: mod.slug 
        })}`);
        skipped++;
        continue;
      }

      // Check if mod already exists
      const existingMods = await databases.listDocuments('main', 'addons', [
        Query.equal('name', mod.name),
      ]);

      if (existingMods.total > 0) {
        // Update existing mod by merging sources and other arrays
        const existingMod = existingMods.documents[0];
        const updatedSources = Array.from(new Set([...(existingMod.sources || []), source]));
        const updatedAuthors = Array.from(
          new Set([...(existingMod.authors || []), ...(mod.authors || [])])
        );

        await retryOnRateLimit(
          () =>
            databases.updateDocument('main', 'addons', existingMod.$id, {
              ...mod,
              sources: updatedSources,
              authors: updatedAuthors,
              curseforge_id: existingMod.curseforge_id || mod.curseforge_id,
              modrinth_id: existingMod.modrinth_id || mod.modrinth_id,
              downloads: (existingMod.downloads || 0) + (mod.downloads || 0),
            }),
          5,
          1000,
          log
        );

        updated++;
        log(`🔄 Updated mod: ${mod.name}`);
      } else {
        // Create new mod
        await retryOnRateLimit(
          () => databases.createDocument('main', 'addons', 'unique()', mod),
          5,
          1000,
          log
        );

        created++;
        log(`➕ Created mod: ${mod.name}`);
      }
    } catch (error) {
      errors++;
      log(`❌ Error saving mod ${mod.name || 'unnamed'}: ${error.message}`);
    }
  }

  const results = { created, updated, errors, skipped, total: mods.length };
  log(`📊 ${source} save results: ${created} created, ${updated} updated, ${errors} errors, ${skipped} skipped`);

  return results;
}

/**
 * Combine and upsert mods to handle duplicates across sources
 * @param {Object} databases - Appwrite Databases instance
 * @param {Array} allMods - Array of all mod objects
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Operation results
 */
export async function combineAndUpsertMods(databases, allMods, log) {
  log(`🔄 Combining ${allMods.length} mods and handling duplicates...`);

  // Filter out mods with invalid names before combining
  const validMods = allMods.filter(mod => {
    if (!mod.name || typeof mod.name !== 'string' || mod.name.trim().length === 0) {
      log(`⚠️  Filtering out mod with invalid name during combination: ${JSON.stringify({
        curseforge_id: mod.curseforge_id,
        modrinth_id: mod.modrinth_id,
        slug: mod.slug
      })}`);
      return false;
    }
    return true;
  });

  const filteredCount = allMods.length - validMods.length;
  if (filteredCount > 0) {
    log(`⚠️  Filtered out ${filteredCount} mods with invalid names during combination`);
  }

  const combinedMods = combineDuplicateMods(validMods);

  log(`📦 Combined into ${combinedMods.length} unique mods`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const mod of combinedMods) {
    try {
      const existingMods = await databases.listDocuments('main', 'addons', [
        Query.equal('name', mod.name),
      ]);

      if (existingMods.total > 0) {
        const existingMod = existingMods.documents[0];
        await retryOnRateLimit(
          () => databases.updateDocument('main', 'addons', existingMod.$id, mod),
          5,
          1000,
          log
        );
        updated++;
        log(`🔄 Combined mod updated: ${mod.name}`);
      } else {
        await retryOnRateLimit(
          () => databases.createDocument('main', 'addons', 'unique()', mod),
          5,
          1000,
          log
        );
        created++;
        log(`➕ Combined mod created: ${mod.name}`);
      }
    } catch (error) {
      errors++;
      log(`❌ Error upserting combined mod ${mod.name || 'unnamed'}: ${error.message}`);
    }
  }

  const results = { created, updated, errors, total: combinedMods.length, filtered: filteredCount };
  log(`📊 Combined upsert results: ${created} created, ${updated} updated, ${errors} errors, ${filteredCount} filtered`);

  return results;
}

/**
 * Get total count of mods in the database
 * @param {Object} databases - Appwrite Databases instance
 * @param {Function} log - Logging function
 * @returns {Promise<number>} Total count of mods
 */
export async function getModsCount(databases, log) {
  try {
    const result = await databases.listDocuments('main', 'addons', [Query.limit(1)]);

    log(`📊 Total mods in database: ${result.total}`);
    return result.total;
  } catch (error) {
    log(`❌ Error getting mods count: ${error.message}`);
    return 0;
  }
}

/**
 * Get mods by source platform
 * @param {Object} databases - Appwrite Databases instance
 * @param {string} source - Source platform
 * @param {Function} log - Logging function
 * @returns {Promise<Array>} Array of mods from the specified source
 */
export async function getModsBySource(databases, source, log) {
  try {
    const result = await databases.listDocuments('main', 'addons', [
      Query.search('sources', source),
      Query.limit(100),
    ]);

    log(`📊 Found ${result.documents.length} mods from ${source}`);
    return result.documents;
  } catch (error) {
    log(`❌ Error getting mods by source ${source}: ${error.message}`);
    return [];
  }
}

/**
 * Find and analyze mods with empty or problematic names
 * @param {Object} databases - Appwrite Databases instance
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeProblematicMods(databases, log) {
  try {
    log('🔍 Analyzing mods for name issues...');
    
    // Get all mods to analyze
    let allMods = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
      const result = await databases.listDocuments('main', 'addons', [
        Query.limit(limit),
        Query.offset(offset)
      ]);
      
      allMods.push(...result.documents);
      
      if (result.documents.length < limit) {
        break;
      }
      
      offset += limit;
    }
    
    log(`📊 Analyzing ${allMods.length} total mods...`);
    
    const issues = {
      emptyNames: [],
      whitespaceOnly: [],
      generatedNames: [],
      duplicateNames: {},
      total: allMods.length
    };
    
    const nameCount = {};
    
    for (const mod of allMods) {
      const name = mod.name || '';
      
      // Count name occurrences for duplicate detection
      nameCount[name] = (nameCount[name] || 0) + 1;
      
      // Check for various issues
      if (name.length === 0) {
        issues.emptyNames.push({
          id: mod.$id,
          curseforge_id: mod.curseforge_id,
          modrinth_id: mod.modrinth_id,
          slug: mod.slug,
          sources: mod.sources
        });
      } else if (name.trim().length === 0) {
        issues.whitespaceOnly.push({
          id: mod.$id,
          name: name,
          curseforge_id: mod.curseforge_id,
          modrinth_id: mod.modrinth_id,
          sources: mod.sources
        });
      } else if (name.startsWith('CurseForge-') || name.startsWith('Modrinth-')) {
        issues.generatedNames.push({
          id: mod.$id,
          name: name,
          sources: mod.sources
        });
      }
    }
    
    // Find duplicates (more than one mod with same name)
    for (const [name, count] of Object.entries(nameCount)) {
      if (count > 1) {
        issues.duplicateNames[name] = count;
      }
    }
    
    // Log summary
    log('📋 Analysis Results:');
    log(`   - Empty names: ${issues.emptyNames.length}`);
    log(`   - Whitespace-only names: ${issues.whitespaceOnly.length}`);
    log(`   - Generated fallback names: ${issues.generatedNames.length}`);
    log(`   - Duplicate names: ${Object.keys(issues.duplicateNames).length}`);
    
    if (issues.emptyNames.length > 0) {
      log('❌ Mods with empty names found - this indicates a data quality issue');
    }
    
    return issues;
    
  } catch (error) {
    log(`❌ Error analyzing problematic mods: ${error.message}`);
    return { error: error.message };
  }
}