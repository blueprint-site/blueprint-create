import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import supabase from "@/components/utility/Supabase.tsx";

export interface Users {
    id: string;
    display_name: string;
    email: string;
    icon_url: string;
    roles: string[];
    created_at: string;
    updated_at: string;
}

interface UsersContextType {
    users: Users[] | null;
}

const UsersContext = createContext<UsersContextType | null>(null);

interface UsersProviderProps {
    children: ReactNode;
}

export const UsersProvider = ({ children }: UsersProviderProps) => {
    const [users, setUsers] = useState<Users[] | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*");

            if (error) {
                console.error("Error fetching data:", error);
                return;
            }

            setUsers(data);
        };

        fetchUsers().then();
    }, []);

    return (
        <UsersContext.Provider value={{ users }}>
            {children}
        </UsersContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error("useAddons must be used within an UsersProvider");
    }
    return context.users;
};
