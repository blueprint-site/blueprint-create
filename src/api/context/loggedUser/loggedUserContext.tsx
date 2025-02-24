import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '@/config/appwrite.ts';
import { LoggedUserContextType, User, UserPreferences } from '@/types';
import { OAuthProvider } from 'appwrite';
import logMessage from '@/components/utility/logs/sendLogs.tsx';
import { JSX } from 'react';
/**
 * @description Creates a context for managing the logged-in user's state.
 *              This context provides access to user data, preferences, authentication functions, and error states.
 */
const LoggedUserContext = createContext<LoggedUserContextType | null>(null);

interface LoggedUserProviderProps {
  /**
   * @description The child components that will have access to the LoggedUserContext.
   */
  children: ReactNode;
}

/**
 * @description Provides the LoggedUserContext to its children, managing user authentication and data.
 *              It handles user login, registration, logout, OAuth authentication, and preference updates.
 *
 * @param {LoggedUserProviderProps} { children } - The child components to be wrapped with the context.
 *
 * @returns {JSX.Element} A provider component that makes user-related data and functions available to its children.
 */
export const LoggedUserProvider = ({ children }: LoggedUserProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [error, setError] = useState<string | null>('');
  const navigate = useNavigate();

  /**
   * @description Fetches the currently logged-in user's data and preferences from the Appwrite account.
   *              Sets the user and preferences states if the user is authenticated.
   */
  const fetchUser = async () => {
    try {
      const userData = await account.get();
      setUser(userData as User);
      setPreferences(userData.prefs as UserPreferences);
    } catch (error) {
      console.log('User is not authenticated');
    }
  };

  /**
   * @description Updates the user's preferences in the Appwrite account.
   *
   */
  const updatePreferences = async (prefs: UserPreferences) => {
    try {
      await account.updatePrefs(prefs);
      setPreferences(prefs);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences :', error);
    }
  };

  /**
   * @description Logs in a user using their email and password.
   *              Navigates to the user's profile page upon successful login.
   *
   */
  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await fetchUser();
      navigate('/user');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      logMessage(`Error logging in: ${error}`, 2, 'auth');
    }
  };

  /**
   * @description Registers a new user with the provided information and automatically logs them in.
   *
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      await account.create('unique()', email, password, name);
      await login(email, password);
    } catch (error) {
      setError('Registration failed. Please try again.');
      logMessage(`Error registering: ${error}`, 2, 'auth');
    }
  };

  /**
   * @description Logs out the current user by deleting the current session.
   *              Navigates to the home page after successful logout.
   */
  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  /**
   * @description Handles OAuth login with the specified provider (Google, GitHub, Discord).
   *              Redirects the user to the OAuth provider's authentication page.
   *
   */
  const handleOAuthLogin = async (provider: 'google' | 'github' | 'discord') => {
    try {
      const providerMap = {
        google: OAuthProvider.Google,
        github: OAuthProvider.Github,
        discord: OAuthProvider.Discord,
      };
      const oauthProvider = providerMap[provider];
      const SuccessUrl = window._env_?.APP_URL + '/auth/success';
      const ErrorUrl = window._env_?.APP_URL + '/auth/error';
      account.createOAuth2Session(oauthProvider, SuccessUrl, ErrorUrl);
    } catch (error) {
      console.error("Erreur lors de l'authentification OAuth", error);
    }
  };

  /**
   * @description Handles the OAuth callback after the user authenticates with the OAuth provider.
   *              Fetches the user's data and navigates to the user's profile page if the authentication is successful.
   */
  const handleOAuthCallback = async () => {
    try {
      // Get the current session to check the user
      const session = await account.listSessions();
      console.log('Session actuelle :', session);

      // Check if the session is valid
      if (session) {
        const user = await account.get(); // Get user info
        console.log('Utilisateur connecté :', user);
        await fetchUser(); // Load user data
        navigate('/user');
      } else {
        console.error('Aucune session valide trouvée');
      }
    } catch (error) {
      console.error("Erreur lors de l'authentification OAuth :", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
      <LoggedUserContext.Provider
          value={{
            user,
            preferences,
            error,
            updatePreferences,
            login,
            register,
            logout,
            handleOAuthLogin,
            handleOAuthCallback,
            setError,
          }}
      >
        {children}
      </LoggedUserContext.Provider>
  );
};

/**
 * @description A custom hook that provides access to the LoggedUserContext.
 *              It throws an error if used outside of a LoggedUserProvider.
 *
 * @returns {LoggedUserContextType} The context value containing user data and authentication functions.
 */
export const useLoggedUser = (): LoggedUserContextType => {
  const context = useContext(LoggedUserContext);
  if (!context) {
    throw new Error('useLoggedUser must be used within a LoggedUserProvider');
  }
  return context;
};
