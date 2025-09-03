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
import { toast } from '@/hooks';
import { databases, ID, storage } from '@/config/appwrite.ts';
import { Query } from 'appwrite';
import type { Models } from 'appwrite';
import type { Schematic } from '@/types';
import { createSchematicSchema, updateSchematicSchema } from '@/schemas/schematic.schema';
import { extractSchematicFiles } from '@/utils/extractFileIdFromUrl';

// Appwrite database configuration
const DATABASE_ID = 'main';
const COLLECTION_ID = 'schematics';

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
        // First, fetch the schematic to get file references
        const schematic = await databases.getDocument<Schematic>(DATABASE_ID, COLLECTION_ID, id);
        
        // Extract all file references from the schematic
        const filesToDelete = extractSchematicFiles(schematic);
        
        console.log(`Deleting schematic ${id} with ${filesToDelete.length} associated files`);
        
        // Delete all associated files
        const deletePromises = filesToDelete.map(async ({ bucketId, fileId }) => {
          try {
            await storage.deleteFile(bucketId, fileId);
            console.log(`Deleted file ${fileId} from bucket ${bucketId}`);
          } catch (error) {
            console.error(`Failed to delete file ${fileId} from bucket ${bucketId}:`, error);
            // Continue with deletion even if some files fail
          }
        });
        
        await Promise.allSettled(deletePromises);
        
        // Now delete the schematic document
        const response = await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Schematic and associated files deleted ✅',
        });

        return response;
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error deleting the Schematic ❌',
        });
        console.error('Error deleting Schematic:', error);

        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['usersSchematics', user_id] });
      await queryClient.invalidateQueries({ queryKey: ['schematics'] });
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
      try {
        // If creating a new schematic
        if (!schematic.$id) {
          // Validate the data against the creation schema
          const validationResult = createSchematicSchema.safeParse(schematic);

          if (!validationResult.success) {
            console.error('Validation failed:', validationResult.error.format());
            throw new Error('Invalid schematic data for creation');
          }

          const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            $id,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            $collectionId,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            $databaseId,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            $createdAt,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            $updatedAt,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            $permissions,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            $sequence,
            ...createData
          } = schematic;
          return databases.createDocument<Schematic>(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            createData as Omit<Schematic, keyof Models.Document>
          );
        }

        // If updating an existing schematic
        // Validate the data against the update schema
        const validationResult = updateSchematicSchema.safeParse(schematic);

        if (!validationResult.success) {
          console.error('Validation failed:', validationResult.error.format());
          throw new Error('Invalid schematic data for update');
        }

        return databases.updateDocument<Schematic>(
          DATABASE_ID,
          COLLECTION_ID,
          schematic.$id,
          schematic
        );
      } catch (error) {
        // Handle and possibly transform errors
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to save schematic');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schematics'] }).then();
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
          title: `✅ You have downloaded: ${response.title} ✅`,
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
