import searchClient from '@/config/meilisearch';

import { useQuery } from '@tanstack/react-query';
import type {
  MeiliSchematicHits,
  MeiliSchematicResponse,
  Schematic,
  SearchSchematicResult,
  SearchSchematicsProps,
} from '@/types';

export const useSearchSchematics = ({
  query = '',
  page = 1,
  category = 'All',
  sub_categories = 'All',
  version = 'all',
  loaders = 'all',
  create_versions = 'All',
  id = 'all',
}: SearchSchematicsProps): SearchSchematicResult => {
  console.log('search triggered');
  if (query === '') {
    query = '*';
  }

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
      if (!searchClient) {
        return {
          schematics: [],
          totalPages: 0,
          currentPage: 1,
        };
      }
      const index = searchClient.index('schematics');
      const result = (await index.search(query, {
        limit: 20,
        offset: (page - 1) * 20,
        filter: filter(),
      })) as MeiliSchematicResponse;

      const hits: MeiliSchematicHits = result.hits;
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
