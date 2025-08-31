# Schematic Filters Improvement Plan

## Overview

This document outlines a comprehensive plan to improve the schematic filtering system using Meilisearch's advanced search capabilities. The goal is to create a dynamic, content-driven filtering system that automatically adapts to the diversity of schematics uploaded by users, with intelligent category and subcategory organization.

## Current Issues

1. **Static Categories**: Limited predefined categories that don't reflect actual schematic diversity
2. **No Subcategories**: Flat category structure without hierarchical organization
3. **Missing Metadata Filters**: No filters for dimensions, block count, mod requirements
4. **No Faceted Search**: Not leveraging Meilisearch's faceting capabilities
5. **Limited Discovery**: Users can't easily find schematics by specific characteristics
6. **No Smart Categorization**: Manual category selection without AI/rule-based suggestions

## Proposed Improvements

### 1. Dynamic Category & Subcategory System

#### Automatic Category Detection

```typescript
interface SchematicCategory {
  id: string;
  name: string;
  subcategories: SubCategory[];
  count: number;
  keywords: string[];
  rules: CategoryRule[];
}

interface SubCategory {
  id: string;
  name: string;
  parentId: string;
  count: number;
  keywords: string[];
}

// Category detection based on schematic analysis
const detectCategories = async (schematic: SchematicData) => {
  const detectedCategories = [];

  // Analyze schematic content
  const analysis = {
    blocks: analyzeBlockTypes(schematic.blocks),
    dimensions: calculateDimensions(schematic),
    patterns: detectBuildPatterns(schematic),
    modBlocks: detectModdedBlocks(schematic.blocks),
  };

  // Apply rule-based categorization
  for (const rule of categoryRules) {
    if (rule.evaluate(analysis)) {
      detectedCategories.push(rule.category);
    }
  }

  return detectedCategories;
};
```

#### Dynamic Category Hierarchy

```typescript
// Main Categories (auto-detected from content)
const schematicCategories = {
  buildings: {
    name: 'Buildings',
    subcategories: [
      'houses',
      'castles',
      'towers',
      'shops',
      'churches',
      'skyscrapers',
      'villages',
      'cities',
      'ruins',
    ],
  },
  machines: {
    name: 'Machines & Contraptions',
    subcategories: [
      'farms',
      'redstone',
      'create-mod',
      'industrial',
      'automation',
      'sorting-systems',
      'doors',
      'elevators',
    ],
  },
  decoration: {
    name: 'Decoration & Aesthetics',
    subcategories: [
      'statues',
      'fountains',
      'gardens',
      'paths',
      'lighting',
      'furniture',
      'art',
      'monuments',
    ],
  },
  vehicles: {
    name: 'Vehicles & Transport',
    subcategories: [
      'trains',
      'cars',
      'planes',
      'ships',
      'spacecraft',
      'railways',
      'stations',
      'bridges',
    ],
  },
  landscapes: {
    name: 'Landscapes & Terrain',
    subcategories: [
      'mountains',
      'valleys',
      'caves',
      'custom-trees',
      'terraforming',
      'islands',
      'floating-islands',
    ],
  },
  fantasy: {
    name: 'Fantasy & Fiction',
    subcategories: [
      'magic-builds',
      'dragons',
      'dungeons',
      'portals',
      'mythical',
      'steampunk',
      'cyberpunk',
      'medieval',
    ],
  },
};
```

### 2. Advanced Schematic Analysis

#### Block Analysis Engine

```typescript
interface SchematicAnalysis {
  // Dimensional data
  dimensions: {
    width: number;
    height: number;
    depth: number;
    volume: number;
    blockCount: number;
  };

  // Block composition
  composition: {
    primaryMaterial: string;
    materials: Map<string, number>;
    modBlocks: Map<string, number>;
    decorativeRatio: number;
    functionalRatio: number;
  };

  // Complexity metrics
  complexity: {
    detailLevel: 'simple' | 'moderate' | 'complex' | 'extreme';
    symmetry: number; // 0-1 score
    patterns: string[];
    estimatedBuildTime: number; // in minutes
  };

  // Technical requirements
  requirements: {
    mods: string[];
    minecraftVersion: string;
    createModVersion?: string;
    hasRedstone: boolean;
    hasCommandBlocks: boolean;
  };
}

const analyzeSchematic = async (schematicFile: File): Promise<SchematicAnalysis> => {
  const schematic = await parseSchematicFile(schematicFile);

  return {
    dimensions: calculateDimensions(schematic),
    composition: analyzeBlockComposition(schematic),
    complexity: assessComplexity(schematic),
    requirements: detectRequirements(schematic),
  };
};
```

