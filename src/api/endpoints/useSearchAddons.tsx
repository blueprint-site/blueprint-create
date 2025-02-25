// /src/api/endpoints/useSearchAddons.tsx
import { useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch.ts';
import { Addon } from '@/schemas/addon.schema.tsx';
import { useState, useEffect } from 'react';

export const useSearchAddons = (
  query: string,
  page: number,
  category: string,
  version: string,
  loaders: string
) => {
  const queryInput = query || '*'; // Default to '*' if query is empty

  // Define filter logic for category, version, and loaders
  const filter = (): string => {
    const filters: string[] = [];

    const addFilter = (field: string, value: string) => {
      if (value && value !== 'all') {
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

  const queryResult = useQuery({
    queryKey: ['searchAddons', queryInput, page, category, version, loaders],
    queryFn: async () => {
      const index = searchClient.index('addons');
      const result = await index.search(queryInput, {
        limit: 16,
        offset: (page - 1) * 16,
        filter: filter(),
      });
      console.log('API Response:', result); // Debugging
      return {
        hits: result.hits as Addon[],
        totalHits: result.estimatedTotalHits,
      };
    },
    enabled: true,
  });

  const { data, isLoading, isError, error, isFetching } = queryResult;

  // State to store hasNextPage
  const [hasNextPage, setHasNextPage] = useState(false);

  // Update hasNextPage only when data is available
  useEffect(() => {
    if (data) {
      const newHasNextPage = (page - 1) * 16 + data.hits.length < data.totalHits;
      console.log('Updating hasNextPage:', newHasNextPage); // Debugging
      setHasNextPage(newHasNextPage);
    }
  }, [data, page]);

  return {
    ...queryResult,
    data: data?.hits || [],
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    totalHits: data?.totalHits || 0,
    page,
  };
};