// /src/api/endpoints/useSearchAddons.tsx
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch.ts';
import { Addon } from '@/types';
import { useState, useEffect } from 'react';

interface SearchAddonsResult {
  data: Addon[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  hasNextPage: boolean;
  totalHits: number;
  page: number;
  limit?: number;
}

interface MeilisearchResponse {
  hits: Addon[];
  estimatedTotalHits: number;
}

/**
 * Hook to search for addons with filtering options
 *
 * @param query Search query string
 * @param page Current page number (1-indexed)
 * @param category Category filter
 * @param version Minecraft version filter
 * @param loaders Mod loaders filter
 * @param limit Number of results per page
 * @returns Search results with pagination info
 */
export const useSearchAddons = (
  query: string,
  page: number,
  category: string,
  version: string,
  loaders: string,
  limit?: number
): SearchAddonsResult => {
  const queryInput = query || '*'; // Default to '*' if query is empty

  // Define filter logic for category, version, and loaders
  const filter = (): string => {
    const filters: string[] = [];

    const addFilter = (field: string, value: string) => {
      if (value && value !== 'all' && value !== 'All') {
        const formattedValue = value.includes(' ') ? `"${value}"` : value;
        filters.push(`${field} = ${formattedValue}`);
      }
    };

    addFilter('loaders', loaders);
    addFilter('categories', category);
    addFilter('minecraft_versions', version);

    // Add additional filters if needed
    filters.push(`isValid = 'true'`); // Ensure only valid addons are returned

    return filters.length > 0 ? filters.join(' AND ') : '';
  };

  const queryResult: UseQueryResult<MeilisearchResponse, Error> = useQuery({
    queryKey: ['searchAddons', queryInput, page, category, version, loaders, limit],
    queryFn: async (): Promise<MeilisearchResponse> => {
      const index = searchClient.index('addons');
      const result = await index.search(queryInput, {
        limit: limit ?? 16,
        offset: (page - 1) * (limit ?? 16),
        filter: filter(),
      });
      return {
        hits: result.hits as Addon[],
        estimatedTotalHits: result.estimatedTotalHits,
      };
    },
    enabled: true,
  });

  const { data, isLoading, isError, error, isFetching } = queryResult;

  // State to store hasNextPage
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // Update hasNextPage only when data is available
  useEffect(() => {
    if (data) {
      const newHasNextPage =
        (page - 1) * (limit ?? 16) + data.hits.length < data.estimatedTotalHits;
      setHasNextPage(newHasNextPage);
    }
  }, [data, page, limit]);

  return {
    data: data?.hits || [],
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    totalHits: data?.estimatedTotalHits ?? 0,
    page,
    limit,
  };
};