### 3. Intelligent Filter System

#### Multi-Dimensional Filters

```typescript
interface SchematicFilters {
  // Text search
  query: string;

  // Category filters (multi-select)
  categories: string[];
  subcategories: string[];

  // Dimension ranges
  dimensions: {
    width: { min?: number; max?: number };
    height: { min?: number; max?: number };
    depth: { min?: number; max?: number };
    blockCount: { min?: number; max?: number };
  };

  // Material filters
  materials: {
    primary: string[];
    exclude: string[];
    includeModded: boolean;
  };

  // Complexity filters
  complexity: {
    levels: ('simple' | 'moderate' | 'complex' | 'extreme')[];
    buildTime: { min?: number; max?: number };
  };

  // Version & mod filters
  compatibility: {
    minecraftVersions: string[];
    createVersions: string[];
    requiredMods: string[];
    allowRedstone: boolean;
  };

  // User & quality filters
  meta: {
    authors: string[];
    minRating: number;
    minDownloads: number;
    uploadedAfter: Date;
    featured: boolean;
  };

  // Sort options
  sort: {
    field: 'relevance' | 'downloads' | 'rating' | 'date' | 'size' | 'complexity';
    order: 'asc' | 'desc';
  };
}
```

### 4. Smart Category Suggestion System

#### AI-Powered Categorization

```typescript
// Use OpenAI or local ML model for category suggestions
const suggestCategories = async (
  schematic: SchematicAnalysis,
  title: string,
  description: string
): Promise<CategorySuggestion[]> => {
  // Combine multiple signals
  const signals = {
    structural: analyzeStructure(schematic),
    textual: analyzeText(title, description),
    visual: analyzeBlockPatterns(schematic),
    contextual: analyzeMetadata(schematic),
  };

  // Generate suggestions with confidence scores
  const suggestions = await mlModel.predict(signals);

  return suggestions.map((s) => ({
    category: s.category,
    subcategory: s.subcategory,
    confidence: s.confidence,
    reasoning: s.reasoning,
  }));
};

// Rule-based fallback system
const categoryRules: CategoryRule[] = [
  {
    name: 'Castle Detection',
    category: 'buildings',
    subcategory: 'castles',
    evaluate: (analysis) => {
      return (
        analysis.composition.materials.has('stone_bricks') > 0.3 &&
        analysis.dimensions.height > 20 &&
        analysis.complexity.patterns.includes('tower')
      );
    },
  },
  {
    name: 'Farm Detection',
    category: 'machines',
    subcategory: 'farms',
    evaluate: (analysis) => {
      const farmBlocks = ['farmland', 'water', 'hopper', 'composter'];
      return farmBlocks.some((block) => analysis.composition.materials.has(block));
    },
  },
  // ... more rules
];
```

### 5. Meilisearch Configuration

#### Index Settings for Schematics

```javascript
// Meilisearch index configuration
{
  searchableAttributes: [
    'title',
    'description',
    'author',
    'categories',
    'subcategories',
    'tags'
  ],

  filterableAttributes: [
    'categories',
    'subcategories',
    'dimensions.width',
    'dimensions.height',
    'dimensions.depth',
    'dimensions.blockCount',
    'materials.primary',
    'complexity.level',
    'requirements.mods',
    'requirements.minecraftVersion',
    'requirements.createModVersion',
    'meta.author',
    'meta.downloads',
    'meta.rating',
    'meta.uploadDate',
    'meta.featured'
  ],

  sortableAttributes: [
    'meta.downloads',
    'meta.rating',
    'meta.uploadDate',
    'dimensions.blockCount',
    'complexity.buildTime'
  ],

  faceting: {
    maxValuesPerFacet: 200,
    sortFacetValuesBy: {
      'categories': 'count',
      'subcategories': 'count',
      'materials.primary': 'count',
      'requirements.mods': 'alpha'
    }
  },

  ranking: [
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
    'meta.downloads:desc',
    'meta.rating:desc'
  ]
}
```

