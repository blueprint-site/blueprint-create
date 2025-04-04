import { databases } from '@/config/appwrite';
import type { FeaturedAddon } from '@/types';
import { FeaturedAddonSchema } from '@/schemas/featuredAddon.schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ID, Query } from 'appwrite';

const DATABASE_ID = '67ed41fb000467814396';
const COLLECTION_ID = 'featured_addons';

// Fetching only active addons
export const useFetchFeaturedAddons = () => {
  return useQuery<FeaturedAddon[]>({
    queryKey: ['featuredAddons'],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.equal('active', true),
          Query.orderAsc('display_order'),
        ]);

        return response.documents.map((document) => FeaturedAddonSchema.parse(document));
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
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.orderAsc('display_order'),
        ]);

        return response.documents.map((document) => FeaturedAddonSchema.parse(document));
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
        return response;
      } catch (error) {
        console.error('Error creating featured addon:', error);
        throw error;
      }
    },
  });
};

// Update a featured addon
export const useUpdateFeaturedAddon = () => {
  return useMutation({
    mutationFn: async (addon: FeaturedAddon) => {
      try {
        const response = await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          addon.$id,
          addon
        );
        return response;
      } catch (error) {
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
        return response;
      } catch (error) {
        console.error('Error deleting featured addon:', error);
        throw error;
      }
    },
  });
};
