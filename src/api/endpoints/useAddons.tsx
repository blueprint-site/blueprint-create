import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/useToast';
import { databases } from '@/config/appwrite';
import { Query } from 'appwrite';
import { Addon } from '@/types';

const DATABASE_ID = '67b1dc430020b4fb23e3';
const COLLECTION_ID = '67b1dc4b000762a0ccc6';

function tryParseJson(jsonString: string) {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (e) {
    console.error('Failed to parse JSON', e);
    return undefined;
  }
}

export const useFetchAddon = (id?: string) => {
  return useQuery<Addon | null>({
    queryKey: ['addon', id],
    queryFn: async () => {
      if (!id) return null;

      const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);

      const addonData: Addon = {
        $id: response.$id,
        name: response.name || '',
        downloads: response.downloads || '',
        description: response.description || '',
        slug: response.slug || '',
        author: response.author || '',
        categories: Array.isArray(response.categories) ? response.categories : [],
        icon: response.icon || '',
        created_at: response.created_at,
        updated_at: response.updated_at,
        curseforge_raw: response.curseforge_raw ? tryParseJson(response.curseforge_raw) : undefined,
        modrinth_raw: response.modrinth_raw ? tryParseJson(response.modrinth_raw) : undefined,
        sources: Array.isArray(response.sources) ? response.sources : [],
        loaders: Array.isArray(response.loaders) ? response.loaders : [],
        isValid: response.isValid || false,
        isChecked: response.isChecked || false,
        minecraft_versions: Array.isArray(response.minecraft_versions)
          ? response.minecraft_versions
          : [],
        create_versions: Array.isArray(response.create_versions) ? response.create_versions : [],
        claimed_by: response.claimed_by || '',
      };

      return addonData;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useFetchAddonBySlug = (slug?: string) => {
  return useQuery<Addon | null>({
    queryKey: ['addon', slug],
    queryFn: async () => {
      if (!slug) return null;

      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('slug', slug),
      ]);

      if (response.documents.length === 0) return null;

      const doc = response.documents[0];
      const addonData: Addon = {
        $id: doc.$id,
        name: doc.name || '',
        downloads: doc.downloads || '',
        description: doc.description || '',
        slug: doc.slug || '',
        author: doc.author || '',
        categories: Array.isArray(doc.categories) ? doc.categories : [],
        icon: doc.icon || '',
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        curseforge_raw: doc.curseforge_raw ? tryParseJson(doc.curseforge_raw) : undefined,
        modrinth_raw: doc.modrinth_raw ? tryParseJson(doc.modrinth_raw) : undefined,
        sources: Array.isArray(doc.sources) ? doc.sources : [],
        loaders: Array.isArray(doc.loaders) ? doc.loaders : [],
        isValid: doc.isValid || false,
        isChecked: doc.isChecked || false,
        minecraft_versions: Array.isArray(doc.minecraft_versions) ? doc.minecraft_versions : [],
        create_versions: Array.isArray(doc.create_versions) ? doc.create_versions : [],
        claimed_by: doc.claimed_by || '',
      };

      return addonData;
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useFetchAddons = (page: number, limit: number = 10) => {
  return useQuery<{
    addons: Addon[];
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>({
    queryKey: ['addons', page, limit],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.limit(limit),
          Query.offset((page - 1) * limit),
        ]);

        const addons: Addon[] = response.documents.map((doc) => ({
          $id: doc.$id,
          name: doc.name || '',
          downloads: doc.downloads || '',
          description: doc.description || '',
          slug: doc.slug || '',
          author: doc.author || '',
          categories: Array.isArray(doc.categories) ? doc.categories : [],
          icon: doc.icon || '',
          created_at: doc.created_at,
          updated_at: doc.updated_at,
          curseforge_raw: doc.curseforge_raw ? tryParseJson(doc.curseforge_raw) : undefined,
          modrinth_raw: doc.modrinth_raw ? tryParseJson(doc.modrinth_raw) : undefined,
          sources: Array.isArray(doc.sources) ? doc.sources : [],
          loaders: Array.isArray(doc.loaders) ? doc.loaders : [],
          isValid: doc.isValid || false,
          isChecked: doc.isChecked || false,
          minecraft_versions: Array.isArray(doc.minecraft_versions) ? doc.minecraft_versions : [],
          create_versions: Array.isArray(doc.create_versions) ? doc.create_versions : [],
          claimed_by: doc.claimed_by || '',
        }));

        return {
          addons,
          total: response.total,
          hasNextPage: page * limit < response.total,
          hasPreviousPage: page > 1,
        };
      } catch (err) {
        console.error('Error fetching addons:', err);
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
        return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, addonId, data);
      } catch (error) {
        console.error('Error updating addon:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
    },
  });
};

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
      queryClient.invalidateQueries({ queryKey: ['addons'] });
    },
  });
};
