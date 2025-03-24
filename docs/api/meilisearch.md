# Meilisearch Integration

Blueprint uses Meilisearch as its search engine, providing fast, typo-tolerant search and powerful filtering capabilities. This document outlines how Meilisearch is integrated into the application.

## Overview

Meilisearch is a powerful, fast, open-source search engine that is easy to use and deploy. Blueprint leverages Meilisearch for:

- Full-text search across addons, schematics, and blog posts
- Advanced filtering by multiple attributes (versions, categories, etc.)
- Typo-tolerant search to handle spelling mistakes
- Fast search results with millisecond response times
- Relevant ranking based on custom criteria

## Setup and Configuration

### Environment Configuration

Meilisearch requires the following environment variables:

```
APP_MEILISEARCH_URL=your_meilisearch_url
APP_MEILISEARCH_API_KEY=your_meilisearch_api_key
```

### Client Configuration

The Meilisearch client is configured in `/src/config/meilisearch.ts`:

```typescript
import { MeiliSearch } from 'meilisearch';

const url = window._env_?.APP_MEILISEARCH_URL || '';
const apiKey = window._env_?.APP_MEILISEARCH_API_KEY || '';

export const meilisearch = new MeiliSearch({
  host: url,
  apiKey: apiKey,
});
```

## Index Structure

Blueprint uses the following Meilisearch indexes:

### Addons Index

The addons index contains all Create Mod addons with their metadata:

```json
{
  "indexUid": "addons",
  "primaryKey": "$id",
  "searchableAttributes": [
    "name",
    "description",
    "author",
    "categories"
  ],
  "filterableAttributes": [
    "categories",
    "minecraft_versions",
    "create_versions",
    "loaders",
    "author"
  ],
  "sortableAttributes": [
    "downloads",
    "created_at",
    "updated_at"
  ],
  "typoTolerance": {
    "enabled": true,
    "minWordSizeForTypos": {
      "oneTypo": 4,
      "twoTypos": 8
    }
  }
}
```

### Schematics Index

The schematics index contains user-created schematics:

```json
{
  "indexUid": "schematics",
  "primaryKey": "$id",
  "searchableAttributes": [
    "name",
    "description",
    "author",
    "tags"
  ],
  "filterableAttributes": [
    "tags",
    "minecraft_version",
    "create_version",
    "author"
  ],
  "sortableAttributes": [
    "downloads",
    "created_at",
    "updated_at",
    "likes"
  ]
}
```

### Blogs Index

The blogs index contains blog posts:

```json
{
  "indexUid": "blogs",
  "primaryKey": "$id",
  "searchableAttributes": [
    "title",
    "content",
    "author",
    "tags"
  ],
  "filterableAttributes": [
    "tags",
    "author",
    "category"
  ],
  "sortableAttributes": [
    "published_at",
    "updated_at",
    "views"
  ]
}
```

## Search Implementation

### Basic Search Hooks

Blueprint implements search functionality through custom hooks in the `/src/api/endpoints` directory:

```typescript
// src/api/endpoints/useSearchAddons.tsx
import { useQuery } from '@tanstack/react-query';
import { meilisearch } from '@/config/meilisearch';
import { Addon } from '@/types';

export interface SearchAddonsParams {
  query: string;
  filters?: string;
  page?: number;
  hitsPerPage?: number;
  sort?: string[];
}

export const useSearchAddons = ({
  query,
  filters,
  page = 1,
  hitsPerPage = 20,
  sort,
}: SearchAddonsParams) => {
  return useQuery<{
    hits: Addon[];
    total: number;
    page: number;
    hitsPerPage: number;
    totalPages: number;
  }>({
    queryKey: ['search', 'addons', query, filters, page, hitsPerPage, sort],
    queryFn: async () => {
      try {
        const index = meilisearch.index('addons');
        const results = await index.search(query, {
          filter: filters,
          page,
          hitsPerPage,
          sort,
        });
        
        return {
          hits: results.hits as Addon[],
          total: results.estimatedTotalHits,
          page: results.page,
          hitsPerPage: results.hitsPerPage,
          totalPages: Math.ceil(results.estimatedTotalHits / results.hitsPerPage),
        };
      } catch (error) {
        console.error('Error searching addons:', error);
        throw new Error('Failed to search addons');
      }
    },
    staleTime: 1000 * 60, // Cache for 1 minute
    keepPreviousData: true,
  });
};
```

### Filter Building

To construct complex filters, Blueprint uses a filter builder utility:

```typescript
// src/lib/search/filterBuilder.ts
export class FilterBuilder {
  private filters: string[] = [];

  /**
   * Add an equality filter
   */
  equals(field: string, value: string | number | boolean): FilterBuilder {
    this.filters.push(`${field} = ${JSON.stringify(value)}`);
    return this;
  }

  /**
   * Add an array contains filter
   */
  contains(field: string, value: string | number): FilterBuilder {
    this.filters.push(`${field} = ${JSON.stringify(value)}`);
    return this;
  }

  /**
   * Add a greater than filter
   */
  greaterThan(field: string, value: number): FilterBuilder {
    this.filters.push(`${field} > ${value}`);
    return this;
  }

  /**
   * Add a less than filter
   */
  lessThan(field: string, value: number): FilterBuilder {
    this.filters.push(`${field} < ${value}`);
    return this;
  }

  /**
   * Add an OR condition group
   */
  or(callback: (builder: FilterBuilder) => void): FilterBuilder {
    const nestedBuilder = new FilterBuilder();
    callback(nestedBuilder);
    const nestedFilters = nestedBuilder.build();
    if (nestedFilters) {
      this.filters.push(`(${nestedFilters})`);
    }
    return this;
  }

  /**
   * Build the final filter string
   */
  build(): string {
    if (this.filters.length === 0) {
      return '';
    }
    return this.filters.join(' AND ');
  }
}
```

