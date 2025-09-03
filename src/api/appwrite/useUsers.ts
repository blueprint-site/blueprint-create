import type { QueryKey } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import type { User as BaseUser } from '@/types';
import { userManagementService } from '@/services/userManagement';
import type { CreateUserData, UpdateUserData, UserListParams } from '@/services/userManagement';
import type { Models } from 'appwrite';

// Type for raw user data from the function
type RawUserData = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name?: string;
  email: string;
  status: boolean;
  labels?: string[];
  accessedAt?: string;
  prefs?: Record<string, unknown>;
  targets?: Array<Record<string, unknown>>;
  registration?: string;
  passwordUpdate?: string;
  phone?: string;
  emailVerification?: boolean;
  phoneVerification?: boolean;
  mfa?: boolean;
  [key: string]: unknown;
};

export type AdminUser = BaseUser & {
  teamIds: string[];
  labels?: string[];
  targets?: Array<Record<string, unknown>>;
  accessedAt?: string;
};

type UserListResponse = {
  total: number;
  users: RawUserData[];
};

type UserListData = {
  total: number;
  documents: AdminUser[];
};

interface UpdateTeamParams {
  userId: string;
  teamId: string;
  add: boolean;
}

const adminUserKeys = {
  all: ['admin', 'users'] as const,
  list: (params: UserListParams = {}) => [...adminUserKeys.all, 'list', params] as const,
  detail: (userId: string) => [...adminUserKeys.all, 'detail', userId] as const,
};

// Fetch users list
export const useFetchUsers = (params: UserListParams = {}) => {
  const queryKey: QueryKey = adminUserKeys.list(params);

  return useQuery<UserListData, Error>({
    queryKey,
    queryFn: async (): Promise<UserListData> => {
      try {
        const rawData = (await userManagementService.listUsers(params)) as UserListResponse;

        // Transform the data - the function returns users array directly
        const documents: AdminUser[] =
          rawData.users?.map(
            (user: RawUserData): AdminUser => ({
              ...user,
              // Provide defaults for required fields
              name: user.name || 'Unknown User',
              phone: user.phone || '',
              registration: user.registration || user.$createdAt,
              passwordUpdate: user.passwordUpdate || user.$createdAt,
              emailVerification: user.emailVerification ?? false,
              phoneVerification: user.phoneVerification ?? false,
              mfa: user.mfa ?? false,
              // Provide default prefs object if undefined
              prefs: user.prefs ?? {},
              // Provide default targets array if undefined (cast to unknown[] to match Target[] type)
              targets: (user.targets ?? []) as Models.Target[],
              // Map labels to teamIds for roles display
              teamIds:
                user.labels?.filter((label: string) =>
                  ['admin', 'betatester', 'premium', 'mvp'].includes(label)
                ) ?? [],
              // Keep original labels too
              labels: user.labels ?? [],
              // Map accessedAt for last active
              accessedAt: user.accessedAt || user.$updatedAt,
            })
          ) ?? [];

        return {
          total: rawData.total ?? 0,
          documents,
        };
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error instanceof Error
          ? error
          : new Error('An unknown error occurred while fetching users.');
      }
    },
  });
};

// Get single user details
export const useFetchUser = (userId: string | null) => {
  return useQuery<AdminUser, Error>({
    queryKey: adminUserKeys.detail(userId ?? ''),
    enabled: !!userId,
    queryFn: async (): Promise<AdminUser> => {
      if (!userId) throw new Error('User ID is required');

      try {
        const user = (await userManagementService.getUser(userId)) as RawUserData;
        return {
          ...user,
          // Provide defaults for required fields
          name: user.name || 'Unknown User',
          phone: user.phone || '',
          registration: user.registration || user.$createdAt,
          passwordUpdate: user.passwordUpdate || user.$createdAt,
          emailVerification: user.emailVerification ?? false,
          phoneVerification: user.phoneVerification ?? false,
          mfa: user.mfa ?? false,
          // Provide default prefs object if undefined
          prefs: user.prefs ?? {},
          // Provide default targets array if undefined (cast to unknown[] to match Target[] type)
          targets: (user.targets ?? []) as Models.Target[],
          // Map labels to teamIds for compatibility
          teamIds:
            user.labels?.filter((label: string) =>
              ['admin', 'betatester', 'premium', 'mvp'].includes(label)
            ) ?? [],
          labels: user.labels ?? [],
          accessedAt: user.accessedAt || user.$updatedAt,
        };
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error instanceof Error ? error : new Error('Failed to fetch user details');
      }
    },
  });
};