### 6. Enhanced UI Components

#### Filter Panel Design

```tsx
// Advanced filter panel with collapsible sections
const SchematicFilterPanel: React.FC = () => {
  return (
    <div className='filter-panel'>
      {/* Quick Filters */}
      <QuickFilters>
        <FilterChip label='Create Mod' icon={<GearIcon />} />
        <FilterChip label='Small Builds' icon={<CubeIcon />} />
        <FilterChip label='No Mods Required' icon={<CheckIcon />} />
        <FilterChip label='Featured' icon={<StarIcon />} />
      </QuickFilters>

      {/* Category Tree */}
      <FilterSection title='Categories' defaultOpen>
        <CategoryTree
          categories={categories}
          selected={selectedCategories}
          onSelect={handleCategorySelect}
          showCounts
          searchable
        />
      </FilterSection>

      {/* Dimension Sliders */}
      <FilterSection title='Dimensions'>
        <RangeSlider
          label='Width'
          min={1}
          max={500}
          value={filters.dimensions.width}
          onChange={updateDimension('width')}
        />
        <RangeSlider
          label='Height'
          min={1}
          max={320}
          value={filters.dimensions.height}
          onChange={updateDimension('height')}
        />
        <BlockCountInput
          min={filters.dimensions.blockCount.min}
          max={filters.dimensions.blockCount.max}
          onChange={updateBlockCount}
        />
      </FilterSection>

      {/* Material Filter */}
      <FilterSection title='Materials'>
        <MaterialSelector
          materials={availableMaterials}
          selected={filters.materials.primary}
          onSelect={updateMaterials}
          showPreview
        />
        <Toggle
          label='Include modded blocks'
          checked={filters.materials.includeModded}
          onChange={toggleModdedBlocks}
        />
      </FilterSection>

      {/* Complexity Filter */}
      <FilterSection title='Complexity'>
        <ComplexitySelector
          levels={['simple', 'moderate', 'complex', 'extreme']}
          selected={filters.complexity.levels}
          onChange={updateComplexity}
        />
        <EstimatedBuildTime
          min={filters.complexity.buildTime.min}
          max={filters.complexity.buildTime.max}
          onChange={updateBuildTime}
        />
      </FilterSection>

      {/* Mod Requirements */}
      <FilterSection title='Compatibility'>
        <ModSelector
          mods={detectedMods}
          selected={filters.compatibility.requiredMods}
          onChange={updateMods}
        />
        <VersionSelector
          versions={minecraftVersions}
          selected={filters.compatibility.minecraftVersions}
          onChange={updateVersions}
        />
      </FilterSection>
    </div>
  );
};
```

#### Visual Filter Preview

```tsx
// Show visual preview of filter results
const FilterPreview: React.FC = ({ filters }) => {
  const { data: preview } = useSchematicPreview(filters);

  return (
    <div className='filter-preview'>
      <div className='stats'>
        <Stat label='Matching Schematics' value={preview.count} />
        <Stat label='Avg. Size' value={preview.avgSize} />
        <Stat label='Popular Category' value={preview.topCategory} />
      </div>

      <div className='preview-grid'>
        {preview.samples.map((schematic) => (
          <SchematicThumbnail key={schematic.id} schematic={schematic} showStats />
        ))}
      </div>
    </div>
  );
};
```

### 7. Implementation Hooks

#### Main Filter Hook

