# Meilisearch Schematics Index Configuration

## Required Settings for the 'schematics' Index

### Filterable Attributes

Add these attributes as filterable in your Meilisearch dashboard:

```
categories
subcategories
dimensions_width
dimensions_height
dimensions_depth
dimensions_blockCount
materials_primary
materials_hasModded
complexity_level
complexity_buildTime
requirement_mods
requirements_minecraftVersion
requirements_hasRedstone
requirements_hasCommandBlocks
create_versions
authors
author
rating
downloads
uploadDate
featured
isValid
```

### Sortable Attributes

Add these attributes as sortable:

```
downloads
rating
uploadDate
dimensions_blockCount
complexity_buildTime
title
```

### Searchable Attributes (in order of importance)

```
title
description
categories
subcategories
authors
materials_primary
```

### Displayed Attributes

All attributes should be displayed, or use `*` to display all.

### Configuration Steps

1. Go to your Meilisearch dashboard
2. Select the 'schematics' index
3. Go to Settings
4. Update each section with the attributes listed above
5. Save the changes

### Important Notes

- There's a typo in the Meilisearch configuration: `requirement_mods` (missing 's') instead of `requirements_mods`. The code has been updated to handle this typo.
- All dimension, material, complexity, and requirement fields use flat naming (underscore separated) instead of nested objects
- The `isValid` field is crucial for filtering out invalid schematics
- The `featured` field is used for highlighting staff picks

### Testing the Configuration

After updating the settings, test with this curl command:

```bash
curl -X POST 'YOUR_MEILISEARCH_URL/indexes/schematics/search' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  --data-binary '{
    "q": "",
    "filter": "isValid = true",
    "limit": 1
  }'
```

If this returns results without errors, the configuration is correct.
