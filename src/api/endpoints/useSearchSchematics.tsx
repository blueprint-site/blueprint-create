import { useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch.ts';
import { Schematic, SearchSchematicsProps } from '@/types';

/**
 * @description Custom hook for searching schematics using Meilisearch.
 *
 * @param {SearchSchematicsProps} { query, page, category, subCategory, version, loaders, id } - Search parameters.
 * @returns {object} An object containing search results, loading states, and pagination information.
 */
export const useSearchSchematics = ({
                                      query = '',
                                      page = 1,
                                      category = 'All',
                                      subCategory = 'All',
                                      version = 'all',
                                      loaders = 'all',
                                      id = 'all',
                                    }: SearchSchematicsProps): object => {
  // If no query is provided, default to a wildcard search ('*').
  if (!query) {
    query = '*';
  }

  /**
   * @description Generates a filter string for Meilisearch based on the provided search parameters.
   * @returns {string} A filter string to be used in the Meilisearch query.
   */
  const filter = (): string => {
    const filters: string[] = [];

    /**
     * @description Adds a filter condition to the filters array if the value is valid.
     * @param {string} field - The field to filter on.
     * @param {string} value - The value to filter by.
     */
    const addFilter = (field: string, value: string) => {
      if (value && value !== 'all' && value !== 'All') {
        // Enclose the value in quotes if it contains spaces.
        const formattedValue = value.includes(' ') ? `"${value}"` : value;
        filters.push(`${field} = ${formattedValue}`);
      }
    };

    addFilter('modloaders', loaders);
    addFilter('categories', category);
    addFilter('subCategories', subCategory);
    addFilter('user_id', id);
    addFilter('game_versions', version);

    console.log(filters);
    return filters.length > 0 ? filters.join(' AND ') : '';
  };

  // Use TanStack Query to manage the search query.
  const queryResult = useQuery({
    queryKey: ['searchSchematics', query, page, category, subCategory, version, loaders, id], // Unique key for the query.  Changes to these values will trigger a refetch.
    queryFn: async () => {
      // Function to execute the actual search.
      const index = searchClient.index('schematics'); // Get the Meilisearch index.
      const result = await index.search(query, {
        limit: 20, // Number of results per page.
        offset: (page - 1) * 20, // Offset based on the current page.
        filter: filter(), // Apply the generated filter.
      });
      return {
        hits: result.hits as Schematic[], // Cast hits to Schematic type.
        totalHits: result.estimatedTotalHits, // Total number of hits (estimated).
      };
    },
    enabled: !!query, // Disable the query if there is no search query.
  });

  // Extract data and loading/error states from the useQuery result.
  const { data, isLoading, isError, error, isFetching } = queryResult;

  // Determine if there is a next page based on the number of hits and the total number of hits.
  const hasNextPage = data ? (page - 1) * 20 + data.hits.length < data.totalHits : false;
  // Determine if there is a previous page (if the current page is greater than 1).
  const hasPreviousPage = page > 1;

  // Return an object containing the search results, loading states, and pagination information.
  return {
    ...queryResult, // Spread existing properties from useQuery (e.g., refetch, status).
    data: data?.hits || [], // Return only the hits array for easier usage.  If data is null, return an empty array.
    isLoading, // Boolean indicating if the query is currently loading.
    isError, // Boolean indicating if the query resulted in an error.
    error, // The error object, if any.
    isFetching, // Boolean indicating if the query is currently fetching (including background updates).
    hasNextPage, // Boolean indicating if there is a next page.
    hasPreviousPage, // Boolean indicating if there is a previous page.
    totalHits: data?.totalHits || 0, // Total number of hits.  If data is null, return 0.
    page, // The current page number.
  };
};
