import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import supabase from "@/components/utility/Supabase.tsx";
import { User } from "@supabase/supabase-js";

export interface LoggedUserContextType {
    user: User | null;
    displayName: string;
    roles: string[];
    isAdmin: boolean;
    icon_url: string;
    bio: string;
    id: string;
    refreshUser: () => Promise<void>;
}

const LoggedUserContext = createContext<LoggedUserContextType | null>(null);

interface LoggedUserProviderProps {
    children: ReactNode;
}

export const LoggedUserProvider = ({ children }: LoggedUserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const [displayName, setDisplayName] = useState("");
    const [icon_url, setIconUrl] = useState("");
    const [bio, setBio] = useState("");
    const [id, setId] = useState("");
    // Utilisation de useRef pour éviter des appels multiples
    const hasFetched = useRef(false);

    const fetchLoggedUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Error fetching user:", error);
            return;
        }
        if (data?.user) {
            setUser(data.user);
            setIconUrl(data.user.user_metadata.avatar_url ?? "");
            await fetchUserRoles(data.user.id);
        }
    };

    const fetchUserRoles = async (userId: string) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error fetching roles:", error);
            return;
        }
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");
        setRoles(Array.isArray(data.roles) ? data.roles : [data.roles]);
        setId(data.id);
    };

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchLoggedUser();
        }
    }, []);

    const isAdmin = roles.includes("admin");

    return (
        <LoggedUserContext.Provider value={{ user, displayName, roles, isAdmin, icon_url, bio,id, refreshUser: fetchLoggedUser }}>
            {children}
        </LoggedUserContext.Provider>
    );
};

// Hook personnalisé
export const useLoggedUser = () => {
    const context = useContext(LoggedUserContext);
    if (!context) {
        throw new Error("useLoggedUser must be used within a LoggedUserProvider");
    }
    return context;
};
