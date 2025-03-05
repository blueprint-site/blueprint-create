import { useQuery } from '@tanstack/react-query';

const modrinthApiUrl = 'https://api.modrinth.com/v2/';

export interface getModrinthInfosProps {
    projectId: string;
}


const fetchModrinthProject = async (projectId: string): Promise<any> => {
    const response = await fetch(`${modrinthApiUrl}project/${projectId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

export const GetModrinthInfos = ({ projectId }: getModrinthInfosProps) => {
    const { data, isLoading, isError, error } = useQuery<any, Error>({
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
