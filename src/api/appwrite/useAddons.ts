import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks';
import { databases } from '@/config/appwrite';
import { Query } from 'appwrite';
import type { Addon, AddonWithParsedFields, CurseForgeRawObject, ModrinthRawObject } from '@/types';
import { UpdateAddonSchema } from '@/schemas/addon.schema';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'addons';

/**
 * Helper function to parse JSON strings from Appwrite
 * Used for fields stored as JSON strings like curseforge_raw and modrinth_raw
 */
function parseJsonField<T>(jsonString: string | null): T | null {
  if (!jsonString) return null;
  try {
    // Skip processing if JSON appears to be truncated (exactly 256 chars is suspicious)
    if (jsonString.length === 256) {
      console.warn(
        'parseJsonField: Skipping JSON parsing - appears to be truncated at 256 characters'
      );
      return null;
    }

    // Check if the JSON string seems to be truncated or malformed
    if (!jsonString.trim().endsWith('}') && !jsonString.trim().endsWith(']')) {
      console.warn('JSON appears to be truncated in parseJsonField:', {
        length: jsonString.length,
        ending: jsonString.slice(-20),
      });
      return null;
    }
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Failed to parse JSON in parseJsonField:', {
      error: e,
      errorMessage: e instanceof Error ? e.message : 'Unknown error',
      jsonLength: jsonString.length,
      jsonStart: jsonString.substring(0, 100),
      jsonEnd: jsonString.substring(jsonString.length - 100),
    });
    return null;
  }
}

/**
 * Adds parsed JSON fields to an Addon object
 */
function addParsedFields(addon: Addon): AddonWithParsedFields {
  const addonWithParsed: AddonWithParsedFields = { ...addon };

  if (addon.curseforge_raw) {
    // Handle case where curseforge_raw might already be an object or a string
    if (typeof addon.curseforge_raw === 'string') {
      addonWithParsed.curseforge_raw_parsed = parseJsonField<CurseForgeRawObject>(
        addon.curseforge_raw
      );
    } else {
      addonWithParsed.curseforge_raw_parsed = addon.curseforge_raw;
    }
  }

  if (addon.modrinth_raw) {
    // Handle case where modrinth_raw might already be an object or a string
    if (typeof addon.modrinth_raw === 'string') {
      addonWithParsed.modrinth_raw_parsed = parseJsonField<ModrinthRawObject>(addon.modrinth_raw);
    } else {
      addonWithParsed.modrinth_raw_parsed = addon.modrinth_raw;
    }
  }

  return addonWithParsed;
}

/**
 * Hook to fetch a single addon by ID
 * @param id The ID of the addon to fetch
 * @returns Query result with the addon data
 */
