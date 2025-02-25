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
    const filters: string[] 
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
    queryKey: ['searchSchematics', query, page, category, subCategory, version, loaders, id],
    queryFn: async () => {
      const index = searchClient.index('schematics');
      const result = await index.search(query, {
        limit: 20,
        offset: (page - 1) * 20,
        filter: filter(),
      });
      console.log(result);
      const schematicsList = result.hits as Schematic[]

      // Transform `Hits<SchematicsAnswer>` into `Schematic[]`
      const schematics: Schematic[] = schematicsList.map((hit) => ({
        $id: hit.$id, // Ensure this matches the property returned by Meilisearch
        $createdAt: hit.$createdAt,
        $updatedAt: hit.$updatedAt,
        title: hit.title,
        description: hit.description,
        schematic_url: hit.schematic_url,
        image_url: hit.image_url,
        authors: hit.authors,
        user_id: hit.user_id,
        downloads: hit.downloads,
        likes: hit.likes,
        game_versions: hit.game_versions,
        create_versions: hit.create_versions,
        modloaders: hit.modloaders,
        categories: hit.categories,
        slug: hit.slug,
      }));

      return {
        data: schematics,
        totalHits: result.estimatedTotalHits ?? 0,
      };
    },
    enabled: !!query,

  });

  const { data, isError, error, isPending, isLoading, isLoadingError } = queryResult;

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
    isError,
    error,
    isPending,
    isLoading,
    isLoadingError,
  }
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