```typescript
// src/hooks/useSchematicFilters.ts
export const useSchematicFilters = () => {
  const [filters, setFilters] = useState<SchematicFilters>(defaultFilters);
  const [facets, setFacets] = useState<FacetResults>({});
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([]);

  // Fetch dynamic facets based on current filters
  const { data: facetData } = useQuery({
    queryKey: ['schematic-facets', filters],
    queryFn: () => fetchSchematicFacets(filters),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Build Meilisearch filter string
  const filterString = useMemo(() => buildSchematicFilterString(filters), [filters]);

  // Generate smart filter suggestions
  const { data: filterSuggestions } = useQuery({
    queryKey: ['filter-suggestions', filters.query],
    queryFn: () => generateFilterSuggestions(filters.query),
    enabled: filters.query.length > 2,
  });

  const updateFilter = useCallback((filterType: keyof SchematicFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));

    // Track filter usage for analytics
    trackFilterUsage(filterType, value);
  }, []);

  const applyPreset = useCallback((preset: FilterPreset) => {
    setFilters(preset.filters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    filters,
    facets: facetData,
    suggestions: filterSuggestions,
    filterString,
    updateFilter,
    applyPreset,
    clearFilters,
    hasActiveFilters: !isEqual(filters, defaultFilters),
  };
};
```

#### Search Hook with Faceting

```typescript
// src/api/meilisearch/useSearchSchematics.ts
export const useSearchSchematics = ({
  query,
  filters,
  page = 1,
  limit = 20,
}: SearchSchematicsProps) => {
  return useInfiniteQuery({
    queryKey: ['search-schematics', query, filters],
    queryFn: async ({ pageParam = page }) => {
      const index = searchClient.index('schematics');

      const searchParams = {
        q: query || '',
        filter: filters.filterString,
        sort: buildSortArray(filters.sort),
        facets: [
          'categories',
          'subcategories',
          'materials.primary',
          'complexity.level',
          'requirements.mods',
        ],
        attributesToRetrieve: [
          'id',
          'title',
          'description',
          'thumbnail',
          'dimensions',
          'downloads',
          'rating',
          'author',
        ],
        attributesToHighlight: ['title', 'description'],
        attributesToCrop: ['description:200'],
        limit,
        offset: (pageParam - 1) * limit,
      };

      const results = await index.search(query, searchParams);

      // Enrich results with additional data
      return {
        ...results,
        schematics: await enrichSchematicResults(results.hits),
        facetDistribution: processFacetDistribution(results.facetDistribution),
      };
    },
    getNextPageParam: (lastPage, pages) => {
      const totalPages = Math.ceil(lastPage.estimatedTotalHits / limit);
      return pages.length < totalPages ? pages.length + 1 : undefined;
    },
  });
};
```

### 8. Auto-Categorization Pipeline

#### Upload Processing Pipeline

```typescript
// Process schematic on upload for auto-categorization
const processSchematicUpload = async (
  file: File,
  metadata: UploadMetadata
): Promise<ProcessedSchematic> => {
  // 1. Parse schematic file
  const schematicData = await parseSchematicFile(file);

  // 2. Analyze schematic structure
  const analysis = await analyzeSchematic(schematicData);

  // 3. Generate category suggestions
  const categorySuggestions = await suggestCategories(
    analysis,
    metadata.title,
    metadata.description
  );

  // 4. Extract searchable tags
  const tags = extractTags(analysis, metadata);

  // 5. Generate thumbnail
  const thumbnail = await generateSchematicThumbnail(schematicData);

  // 6. Calculate complexity metrics
  const complexity = calculateComplexity(analysis);

  return {
    ...metadata,
    analysis,
    categories: categorySuggestions.filter((s) => s.confidence > 0.7),
    tags,
    thumbnail,
    complexity,
    searchableContent: generateSearchableContent(metadata, analysis),
  };
};
```

### 9. Filter Presets & Templates

#### Predefined Filter Combinations

```typescript
const filterPresets: FilterPreset[] = [
  {
    id: 'small-builds',
    name: 'Small Builds',
    icon: 'cube',
    description: 'Perfect for survival mode',
    filters: {
      dimensions: {
        blockCount: { max: 5000 },
      },
      complexity: {
        levels: ['simple', 'moderate'],
      },
    },
  },
  {
    id: 'create-contraptions',
    name: 'Create Mod Contraptions',
    icon: 'gear',
    description: 'Mechanical marvels',
    filters: {
      categories: ['machines'],
      compatibility: {
        requiredMods: ['create'],
      },
    },
  },
  {
    id: 'mega-builds',
    name: 'Mega Builds',
    icon: 'city',
    description: 'Massive structures',
    filters: {
      dimensions: {
        blockCount: { min: 50000 },
      },
      complexity: {
        levels: ['complex', 'extreme'],
      },
    },
  },
  {
    id: 'vanilla-friendly',
    name: 'Vanilla Friendly',
    icon: 'grass-block',
    description: 'No mods required',
    filters: {
      materials: {
        includeModded: false,
      },
      compatibility: {
        requiredMods: [],
      },
    },
  },
];
```

