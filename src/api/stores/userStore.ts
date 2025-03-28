/**
 * Helper function to map Appwrite user data to our application's User type
 */
const mapAppwriteUserToUser = (appwriteUser: Models.User<Models.Preferences>): User => {
  return {
    $id: appwriteUser.$id,
    $createdAt: appwriteUser.$createdAt,
    $updatedAt: appwriteUser.$updatedAt,
    name: appwriteUser.name,
    registration: appwriteUser.registration,
    status: appwriteUser.status,
    labels: appwriteUser.labels || [],
    passwordUpdate: appwriteUser.passwordUpdate,
    email: appwriteUser.email,
    phone: appwriteUser.phone,
    emailVerification: appwriteUser.emailVerification,
    phoneVerification: appwriteUser.phoneVerification,
    mfa: appwriteUser.mfa,
    prefs: mapAppwritePrefsToUserPreferences(appwriteUser.prefs),
    targets: appwriteUser.targets || [],
    accessedAt: appwriteUser.accessedAt,
  };
};

/**
 * Helper function to map Appwrite preferences to our application's UserPreferences type
 */
const mapAppwritePrefsToUserPreferences = (prefs: Models.Preferences): UserPreferences => {
  return {
    theme: prefs?.theme || 'light',
    language: prefs?.language || 'en',
    notificationsEnabled: prefs?.notificationsEnabled || false,
    avatar: prefs?.avatar,
    bio: prefs?.bio,
    roles: prefs?.roles || [],
    easterEggs: prefs?.easterEggs,
  };
};

import { create } from 'zustand';
import { account, functions } from '@/config/appwrite.ts';
import type { User, UserPreferences } from '@/types';
import type { Models } from 'appwrite';
import { ExecutionMethod, OAuthProvider } from 'appwrite';
import logMessage from '@/components/utility/logs/sendLogs.tsx';

