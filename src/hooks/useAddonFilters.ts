import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch';
import type { AddonFilters, FacetResults, FilterPreset, SortOption } from '@/types/filters';
import { defaultFilters } from '@/types/filters';

export const useAddonFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<AddonFilters>(() => parseFiltersFromUrl(searchParams));
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch ALL available facets from the entire dataset (for showing all options)
  const { data: allFacetsData } = useQuery({
    queryKey: ['all-addon-facets'],
    queryFn: async () => {
      try {
        const index = searchClient.index('addons');
        const result = await index.search('*', {
          facets: ['categories', 'loaders', 'minecraft_versions', 'authors'],
          filter: 'isValid = true',
          limit: 0, // We only want facets, not results
          attributesToRetrieve: [],
        });

        // Process facets to split comma-separated values
        const processedFacets: FacetResults = {};

        // Process categories - split comma-separated values
        if (result.facetDistribution?.categories) {
          const splitCategories: Record<string, number> = {};
          Object.entries(result.facetDistribution.categories).forEach(([key, count]) => {
            // Split by comma and trim whitespace
            const individualCategories = key
              .split(',')
              .map((cat) => cat.trim())
              .filter((cat) => cat);
            individualCategories.forEach((category) => {
              splitCategories[category] = (splitCategories[category] || 0) + count;
            });
          });
          processedFacets.categories = splitCategories;
        }

        // Process loaders - split comma-separated values
        if (result.facetDistribution?.loaders) {
          const splitLoaders: Record<string, number> = {};
          Object.entries(result.facetDistribution.loaders).forEach(([key, count]) => {
            // Split by comma and trim whitespace
            const individualLoaders = key
              .split(',')
              .map((loader) => loader.trim())
              .filter((loader) => loader);
            individualLoaders.forEach((loader) => {
              splitLoaders[loader] = (splitLoaders[loader] || 0) + count;
            });
          });
          processedFacets.loaders = splitLoaders;
        }

        // Process minecraft versions - split comma-separated values
        if (result.facetDistribution?.minecraft_versions) {
          const splitVersions: Record<string, number> = {};
          Object.entries(result.facetDistribution.minecraft_versions).forEach(([key, count]) => {
            // Split by comma and trim whitespace
            const individualVersions = key
              .split(',')
              .map((v) => v.trim())
              .filter((v) => v);
            individualVersions.forEach((version) => {
              splitVersions[version] = (splitVersions[version] || 0) + count;
            });
          });
          processedFacets.minecraft_versions = splitVersions;
        }

        // Authors are usually not comma-separated, but process them just in case
        if (result.facetDistribution?.authors) {
          processedFacets.authors = result.facetDistribution.authors;
        }

        return processedFacets;
      } catch (error) {
        console.warn('Failed to fetch all facets:', error);
        return {} as FacetResults;
      }
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes since this doesn't change often
    retry: false,
  });

  // Fetch facets filtered by current search/filters (for showing counts in current context)
  const { data: facetData, isLoading: facetsLoading } = useQuery({
    queryKey: ['addon-facets', filters, searchQuery],
    queryFn: async () => {
      try {
        const index = searchClient.index('addons');
        const result = await index.search('*', {
          facets: ['categories', 'loaders', 'minecraft_versions', 'authors'],
          filter: 'isValid = true',
          limit: 0, // We only want facets, not results
          attributesToRetrieve: [],
        });

        // Process facets to split comma-separated values
        const processedFacets: FacetResults = {};

        // Process categories - split comma-separated values
        if (result.facetDistribution?.categories) {
          const splitCategories: Record<string, number> = {};
          Object.entries(result.facetDistribution.categories).forEach(([key, count]) => {
            // Split by comma and trim whitespace
            const individualCategories = key
              .split(',')
              .map((cat) => cat.trim())
              .filter((cat) => cat);
            individualCategories.forEach((category) => {
              splitCategories[category] = (splitCategories[category] || 0) + count;
            });
          });
          processedFacets.categories = splitCategories;
        }

        // Process loaders - split comma-separated values
        if (result.facetDistribution?.loaders) {
          const splitLoaders: Record<string, number> = {};
          Object.entries(result.facetDistribution.loaders).forEach(([key, count]) => {
            // Split by comma and trim whitespace
            const individualLoaders = key
              .split(',')
              .map((loader) => loader.trim())
              .filter((loader) => loader);
            individualLoaders.forEach((loader) => {
              splitLoaders[loader] = (splitLoaders[loader] || 0) + count;
            });
          });
          processedFacets.loaders = splitLoaders;
        }

        // Process minecraft versions - split comma-separated values
        if (result.facetDistribution?.minecraft_versions) {
          const splitVersions: Record<string, number> = {};
          Object.entries(result.facetDistribution.minecraft_versions).forEach(([key, count]) => {
            // Split by comma and trim whitespace
            const individualVersions = key
              .split(',')
              .map((v) => v.trim())
              .filter((v) => v);
            individualVersions.forEach((version) => {
              splitVersions[version] = (splitVersions[version] || 0) + count;
            });
          });
          processedFacets.minecraft_versions = splitVersions;
        }

        // Authors are usually not comma-separated, but process them just in case
        if (result.facetDistribution?.authors) {
          processedFacets.authors = result.facetDistribution.authors;
        }

        return processedFacets;
      } catch (error) {
        // If CORS error or network error, return empty facets
        console.warn('Failed to fetch facets, using fallback options:', error);
        return {} as FacetResults;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false, // Don't retry on CORS errors
  });

  // Build Meilisearch filter string
  const filterString = useMemo(() => {
    const parts: string[] = [];

    // Always include isValid filter
    parts.push('isValid = true');

    // Categories filter
    if (filters.categories.length > 0) {
      const categoryFilter = filters.categories.map((cat) => `categories = "${cat}"`).join(' OR ');
      parts.push(`(${categoryFilter})`);
    }

    // Loaders filter
    if (filters.loaders.length > 0) {
      const loaderFilter = filters.loaders.map((loader) => `loaders = "${loader}"`).join(' OR ');
      parts.push(`(${loaderFilter})`);
    }

    // Minecraft versions filter
    if (filters.minecraft_versions.length > 0) {
      const versionFilter = filters.minecraft_versions
        .map((version) => `minecraft_versions = "${version}"`)
        .join(' OR ');
      parts.push(`(${versionFilter})`);
    }

    // Authors filter
    if (filters.authors.length > 0) {
      const authorFilter = filters.authors.map((author) => `authors = "${author}"`).join(' OR ');
      parts.push(`(${authorFilter})`);
    }

    // Downloads range filter
    if (filters.downloads) {
      if (filters.downloads.min !== undefined) {
        parts.push(`downloads >= ${filters.downloads.min}`);
      }
      if (filters.downloads.max !== undefined) {
        parts.push(`downloads <= ${filters.downloads.max}`);
      }
    }

    // Last updated date filter
    if (filters.lastUpdated) {
      if (filters.lastUpdated.from) {
        const fromTimestamp = Math.floor(filters.lastUpdated.from.getTime() / 1000);
        parts.push(`updated_at >= ${fromTimestamp}`);
      }
      if (filters.lastUpdated.to) {
        const toTimestamp = Math.floor(filters.lastUpdated.to.getTime() / 1000);
        parts.push(`updated_at <= ${toTimestamp}`);
      }
    }

    return parts.join(' AND ');
  }, [filters]);

  // Update a specific filter
  const updateFilter = useCallback(
    <K extends keyof AddonFilters>(key: K, value: AddonFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Toggle a value in a multi-select filter
  const toggleFilterValue = useCallback(
    (key: 'categories' | 'loaders' | 'minecraft_versions' | 'authors', value: string) => {
      setFilters((prev) => {
        const currentValues = prev[key];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return {
          ...prev,
          [key]: newValues,
        };
      });
    },
    []
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchQuery('');
  }, []);

  // Apply a preset
  const applyPreset = useCallback((preset: FilterPreset) => {
    setFilters((_prev) => ({
      ...defaultFilters,
      ...preset.filters,
    }));
  }, []);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.loaders.length > 0 ||
      filters.minecraft_versions.length > 0 ||
      filters.authors.length > 0 ||
      filters.downloads !== undefined ||
      filters.lastUpdated !== undefined ||
      searchQuery !== ''
    );
  }, [filters, searchQuery]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.loaders.length > 0) count += filters.loaders.length;
    if (filters.minecraft_versions.length > 0) count += filters.minecraft_versions.length;
    if (filters.authors.length > 0) count += filters.authors.length;
    if (filters.downloads) count++;
    if (filters.lastUpdated) count++;
    return count;
  }, [filters]);

  // Sync filters with URL
  useEffect(() => {
    const params = filtersToUrlParams(filters, searchQuery);
    setSearchParams(params, { replace: true });
  }, [filters, searchQuery, setSearchParams]);

  return {
    filters,
    facets: facetData, // Facets based on current filters
    allFacets: allFacetsData, // All available facets from entire dataset
    facetsLoading,
    filterString,
    searchQuery,
    setSearchQuery,
    updateFilter,
    toggleFilterValue,
    clearFilters,
    applyPreset,
    hasActiveFilters,
    activeFilterCount,
  };
};

