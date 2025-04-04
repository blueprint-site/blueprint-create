import searchClient from '@/config/meilisearch';

import { useQuery } from '@tanstack/react-query';
import type { SearchSchematicsProps, SearchSchematicsResult } from '@/types';
import type { Schematic } from '@/types/appwrite';
import type { MeiliSchematicResponse, MeiliSchematicHits } from '@/types/meilisearch';

export const useSearchSchematics = ({
  query = '',
  page = 1,
  category = 'All',
  sub_categories = 'All',
  version = 'all',
  loaders = 'all',
  create_versions = 'All',
  id = 'all',
}: SearchSchematicsProps): SearchSchematicsResult => {
  console.log('search triggered');
  if (query === '') {
    query = '*';
  }
  // Define filter logic for category, version, and loaders
  const filter = (): string => {
    const filters: string[] = [];
    const addFilter = (field: string, value: string) => {
      if (value && value !== 'all' && value !== 'All') {
        const formattedValue = value.includes(' ') ? `"${value}"` : value;
        filters.push(`${field} = ${formattedValue}`);
      }
    };

    addFilter('modloaders', loaders);
    addFilter('categories', category);
    addFilter('subCategories', sub_categories);
    addFilter('user_id', id);
    addFilter('game_versions', version);
    addFilter('create_versions', create_versions);

    return filters.length > 0 ? filters.join(' AND ') : '';
  };
  const queryResult = useQuery({
    queryKey: [
      'searchSchematics',
      query,
      page,
      category,
      sub_categories,
      version,
      loaders,
      create_versions,
      id,
    ],
    queryFn: async () => {
      const index = searchClient.index('schematics');
      // Fetch raw results from Meilisearch with proper typing
      const result = (await index.search(query, {
        limit: 20,
        offset: (page - 1) * 20,
        filter: filter(),
      })) as MeiliSchematicResponse;

      // Access the hits with proper typing
      const hits: MeiliSchematicHits = result.hits;

      // Since Meilisearch already returns data in the Appwrite format,
      // we can use the hits directly as Schematics with minimal transformation
      // Convert to Schematic array, ensuring type safety without explicit 'any'
      const schematics: Schematic[] = Array.isArray(hits) ? hits : [];

      return {
        data: schematics,
        totalHits: result.estimatedTotalHits ?? 0,
      };
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!query,
  });

  const { data, isLoading, isError, error, isFetching } = queryResult;

  // `data` is now an array of Schematic objects
  const schematics = data?.data ?? [];

  const totalHits = data?.totalHits ?? 0;
  const hasNextPage = (page - 1) * 20 + schematics.length < totalHits;
  const hasPreviousPage = page > 1;

  return {
    ...queryResult,
    data: schematics,
    hasNextPage,
    hasPreviousPage,
    totalHits,
    page,
    isLoading,
    isError,
    error,
    isFetching,
  };
};