Example usage of the filter builder:

```typescript
// Example of building complex filters
const filter = new FilterBuilder()
  .contains('minecraft_versions', '1.19.2')
  .or(builder => {
    builder
      .contains('loaders', 'forge')
      .contains('loaders', 'fabric');
  })
  .build();

// Results in: minecraft_versions = "1.19.2" AND (loaders = "forge" OR loaders = "fabric")
```

### Search UI Components

Blueprint includes several components for integrating search into the UI:

```tsx
// src/components/common/SearchBar.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  initialValue = '',
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10"
      />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};
```

## Data Synchronization

### Appwrite to Meilisearch Sync

Blueprint synchronizes data from Appwrite to Meilisearch to ensure search indexes stay up-to-date. This is handled through background processes after data changes:

1. **Real-time Synchronization**: Updates are synchronized with a small delay
2. **Batch Synchronization**: Full reindexing is performed periodically

The synchronization is currently managed through Appwrite Functions:

```javascript
// Appwrite Function example for syncing an addon to Meilisearch
const { Client } = require('node-appwrite');
const { MeiliSearch } = require('meilisearch');

module.exports = async function(req, res) {
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  // Initialize Meilisearch client
  const meilisearch = new MeiliSearch({
    host: process.env.MEILISEARCH_HOST,
    apiKey: process.env.MEILISEARCH_API_KEY,
  });

  // Get addon data from Appwrite
  const databases = new Databases(client);
  const document = req.body;

  // Prepare document for Meilisearch
  const addonData = {
    $id: document.$id,
    name: document.name,
    description: document.description,
    slug: document.slug,
    author: document.author,
    categories: document.categories,
    downloads: document.downloads,
    icon: document.icon,
    minecraft_versions: document.minecraft_versions,
    create_versions: document.create_versions,
    loaders: document.loaders,
    created_at: document.created_at,
    updated_at: document.updated_at,
  };

  // Update document in Meilisearch
  try {
    await meilisearch.index('addons').addDocuments([addonData]);
    console.log(`Synced addon ${document.$id} to Meilisearch`);
    return res.json({ success: true });
  } catch (error) {
    console.error('Error syncing to Meilisearch:', error);
    return res.json({ success: false, error: error.message });
  }
};
```

## Advanced Search Features

### Search Ranking

Blueprint configures Meilisearch ranking rules to provide the most relevant results:

```json
{
  "rankingRules": [
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness",
    "downloads:desc"
  ]
}
```

This configuration prioritizes:
1. Matching more words from the query
2. Having fewer typos
3. Having query terms closer together
4. Matching more important attributes
5. Explicit sort criteria
6. Exact matches over partial matches
7. Higher download counts

### Faceted Search

Blueprint implements faceted search for filtering results by categories, versions, etc.:

```typescript
// src/api/endpoints/useSearchFacets.tsx
import { useQuery } from '@tanstack/react-query';
import { meilisearch } from '@/config/meilisearch';

export const useAddonFacets = (query: string, filters?: string) => {
  return useQuery({
    queryKey: ['facets', 'addons', query, filters],
    queryFn: async () => {
      const index = meilisearch.index('addons');
      const results = await index.search(query, {
        filter: filters,
        facets: ['categories', 'minecraft_versions', 'create_versions', 'loaders'],
        limit: 0, // We only need facets, not results
      });
      
      return results.facetDistribution || {};
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
```

## Performance Considerations

1. **Query Caching**: TanStack Query caches search results to reduce API calls
2. **Pagination**: Results are paginated to improve performance
3. **Attribute Pruning**: Only necessary attributes are returned in search results
4. **Index Optimization**: Indexes are optimized for faster searching

## Error Handling

Blueprint implements error handling for search operations:

```typescript
// Example of error handling in search hooks
const { data, error, isLoading, isError } = useSearchAddons({
  query,
  filters,
  page,
});

// In component
if (isLoading) return <LoadingOverlay />;
if (isError) return <ErrorMessage message={`Search failed: ${error.message}`} />;
```

## Testing Search Functionality

For testing search functionality, Blueprint provides utility functions:

```typescript
// src/lib/search/testUtils.ts
export const testSearch = async (query: string, filters?: string) => {
  const index = meilisearch.index('addons');
  return await index.search(query, { filter: filters });
};
```

## Security Considerations

1. **API Key Permissions**: Different API keys with appropriate permissions:
   - Search-only key for frontend operations
   - Admin key for indexing operations (server-side only)

2. **Input Sanitization**: All user inputs are sanitized before use in search queries

## Best Practices

1. **Use Appropriate Filters**: Build filters that match user needs
   ```typescript
   // Good: Specific filter
   const filter = new FilterBuilder()
     .contains('minecraft_versions', selectedVersion)
     .build();
   
   // Bad: Overly complex filter
   const filter = `minecraft_versions = "${selectedVersion}" AND created_at > ${Date.now() - 86400000}`;
   ```

2. **Optimize Query Parameters**: Only include necessary parameters
   ```typescript
   // Good: Only request what's needed
   const results = await index.search(query, {
     filter: filters,
     limit: 10,
     offset: (page - 1) * 10,
     attributesToRetrieve: ['$id', 'name', 'description', 'icon'],
   });
   
   // Bad: Requesting everything
   const results = await index.search(query);
   ```

3. **Handle Empty Queries**: Provide meaningful results for empty searches
   ```typescript
   // Empty query handling
   const searchQuery = query.trim() || '*'; // Use * for empty queries to match everything
   ```

## Related Documentation

- [API Overview](./endpoints.md)
- [Appwrite Integration](./appwrite.md)
- [Search Components](../components/feature-components.md)
