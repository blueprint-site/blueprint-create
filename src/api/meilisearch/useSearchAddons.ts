// /src/api/endpoints/useSearchAddons.tsx
import { useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch.ts';
import { useState, useEffect } from 'react';
import type {
  Addon,
  AddonWithParsedFields,
  CurseForgeRawObject,
  ModrinthRawObject,
  SearchAddonResult,
  MeiliAddonResponse,
} from '@/types';

interface SearchAddonsProps {
  query: string;
  page: number;
  category?: string;
  version?: string;
  loaders?: string;
  limit?: number;
}

/**
 * Process an addon to add parsed JSON fields
 */
function processAddon(addon: Addon): AddonWithParsedFields {
  const processed: AddonWithParsedFields = { ...addon };

  // If curseforge_raw or modrinth_raw are strings, parse them
  if (typeof processed.curseforge_raw === 'string') {
    try {
      processed.curseforge_raw_parsed = JSON.parse(processed.curseforge_raw) as CurseForgeRawObject;
    } catch (e) {
      console.error('Failed to parse curseforge_raw JSON', e);
      processed.curseforge_raw_parsed = null;
    }
  }

  if (typeof processed.modrinth_raw === 'string') {
    try {
      // Skip processing if JSON appears to be truncated (exactly 256 chars is suspicious)
      if (processed.modrinth_raw.length === 256) {
        console.warn('Skipping modrinth_raw parsing - appears to be truncated at 256 characters');
        processed.modrinth_raw_parsed = null;
        return processed;
      }

      // Check if the JSON string seems to be truncated
      if (
        processed.modrinth_raw.length > 0 &&
        !processed.modrinth_raw.trim().endsWith('}') &&
        !processed.modrinth_raw.trim().endsWith(']')
      ) {
        console.warn('Modrinth JSON appears to be truncated:', {
          length: processed.modrinth_raw.length,
          ending: processed.modrinth_raw.slice(-20),
        });
        // Don't try to parse obviously truncated JSON
        processed.modrinth_raw_parsed = null;
        return processed;
      }

      processed.modrinth_raw_parsed = JSON.parse(processed.modrinth_raw) as ModrinthRawObject;
    } catch (e) {
      console.error('Failed to parse modrinth_raw JSON in search:', {
        error: e,
        errorMessage: e instanceof Error ? e.message : 'Unknown error',
        jsonLength: processed.modrinth_raw.length,
        jsonStart: processed.modrinth_raw.substring(0, 100),
        jsonEnd: processed.modrinth_raw.substring(processed.modrinth_raw.length - 100),
      });
      processed.modrinth_raw_parsed = null;
    }
  }

  return processed;
}

/**
 * Hook to search for addons with filtering options
 *
 * @param props Search parameters
 * @returns Search results with pagination info
 */
export const useSearchAddons = ({
  query,
  page,
  category,
  version,
  loaders,
  limit = 16,
}: SearchAddonsProps): SearchAddonResult => {
  const queryInput = query || '*'; // Default to '*' if query is empty

  // Define filter logic for category, version, and loaders
  const buildFilter = (): string => {
    const filters: string[] = [];

    const addFilter = (field: string, value?: string) => {
      if (value && value !== 'all' && value !== 'All') {
        const formattedValue = value.includes(' ') ? `"${value}"` : value;
        filters.push(`${field} = ${formattedValue}`);
      }
    };

    addFilter('loaders', loaders);
    addFilter('categories', category);
    addFilter('minecraft_versions', version);

    // Add additional filters if needed
    filters.push(`isValid = true`); // Ensure only valid addons are returned

    return filters.length > 0 ? filters.join(' AND ') : '';
  };

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['searchAddons', queryInput, page, category, version, loaders, limit],
    queryFn: async () => {
      const index = searchClient.index('addons');

      // Use the MeiliAddonResponse type to ensure proper typing
      const result = (await index.search(queryInput, {
        limit,
        offset: (page - 1) * limit,
        filter: buildFilter(),
      })) as MeiliAddonResponse;

      return {
        hits: result.hits,
        totalHits: result.estimatedTotalHits ?? 0,
      };
    },
  });

  // State to store hasNextPage
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // Update hasNextPage only when data is available
  useEffect(() => {
    if (data) {
      const newHasNextPage = (page - 1) * limit + (data.hits?.length || 0) < (data.totalHits || 0);
      setHasNextPage(newHasNextPage);
    }
  }, [data, page, limit]);

  // Process the addons to parse JSON fields if needed
  const processedAddons = data?.hits?.map(processAddon) || [];

  // Return the search result with proper typing
  return {
    data: processedAddons,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    totalHits: data?.totalHits ?? 0,
    page,
    limit,
  };
};
