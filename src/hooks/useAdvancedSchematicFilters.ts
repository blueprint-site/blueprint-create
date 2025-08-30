import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch';
import type {
  SchematicFilters,
  SchematicFilterPreset,
  SchematicFacetDistribution,
  CategorySuggestion,
} from '@/types/schematicFilters';
import { defaultSchematicFilters } from '@/types/schematicFilters';
import {
  buildSchematicFilterString,
  buildSchematicSortArray,
  parseSchematicFiltersFromUrl,
  schematicFiltersToUrlParams,
  hasActiveSchematicFilters,
  mergeSchematicFilters,
  processSchematicFacetDistribution,
} from '@/utils/schematicFilterUtils';

interface UseAdvancedSchematicFiltersReturn {
  filters: SchematicFilters;
  facets: SchematicFacetDistribution | null;
  filterString: string;
  sortArray: string[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  updateFilter: <K extends keyof SchematicFilters>(
    filterType: K,
    value: SchematicFilters[K]
  ) => void;
  updatePartialFilter: (updates: Partial<SchematicFilters>) => void;
  toggleCategory: (category: string) => void;
  toggleSubcategory: (subcategory: string) => void;
  toggleMaterial: (material: string) => void;
  toggleMod: (mod: string) => void;
  toggleComplexity: (level: string) => void;
  applyPreset: (preset: SchematicFilterPreset) => void;
  clearFilters: () => void;
  clearFilterType: (filterType: keyof SchematicFilters) => void;
  suggestions: CategorySuggestion[];
}

/**
 * Advanced hook for managing schematic filters with URL persistence and faceting
 */
export const useAdvancedSchematicFilters = (
  initialFilters?: Partial<SchematicFilters>
): UseAdvancedSchematicFiltersReturn => {
  console.log('useAdvancedSchematicFilters hook called with:', initialFilters);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState<SchematicFilters>(() => {
    const urlFilters = parseSchematicFiltersFromUrl(searchParams);
    return mergeSchematicFilters(defaultSchematicFilters, { ...urlFilters, ...initialFilters });
  });

  // Sync filters with URL
  useEffect(() => {
    const params = schematicFiltersToUrlParams(filters);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch facets based on current filters
  const { data: facetData, isLoading } = useQuery({
    queryKey: ['schematic-facets', filters],
    queryFn: async () => {
      console.log('queryFn called for facets!');
      const index = searchClient.index('schematics');

      try {
        console.log('Fetching facets with filters:', filters);

        const results = await index.search(filters.query || '', {
          filter: buildSchematicFilterString(filters),
          facets: ['*'], // Use wildcard to get all available facets
          limit: 0,
          attributesToRetrieve: [],
        });

        console.log('Facet search results:', {
          totalHits: results.estimatedTotalHits,
          facetDistribution: results.facetDistribution,
          facetKeys: results.facetDistribution ? Object.keys(results.facetDistribution) : [],
        });
        const processed = processSchematicFacetDistribution(results.facetDistribution);
        console.log('Processed facet distribution:', processed);
        return processed;
      } catch (error) {
        console.error('Facet search failed with error:', error);
        return {
          categories: {},
          subcategories: {},
          materials_primary: {},
          complexity_level: {},
          requirement_mods: {},
          requirements_minecraftVersion: {},
          authors: {},
        };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  console.log('Facet data from query:', facetData);

  // Generate category suggestions based on query
  const { data: suggestions = [] } = useQuery({
    queryKey: ['schematic-category-suggestions', filters.query],
    queryFn: async () => {
      if (!filters.query || filters.query.length < 3) return [];

      // This would ideally call an AI service or use a rule-based system
      // For now, return simple keyword-based suggestions
      const query = filters.query.toLowerCase();
      const suggestions: CategorySuggestion[] = [];

      // Check for category keywords
      const categoryKeywords = {
        buildings: ['house', 'castle', 'tower', 'building', 'church', 'shop'],
        machines: ['farm', 'machine', 'contraption', 'redstone', 'automatic'],
        decoration: ['decoration', 'statue', 'fountain', 'garden', 'art'],
        vehicles: ['car', 'train', 'plane', 'ship', 'vehicle', 'transport'],
        landscapes: ['mountain', 'terrain', 'landscape', 'tree', 'island'],
        fantasy: ['fantasy', 'magic', 'dragon', 'portal', 'dungeon'],
      };

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
          if (query.includes(keyword)) {
            suggestions.push({
              category,
              confidence: 0.8,
              reasoning: `Query contains "${keyword}"`,
            });
            break;
          }
        }
      }

      return suggestions;
    },
    enabled: filters.query.length >= 3,
    staleTime: 60 * 1000, // Cache for 1 minute
  });

  // Build filter string for Meilisearch
  const filterString = useMemo(() => buildSchematicFilterString(filters), [filters]);

  // Build sort array for Meilisearch
  const sortArray = useMemo(() => buildSchematicSortArray(filters.sort), [filters.sort]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => hasActiveSchematicFilters(filters), [filters]);

  // Update a specific filter
  const updateFilter = useCallback(
    <K extends keyof SchematicFilters>(filterType: K, value: SchematicFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }));
    },
    []
  );

  // Update multiple filters at once
  const updatePartialFilter = useCallback((updates: Partial<SchematicFilters>) => {
    setFilters((prev) => mergeSchematicFilters(prev, updates));
  }, []);

  // Toggle helpers for multi-select filters
  const toggleCategory = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const toggleSubcategory = useCallback((subcategory: string) => {
    setFilters((prev) => ({
      ...prev,
      subcategories: prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter((s) => s !== subcategory)
        : [...prev.subcategories, subcategory],
    }));
  }, []);

  const toggleMaterial = useCallback((material: string) => {
    setFilters((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        primary: prev.materials.primary.includes(material)
          ? prev.materials.primary.filter((m) => m !== material)
          : [...prev.materials.primary, material],
      },
    }));
  }, []);