// Create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<AdminUser, Error, CreateUserData>({
    mutationFn: async (userData: CreateUserData): Promise<AdminUser> => {
      try {
        const newUser = (await userManagementService.createUser(userData)) as RawUserData;
        return {
          ...newUser,
          // Provide defaults for required fields
          name: newUser.name || 'Unknown User',
          phone: newUser.phone || '',
          registration: newUser.registration || newUser.$createdAt,
          passwordUpdate: newUser.passwordUpdate || newUser.$createdAt,
          emailVerification: newUser.emailVerification ?? false,
          phoneVerification: newUser.phoneVerification ?? false,
          mfa: newUser.mfa ?? false,
          // Provide default prefs object if undefined
          prefs: newUser.prefs ?? {},
          // Provide default targets array if undefined (cast to unknown[] to match Target[] type)
          targets: (newUser.targets ?? []) as Models.Target[],
          teamIds:
            newUser.labels?.filter((label: string) =>
              ['admin', 'betatester', 'premium', 'mvp'].includes(label)
            ) ?? [],
          labels: newUser.labels ?? [],
          accessedAt: newUser.accessedAt || newUser.$updatedAt,
        };
      } catch (error) {
        console.error('Error creating user:', error);
        throw error instanceof Error ? error : new Error('Failed to create user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    },
  });
};

// Update user information
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<AdminUser, Error, { userId: string; updates: UpdateUserData }>({
    mutationFn: async ({ userId, updates }): Promise<AdminUser> => {
      try {
        const updatedUser = (await userManagementService.updateUser(
          userId,
          updates
        )) as RawUserData;
        return {
          ...updatedUser,
          // Provide defaults for required fields
          name: updatedUser.name || 'Unknown User',
          phone: updatedUser.phone || '',
          registration: updatedUser.registration || updatedUser.$createdAt,
          passwordUpdate: updatedUser.passwordUpdate || updatedUser.$createdAt,
          emailVerification: updatedUser.emailVerification ?? false,
          phoneVerification: updatedUser.phoneVerification ?? false,
          mfa: updatedUser.mfa ?? false,
          // Provide default prefs object if undefined
          prefs: updatedUser.prefs ?? {},
          // Provide default targets array if undefined (cast to unknown[] to match Target[] type)
          targets: (updatedUser.targets ?? []) as Models.Target[],
          teamIds:
            updatedUser.labels?.filter((label: string) =>
              ['admin', 'betatester', 'premium', 'mvp'].includes(label)
            ) ?? [],
          labels: updatedUser.labels ?? [],
          accessedAt: updatedUser.accessedAt || updatedUser.$updatedAt,
        };
      } catch (error) {
        console.error('Error updating user:', error);
        throw error instanceof Error ? error : new Error('Failed to update user');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.userId) });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    },
  });
};

// Delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, string>({
    mutationFn: async (userId: string): Promise<void> => {
      try {
        await userManagementService.deleteUser(userId);
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error instanceof Error ? error : new Error('Failed to delete user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    },
  });
};

// Update user status (enable/disable)
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, { userId: string; status: boolean }>({
    mutationFn: async ({ userId, status }): Promise<void> => {
      try {
        await userManagementService.updateUserStatus(userId, status);
      } catch (error) {
        console.error('Error updating user status:', error);
        throw error instanceof Error ? error : new Error('Failed to update user status');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.userId) });
      toast({
        title: 'Success',
        description: `User ${variables.status ? 'enabled' : 'disabled'} successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user status',
        variant: 'destructive',
      });
    },
  });
};

// Reset user password
export const useResetUserPassword = () => {
  const { toast } = useToast();

  return useMutation<void, Error, string>({
    mutationFn: async (userId: string): Promise<void> => {
      try {
        await userManagementService.resetUserPassword(userId);
      } catch (error) {
        console.error('Error resetting password:', error);
        throw error instanceof Error ? error : new Error('Failed to reset password');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Password reset email sent successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password',
        variant: 'destructive',
      });
    },
  });
};

// Update team membership (now updates labels)
export const useUpdateUserTeam = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<string, Error, UpdateTeamParams>({
    mutationFn: async ({ userId, teamId, add }: UpdateTeamParams): Promise<string> => {
      try {
        // Get current user to get their labels
        const currentUser = (await userManagementService.getUser(userId)) as RawUserData;
        const currentLabels = currentUser.labels || [];

        // Map teamId to label (no underscores allowed in Appwrite labels)
        const labelMap: Record<string, string> = {
          admin: 'admin',
          beta_tester: 'betatester',
          premium: 'premium',
          mvp: 'mvp',
          banned: 'banned',
        };

        const label = labelMap[teamId] || teamId;

        // Update labels
        let newLabels: string[];
        if (add) {
          newLabels = [...new Set([...currentLabels, label])];
        } else {
          newLabels = currentLabels.filter((l: string) => l !== label);
        }

        await userManagementService.updateUserLabels(userId, newLabels);
        return `Role ${add ? 'added' : 'removed'} successfully`;
      } catch (error) {
        console.error('Error updating user role:', error);
        throw error instanceof Error ? error : new Error('Failed to update user role');
      }
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      toast({ title: 'Success', description: message });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user role.',
        variant: 'destructive',
      });
    },
  });
};
