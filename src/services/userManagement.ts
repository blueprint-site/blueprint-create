import { account, functions } from '@/config/appwrite';
import { ExecutionMethod } from 'appwrite';

// Types for user management operations
export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  labels?: string[];
  emailVerification?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  labels?: string[];
  status?: boolean;
  emailVerification?: boolean;
  phoneVerification?: boolean;
}

export interface UserListParams {
  search?: string;
  limit?: number;
  offset?: number;
  queries?: string[];
}

// Function ID from environment or default
const MANAGE_USERS_FUNCTION_ID = window._env_?.APPWRITE_MANAGE_USERS_FUNCTION_ID ?? 'manage-users';

// Helper function to call the Appwrite function with authentication
async function callUserManagementFunction<T = unknown>(action: string, payload: Record<string, unknown> | CreateUserData = {}): Promise<T> {
  try {
    // Create JWT for authentication
    const jwt = await account.createJWT();
    
    // Prepare the request payload
    const requestPayload = {
      action,
      payload
    };
    
    // Execute the function
    const result = await functions.createExecution(
      MANAGE_USERS_FUNCTION_ID,
      JSON.stringify(requestPayload),
      false,
      '/',
      ExecutionMethod.POST,
      {
        'X-Appwrite-JWT': jwt.jwt,
        'Content-Type': 'application/json',
      }
    );
    
    // Check if execution was successful
    if (result.status !== 'completed') {
      const errorDetails = result.errors
        ? ` Errors: ${result.errors}`
        : ` Status Code: ${result.responseStatusCode}. Response: ${result.responseBody}`;
      throw new Error(`Function execution failed with status: ${result.status}.${errorDetails}`);
    }
    
    // Parse the response
    const responseBody = JSON.parse(result.responseBody);
    
    // Check if the operation was successful
    if (!responseBody.success) {
      throw new Error(responseBody.message || `Failed to execute ${action}`);
    }
    
    return responseBody.data;
  } catch (error) {
    console.error(`Error in ${action}:`, error);
    throw error instanceof Error ? error : new Error(`Unknown error in ${action}`);
  }
}

// User Management Service
export const userManagementService = {
  // List all users with optional filtering
  async listUsers(params: UserListParams = {}) {
    return callUserManagementFunction('listUsers', {
      search: params.search,
      limit: params.limit ?? 25,
      offset: params.offset ?? 0,
      queries: params.queries ?? []
    });
  },
  
  // Get a single user by ID
  async getUser(userId: string) {
    return callUserManagementFunction('getUser', { userId });
  },
  
  // Create a new user
  async createUser(userData: CreateUserData) {
    return callUserManagementFunction('createUser', userData);
  },
  
  // Update user information
  async updateUser(userId: string, updates: UpdateUserData) {
    return callUserManagementFunction('updateUser', {
      userId,
      updates
    });
  },
  
  // Delete a user
  async deleteUser(userId: string) {
    return callUserManagementFunction('deleteUser', { userId });
  },
  
  // Update user status (enable/disable)
  async updateUserStatus(userId: string, status: boolean) {
    return callUserManagementFunction('updateUserStatus', {
      userId,
      status
    });
  },
  
  // Update user labels (roles)
  async updateUserLabels(userId: string, labels: string[]) {
    return callUserManagementFunction('updateUserLabels', {
      userId,
      labels
    });
  },
  
  // Update user email verification
  async updateEmailVerification(userId: string, verified: boolean) {
    return callUserManagementFunction('updateEmailVerification', {
      userId,
      emailVerification: verified
    });
  },
  
  // Reset user password (generates new password)
  async resetUserPassword(userId: string) {
    return callUserManagementFunction('resetUserPassword', { userId });
  },
  
  // Update team membership (existing functionality)
  async updateTeamMembership(userId: string, teamId: string, add: boolean) {
    return callUserManagementFunction('updateTeamMembership', {
      userId,
      teamId,
      add
    });
  },
  
  // Get user sessions
  async getUserSessions(userId: string) {
    return callUserManagementFunction('getUserSessions', { userId });
  },
  
  // Delete all user sessions (force logout)
  async deleteUserSessions(userId: string) {
    return callUserManagementFunction('deleteUserSessions', { userId });
  }
};