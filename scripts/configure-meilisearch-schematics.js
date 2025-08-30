// Script to configure Meilisearch schematics index with proper filterable attributes
import { MeiliSearch } from 'meilisearch';

async function configureMeilisearchIndex() {
  // Get configuration from environment
  const MEILISEARCH_URL = 'https://meilisearch.blueprint-create.net';
  const MEILISEARCH_KEY =
    'HFNtHry2u3j6ykqxcC5hd1QRIskufFU2F8R44aSVgUBLF5LVtB0nxMGkENQaMtHPYG7IGCl3CkDKtn93xG8wIi6dZRgiyF470EaB16cBcREL5Zlm9V9dmaR5qutZXQu3';

  console.log('Connecting to Meilisearch at:', MEILISEARCH_URL);

  const client = new MeiliSearch({
    host: MEILISEARCH_URL,
    apiKey: MEILISEARCH_KEY,
  });

  const index = client.index('schematics');

  try {
    // Get current settings
    console.log('Getting current index settings...');
    const currentSettings = await index.getSettings();
    console.log('Current settings:', JSON.stringify(currentSettings, null, 2));

    // Configure filterable attributes based on actual document structure
    console.log('\nConfiguring filterable attributes...');
    const filterableAttributes = [
      // Core fields
      '$id',
      'title',
      'slug',
      'user_id',
      'isValid',
      'featured',

      // Arrays that need filtering
      'categories',
      'subcategories',
      'sub_categories',
      'authors',
      'materials_primary',
      'requirements_mods',

      // Single value fields for filtering
      'complexity_level',
      'requirements_minecraftVersion',
      'requirements_hasRedstone',
      'requirements_hasCommandBlocks',
      'materials_hasModded',

      // Numeric fields for range filtering
      'dimensions_width',
      'dimensions_height',
      'dimensions_depth',
      'dimensions_blockCount',
      'complexity_buildTime',
      'downloads',
      'rating',
      'uploadDate',
    ];

    await index.updateFilterableAttributes(filterableAttributes);
    console.log('✓ Filterable attributes configured');

    // Configure sortable attributes
    console.log('\nConfiguring sortable attributes...');
    const sortableAttributes = [
      'title',
      'downloads',
      'rating',
      'uploadDate',
      'dimensions_blockCount',
      'complexity_buildTime',
    ];

    await index.updateSortableAttributes(sortableAttributes);
    console.log('✓ Sortable attributes configured');

    // Configure searchable attributes
    console.log('\nConfiguring searchable attributes...');
    const searchableAttributes = [
      'title',
      'description',
      'authors',
      'categories',
      'subcategories',
      'materials_primary',
      'requirements_mods',
    ];

    await index.updateSearchableAttributes(searchableAttributes);
    console.log('✓ Searchable attributes configured');

    // Wait a moment for settings to apply
    console.log('\nWaiting for settings to apply...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Verify the configuration
    console.log('\nVerifying configuration...');
    const newSettings = await index.getSettings();
    console.log('New settings:', JSON.stringify(newSettings, null, 2));

    // Test facet search
    console.log('\nTesting facet search...');
    const testResults = await index.search('', {
      facets: ['*'],
      limit: 1,
    });

    console.log('Facet distribution test:', JSON.stringify(testResults.facetDistribution, null, 2));
    console.log('Total documents:', testResults.estimatedTotalHits);

    console.log('\n✅ Meilisearch schematics index configured successfully!');
  } catch (error) {
    console.error('Error configuring Meilisearch:', error);
    process.exit(1);
  }
}

// Run the configuration
configureMeilisearchIndex().catch(console.error);