interface UserState {
  user: User | null;
  preferences: UserPreferences | null;
  error: string | null;
  isLoading: boolean;
  // Methods
  fetchUser: () => Promise<void>;
  getProviders: () => Promise<string[]>;
  getUserSessions: () => Promise<Models.Session[]>;
  getAllUserData: (userID: string) => Promise<{ message: string; data: object } | null>;
  updatePreferences: (prefs: UserPreferences) => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string } | void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  handleOAuthLogin: (provider: 'google' | 'github' | 'discord') => Promise<void>;
  handleOAuthCallback: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  preferences: null,
  error: null,
  isLoading: false,

  /**
   * Fetches the currently logged-in user's data and preferences from the Appwrite account.
   */
  fetchUser: async () => {
    try {
      const userData = await account.get();
      console.log('User Data loaded', userData);
      set({
        user: mapAppwriteUserToUser(userData),
        preferences: mapAppwritePrefsToUserPreferences(userData.prefs),
      });
    } catch (error) {
      console.error('User is not authenticated', error);
    }
  },

  /**
   * GET user's Sessions
   */
  getUserSessions: async (): Promise<Models.Session[]> => {
    try {
      const sessionList = await account.listSessions();
      return sessionList.sessions; // Retourne bien un tableau de sessions
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  },

  /**
   * Updates the user's preferences in the Appwrite account.
   */
  updatePreferences: async (prefs: UserPreferences) => {
    try {
      await account.updatePrefs(prefs);
      set({ preferences: prefs });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  },

  /**
   * Get all the users data
   */

  getAllUserData: async (userID: string) => {
    try {
      const headers = {
        'x-user-id': userID,
      };
      const res = await functions.createExecution(
        '67bf7b35002f188635ac',
        undefined,
        false,
        undefined,
        ExecutionMethod.POST,
        headers
      );

      if (res.responseStatusCode === 200) {
        const result: { message: string; data: object } = JSON.parse(res.responseBody);

        // Create JSON file content
        const jsonContent = JSON.stringify(result.data, null, 2); // Pretty print JSON

        // Create a Blob
        const blob = new Blob([jsonContent], { type: 'application/json' });

        // Create a link and trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userID}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return result; // Or return a success message
      }
      return null;
    } catch (error) {
      console.error('Error getting all the user data', error);
      return null;
    }
  },

  /**
   * Get user providers in Appwrite
   */
  getProviders: async (): Promise<string[]> => {
    try {
      const sessions = await account.listSessions();
      // Extract the provider from each session
      return sessions.sessions.map((session) => session.provider);
    } catch (error) {
      console.error('Error getting providers:', error);
      return []; // Or handle the error as needed
    }
  },

  /**
   * Logs in a user using their email and password.
   */
  login: async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string } | void> => {
    try {
      await account.createEmailPasswordSession(email, password);
      await get().fetchUser();
      // Resolve with a success message to trigger the redirection
      return Promise.resolve({ success: true, message: 'Login successful' });
    } catch (error) {
      set({ error: 'Login failed. Please check your credentials.' });
      logMessage(`Error logging in: ${error}`, 2, 'auth');
      // Reject with the error to handle it in the component
      return Promise.reject(new Error(`Login failed: ${error}`));
    }
  },

  /**
   * Registers a new user with the provided information and automatically logs them in.
   */
  register: async (name: string, email: string, password: string) => {
    try {
      await account.create('unique()', email, password, name);
      await get().login(email, password);
      return Promise.resolve();
    } catch (error) {
      set({ error: 'Registration failed. Please try again.' });
      logMessage(`Error registering: ${error}`, 2, 'auth');
      return Promise.reject(new Error(`Registration failed: ${error}`));
    }
  },

  /**
   * Logs out the current user by deleting the current session.
   */
  logout: async () => {
    set({ isLoading: true, error: null }); // Set loading state and clear any previous errors
    try {
      await account.deleteSession('current');
      set({ user: null, preferences: null, error: null }); // Clear user data and error
      // Optionally, clear any other authentication tokens/cookies here

      // Redirect to login page (example using window.location, consider using react-router for SPA)
      window.location.href = '/login'; // Or use navigate('/login') if using react-router
      return Promise.resolve();
    } catch (error) {
      console.error('Logout failed', error);
      set({ error: 'Logout failed. Please try again.', isLoading: false }); // Set error and clear loading state
      return Promise.reject(new Error(`Logout failed: ${error}`));
    } finally {
      set({ isLoading: false }); // Ensure loading state is cleared even if there's an error
    }
  },

  /**
   * Handles OAuth login with the specified provider (Google, GitHub, Discord).
   */
  handleOAuthLogin: async (provider: 'google' | 'github' | 'discord') => {
    try {
      const providerMap = {
        google: OAuthProvider.Google,
        github: OAuthProvider.Github,
        discord: OAuthProvider.Discord,
      };
      const oauthProvider = providerMap[provider];
      const successUrl = window._env_?.APP_URL + '/auth/success';
      const errorUrl = window._env_?.APP_URL + '/auth/error';
      account.createOAuth2Session(oauthProvider, successUrl, errorUrl);
      return Promise.resolve();
    } catch (error) {
      console.error('Error during OAuth authentication', error);
      return Promise.reject(new Error(`OAuth authentication failed: ${error}`));
    }
  },

  /**
   * Handles the OAuth callback after the user authenticates with the OAuth provider.
   */
  handleOAuthCallback: async () => {
    try {
      const session = await account.listSessions();
      if (session) {
        await get().fetchUser();
        return Promise.resolve();
      } else {
        console.error('No valid session found');
        return Promise.reject(new Error('No valid session found'));
      }
    } catch (error) {
      console.error('Error during OAuth callback:', error);
      return Promise.reject(new Error(`OAuth callback failed: ${error}`));
    }
  },

  /**
   * Sets the error message.
   */
  setError: (error: string | null) => {
    set({ error });
  },
}));
