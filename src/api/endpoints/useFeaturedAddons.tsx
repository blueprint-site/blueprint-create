import { databases } from '@/config/appwrite';
import type { FeaturedAddon } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ID, Query } from 'appwrite';
import { toast } from '@/hooks/useToast';
import type { Models } from 'appwrite';

const DATABASE_ID = '67e6ec5c0032a90a14e6';
const COLLECTION_ID = '67ed41fb000467814396';

// Fetching only active addons
export const useFetchFeaturedAddons = () => {
  return useQuery<FeaturedAddon[]>({
    queryKey: ['featuredAddons'],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments<FeaturedAddon>(DATABASE_ID, COLLECTION_ID, [
          Query.equal('active', true),
          Query.orderAsc('display_order'),
        ]);
        return response.documents;
      } catch (err) {
        console.error('Error fetching featured addons:', err);
        throw new Error('Failed to fetch featured addons');
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetching all addons (featured and not featured made for admin panel)
export const useFetchAllFeaturedAddons = () => {
  return useQuery<FeaturedAddon[]>({
    queryKey: ['featuredAddons'],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments<FeaturedAddon>(DATABASE_ID, COLLECTION_ID, [
          Query.orderAsc('display_order'),
        ]);
        return response.documents;
      } catch (err) {
        console.error('Error fetching featured addons:', err);
        throw new Error('Failed to fetch featured addons');
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Creating a new featured addon
export const useCreateFeaturedAddon = () => {
  return useMutation({
    mutationFn: async (addon: FeaturedAddon) => {
      try {
        const response = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          addon
        );
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: 'Featured addon created',
        });
        return response;
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: 'Error creating featured addon',
        });
        console.error('Error creating featured addon:', error);
        throw error;
      }
    },
  });
};
type UpdateFeaturedAddonArgs = {
  id: string;
  addon: Partial<FeaturedAddon>;
};
// Update a featured addon
export const useUpdateFeaturedAddon = () => {
  return useMutation({
    mutationFn: async ({ id, addon }: UpdateFeaturedAddonArgs): Promise<Models.Document> => {
      try {
        const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, addon);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: 'Featured addon updated',
        });
        return response;
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: 'Error updating featured addon',
        });
        console.error('Error updating featured addon:', error);
        throw error;
      }
    },
  });
};

// Delete a featured addon
export const useDeleteFeaturedAddon = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: 'Featured addon deleted',
        });
        return response;
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: 'Error deleting featured addon',
        });
        console.error('Error deleting featured addon:', error);
        throw error;
      }
    },
  });
};
