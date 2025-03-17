import { useQuery } from '@tanstack/react-query';

export interface ModrinthGalleryImage {
  url: string;
  raw_url: string;
  featured: boolean;
  title: string | null;
  description: string | null;
  created: string;
  ordering: number | null;
}

export const useModrinthProject = (projectId?: string) => {
  return useQuery({
    queryKey: ['modrinth', 'project', projectId],
    queryFn: async () => {
      if (!projectId) return null;

      try {
        const response = await fetch(`https://api.modrinth.com/v2/project/${projectId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Modrinth project:', error);
        throw error;
      }
    },
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Custom hook to fetch version dependencies from Modrinth
 * Uses the /project/{id|slug}/dependencies endpoint
 */
export const useModrinthDependencies = (projectIdOrSlug?: string) => {
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

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Modrinth dependencies:', error);
        throw error;
      }
    },
    enabled: Boolean(projectIdOrSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export interface ModrinthVersions {
  name: string;
  version_number: string;
  changelog?: string;
  dependencies?: Array<{
    project_id: string;
    version_id?: string;
    file_name?: string;
    dependency_type: 'required' | 'optional' | 'incompatible' | 'embedded';
  }>;
  game_versions: string[];
  version_type: 'release' | 'beta' | 'alpha';
  loaders: string[];
  featured: boolean;
  status: 'listed' | 'archived' | 'draft' | 'unlisted' | 'scheduled' | 'unknown';
  requested_status?: 'listed' | 'archived' | 'draft' | 'unlisted';
  id: string;
  project_id: string;
  author_id: string;
  date_published: string;
  downloads: number;
  files: Array<{
    url: string;
    filename: string;
    primary: boolean;
    size: number;
    file_type?: string;
  }>;
}

/**
 * Custom hook to fetch all versions for a project from Modrinth
 */
export const useModrinthVersions = (projectIdOrSlug?: string) => {
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

        const data: ModrinthVersions[] = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Modrinth versions:', error);
        throw error;
      }
    },
    enabled: Boolean(projectIdOrSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook that combines both dependencies and versions data
 */
export const useModrinthVersionInfo = (projectIdOrSlug?: string) => {
  const dependenciesQuery = useModrinthDependencies(projectIdOrSlug);
  const versionsQuery = useModrinthVersions(projectIdOrSlug);

  const isLoading = dependenciesQuery.isLoading || versionsQuery.isLoading;
  const error = dependenciesQuery.error || versionsQuery.error;

  // Process and merge data
  interface DependencyProject {
    title: string;
    id: string;
  }

  interface ModrinthVersionInfo {
    dependencies: ModrinthVersions['dependencies'] | null; // Use the appropriate type for dependencies
    versions: ModrinthVersions[] | null;
    createVersions: string[];
  }

  const data: ModrinthVersionInfo = {
    dependencies: dependenciesQuery.data,
    versions: versionsQuery.data ?? null,
    // Find the Create mod dependency if it exists using the actual Create mod ID
    createVersions:
      dependenciesQuery.data?.projects
        ?.filter(
          (project: DependencyProject) =>
            project.id === 'Jq3vXCZh' || // Direct match with Create mod ID
            project.title.toLowerCase().includes('create') // Fallback for text matching
        )
        .map((project: DependencyProject) => project.id) || [],
  };

  return {
    data,
    isLoading,
    error,
  };
};
