import type { QueryKey } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { account, functions } from '@/config/appwrite';
import { ExecutionMethod } from 'appwrite'; // Import ExecutionMethod
import { useToast } from '@/hooks/useToast';

import type { User as BaseUser } from '@/types'; // Assuming this is your base type

export type AdminUser = BaseUser & {
  teamIds: string[];
};

type UserListData = {
  total: number;
  documents: AdminUser[];
};

interface FetchUsersParams {
  search?: string;
  limit?: number;
  offset?: number;
}

interface UpdateTeamParams {
  userId: string;
  teamId: string;
  add: boolean;
}

const MANAGE_USERS_FUNCTION_ID =
  window._env_?.APPWRITE_MANAGE_USERS_FUNCTION_ID ?? '67f99445001dd9278180';

const adminUserKeys = {
  all: ['admin', 'users'] as const,
  list: (params: FetchUsersParams = {}) => [...adminUserKeys.all, 'list', params] as const,
};

export const useFetchUsers = (params: FetchUsersParams = {}) => {
  const queryKey: QueryKey = adminUserKeys.list(params);

  return useQuery<UserListData, Error>({
    queryKey: queryKey,
    queryFn: async (): Promise<UserListData> => {
      try {
        const jwt = await account.createJWT();
        const payload = {
          action: 'listUsers',
          payload: {
            search: params.search ?? undefined,
            limit: params.limit ?? 25,
            offset: params.offset ?? 0,
          },
        };

        const result = await functions.createExecution(
          MANAGE_USERS_FUNCTION_ID,
          JSON.stringify(payload),
          false,
          '/',
          // --- Use ExecutionMethod Enum ---
          ExecutionMethod.POST,
          {
            Authorization: `Bearer ${jwt.jwt}`,
            'Content-Type': 'application/json',
          }
        );

        if (result.status !== 'completed') {
          // --- Adjust Error Handling ---
          // Use result.errors if available (for function logs via error()), otherwise use status code/body
          const errorDetails = result.errors
            ? ` Errors: ${result.errors}`
            : ` Status Code: ${result.responseStatusCode}. Response: ${result.responseBody}`;
          throw new Error(
            `Function execution failed with status: ${result.status}.${errorDetails}`
          );
        }

        const responseBody = JSON.parse(result.responseBody);
        if (!responseBody.success) {
          throw new Error(responseBody.message || 'Failed to fetch users from function.');
        }
        if (
          !responseBody.data ||
          typeof responseBody.data.total !== 'number' ||
          !Array.isArray(responseBody.data.documents)
        ) {
          console.error('Received unexpected data structure:', responseBody.data);
          throw new Error('Received unexpected data structure from listUsers function.');
        }
        return responseBody.data as UserListData;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error instanceof Error
          ? error
          : new Error('An unknown error occurred while fetching users.');
      }
    },
    // keepPreviousData: true, // Consider uncommenting for pagination UX
  });
};

export const useUpdateUserTeam = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<string, Error, UpdateTeamParams>({
    mutationFn: async ({ userId, teamId, add }: UpdateTeamParams): Promise<string> => {
      try {
        const jwt = await account.createJWT();
        const payload = {
          action: 'updateTeamMembership',
          payload: { userId, teamId, add },
        };

        const result = await functions.createExecution(
          MANAGE_USERS_FUNCTION_ID,
          JSON.stringify(payload),
          false,
          '/',
          // --- Use ExecutionMethod Enum ---
          ExecutionMethod.POST,
          {
            Authorization: `Bearer ${jwt.jwt}`,
            'Content-Type': 'application/json',
          }
        );

        if (result.status !== 'completed') {
          // --- Adjust Error Handling ---
          const errorDetails = result.errors
            ? ` Errors: ${result.errors}`
            : ` Status Code: ${result.responseStatusCode}. Response: ${result.responseBody}`;
          throw new Error(
            `Function execution failed with status: ${result.status}.${errorDetails}`
          );
        }

        const responseBody = JSON.parse(result.responseBody);
        if (!responseBody.success) {
          throw new Error(responseBody.message || 'Failed to update team membership.');
        }
        return responseBody.message || 'Team membership updated successfully.';
      } catch (error) {
        console.error('Error updating team membership:', error);
        throw error instanceof Error
          ? error
          : new Error('An unknown error occurred while updating team membership.');
      }
    },
    onSuccess: (message) => {
      // Consider more granular invalidation if performance becomes an issue
      queryClient.invalidateQueries({ queryKey: adminUserKeys.list() });
      toast({ title: 'Success', description: message });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update team membership.',
        variant: 'destructive',
      });
    },
  });
};
