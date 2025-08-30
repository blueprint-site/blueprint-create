# Meilisearch Schematic Index Configuration

This document outlines the required configuration for the Meilisearch `schematics` index to support the advanced filtering system.

## Required Filterable Attributes

The following attributes need to be configured as filterable in your Meilisearch index:

```javascript
// Core attributes
('$id',
  '$createdAt',
  '$updatedAt',
  'user_id',
  'status',
  'isValid',
  'featured',
  // Basic schematic attributes
  'title',
  'slug',
  'authors',
  'categories',
  'subcategories', // Note: using 'subcategories' for consistency with Meilisearch
  'sub_categories', // Keep for backward compatibility
  // Version compatibility
  'game_versions',
  'create_versions',
  'modloaders',
  // Dimensions (nested object)
  'dimensions.width',
  'dimensions.height',
  'dimensions.depth',
  'dimensions.blockCount',
  // Materials (nested object)
  'materials.primary',
  'materials.hasModded',
  // Complexity (nested object)
  'complexity.level',
  'complexity.buildTime',
  // Requirements (nested object)
  'requirements.mods',
  'requirements.minecraftVersion',
  'requirements.hasRedstone',
  'requirements.hasCommandBlocks',
  // Metrics
  'downloads',
  'likes',
  'rating',
  'uploadDate');
```

## Required Sortable Attributes

The following attributes should be configured as sortable:

```javascript
('title',
  'downloads',
  'likes',
  'rating',
  'uploadDate',
  '$createdAt',
  'dimensions.blockCount',
  'complexity.buildTime');
```

## Required Searchable Attributes

The following attributes should be searchable:

```javascript
('title',
  'description',
  'authors',
  'categories',
  'subcategories',
  'materials.primary',
  'requirements.mods');
```

## Meilisearch Configuration Script

Run this script to configure your Meilisearch index:

```javascript
const { MeiliSearch } = require('meilisearch');

const client = new MeiliSearch({
  host: 'YOUR_MEILISEARCH_URL',
  apiKey: 'YOUR_MASTER_KEY',
});

async function configureSchematicsIndex() {
  const index = client.index('schematics');

  // Set filterable attributes
  await index.updateFilterableAttributes([
    '$id',
    '$createdAt',
    '$updatedAt',
    'user_id',
    'status',
    'isValid',
    'featured',
    'title',
    'slug',
    'authors',
    'categories',
    'subcategories',
    'sub_categories',
    'game_versions',
    'create_versions',
    'modloaders',
    'dimensions.width',
    'dimensions.height',
    'dimensions.depth',
    'dimensions.blockCount',
    'materials.primary',
    'materials.hasModded',
    'complexity.level',
    'complexity.buildTime',
    'requirements.mods',
    'requirements.minecraftVersion',
    'requirements.hasRedstone',
    'requirements.hasCommandBlocks',
    'downloads',
    'likes',
    'rating',
    'uploadDate',
  ]);

  // Set sortable attributes
  await index.updateSortableAttributes([
    'title',
    'downloads',
    'likes',
    'rating',
    'uploadDate',
    '$createdAt',
    'dimensions.blockCount',
    'complexity.buildTime',
  ]);

  // Set searchable attributes
  await index.updateSearchableAttributes([
    'title',
    'description',
    'authors',
    'categories',
    'subcategories',
    'materials.primary',
    'requirements.mods',
  ]);

  console.log('Schematics index configured successfully!');
}

configureSchematicsIndex().catch(console.error);
```

## Data Migration

For existing schematics, you'll need to migrate the data to include the new fields. Here's a sample migration script:

```javascript
async function migrateExistingSchematics() {
  // Fetch all existing schematics
  const schematics = await fetchAllSchematics();

  // Update each schematic with default values for new fields
  const updatedSchematics = schematics.map((schematic) => ({
    ...schematic,
    // Ensure subcategories is available (duplicate of sub_categories)
    subcategories: schematic.sub_categories || [],

    // Add default dimensions if not present
    dimensions: schematic.dimensions || {
      width: 0,
      height: 0,
      depth: 0,
      blockCount: 0,
    },

    // Add default materials if not present
    materials: schematic.materials || {
      primary: [],
      hasModded: false,
    },

    // Add default complexity if not present
    complexity: schematic.complexity || {
      level: 'moderate',
      buildTime: 30,
    },

    // Add default requirements if not present
    requirements: schematic.requirements || {
      mods: [],
      minecraftVersion: schematic.game_versions?.[0] || '1.20.1',
      hasRedstone: false,
      hasCommandBlocks: false,
    },

    // Add default values for other fields
    isValid: schematic.isValid !== undefined ? schematic.isValid : true,
    featured: schematic.featured || false,
    rating: schematic.rating || 0,
    uploadDate: schematic.uploadDate || schematic.$createdAt,
  }));

  // Update in Meilisearch
  await index.updateDocuments(updatedSchematics);
}
```

## Testing the Configuration

After configuring the index, test the filtering with this query:

```javascript
const results = await index.search('', {
  filter: [
    'categories = "buildings"',
    'complexity.level = "simple"',
    'dimensions.width < 100',
  ].join(' AND '),
  facets: [
    'categories',
    'subcategories',
    'materials.primary',
    'complexity.level',
    'requirements.mods',
  ],
});

console.log('Search results:', results.hits);
console.log('Facet distribution:', results.facetDistribution);
```

## Notes

1. **Naming Convention**: We use `subcategories` (no underscore) for Meilisearch compatibility while keeping `sub_categories` for backward compatibility with existing code.

2. **Nested Objects**: Meilisearch supports nested object filtering using dot notation (e.g., `dimensions.width`).

3. **Performance**: Having many filterable attributes doesn't significantly impact search performance in Meilisearch.

4. **Faceting**: Facets are automatically available for all filterable attributes.

5. **Data Types**: Ensure numeric fields are stored as numbers, not strings, for proper range filtering.