// Helper function to parse filters from URL
function parseFiltersFromUrl(params: URLSearchParams): AddonFilters {
  const filters: AddonFilters = { ...defaultFilters };

  // Parse categories
  const categories = params.get('cat');
  if (categories) {
    filters.categories = categories.split(',');
  }

  // Parse loaders
  const loaders = params.get('loader');
  if (loaders) {
    filters.loaders = loaders.split(',');
  }

  // Parse versions
  const versions = params.get('v');
  if (versions) {
    filters.minecraft_versions = versions.split(',');
  }

  // Parse authors
  const authors = params.get('author');
  if (authors) {
    filters.authors = authors.split(',');
  }

  // Parse sort
  const sort = params.get('sort') as SortOption;
  if (sort) {
    filters.sort = sort;
  }

  // Parse download range
  const minDownloads = params.get('min_dl');
  const maxDownloads = params.get('max_dl');
  if (minDownloads || maxDownloads) {
    filters.downloads = {
      min: minDownloads ? parseInt(minDownloads) : undefined,
      max: maxDownloads ? parseInt(maxDownloads) : undefined,
    };
  }

  return filters;
}

// Helper function to convert filters to URL params
function filtersToUrlParams(filters: AddonFilters, searchQuery: string): URLSearchParams {
  const params = new URLSearchParams();

  if (searchQuery) {
    params.set('q', searchQuery);
  }

  if (filters.categories.length > 0) {
    params.set('cat', filters.categories.join(','));
  }

  if (filters.loaders.length > 0) {
    params.set('loader', filters.loaders.join(','));
  }

  if (filters.minecraft_versions.length > 0) {
    params.set('v', filters.minecraft_versions.join(','));
  }

  if (filters.authors.length > 0) {
    params.set('author', filters.authors.join(','));
  }

  if (filters.sort && filters.sort !== 'relevance') {
    params.set('sort', filters.sort);
  }

  if (filters.downloads?.min !== undefined) {
    params.set('min_dl', filters.downloads.min.toString());
  }

  if (filters.downloads?.max !== undefined) {
    params.set('max_dl', filters.downloads.max.toString());
  }

  return params;
}
