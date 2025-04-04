import { useQuery } from '@tanstack/react-query';
import type { Blog, RawBlog, MeiliSearchResult } from '@/types';
import { parseJsonFields } from '../utils/json-fields';

/**
 * Hook to search blogs via Meilisearch.
 */
export const useSearchBlogs = (query: string) => {
  return useQuery<MeiliSearchResult<Blog>>({
    queryKey: ['search-blogs', query],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const rawData = await response.json();

        // Parse JSON fields in each hit
        const parsedData = {
          ...rawData,
          hits: rawData.hits.map((hit: RawBlog) => parseJsonFields(hit)),
        };

        return parsedData;
      } catch (error) {
        console.error('Error searching blogs:', error);
        return {
          hits: [],
          estimatedTotalHits: 0,
          processingTimeMs: 0,
          query,
        };
      }
    },
    enabled: Boolean(query),
  });
};
