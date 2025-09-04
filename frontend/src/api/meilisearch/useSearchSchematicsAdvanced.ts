import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch';
import type { SchematicFilters } from '@/types/schematicFilters';
import type { SchematicSearchResult } from '@/types/schematicSearch';
import { buildSchematicFilterString, buildSchematicSortArray } from '@/utils/schematicFilterUtils';

interface SearchSchematicsParams {
  filters: SchematicFilters;
  page?: number;
  limit?: number;
  enableFacets?: boolean;
}

// SchematicSearchResult is now imported from types/schematicSearch.ts

interface SchematicSearchResponse {
  hits: SchematicSearchResult[];
  estimatedTotalHits: number;
  facetDistribution?: Record<string, Record<string, number>>;
  processingTimeMs: number;
  query: string;
  limit: number;
  offset: number;
}

/**
 * Hook for searching schematics with advanced filtering
 */
export const useSearchSchematicsAdvanced = ({
  filters,
  page = 1,
  limit = 20,
  enableFacets = true,
}: SearchSchematicsParams) => {
  return useQuery({
    queryKey: ['search-schematics-advanced', filters, page, limit],
    queryFn: async (): Promise<SchematicSearchResponse> => {
      if (!searchClient) {
        return {
          hits: [],
          estimatedTotalHits: 0,
          processingTimeMs: 0,
          query: filters.query || '',
          limit,
          offset: (page - 1) * limit,
          facetDistribution: {},
        };
      }
      const index = searchClient.index('schematics');

      const searchParams: Record<string, unknown> = {
        q: filters.query || '',
        filter: buildSchematicFilterString(filters),
        sort: buildSchematicSortArray(filters.sort),
        limit,
        offset: (page - 1) * limit,
        attributesToRetrieve: [
          '$id', // Appwrite document ID
          'title',
          'description',
          'slug',
          'authors', // Array of authors
          'author_display_name', // Single author name
          'image_urls', // Array of image URLs
          'dimensions_width',
          'dimensions_height',
          'dimensions_depth',
          'dimensions_blockCount',
          'categories',
          'subcategories',
          'sub_categories', // Alternative field name
          'materials_primary',
          'materials_hasModded',
          'complexity_level',
          'complexity_buildTime',
          'requirements_mods',
          'requirements_minecraftVersion',
          'requirements_hasRedstone',
          'requirements_hasCommandBlocks',
          'downloads',
          'rating',
          'uploadDate',
          'featured',
          'isValid',
          'user_id',
        ],
        attributesToHighlight: ['title', 'description'],
        attributesToCrop: ['description:200'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      };

      // Add facets if enabled - start with just one field to test
      if (enableFacets) {
        searchParams.facets = ['*']; // Try with wildcard first
      }

      try {
        console.log('Meilisearch search params:', JSON.stringify(searchParams, null, 2));
        const results = await index.search(filters.query, searchParams);

        if (results.hits[0]) {
          console.log('First document structure:');
          console.log(JSON.stringify(results.hits[0], null, 2));
        }

        console.log('Facet distribution received:');
        console.log(JSON.stringify(results.facetDistribution, null, 2));

        return {
          hits: results.hits as SchematicSearchResult[],
          estimatedTotalHits: results.estimatedTotalHits || 0,
          facetDistribution: enableFacets ? results.facetDistribution : undefined,
          processingTimeMs: results.processingTimeMs || 0,
          query: results.query || '',
          limit: results.limit || limit,
          offset: results.offset || 0,
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Meilisearch error details:', {
          message: errorMessage,
          error: error instanceof Error ? error : String(error),
        });

        // If facet request fails, try without facets
        if (errorMessage.includes('invalid_search_facets') && enableFacets) {
          console.warn('Facet search failed, retrying without facets:', errorMessage);
          const { ...paramsWithoutFacets } = searchParams;
          const fallbackResults = await index.search(filters.query, paramsWithoutFacets);

          return {
            hits: fallbackResults.hits as SchematicSearchResult[],
            estimatedTotalHits: fallbackResults.estimatedTotalHits || 0,
            facetDistribution: undefined,
            processingTimeMs: fallbackResults.processingTimeMs || 0,
            query: fallbackResults.query || '',
            limit: fallbackResults.limit || limit,
            offset: fallbackResults.offset || 0,
          };
        }
        throw error;
      }
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};

/**
 * Hook for infinite scrolling schematic search
 */
export const useSearchSchematicsInfinite = ({
  filters,
  limit = 20,
  enableFacets = false,
}: Omit<SearchSchematicsParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['search-schematics-infinite', filters, limit],
    queryFn: async ({ pageParam = 1 }): Promise<SchematicSearchResponse> => {
      if (!searchClient) {
        return {
          hits: [],
          estimatedTotalHits: 0,
          processingTimeMs: 0,
          query: filters.query || '',
          limit,
          offset: (pageParam - 1) * limit,
          facetDistribution: {},
        };
      }
      const index = searchClient.index('schematics');

      const searchParams: Record<string, unknown> = {
        q: filters.query || '',
        filter: buildSchematicFilterString(filters),
        sort: buildSchematicSortArray(filters.sort),
        limit,
        offset: (pageParam - 1) * limit,
        attributesToRetrieve: [
          '$id',
          'title',
          'description',
          'slug',
          'authors',
          'author_display_name',
          'image_urls',
          'dimensions_width',
          'dimensions_height',
          'dimensions_depth',
          'dimensions_blockCount',
          'categories',
          'subcategories',
          'downloads',
          'rating',
          'uploadDate',
          'featured',
          'user_id',
        ],
        attributesToHighlight: ['title', 'description'],
        attributesToCrop: ['description:150'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      };

      // Only get facets on first page for performance
      if (enableFacets && pageParam === 1) {
        searchParams.facets = ['*']; // Try with wildcard first
      }

      try {
        const results = await index.search(filters.query, searchParams);

        return {
          hits: results.hits as SchematicSearchResult[],
          estimatedTotalHits: results.estimatedTotalHits || 0,
          facetDistribution:
            enableFacets && pageParam === 1 ? results.facetDistribution : undefined,
          processingTimeMs: results.processingTimeMs || 0,
          query: results.query || '',
          limit: results.limit || limit,
          offset: results.offset || 0,
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Meilisearch infinite query error:', {
          message: errorMessage,
          error: error instanceof Error ? error : String(error),
        });

        // If facet request fails, try without facets
        if (errorMessage.includes('invalid_search_facets') && enableFacets) {
          console.warn(
            'Facet search failed in infinite query, retrying without facets:',
            errorMessage
          );
          const { ...paramsWithoutFacets } = searchParams;
          const fallbackResults = await index.search(filters.query, paramsWithoutFacets);

          return {
            hits: fallbackResults.hits as SchematicSearchResult[],
            estimatedTotalHits: fallbackResults.estimatedTotalHits || 0,
            facetDistribution: undefined,
            processingTimeMs: fallbackResults.processingTimeMs || 0,
            query: fallbackResults.query || '',
            limit: fallbackResults.limit || limit,
            offset: fallbackResults.offset || 0,
          };
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage, pages) => {
      const totalPages = Math.ceil(lastPage.estimatedTotalHits / limit);
      const currentPage = pages.length;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    initialPageParam: 1,
  });
};

/**
 * Hook for getting schematic suggestions based on partial input
 */
export const useSchematicSuggestions = (query: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['schematic-suggestions', query, limit],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      if (!searchClient) return [];

      const index = searchClient.index('schematics');

      const results = await index.search(query, {
        limit,
        attributesToRetrieve: ['id', 'title', 'thumbnail', 'categories'],
        attributesToHighlight: ['title'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      });

      return results.hits;
    },
    enabled: query.length >= 2,
    staleTime: 60 * 1000, // Cache for 1 minute
  });
};

/**
 * Hook for getting featured schematics
 */
export const useFeaturedSchematics = (limit: number = 6) => {
  return useQuery({
    queryKey: ['featured-schematics', limit],
    queryFn: async () => {
      if (!searchClient) return [];
      const index = searchClient.index('schematics');

      const results = await index.search('', {
        // filter: 'featured = true AND isValid = true', // Uncomment when fields exist in Meilisearch
        filter: '', // Temporarily show all until Meilisearch documents have these fields
        sort: ['downloads:desc'],
        limit,
        attributesToRetrieve: [
          'id',
          'title',
          'description',
          'slug',
          'author',
          'thumbnail',
          'dimensions',
          'categories',
          'downloads',
          'rating',
        ],
      });

      return results.hits as SchematicSearchResult[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for getting popular schematics by category
 */
export const usePopularSchematicsByCategory = (category: string, limit: number = 4) => {
  return useQuery({
    queryKey: ['popular-schematics-category', category, limit],
    queryFn: async () => {
      if (!searchClient) return [];
      const index = searchClient.index('schematics');

      const results = await index.search('', {
        filter: `categories = "${category}"`, // Removed isValid until field exists in Meilisearch
        sort: ['downloads:desc'],
        limit,
        attributesToRetrieve: [
          'id',
          'title',
          'slug',
          'author',
          'thumbnail',
          'dimensions',
          'downloads',
        ],
      });

      return results.hits as SchematicSearchResult[];
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for getting similar schematics
 */
export const useSimilarSchematics = (
  schematicId: string,
  categories: string[],
  limit: number = 6
) => {
  return useQuery({
    queryKey: ['similar-schematics', schematicId, categories, limit],
    queryFn: async () => {
      if (!categories || categories.length === 0) return [];
      if (!searchClient) return [];

      const index = searchClient.index('schematics');

      const categoryFilter = categories.map((cat) => `categories = "${cat}"`).join(' OR ');

      const results = await index.search('', {
        filter: `(${categoryFilter}) AND id != "${schematicId}"`, // Removed isValid until field exists
        sort: ['downloads:desc'],
        limit,
        attributesToRetrieve: [
          'id',
          'title',
          'slug',
          'author',
          'thumbnail',
          'dimensions',
          'downloads',
          'rating',
        ],
      });

      return results.hits as SchematicSearchResult[];
    },
    enabled: !!schematicId && categories.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
