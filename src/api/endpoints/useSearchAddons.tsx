import { useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch.ts';
import { Addon } from '@/schemas/addon.schema.tsx';

export const useSearchAddons = (
  query: string,
  page: number,
  category: string,
  version: string,
  loaders: string
) => {
  const queryInput = query || 'create';

  // Define filter logic for category and version
  const filter = () => {
    let filterQuery = '';

    // Loader filter logic
    if (loaders && loaders !== 'all') {
      filterQuery = `loaders = ${loaders}`;
    }

    // Category filter logic
    if (category && category !== 'all') {
      if (filterQuery) filterQuery += ' AND ';
      filterQuery += `categories = ${category}`;
    }

    // Version filter logic
    if (version && version !== 'all') {
      if (filterQuery) filterQuery += ' AND ';
      filterQuery += `minecraft_versions = ${version}`;
    }
    if (filterQuery) filterQuery += ' AND ';
    filterQuery += `isValid = 'true'`;
    console.log('query: ', filterQuery);
    return [filterQuery];
  };

  return useQuery({
    queryKey: ['searchAddons', queryInput, page, category, version, loaders],
    queryFn: async () => {
      const index = searchClient.index('addons');
      const result = await index.search(queryInput, {
        limit: 6,
        offset: (page - 1) * 6,
        filter: filter(),
      });
      return result.hits as Addon[];
    },
    enabled: !!queryInput,
  });
};
