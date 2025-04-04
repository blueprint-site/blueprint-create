import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/useToast';
import { databases } from '@/config/appwrite';
import { Query } from 'appwrite';
import type { Addon } from '@/types/appwrite';
import type { AddonWithParsedFields } from '@/types/addons/addon-details';
import type { CurseForgeRawObject } from '@/types/addons/curseforge';
import type { ModrinthRawObject } from '@/types/addons/modrinth';

const DATABASE_ID = '67b1dc430020b4fb23e3';
const COLLECTION_ID = '67b1dc4b000762a0ccc6';

/**
 * Helper function to parse JSON strings from Appwrite
 * Used for fields stored as JSON strings like curseforge_raw and modrinth_raw
 */
function parseJsonField<T>(jsonString: string | null): T | null {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Failed to parse JSON', e);
    return null;
  }
}

/**
 * Adds parsed JSON fields to an Addon object
 */
function addParsedFields(addon: Addon): AddonWithParsedFields {
  const addonWithParsed: AddonWithParsedFields = { ...addon };

  if (addon.curseforge_raw) {
    addonWithParsed.curseforge_raw_parsed = parseJsonField<CurseForgeRawObject>(
      addon.curseforge_raw
    );
  }

  if (addon.modrinth_raw) {
    addonWithParsed.modrinth_raw_parsed = parseJsonField<ModrinthRawObject>(addon.modrinth_raw);
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

/**
 * Hook to fetch paginated addons
 * @param page Current page number
 * @param limit Number of items per page
 * @returns Query result with addons and pagination data
 */
export const useFetchAddons = (page: number, limit: number = 10) => {
  return useQuery<{
    addons: AddonWithParsedFields[];
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>({
    queryKey: ['addons', 'list', page, limit],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments<Addon>(DATABASE_ID, COLLECTION_ID, [
          Query.limit(limit),
          Query.offset((page - 1) * limit),
        ]);

        // Process JSON fields for each addon
        const addons = response.documents.map((addon) => addParsedFields(addon));

        return {
          addons,
          total: response.total,
          hasNextPage: page * limit < response.total,
          hasPreviousPage: page > 1,
        };
      } catch (error) {
        console.error('Error fetching addons list:', error);
        throw new Error('Failed to fetch addons');
      }
    },
    retry: 2,
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
        // Handle JSON fields that need to be stringified
        const updateData = { ...data };

        // If raw data is provided as an object, stringify it
        if (updateData.curseforge_raw && typeof updateData.curseforge_raw === 'object') {
          updateData.curseforge_raw = JSON.stringify(updateData.curseforge_raw);
        }

        if (updateData.modrinth_raw && typeof updateData.modrinth_raw === 'object') {
          updateData.modrinth_raw = JSON.stringify(updateData.modrinth_raw);
        }

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
    onSuccess: (_, variables) => {
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: ['addon', variables.addonId] });
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
