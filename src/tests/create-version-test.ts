import { getAddonCreateCompatibility } from '@/utils/createCompatibility';
import {
  CREATE_MOD_IDS,
  extractCreateVersionFromText,
  normalizeCreateVersion,
} from '@/data/createVersions';

/**
 * Test Create version extraction from different addon types
 */
function testCreateVersionExtraction() {
  // Example addon with direct dependency on Create Forge
  const addonWithDependency = {
    name: 'Example Addon',
    description: 'This addon adds new features to Create',
    game_versions: ['1.18.2', '1.19.2'],
    dependencies: [{ project_id: CREATE_MOD_IDS.FORGE, dependency_type: 'required' }],
  };

  // Example addon with Create version in name/description
  const addonWithVersionMention = {
    name: 'Create Addon for 0.5',
    description: 'Compatible with Create 0.5.1',
    game_versions: ['1.19.2'],
  };

  // Example addon with only Minecraft versions
  const addonWithMinecraftOnly = {
    name: 'Some Create Addon',
    description: 'An extension for Create',
    game_versions: ['1.20.1'],
  };

  // Example addon that has its own versioning (like those shown in the issue)
  const addonWithOwnVersioning = {
    name: 'Create Addon 2.2.2',
    description: 'Version 2.2.2 of this Create addon',
    game_versions: ['1.18.2'],
  };

  // Test each case
  console.log('=== Create Version Detection Tests ===');
  console.log('1. Addon with direct dependency:', getAddonCreateCompatibility(addonWithDependency));
  console.log(
    '2. Addon with version mention:',
    getAddonCreateCompatibility(addonWithVersionMention)
  );
  console.log(
    '3. Addon with Minecraft versions only:',
    getAddonCreateCompatibility(addonWithMinecraftOnly)
  );
  console.log(
    '4. Addon with its own versioning:',
    getAddonCreateCompatibility(addonWithOwnVersioning)
  );

  // Test text extraction
  console.log('\n=== Text Extraction Tests ===');
  const testTexts = [
    'Compatible with Create 0.5.1',
    'For Create 6.0.2',
    'Works with Create Fabric 0.5',
    'Create-0.4.1 addon',
    'Addon version 2.2.2',
    'Create Addon version 2.2.1a',
  ];

  testTexts.forEach((text) => {
    const extracted = extractCreateVersionFromText(text);
    console.log(
      `From "${text}": ${extracted ? extracted : 'No match'} ${extracted ? `(normalized: ${normalizeCreateVersion(extracted)})` : ''}`
    );
  });
}

// Uncomment to run tests
// testCreateVersionExtraction();

export default testCreateVersionExtraction;
