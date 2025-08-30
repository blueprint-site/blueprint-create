#!/bin/bash

# Configuration
MEILISEARCH_URL="YOUR_MEILISEARCH_URL"
MEILISEARCH_API_KEY="YOUR_MASTER_KEY"
INDEX_NAME="schematics"

# Update index settings
echo "Updating Meilisearch schematics index settings..."

curl -X PATCH "$MEILISEARCH_URL/indexes/$INDEX_NAME/settings" \
  -H "Authorization: Bearer $MEILISEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "filterableAttributes": [
      "$id",
      "$createdAt",
      "$updatedAt",
      "user_id",
      "status",
      "isValid",
      "featured",
      "title",
      "slug",
      "authors",
      "categories",
      "subcategories",
      "sub_categories",
      "game_versions",
      "create_versions",
      "modloaders",
      "dimensions_width",
      "dimensions_height",
      "dimensions_depth",
      "dimensions_blockCount",
      "materials_primary",
      "materials_hasModded",
      "complexity_level",
      "complexity_buildTime",
      "requirements_mods",
      "requirements_minecraftVersion",
      "requirements_hasRedstone",
      "requirements_hasCommandBlocks",
      "downloads",
      "likes",
      "rating",
      "uploadDate"
    ],
    "sortableAttributes": [
      "title",
      "downloads",
      "likes",
      "rating",
      "uploadDate",
      "$createdAt",
      "dimensions_blockCount",
      "complexity_buildTime",
      "dimensions_width",
      "dimensions_height",
      "dimensions_depth"
    ],
    "searchableAttributes": [
      "title",
      "description",
      "authors",
      "categories",
      "subcategories",
      "materials_primary",
      "requirements_mods",
      "slug"
    ],
    "displayedAttributes": ["*"],
    "rankingRules": [
      "words",
      "typo",
      "proximity",
      "attribute",
      "sort",
      "exactness",
      "downloads:desc"
    ],
    "stopWords": [],
    "synonyms": {
      "house": ["home", "building", "residence"],
      "factory": ["plant", "manufactory", "industrial"],
      "farm": ["agriculture", "farming", "ranch"],
      "train": ["railway", "railroad", "locomotive"],
      "storage": ["warehouse", "depot", "storehouse"],
      "bridge": ["viaduct", "overpass", "crossing"],
      "create": ["create mod", "create-mod"],
      "redstone": ["rs", "red stone"],
      "commandblock": ["command block", "cmd block"]
    },
    "typoTolerance": {
      "enabled": true,
      "minWordSizeForTypos": {
        "oneTypo": 5,
        "twoTypos": 9
      },
      "disableOnWords": [],
      "disableOnAttributes": []
    },
    "faceting": {
      "maxValuesPerFacet": 100
    },
    "pagination": {
      "maxTotalHits": 10000
    }
  }'

echo "Settings update initiated. Check your Meilisearch dashboard for status."