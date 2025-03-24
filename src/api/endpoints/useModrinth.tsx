import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  ModrinthProject,
  ModrinthVersionsResponse,
  ModrinthDependenciesResponse,
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
