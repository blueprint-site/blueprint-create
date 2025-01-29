import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import supabase from "@/components/utility/Supabase.tsx";
import { Addon } from "@/types";

type AddonsType = Addon[] | null;

const AddonsContext = createContext<AddonsType>(null);

interface AddonsProviderProps {
    children: ReactNode;
}

export const AddonsProvider = ({ children }: AddonsProviderProps) => {
    const [Addons, setStats] = useState<AddonsType>(null);

    useEffect(() => {
        const fetchStats = async () => {
            let allData: Addon[] = [];
            let start = 0;
            const limit = 1000; // Limite par requête (1000 éléments)

            let hasMoreData = true;
            while (hasMoreData) {
                const { data, error } = await supabase
                    .from("mods")
                    .select("*")
                    .range(start, start + limit - 1);

                if (error) {
                    console.error("Error fetching data:", error);
                    break;
                }

                if (!data || data.length === 0) {
                    hasMoreData = false; // Stop looping when there's no more data
                    break;
                }

                allData = [...allData, ...data];
                start += limit;
            }

            setStats(allData); // Une fois tout récupéré, mettre à jour l'état
        };

        fetchStats().then();
    }, []);

    return <AddonsContext.Provider value={Addons}>{children}</AddonsContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAddons = () => {
    return useContext(AddonsContext);
};