### 10. Performance Optimizations

#### Facet Caching Strategy

```typescript
// Cache facet distributions aggressively
const facetCache = new Map<string, FacetResults>();

const getCachedFacets = (filterKey: string): FacetResults | null => {
  const cached = facetCache.get(filterKey);
  if (cached && Date.now() - cached.timestamp < 300000) {
    // 5 min cache
    return cached.data;
  }
  return null;
};

// Debounce filter updates
const debouncedFilterUpdate = useMemo(() => debounce(updateFilters, 300), []);

// Virtual scrolling for large result sets
const virtualizer = useVirtualizer({
  count: schematics.length,
  getScrollElement: () => scrollContainerRef.current,
  estimateSize: () => 280, // Estimated card height
  overscan: 5,
});
```

### 11. Analytics & Learning

#### Filter Usage Analytics

```typescript
// Track which filters lead to downloads
const trackFilterSuccess = (filters: SchematicFilters, action: string) => {
  analytics.track('schematic_filter_success', {
    filters: simplifyFilters(filters),
    action, // 'download', 'view', 'favorite'
    timestamp: Date.now(),
  });
};

// Learn from user behavior to improve suggestions
const improveCategorizationModel = async () => {
  const userFeedback = await collectUserCategoryFeedback();
  const modelImprovements = analyzeCategorizationAccuracy(userFeedback);

  if (modelImprovements.accuracy < 0.8) {
    await retrainCategorizationModel(userFeedback);
  }
};
```

### 12. Implementation Timeline

#### Phase 1: Foundation (Week 1)

- [ ] Set up Meilisearch index with faceting for schematics
- [ ] Implement schematic file parser and analyzer
- [ ] Create basic category detection rules
- [ ] Build filter state management hooks

#### Phase 2: Core Features (Week 2)

- [ ] Implement dynamic category/subcategory system
- [ ] Add dimension and block count filters
- [ ] Create material composition filters
- [ ] Build complexity assessment algorithm

#### Phase 3: Advanced Features (Week 3)

- [ ] Integrate AI-powered category suggestions
- [ ] Add mod requirement detection
- [ ] Implement filter presets
- [ ] Create visual filter preview

#### Phase 4: UI/UX (Week 4)

- [ ] Design and implement advanced filter panel
- [ ] Add category tree navigator
- [ ] Create filter chips and tags
- [ ] Implement filter persistence in URL

#### Phase 5: Optimization (Week 5)

- [ ] Add facet caching layer
- [ ] Implement virtual scrolling
- [ ] Optimize search queries
- [ ] Add analytics tracking

## Success Metrics

- **Filter Adoption Rate**: >70% of searches use at least one filter
- **Category Accuracy**: >85% auto-categorization accuracy
- **Search Success Rate**: >80% of searches result in download/view
- **Time to Discovery**: <20 seconds average to find desired schematic
- **User Satisfaction**: 4.6/5 rating for search experience

## Migration Strategy

1. **Parallel Development**: Build alongside existing system
2. **Beta Testing**: Roll out to power users first
3. **Feedback Loop**: Iterate based on user feedback
4. **Gradual Migration**: Move categories incrementally
5. **Full Launch**: Replace old system after validation

## Benefits

1. **Improved Discovery**: Users find relevant schematics faster
2. **Better Organization**: Automatic categorization reduces manual work
3. **Scalability**: System grows with content automatically
4. **User Experience**: Intuitive filters that match user mental models
5. **Data Insights**: Learn what users actually search for
6. **Mod Integration**: First-class support for modded schematics

## Conclusion

This comprehensive filter system will revolutionize schematic discovery by providing intelligent, content-aware filtering that automatically adapts to the growing library of user creations. By leveraging Meilisearch's powerful features and adding smart categorization, we create a system that scales effortlessly while providing an exceptional user experience.