  const toggleMod = useCallback((mod: string) => {
    setFilters((prev) => ({
      ...prev,
      compatibility: {
        ...prev.compatibility,
        requiredMods: prev.compatibility.requiredMods.includes(mod)
          ? prev.compatibility.requiredMods.filter((m) => m !== mod)
          : [...prev.compatibility.requiredMods, mod],
      },
    }));
  }, []);

  const toggleComplexity = useCallback((level: string) => {
    setFilters((prev) => ({
      ...prev,
      complexity: {
        ...prev.complexity,
        levels: prev.complexity.levels.includes(
          level as 'simple' | 'moderate' | 'complex' | 'extreme'
        )
          ? prev.complexity.levels.filter((l) => l !== level)
          : [...prev.complexity.levels, level as 'simple' | 'moderate' | 'complex' | 'extreme'],
      },
    }));
  }, []);

  // Apply a filter preset
  const applyPreset = useCallback((preset: SchematicFilterPreset) => {
    setFilters(mergeSchematicFilters(defaultSchematicFilters, preset.filters));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultSchematicFilters);
  }, []);

  // Clear a specific filter type
  const clearFilterType = useCallback((filterType: keyof SchematicFilters) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: defaultSchematicFilters[filterType],
    }));
  }, []);

  return {
    filters,
    facets: facetData || null,
    filterString,
    sortArray,
    isLoading,
    hasActiveFilters,
    updateFilter,
    updatePartialFilter,
    toggleCategory,
    toggleSubcategory,
    toggleMaterial,
    toggleMod,
    toggleComplexity,
    applyPreset,
    clearFilters,
    clearFilterType,
    suggestions,
  };
};

/**
 * Hook for URL-synced schematic filters
 */
export const useSchematicFilterUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filtersFromUrl = useMemo(() => parseSchematicFiltersFromUrl(searchParams), [searchParams]);

  const updateUrl = useCallback(
    (filters: SchematicFilters) => {
      const params = schematicFiltersToUrlParams(filters);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  return { filtersFromUrl, updateUrl };
};
