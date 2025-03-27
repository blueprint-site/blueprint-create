import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  ModrinthProject,
  ModrinthVersionsResponse,
  ModrinthDependenciesResponse,
  ModrinthUser,
  ModrinthUserProjects,
} from '@/types/addons/modrinth';

/**
 * Custom hook to fetch a project from Modrinth
 * @param projectIdOrSlug The project ID or slug to fetch
 * @returns Query result with typed project data
 */
export const useFetchModrinthProject = (
  projectIdOrSlug?: string
): UseQueryResult<ModrinthProject | null, Error> => {
  return useQuery({
    queryKey: ['modrinth', 'project', projectIdOrSlug],
    queryFn: async () => {
      if (!projectIdOrSlug) return null;

      try {
        const response = await fetch(`https://api.modrinth.com/v2/project/${projectIdOrSlug}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status}`);
        }

        const data: ModrinthProject = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Modrinth project:', error);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: Boolean(projectIdOrSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Custom hook to fetch version dependencies from Modrinth
 * Uses the /project/{id|slug}/dependencies endpoint
 * @param projectIdOrSlug The project ID or slug to fetch dependencies for
 * @returns Query result with typed dependency data
 */
export const useFetchModrinthDependencies = (
  projectIdOrSlug?: string
): UseQueryResult<ModrinthDependenciesResponse | null, Error> => {
  return useQuery({
    queryKey: ['modrinth', 'dependencies', projectIdOrSlug],
    queryFn: async () => {
      if (!projectIdOrSlug) return null;

      try {
        const response = await fetch(
          `https://api.modrinth.com/v2/project/${projectIdOrSlug}/dependencies`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch dependencies: ${response.status}`);
        }

        const data: ModrinthDependenciesResponse = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Modrinth dependencies:', error);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: Boolean(projectIdOrSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Custom hook to fetch all versions for a project from Modrinth
 * @param projectIdOrSlug The project ID or slug to fetch versions for
 * @returns Query result with typed version data
 */
export const useFetchModrinthVersions = (
  projectIdOrSlug?: string
): UseQueryResult<ModrinthVersionsResponse | null, Error> => {
  return useQuery({
    queryKey: ['modrinth', 'versions', projectIdOrSlug],
    queryFn: async () => {
      if (!projectIdOrSlug) return null;

      try {
        const response = await fetch(
          `https://api.modrinth.com/v2/project/${projectIdOrSlug}/version`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch versions: ${response.status}`);
        }

        const data: ModrinthVersionsResponse = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Modrinth versions:', error);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: Boolean(projectIdOrSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch user profile from Modrinth using their authentication token
 * @param authToken The Modrinth authentication token
 * @returns Query result with typed user data
 */
export const useModrinthProfile = (
  authToken: string | null
): UseQueryResult<ModrinthUser | null, Error> => {
  return useQuery({
    queryKey: ['modrinth', 'profile', authToken],
    queryFn: async () => {
      if (!authToken) return null;

      try {
        const response = await fetch('https://api.modrinth.com/v2/user', {
          headers: { Authorization: authToken },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Modrinth profile: ${response.status}`);
        }

        const data: ModrinthUser = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Modrinth profile:', error);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: !!authToken && authToken.length === 64, // Only run when authToken exists and is valid
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch user projects from Modrinth
 * @param userId The Modrinth user ID
 * @returns Query result with typed user projects data
 */
export const useModrinthProjects = (
  userId: string | null
): UseQueryResult<ModrinthUserProjects | null, Error> => {
  return useQuery({
    queryKey: ['modrinth', 'projects', userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        const response = await fetch(`https://api.modrinth.com/v2/user/${userId}/projects`);

        if (!response.ok) {
          throw new Error(`Failed to fetch Modrinth projects: ${response.status}`);
        }

        const data: ModrinthUserProjects = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Modrinth projects:', error);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    enabled: !!userId, // Only run when userId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
