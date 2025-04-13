import type { QueryKey } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { account, functions } from '@/config/appwrite';
import { ExecutionMethod } from 'appwrite';
import { useToast } from '@/hooks/useToast';
import type { User as BaseUser } from '@/types';

export type AdminUser = BaseUser & {
  teamIds: string[];
};

type TeamMembership = {
  teamId: string;
};

type UserWithTeams = AdminUser & {
  teams?: {
    memberships?: TeamMembership[];
  };
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
    queryKey,
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
          ExecutionMethod.POST,
          {
            Authorization: `Bearer ${jwt.jwt}`,
            'Content-Type': 'application/json',
          }
        );

        if (result.status !== 'completed') {
          const errorDetails = result.errors
            ? ` Errors: ${result.errors}`
            : ` Status Code: ${result.responseStatusCode}. Response: ${result.responseBody}`;
          return Promise.reject(
            new Error(`Function execution failed with status: ${result.status}.${errorDetails}`)
          );
        }

        const responseBody = JSON.parse(result.responseBody);
        if (!responseBody.success) {
          return Promise.reject(
            new Error(responseBody.message || 'Failed to fetch users from function.')
          );
        }

        const rawData: { total: number; users: UserWithTeams[] } = responseBody.data;

        if (!Array.isArray(rawData.users)) {
          console.error('Received unexpected data structure:', rawData);
          return Promise.reject(
            new Error('Received unexpected data structure from listUsers function.')
          );
        }

        const documents: AdminUser[] = rawData.users.map(
          (user): AdminUser => ({
            ...user,
            teamIds: user.teams?.memberships?.map((m) => m.teamId) ?? [],
          })
        );

        return {
          total: rawData.total,
          documents,
        };
      } catch (error) {
        console.error('Error fetching users:', error);
        return Promise.reject(
          error instanceof Error
            ? error
            : new Error('An unknown error occurred while fetching users.')
        );
      }
    },
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
          ExecutionMethod.POST,
          {
            Authorization: `Bearer ${jwt.jwt}`,
            'Content-Type': 'application/json',
          }
        );

        if (result.status !== 'completed') {
          const errorDetails = result.errors
            ? ` Errors: ${result.errors}`
            : ` Status Code: ${result.responseStatusCode}. Response: ${result.responseBody}`;
          return Promise.reject(
            new Error(`Function execution failed with status: ${result.status}.${errorDetails}`)
          );
        }

        const responseBody = JSON.parse(result.responseBody);
        if (!responseBody.success) {
          return Promise.reject(
            new Error(responseBody.message || 'Failed to update team membership.')
          );
        }

        return responseBody.message || 'Team membership updated successfully.';
      } catch (error) {
        console.error('Error updating team membership:', error);
        return Promise.reject(
          error instanceof Error
            ? error
            : new Error('An unknown error occurred while updating team membership.')
        );
      }
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.list() }).then();
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
