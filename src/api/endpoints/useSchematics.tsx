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
import { Schematic } from '@/types';

// Appwrite database configuration
const DATABASE_ID = '67b1dc430020b4fb23e3';
const COLLECTION_ID = '67b2310d00356b0cb53c';

/**
 * Mutation hook to delete a schematic from the database.
 */
export const useDeleteSchematics = (user_id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Schematics deleted ✅',
        });
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error deleting the Schematics ❌',
        });
        console.error('Error deleting Schematics:', error);
      }
    },
    onSuccess: async () => {
      // ⚡️ Invalidation spécifique aux schémas utilisateur
      await queryClient.invalidateQueries({ queryKey: ['usersSchematics', user_id] });
    },
  });
};

/**
 * Query hook to fetch a single schematic by its ID.
 */
export const useFetchSchematic = (id?: string) => {
  return useQuery<Schematic | null>({
    queryKey: ['schematics', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('$id', id),
      ]);

      if (response.documents.length === 0) return null;

      const doc = response.documents[0];
      console.log(doc);
      const schematicData: Schematic = {
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
        title: doc.title,
        description: doc.description || '',
        schematic_url: doc.schematic_url || '',
        likes: doc.likes || 0,
        downloads: doc.downloads || 0,
        image_url: doc.image_url || '',
        authors: Array.isArray(doc.authors) ? doc.authors : [],
        user_id: doc.user_id || '',
        game_versions: Array.isArray(doc.game_versions) ? doc.game_versions : [],
        modloaders: Array.isArray(doc.game_versions) ? doc.game_versions : [],
        slug: doc.slug || '',
        create_versions: Array.isArray(doc.create_versions) ? doc.create_versions : [],
        categories: Array.isArray(doc.categories) ? doc.categories : [],
        status: doc.status || 'draft',
      };

      return schematicData;
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
      const filters = categories ? [Query.equal('schematics', categories)] : [];

      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, filters);

      const schematics: Schematic[] = response.documents.map((doc) => ({
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
        title: doc.title,
        description: doc.description || '',
        schematic_url: doc.schematic_url || '',
        image_url: doc.image_url || '',
        downloads: doc.downloads || 0,
        likes: doc.likes || 0,
        authors: Array.isArray(doc.authors) ? doc.authors : [],
        user_id: doc.user_id || '',
        game_versions: Array.isArray(doc.game_versions) ? doc.game_versions : [],
        modloaders: Array.isArray(doc.game_versions) ? doc.game_versions : [],
        slug: doc.slug || '',
        create_versions: Array.isArray(doc.create_versions) ? doc.create_versions : [],
        categories: Array.isArray(doc.categories) ? doc.categories : [],
        status: doc.status || 'draft',
      }));

      return schematics;
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
      const filters = user_id ? [Query.equal('user_id', user_id)] : [];

      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, filters);

      const schematics: Schematic[] = response.documents.map((doc) => ({
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
        title: doc.title,
        description: doc.description || '',
        schematic_url: doc.schematic_url || '',
        image_url: doc.image_url || '',
        downloads: doc.downloads || 0,
        likes: doc.likes || 0,
        authors: Array.isArray(doc.authors) ? doc.authors : [],
        user_id: doc.user_id || '',
        game_versions: Array.isArray(doc.game_versions) ? doc.game_versions : [],
        modloaders: Array.isArray(doc.game_versions) ? doc.game_versions : [],
        slug: doc.slug || '',
        create_versions: Array.isArray(doc.create_versions) ? doc.create_versions : [],
        categories: Array.isArray(doc.categories) ? doc.categories : [],
        status: doc.status || 'draft',
      }));

      return schematics;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
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
        // Récupérer les données actuelles du schématique
        const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
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
        // Récupérer les données actuelles du schématique
        const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
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
      const serializedSchematics = {
        ...schematic,
        authors: schematic.authors ? JSON.stringify(schematic.authors) : undefined,
        game_versions: schematic.game_versions
          ? JSON.stringify(schematic.game_versions)
          : undefined,
        create_versions: schematic.create_versions
          ? JSON.stringify(schematic.create_versions)
          : undefined,
        modloaders: schematic.modloaders ? JSON.stringify(schematic.modloaders) : undefined,
        categories: schematic.categories ? JSON.stringify(schematic.categories) : undefined,
      };

      if (!schematic.$id) {
        return databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          serializedSchematics
        );
      }

      return databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        schematic.$id,
        serializedSchematics
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schematics'] }).then();
    },
  });
};
