import { useQuery } from '@tanstack/react-query';
import { databases } from '@/config/appwrite';
import { Query } from 'appwrite';

export interface PublicUser {
  $id: string;
  name: string;
  email?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  emailVerification: boolean;
  $createdAt: string;
  $updatedAt: string;
}

// Get user by ID (public information only)
export const useUser = (userId: string) => {
  return useQuery<PublicUser>({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      try {
        // Get user from account (this gives us basic user info)
        const response = await databases.listDocuments('main', 'users', [
          Query.equal('$id', userId),
        ]);

        if (response.documents.length === 0) {
          throw new Error('User not found');
        }

        const userDoc = response.documents[0];

        // Return public user information
        return {
          $id: userDoc.$id,
          name: userDoc.name || 'Anonymous User',
          username: userDoc.username || null,
          bio: userDoc.bio || null,
          avatar: userDoc.avatar || null,
          emailVerification: userDoc.emailVerification || false,
          $createdAt: userDoc.$createdAt,
          $updatedAt: userDoc.$updatedAt,
        } as PublicUser;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Search users by name or username
export const useSearchUsers = (searchTerm: string) => {
  return useQuery<PublicUser[]>({
    queryKey: ['searchUsers', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return [];
      }

      try {
        const response = await databases.listDocuments('main', 'users', [
          Query.or([Query.search('name', searchTerm), Query.search('username', searchTerm)]),
          Query.limit(20),
        ]);

        return response.documents.map((userDoc) => ({
          $id: userDoc.$id,
          name: userDoc.name || 'Anonymous User',
          username: userDoc.username || null,
          bio: userDoc.bio || null,
          avatar: userDoc.avatar || null,
          emailVerification: userDoc.emailVerification || false,
          $createdAt: userDoc.$createdAt,
          $updatedAt: userDoc.$updatedAt,
        })) as PublicUser[];
      } catch (error) {
        console.error('Error searching users:', error);
        return [];
      }
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};
