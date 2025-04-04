/**
 * Custom React Query hooks to interact with Appwrite's database for schematics data.
 *
 * - `useDeleteSchematics`: Handles the deletion of a schematic.
 * - `useFetchSchematic`: Fetches a single schematic based on the ID.
 * - `useFetchSchematics`: Fetches all schematics with optional filtering by categories.
 * - `useFetchUserSchematics`: Fetches schematics for a specific user by their `user_id`.
 * - `useIncrementDownloads`: Increments the download count of a schematic.
 * - `useIncrementLikes`: Increments the like count of a schematic.
 * - `useSaveSchematics`: Creates or updates a schematic document in the database.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/api';
import { databases, ID } from '@/config/appwrite.ts';
import { Query } from 'appwrite';
import type { Schematic } from '@/types';

// Appwrite database configuration
const DATABASE_ID = '67b1dc430020b4fb23e3';
const COLLECTION_ID = '67b2310d00356b0cb53c';

/**
 * Query hook to fetch a single schematic by its ID.
 */
export const useFetchSchematic = (id?: string) => {
  return useQuery<Schematic | null>({
    queryKey: ['schematics', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const response = await databases.getDocument<Schematic>(DATABASE_ID, COLLECTION_ID, id);

        return response;
      } catch (error) {
        console.error('Error fetching schematic:', error);
        return null;
      }
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

/**
 * Query hook to fetch all schematics with optional category filtering.
 */
export const useFetchSchematics = (categories?: string[]) => {
  return useQuery<Schematic[]>({
    queryKey: ['schematics', categories],
    queryFn: async () => {
      try {
        const filters = categories ? [Query.equal('categories', categories)] : [];

        const response = await databases.listDocuments<Schematic>(
          DATABASE_ID,
          COLLECTION_ID,
          filters
        );

        return response.documents;
      } catch (error) {
        console.error('Error fetching schematics:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

/**
 * Query hook to fetch schematics for a specific user.
 */
export const useFetchUserSchematics = (user_id?: string) => {
  return useQuery<Schematic[]>({
    queryKey: ['usersSchematics', user_id],
    queryFn: async () => {
      try {
        const filters = user_id ? [Query.equal('user_id', user_id)] : [];

        const response = await databases.listDocuments<Schematic>(
          DATABASE_ID,
          COLLECTION_ID,
          filters
        );

        return response.documents;
      } catch (error) {
        console.error('Error fetching user schematics:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

/**
 * Mutation hook to delete a schematic from the database.
 */
export const useDeleteSchematics = (user_id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Schematics deleted ✅',
        });

        return response;
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error deleting the Schematics ❌',
        });
        console.error('Error deleting Schematics:', error);

        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['usersSchematics', user_id] });
    },
  });
};

/**
 * Mutation hook to increment the download count for a schematic.
 */
export const useIncrementDownloads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log(id);
      try {
        // Fetch the current schematic data with proper typing
        const response = await databases.getDocument<Schematic>(DATABASE_ID, COLLECTION_ID, id);
        const updatedDownloads = (response.downloads || 0) + 1;

        // Mettre à jour le document avec le nombre de downloads incrémenté
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
          downloads: updatedDownloads,
        });

        toast({
          className: 'bg-surface-1 border-ring text-foreground',
          title: `✅ You have downloaded : ${response.title} ✅`,
        });
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error incrementing downloads ❌',
        });
        console.error('Error incrementing downloads:', error);
      }
    },
    onSuccess: () => {
      // Invalidating the query to refetch the list of schematics after the download increment
      queryClient.invalidateQueries({ queryKey: ['schematics'] }).then();
    },
  });
};

/**
 * Mutation hook to increment the like count for a schematic.
 */
export const useIncrementLikes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        // Fetch the current schematic data with proper typing
        const response = await databases.getDocument<Schematic>(DATABASE_ID, COLLECTION_ID, id);
        const updatedLikes = (response.likes || 0) + 1;

        // Mettre à jour le document avec le nombre de likes incrémenté
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
          likes: updatedLikes,
        });

        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Likes incremented ✅',
        });
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error incrementing likes ❌',
        });
        console.error('Error incrementing likes:', error);
      }
    },
    onSuccess: () => {
      // Invalidating the query to refetch the list of schematics after the like increment
      queryClient.invalidateQueries({ queryKey: ['schematics'] }).then();
    },
  });
};

/**
 * Mutation hook to create or update a schematic.
 */
export const useSaveSchematics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schematic: Partial<Schematic>) => {
      // If the schematic does not have an ID, create a new document
      if (!schematic.$id) {
        return databases.createDocument<Schematic>(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          schematic
        );
      }

      return databases.updateDocument<Schematic>(
        DATABASE_ID,
        COLLECTION_ID,
        schematic.$id,
        schematic
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schematics'] }).then();
    },
  });
};
