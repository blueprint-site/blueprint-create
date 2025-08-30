# Addon Filters Improvement Plan

## Overview

This document outlines a comprehensive plan to improve the addon filtering system using Meilisearch's advanced search capabilities. The current implementation uses hardcoded filter options that don't reflect the actual data diversity and don't leverage Meilisearch's powerful features.

## Current Issues

1. **Hardcoded Filter Options**: Categories, loaders, and versions are statically defined
2. **Limited Categories**: Only 4 categories (tech, energy, magic, all) vs. actual mod diversity
3. **No Faceted Search**: Not using Meilisearch's faceting capabilities
4. **Single Selection Only**: Can't select multiple options within a filter
5. **No Dynamic Updates**: Filters don't reflect actual available data
6. **Missing Filter Types**: No author, download count, or date filters

## Proposed Improvements

### 1. Dynamic Faceted Search

Leverage Meilisearch's faceting to dynamically generate filter options based on actual data.

#### Implementation Steps:

```typescript
// Configure Meilisearch index with facets
const configureMeilisearchIndex = async () => {
  await index.updateSettings({
    filterableAttributes: [
      'categories',
      'loaders',
      'minecraft_versions',
      'authors',
      'downloads',
      'created_at',
      'updated_at',
      'isValid',
      'sources',
    ],
    faceting: {
      maxValuesPerFacet: 100,
    },
  });
};

// Fetch facets with search results
const searchWithFacets = async (query: string, filters: string) => {
  return await index.search(query, {
    facets: ['categories', 'loaders', 'minecraft_versions', 'authors'],
    filter: filters,
    limit: 20,
  });
};
```

### 2. Enhanced Filter Categories

#### Categories (Dynamic from CurseForge/Modrinth)

- **Technology**: Industrial, Automation, Energy, Redstone
- **Magic**: Magical, Enchantment, Alchemy, Dimensions
- **Adventure**: Exploration, Dungeons, Structures, Biomes
- **Decoration**: Building, Decoration, Furniture, Cosmetic
- **Gameplay**: Mechanics, Combat, Food, Farming
- **Utility**: Library, API, Performance, UI
- **World Gen**: Terrain, Ores, Plants, Mobs

#### Loaders (Multi-select)

- Forge
- Fabric
- NeoForge
- Quilt
- Rift
- LiteLoader

#### Minecraft Versions (Grouped)

- **Latest**: 1.21.x, 1.20.x
- **LTS**: 1.19.2, 1.18.2, 1.16.5
- **Legacy**: 1.12.2, 1.7.10
- Custom version input

### 3. Advanced Filter Types

#### Range Filters

```typescript
interface RangeFilters {
  downloads: { min?: number; max?: number };
  lastUpdated: { from?: Date; to?: Date };
}
```

#### Sort Options

- Relevance (default)
- Downloads (high to low)
- Recently Updated
- Recently Added
- Alphabetical

#### Filter Tags

Visual tags showing active filters with easy removal:

```tsx
<FilterTag onRemove={() => removeFilter('category', 'tech')}>Category: Tech ×</FilterTag>
```

### 4. UI/UX Improvements

#### Filter Panel Design

```tsx
interface FilterPanelProps {
  // Collapsible sections for each filter type
  sections: {
    categories: FilterSection;
    loaders: FilterSection;
    versions: FilterSection;
    advanced: FilterSection;
  };

  // Quick filter presets
  presets: FilterPreset[];

  // Search within filters
  filterSearch: boolean;
}
```

#### Multi-select with Checkboxes

```tsx
<FilterSection title='Categories' searchable>
  {facets.categories.map((cat) => (
    <Checkbox
      key={cat.value}
      checked={selectedCategories.includes(cat.value)}
      onChange={() => toggleCategory(cat.value)}
    >
      {cat.label} ({cat.count})
    </Checkbox>
  ))}
</FilterSection>
```

### 5. Meilisearch Configuration

#### Index Settings Update

```javascript
// Update Meilisearch index configuration
{
  searchableAttributes: [
    'name',
    'description',
    'slug',
    'authors'
  ],

  filterableAttributes: [
    'categories',
    'loaders',
    'minecraft_versions',
    'authors',
    'downloads',
    'created_at',
    'updated_at',
    'isValid',
    'sources'
  ],

  sortableAttributes: [
    'downloads',
    'created_at',
    'updated_at',
    'name'
  ],

  faceting: {
    maxValuesPerFacet: 100,
    sortFacetValuesBy: {
      'categories': 'count',
      'loaders': 'alpha',
      'minecraft_versions': 'alpha'
    }
  }
}
```

