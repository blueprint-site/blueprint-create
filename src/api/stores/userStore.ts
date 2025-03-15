// src/api/stores/userStore.ts
import { create } from 'zustand';
import { account } from '@/config/appwrite.ts';
import { User, UserPreferences } from '@/types';
import { Models, OAuthProvider } from 'appwrite';
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
      set({
        user: userData as User,
        preferences: userData.prefs as UserPreferences,
      });
    } catch (error) {
      console.log('User is not authenticated');
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
   * Get user providers in Appwrite
   */
  getProviders: async (): Promise<string[]> => {
    try {
      const sessions = await account.listSessions();
      // Extract the provider from each session
      const providers = sessions.sessions.map((session) => session.provider);
      return providers;
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
      return Promise.reject(error);
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
      return Promise.reject(error);
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
      return Promise.reject(error);
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
      return Promise.reject(error);
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
      return Promise.reject(error);
    }
  },

  /**
   * Sets the error message.
   */
  setError: (error: string | null) => {
    set({ error });
  },
}));
