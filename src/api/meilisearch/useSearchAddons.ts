// /src/api/endpoints/useSearchAddons.tsx
import { useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch.ts';
import { useState, useEffect } from 'react';
import type {
  Addon,
  AddonWithParsedFields,
  CurseForgeRawObject,
  ModrinthRawObject,
  SearchAddonResult,
} from '@/types';
import type { SortOption } from '@/types/filters';
import type { SearchResponse, Hit } from 'meilisearch';

interface SearchAddonsProps {
  query: string;
  page: number;
  filterString?: string;
  sort?: SortOption;
  limit?: number;
  includeFacets?: boolean;
  // Legacy props for backward compatibility
  category?: string;
  version?: string;
  loaders?: string;
}

/**
 * Process an addon to add parsed JSON fields
 */
function processAddon(addon: Addon): AddonWithParsedFields {
  const processed: AddonWithParsedFields = { ...addon };

  // If curseforge_raw or modrinth_raw are strings, parse them
  if (typeof processed.curseforge_raw === 'string' && processed.curseforge_raw.trim() !== '') {
    try {
      // Skip if the string is obviously not valid JSON
      const trimmed = processed.curseforge_raw.trim();
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        processed.curseforge_raw_parsed = null;
        return processed;
      }

      processed.curseforge_raw_parsed = JSON.parse(processed.curseforge_raw) as CurseForgeRawObject;
    } catch (e) {
      // Only log error if there's actual content that failed to parse
      if (processed.curseforge_raw.length > 0) {
        console.debug('Failed to parse curseforge_raw JSON', e);
      }
      processed.curseforge_raw_parsed = null;
    }
  } else {
    processed.curseforge_raw_parsed = null;
  }

  if (typeof processed.modrinth_raw === 'string' && processed.modrinth_raw.trim() !== '') {
    try {
      // Skip if the string is obviously not valid JSON
      const trimmed = processed.modrinth_raw.trim();
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        processed.modrinth_raw_parsed = null;
        return processed;
      }

      // Skip processing if JSON appears to be truncated (exactly 256 chars is suspicious)
      if (processed.modrinth_raw.length === 256) {
        console.debug('Skipping modrinth_raw parsing - appears to be truncated at 256 characters');
        processed.modrinth_raw_parsed = null;
        return processed;
      }

      // Check if the JSON string seems to be truncated
      if (processed.modrinth_raw.length > 0 && !trimmed.endsWith('}') && !trimmed.endsWith(']')) {
        console.debug('Modrinth JSON appears to be truncated:', {
          length: processed.modrinth_raw.length,
          ending: processed.modrinth_raw.slice(-20),
        });
        // Don't try to parse obviously truncated JSON
        processed.modrinth_raw_parsed = null;
        return processed;
      }

      processed.modrinth_raw_parsed = JSON.parse(processed.modrinth_raw) as ModrinthRawObject;
    } catch (e) {
      // Only log error if there's actual content that failed to parse
      if (processed.modrinth_raw.length > 0) {
        console.debug('Failed to parse modrinth_raw JSON in search:', {
          error: e,
          errorMessage: e instanceof Error ? e.message : 'Unknown error',
          jsonLength: processed.modrinth_raw.length,
          jsonStart: processed.modrinth_raw.substring(0, 50),
          jsonEnd: processed.modrinth_raw.substring(
            Math.max(0, processed.modrinth_raw.length - 50)
          ),
        });
      }
      processed.modrinth_raw_parsed = null;
    }
  } else {
    processed.modrinth_raw_parsed = null;
  }

  return processed;
}

/**
 * Hook to search for addons with filtering options
 *
 * @param props Search parameters
 * @returns Search results with pagination info
 */
export const useSearchAddons = ({
  query,
  page,
  filterString,
  sort,
  limit = 16,
  includeFacets = false,
  // Legacy props
  category,
  version,
  loaders,
}: SearchAddonsProps): SearchAddonResult => {
  const queryInput = query || '*'; // Default to '*' if query is empty

  // Build filter string - use provided filterString or fall back to legacy method
  const buildFilter = (): string => {
    if (filterString) {
      return filterString;
    }

    // Legacy filter building for backward compatibility
    const filters: string[] = [];

    const addFilter = (field: string, value?: string) => {
      if (value && value !== 'all' && value !== 'All') {
        const formattedValue = value.includes(' ') ? `"${value}"` : value;
        filters.push(`${field} = ${formattedValue}`);
      }
    };

    addFilter('loaders', loaders);
    addFilter('categories', category);
    addFilter('minecraft_versions', version);

    // Add additional filters if needed
    filters.push(`isValid = true`); // Ensure only valid addons are returned

    return filters.length > 0 ? filters.join(' AND ') : '';
  };

  // Convert sort option to Meilisearch sort format
  const getSortArray = (): string[] | undefined => {
    if (!sort || sort === 'relevance') return undefined;
    return [sort];
  };

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: [
      'searchAddons',
      queryInput,
      page,
      filterString || { category, version, loaders },
      sort,
      limit,
      includeFacets,
    ],
    queryFn: async () => {
      try {
        const index = searchClient.index('addons');

        const searchOptions: Record<string, unknown> = {
          limit,
          offset: (page - 1) * limit,
          filter: buildFilter(),
          sort: getSortArray(),
          attributesToHighlight: ['name', 'description'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
        };

        // Include facets if requested
        if (includeFacets) {
          searchOptions.facets = ['categories', 'loaders', 'minecraft_versions', 'authors'];
        }

        const result = (await index.search<Addon>(
          queryInput,
          searchOptions
        )) as SearchResponse<Addon>;

        return {
          hits: result.hits,
          totalHits: result.estimatedTotalHits ?? 0,
          facetDistribution: includeFacets ? result.facetDistribution : undefined,
        };
      } catch (error) {
        // Handle CORS or network errors gracefully
        console.warn('Search failed, returning empty results:', error);
        return {
          hits: [],
          totalHits: 0,
          facetDistribution: undefined,
        };
      }
    },
    retry: false, // Don't retry on CORS errors
  });

  // State to store hasNextPage
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // Update hasNextPage only when data is available
  useEffect(() => {
    if (data) {
      const newHasNextPage = (page - 1) * limit + (data.hits?.length || 0) < (data.totalHits || 0);
      setHasNextPage(newHasNextPage);
    }
  }, [data, page, limit]);

  // Process the addons to parse JSON fields if needed
  const processedAddons =
    data?.hits?.map((hit: Hit<Addon>) => processAddon((hit._formatted as Addon) || hit)) || [];

  // Return the search result with proper typing
  return {
    data: processedAddons,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    totalHits: data?.totalHits ?? 0,
    facetDistribution: data?.facetDistribution,
    page,
    limit,
  };
};