### 6. Implementation Timeline

#### Phase 1: Backend Setup (Week 1)

- [ ] Configure Meilisearch index with faceting
- [ ] Update API hooks to fetch facets
- [ ] Create filter aggregation endpoint

#### Phase 2: Core Filters (Week 2)

- [ ] Implement multi-select for categories
- [ ] Add dynamic loader options
- [ ] Group Minecraft versions
- [ ] Add sort functionality

#### Phase 3: Advanced Features (Week 3)

- [ ] Add range filters (downloads, dates)
- [ ] Implement filter presets
- [ ] Add search within filters
- [ ] Create filter tags UI

#### Phase 4: Polish & Performance (Week 4)

- [ ] Add filter persistence (URL state)
- [ ] Implement filter analytics
- [ ] Optimize facet queries
- [ ] Add loading states and animations

### 7. Code Structure

#### New Hook: `useAddonFilters`

```typescript
// src/hooks/useAddonFilters.ts
export const useAddonFilters = () => {
  const [filters, setFilters] = useState<AddonFilters>(defaultFilters);
  const [facets, setFacets] = useState<FacetResults>({});

  // Fetch available facets
  const { data: facetData } = useQuery({
    queryKey: ['addon-facets', filters],
    queryFn: () => fetchAddonFacets(filters),
  });

  // Build Meilisearch filter string
  const filterString = useMemo(() => buildFilterString(filters), [filters]);

  return {
    filters,
    facets: facetData,
    filterString,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
};
```

#### Updated Search Hook

```typescript
// src/api/meilisearch/useSearchAddons.ts
export const useSearchAddons = ({ query, filters, sort, page, limit = 20 }: SearchAddonsProps) => {
  return useQuery({
    queryKey: ['search-addons', query, filters, sort, page],
    queryFn: async () => {
      const index = searchClient.index('addons');

      return await index.search(query || '*', {
        filter: filters,
        sort: sort ? [sort] : undefined,
        facets: ['categories', 'loaders', 'minecraft_versions'],
        limit,
        offset: (page - 1) * limit,
        attributesToHighlight: ['name', 'description'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      });
    },
  });
};
```

### 8. Filter Persistence & Sharing

#### URL State Management

```typescript
// Sync filters with URL params
const useFilterUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filtersFromUrl = useMemo(() => parseFiltersFromUrl(searchParams), [searchParams]);

  const updateUrl = useCallback(
    (filters: AddonFilters) => {
      const params = filtersToUrlParams(filters);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  return { filtersFromUrl, updateUrl };
};
```

#### Shareable Filter Links

Users can share filtered results via URL:

```
/addons?cat=tech,magic&loader=forge&v=1.20.1&sort=downloads
```

### 9. Performance Optimizations

#### Debounced Search

```typescript
const debouncedQuery = useDebounce(searchQuery, 300);
```

#### Facet Caching

```typescript
// Cache facet results for 5 minutes
queryClient.setQueryDefaults(['addon-facets'], {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});
```

#### Virtual Scrolling

For large result sets, implement virtual scrolling:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

### 10. Analytics & Insights

Track filter usage to improve defaults:

```typescript
const trackFilterUsage = (filterType: string, value: string) => {
  analytics.track('filter_applied', {
    filter_type: filterType,
    filter_value: value,
    timestamp: new Date(),
  });
};
```

## Benefits

1. **Better User Experience**: Dynamic, relevant filters that reflect actual data
2. **Improved Discovery**: Users can find addons more easily with advanced filtering
3. **Performance**: Leveraging Meilisearch's built-in faceting is faster than client-side filtering
4. **Scalability**: System grows with content without manual updates
5. **Analytics**: Understanding user behavior to improve defaults

## Migration Strategy

1. **Parallel Implementation**: Build new system alongside existing one
2. **Feature Flag**: Use feature flag to gradually roll out to users
3. **A/B Testing**: Compare engagement metrics between old and new systems
4. **Gradual Rollout**: Start with power users, then expand to all users

## Success Metrics

- **Filter Usage Rate**: % of searches using filters (target: >60%)
- **Filter Depth**: Average number of filters applied (target: 2-3)
- **Search Success Rate**: % of searches resulting in clicks (target: >70%)
- **Time to Result**: Average time to find desired addon (target: <30s)
- **User Satisfaction**: Survey score for search experience (target: 4.5/5)

## Conclusion

This comprehensive filter improvement plan will transform the addon discovery experience by leveraging Meilisearch's powerful capabilities while providing a modern, intuitive interface that scales with the growing addon ecosystem.
