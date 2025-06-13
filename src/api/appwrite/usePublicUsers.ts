/**
 * Hooks for fetching public user data for profile pages
 */

import { useQuery } from '@tanstack/react-query';
import { databases } from '@/config/appwrite.ts';
import { Query } from 'appwrite';

const DATABASE_ID = '67b1dc430020b4fb23e3';
const SCHEMATICS_COLLECTION_ID = '67b2310d00356b0cb53c';
const ADDONS_COLLECTION_ID = '67b1dc4b000762a0ccc6';

/**
 * Interface for public user data (limited fields for privacy)
 */
export interface PublicUser {
  $id: string;
  $createdAt: string;
  name: string;
  // Only include safe, public preferences
  prefs?: {
    avatar?: string;
    bio?: string;
  };
}

/**
 * Hook to fetch public user data by user ID
 */
export const usePublicUser = (userId?: string) => {
  return useQuery<PublicUser | null>({
    queryKey: ['publicUser', userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        // For now, we'll return null since we need to implement
        // public user profile data fetching
        console.warn('Public user fetching not implemented');
        return null;
      } catch (error) {
        console.error('Error fetching public user:', error);
        return null;
      }
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    retry: false,
  });
};

/**
 * Hook to fetch user schematics with public data
 * This is essentially the same as useFetchUserSchematics but with public context
 */
export const usePublicUserSchematics = (userId?: string) => {
  return useQuery({
    queryKey: ['publicUserSchematics', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const filters = [Query.equal('user_id', userId)];
        const response = await databases.listDocuments(
          DATABASE_ID,
          SCHEMATICS_COLLECTION_ID,
          filters
        );
        return response.documents;
      } catch (error) {
        console.error('Error fetching public user schematics:', error);
        return [];
      }
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

/**
 * Hook to fetch user addons with public data
 * Filters addons by user_id to show only the user's created addons
 */
export const usePublicUserAddons = (userId?: string) => {
  return useQuery({
    queryKey: ['publicUserAddons', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const filters = [Query.equal('user_id', userId)];
        const response = await databases.listDocuments(DATABASE_ID, ADDONS_COLLECTION_ID, filters);
        return response.documents;
      } catch (error) {
        console.error('Error fetching public user addons:', error);
        return [];
      }
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

/**
 * Hook to fetch user badges with public data
 * Note: This is a stub implementation - the badges collection structure
 * may need to be adjusted based on the actual implementation
 */
export const usePublicUserBadges = (userId?: string) => {
  return useQuery({
    queryKey: ['publicUserBadges', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const filters = [Query.equal('user_id', userId)];
        const response = await databases.listDocuments('main', 'badges', filters);
        return response.documents;
      } catch (error) {
        console.error('Error fetching public user badges:', error);
        return [];
      }
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
