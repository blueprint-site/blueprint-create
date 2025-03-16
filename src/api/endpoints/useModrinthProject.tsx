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