export const useFetchAddon = (id?: string) => {
  return useQuery<AddonWithParsedFields | null>({
    queryKey: ['addon', id],
    queryFn: async () => {
      if (!id) return null;

      try {
        // Using type parameter with getDocument for automatic type conversion
        const addon = await databases.getDocument<Addon>(DATABASE_ID, COLLECTION_ID, id);

        // Add the parsed fields to the addon object
        return addParsedFields(addon);
      } catch (error) {
        console.error('Error fetching addon:', error);
        throw error;
      }
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

/**
 * Hook to fetch a single addon by slug
 * @param slug The slug of the addon to fetch
 * @returns Query result with the addon data
 */
export const useFetchAddonBySlug = (slug?: string) => {
  return useQuery<AddonWithParsedFields | null>({
    queryKey: ['addon', 'slug', slug],
    queryFn: async () => {
      if (!slug) return null;

      try {
        const response = await databases.listDocuments<Addon>(DATABASE_ID, COLLECTION_ID, [
          Query.equal('slug', slug),
        ]);

        if (response.documents.length === 0) return null;

        const addon = response.documents[0];

        // Add the parsed fields to the addon object
        return addParsedFields(addon);
      } catch (error) {
        console.error('Error fetching addon by slug:', error);
        throw error;
      }
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

export const useFetchAllAddons = () => {
  return useQuery<AddonWithParsedFields[]>({
    queryKey: ['addons', 'all'],
    queryFn: async () => {
      const limit = 100;
      let offset = 0;
      let allAddons: AddonWithParsedFields[] = [];

      while (true) {
        const response = await databases.listDocuments<Addon>(DATABASE_ID, COLLECTION_ID, [
          Query.limit(limit),
          Query.offset(offset),
        ]);

        const parsed = response.documents.map((addon) => addParsedFields(addon));
        allAddons = [...allAddons, ...parsed];

        if (response.documents.length < limit) break;
        offset += limit;
      }

      return allAddons;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Optimized hook for admin addon management with efficient pagination
 * @param filters Object containing filter criteria (search, reviewStatus, etc.)
 * @param page Current page number (1-based)
 * @param limit Number of items per page
 */
export const useAdminAddons = (
  filters: {
    search?: string;
    reviewStatus?: 'all' | 'reviewed' | 'unreviewed' | 'unsorted';
    isValid?: boolean;
  } = {},
  page: number = 1,
  limit: number = 25
) => {
  return useQuery({
    queryKey: ['addons', 'admin', filters, page, limit],
    queryFn: async () => {
      const queries = [
        Query.limit(limit),
        Query.offset((page - 1) * limit),
        Query.orderDesc('$createdAt'), // Show newest first for admin review
      ];

      // Add filter queries based on criteria
      if (filters.reviewStatus === 'all') {
        // Show only approved/valid addons
        queries.push(Query.equal('isValid', true));
      } else if (filters.reviewStatus === 'reviewed') {
        queries.push(Query.equal('isChecked', true));
      } else if (filters.reviewStatus === 'unreviewed') {
        queries.push(Query.equal('isChecked', false));
      } else if (filters.reviewStatus === 'unsorted') {
        // Show addons that are not valid/approved (need sorting)
        queries.push(Query.equal('isValid', false));
      }

      if (filters.isValid !== undefined) {
        queries.push(Query.equal('isValid', filters.isValid));
      }

      // For search, we'll handle it client-side for now
      // In a real production app, you'd want server-side search with Meilisearch
      const response = await databases.listDocuments<Addon>(DATABASE_ID, COLLECTION_ID, queries);

      let addons = response.documents.map(addParsedFields);

      // Client-side search filtering
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        addons = addons.filter(
          (addon) =>
            addon.name.toLowerCase().includes(searchTerm) ||
            addon.author?.toLowerCase().includes(searchTerm) ||
            addon.description?.toLowerCase().includes(searchTerm)
        );
      }

      const totalPages = Math.ceil(response.total / limit);

      return {
        addons,
        total: response.total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        currentPage: page,
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter cache for admin data
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
};

/**
 * Hook to fetch paginated addons
 * @param page Current page number
 * @param limit Number of items per page
 * @returns Query result with addons and pagination data
 */
export const useFetchAddons = (page: number, limit: number = 10) => {
  return useQuery({
    queryKey: ['addons', 'list', page, limit],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments<Addon>(DATABASE_ID, COLLECTION_ID, [
          Query.limit(limit),
          Query.offset((page - 1) * limit),
        ]);

        const addons = response.documents.map(addParsedFields);
        const totalPages = Math.ceil(response.total / limit);

        return {
          addons,
          total: response.total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        };
      } catch (error) {
        console.error('Error fetching addons list:', error);
        throw new Error('Failed to fetch addons');
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to search addons globally across the entire database
 * @param searchTerm The search term to use
 * @param page Current page number (1-based)
 * @param limit Number of items per page
 */
export const useSearchAddons = (searchTerm: string, page: number = 1, limit: number = 25) => {
  return useQuery({
    queryKey: ['addons', 'search', searchTerm, page, limit],
    queryFn: async () => {
      try {
        const queries = [
          Query.limit(limit),
          Query.offset((page - 1) * limit),
          Query.orderDesc('$createdAt'),
        ];

        // Add search queries if search term is provided
        if (searchTerm.trim()) {
          // Search in name, description, and authors fields
          queries.push(
            Query.or([
              Query.search('name', searchTerm.trim()),
              Query.search('description', searchTerm.trim()),
              Query.search('authors', searchTerm.trim()),
            ])
          );
        }

        const response = await databases.listDocuments<Addon>(DATABASE_ID, COLLECTION_ID, queries);

        const addons = response.documents.map(addParsedFields);
        const totalPages = Math.ceil(response.total / limit);

        return {
          addons,
          total: response.total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
        };
      } catch (error) {
        console.error('Error searching addons:', error);
        throw new Error('Failed to search addons');
      }
    },
    enabled: searchTerm.trim().length > 0, // Only search if there's a search term
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
};

/**
 * Hook to update specific fields of an addon
 * @returns Mutation function for updating addon fields
 */
export const useUpdateAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ addonId, data }: { addonId: string; data: Partial<Addon> }) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { curseforge_raw, modrinth_raw, ...dataWithoutRaw } = data;
        const validationResult = UpdateAddonSchema.safeParse(dataWithoutRaw);

        if (!validationResult.success) {
          console.error('Validation error:', validationResult.error.format());
        }

        const updateData = { ...validationResult.data };

        return await databases.updateDocument<Addon>(
          DATABASE_ID,
          COLLECTION_ID,
          addonId,
          updateData
        );
      } catch (error) {
        console.error('Error updating addon:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['searchAddons'] });
    },
  });
};
/**
 * Hook to delete an addon
 * @returns Mutation function for deleting an addon
 */
export const useDeleteAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Addon deleted ✅',
        });
        return response;
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error deleting the addon ❌',
        });
        console.error('Error deleting addon:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['addons', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['searchAddons'] });
    },
  });
};
