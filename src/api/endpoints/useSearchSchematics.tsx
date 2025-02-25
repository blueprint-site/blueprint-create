import searchClient from "@/config/meilisearch";
import { SearchSchematicsProps, SearchSchematicsResult, Schematic } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export const useSearchSchematics = ({
  query = '',
  page = 1,
  category = 'All',
  subCategory = 'All',
  version = 'all',
  loaders = 'all',
  id = 'all',
}: SearchSchematicsProps): SearchSchematicsResult => {
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

    addFilter('modloaders', loaders);
    addFilter('categories', category);
    addFilter('subCategories', subCategory);
    addFilter('user_id', id);
    addFilter('game_versions', version);

    return filters.length > 0 ? filters.join(' AND ') : '';
  };

  const queryResult = useQuery({
    queryKey: ['searchSchematics', queryInput, page, category, subCategory, version, loaders, id],
    queryFn: async () => {
      const index = searchClient.index('schematics');
      const result = await index.search(queryInput, {
        limit: 16, // Match the limit in useSearchAddons
        offset: (page - 1) * 16, // Match the offset calculation
        filter: filter(),
      });
      console.log('API Response:', result); // Debugging
      return {
        hits: result.hits as Schematic[],
        totalHits: result.estimatedTotalHits,
      };
    },
    enabled: true, // Always enable the query
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
    hasPreviousPage: page > 1,
    totalHits: data?.totalHits || 0,
    page,
  };
};