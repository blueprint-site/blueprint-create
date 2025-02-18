import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { account } from "@/lib/appwrite.ts";
import {LoggedUserContextType, User, UserPreferences} from "@/types";



const LoggedUserContext = createContext<LoggedUserContextType | null>(null);

interface LoggedUserProviderProps {
    children: ReactNode;
}

export const LoggedUserProvider = ({ children }: LoggedUserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);

    const fetchUser = async () => {
        try {
            const userData = await account.get();
            setUser(userData as User);
            setPreferences(userData.prefs as UserPreferences);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur ou des préférences :', error);
        }
    };

    const updatePreferences = async (prefs: UserPreferences) => {
        try {
            await account.updatePrefs(prefs);
            setPreferences(prefs);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des préférences :', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <LoggedUserContext.Provider value={{ user, preferences, updatePreferences }}>
            {children}
        </LoggedUserContext.Provider>
    );
};

export const useLoggedUser = () => {
    const context = useContext(LoggedUserContext);
    if (!context) {
        throw new Error('useLoggedUser doit être utilisé à l\'intérieur de LoggedUserProvider');
    }
    return context;
};
