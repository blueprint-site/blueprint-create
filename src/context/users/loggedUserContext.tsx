import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '@/lib/appwrite.ts';
import { LoggedUserContextType, User, UserPreferences } from '@/types';
import { OAuthProvider } from 'appwrite';
import logMessage from '@/components/utility/logs/sendLogs';
const LoggedUserContext = createContext<LoggedUserContextType | null>(null);

interface LoggedUserProviderProps {
    children: ReactNode;
}

export const LoggedUserProvider = ({ children }: LoggedUserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [error, setError] = useState<string | null>('');
    const navigate = useNavigate();

    // Récupération de l'utilisateur connecté
    const fetchUser = async () => {
        try {
            const userData = await account.get();
            setUser(userData as User);
            setPreferences(userData.prefs as UserPreferences);
        } catch (error) {
            console.log('User is not authenticated');
        }
    };

    // Mise à jour des préférences utilisateur
    const updatePreferences = async (prefs: UserPreferences) => {
        try {
            await account.updatePrefs(prefs);
            setPreferences(prefs);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des préférences :', error);
        }
    };

    // Connexion via email/mot de passe
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

    // Inscription et connexion automatique après l'inscription
    const register = async (name: string, email: string, password: string) => {
        try {
            await account.create('unique()', email, password, name);
            await login(email, password);
        } catch (error) {
            setError('Registration failed. Please try again.');
            logMessage(`Error registering: ${error}`, 2, 'auth');
        }
    };

    // Déconnexion de l'utilisateur
    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'github' | 'discord') => {
        try {
            const providerMap = {
                google: OAuthProvider.Google,
                github: OAuthProvider.Github,
                discord: OAuthProvider.Discord,
            };
            const oauthProvider = providerMap[provider];
            const SuccessUrl = window._env_?.APP_URL + '/auth/success'
            const ErrorUrl = window._env_?.APP_URL + '/auth/error'
            account.createOAuth2Session(
                oauthProvider,
                SuccessUrl,
                ErrorUrl,
            );
        } catch (error) {
            console.error('Erreur lors de l\'authentification OAuth', error);
        }
    };

    const handleOAuthCallback = async () => {
        try {
            // Récupérer la session actuelle pour vérifier l'utilisateur
            const session = await account.listSessions();
            console.log('Session actuelle :', session);

            // Vérifier si la session est valide
            if (session) {
                const user = await account.get();  // Récupère les infos utilisateur
                console.log('Utilisateur connecté :', user);
                await fetchUser(); // Charge les données de l'utilisateur
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

export const useLoggedUser = () => {
    const context = useContext(LoggedUserContext);
    if (!context) {
        throw new Error('useLoggedUser must be used within a LoggedUserProvider');
    }
    return context;
};
