import { useQuery } from '@tanstack/react-query';

const modrinthApiUrl = 'https://api.modrinth.com/v2/';

export interface GetModrinthInfosProps {
  projectId: string;
}

// Define interface for the project data
interface ModrinthProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  // Add other fields as needed based on the actual API response
  [key: string]: unknown; // This allows for additional properties without using 'any'
}

const fetchModrinthProject = async (projectId: string): Promise<ModrinthProject> => {
  const response = await fetch(`${modrinthApiUrl}project/${projectId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const GetModrinthInfos = ({ projectId }: GetModrinthInfosProps) => {
  const { data, isLoading, isError, error } = useQuery<ModrinthProject, Error>({
    queryKey: ['modrinthProject', projectId],
    queryFn: () => fetchModrinthProject(projectId),
    enabled: !!projectId, // Only fetch if projectId is available
    retry: false,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
