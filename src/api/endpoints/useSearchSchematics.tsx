import { useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch.ts';
import { Schematic, SearchSchematicsProps } from '@/types';
export const useSearchSchematics = ({
  query = '',
  page = 1,
  category = 'all',
  version = 'all',
  loaders = 'all',
  id = 'all',
}: SearchSchematicsProps) => {
  if (!query) {
    query = '*';
  }
  // Define filter logic for category and version
  const filter = () => {
    const filters = [];
    if (loaders && loaders !== 'all') {
      filters.push(`modloaders = ${loaders}`);
    }
    if (category && category !== 'all') {
      filters.push(`categories = ${category}`);
    }
    if (id && id !== 'all') {
      filters.push(`user_id = ${id}`);
    }
    if (version && version !== 'all') {
      filters.push(`game_versions = ${version}`);
    }
    console.log(filters);
    return filters.length > 0 ? filters.join(' AND ') : '';
  };

  return useQuery({
    queryKey: ['searchSchematics', query, page, category, version, loaders, id],
    queryFn: async () => {
      const index = searchClient.index('schematics');
      const result = await index.search(query, {
        limit: 6,
        offset: (page - 1) * 6,
        filter: filter(),
      });
      return result.hits as Schematic[];
    },
    enabled: !!query,
  });
};
