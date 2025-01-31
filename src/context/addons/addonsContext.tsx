import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import supabase from "@/components/utility/Supabase.tsx";
import { Addon } from "@/types";

type AddonsContextType = {
    addons: Addon[] | null;
    loadMore: () => void;
    loading: boolean;
    hasMoreData: boolean;
};

const AddonsContext = createContext<AddonsContextType | undefined>(undefined);

interface AddonsProviderProps {
    children: ReactNode;
}

export const AddonsProvider = ({ children }: AddonsProviderProps) => {
    const [addons, setAddons] = useState<Addon[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMoreData, setHasMoreData] = useState<boolean>(true); // Indicate if there are more addons to fetch
    const [page, setPage] = useState<number>(1); // Track the current page

    const limit = 1000;

    const fetchAddons = async (page: number) => {
        setLoading(true);
        const start = (page - 1) * limit;

        const { data, error } = await supabase
            .from("mods")
            .select("*")
            .range(start, start + limit - 1);

        if (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
            return;
        }

        if (data && data.length > 0) {
            setAddons(prev => (prev ? [...prev, ...data] : data));
            setHasMoreData(data.length === limit);
        } else {
            setHasMoreData(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAddons(page);
    }, [page]);

    const loadMore = () => {
        if (!loading && hasMoreData) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <AddonsContext.Provider value={{ addons, loadMore, loading, hasMoreData }}>
            {children}
        </AddonsContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAddons = () => {
    const context = useContext(AddonsContext);
    if (!context) {
        throw new Error("useAddons must be used within an AddonsProvider");
    }
    return context;
};
