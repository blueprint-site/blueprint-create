import { ReactNode, createContext, useEffect, useState, useCallback } from "react";
import supabase from "@/components/utility/Supabase.tsx";
import { Addon } from "@/types";

type AddonsContextType = {
    addons: Addon[];
    loadMore: () => void;
    loading: boolean;
    hasMoreData: boolean;
    totalAddons: number;
    totalValidAddons: number;
};

export const AddonsContext = createContext<AddonsContextType | undefined>(undefined);
const PAGE_SIZE = 10;

interface AddonsProviderProps {
    children: ReactNode;
}

export const AddonsProvider = ({ children }: AddonsProviderProps) => {
    const [addons, setAddons] = useState<Addon[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [page, setPage] = useState(1);
    const [totalAddons, setTotalAddons] = useState(0);
    const [totalValidAddons, setTotalValidAddons] = useState(0);

    const fetchTotalCount = useCallback(async () => {
        try {
            const { count: total, error: totalError } = await supabase
                .from("mods")
                .select("*", { count: "exact", head: true });

            if (totalError) console.error(totalError);
            if (total !== null) setTotalAddons(total);

            const { count: validTotal, error: validError } = await supabase
                .from("mods")
                .select("*", { count: "exact", head: true })
                .eq("isValid", true);

            if (validError) console.error(validError);
            if (validTotal !== null) setTotalValidAddons(validTotal);
        } catch (error) {
            console.error("Error fetching total counts:", error);
        }
    }, []);

    const fetchAddons = useCallback(async () => {
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from("mods")
                .select("*")
                .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

            if (error) console.error(error);

            if (data && data.length > 0) {
                setAddons(prev => [...prev, ...data]);
                setHasMoreData(data.length === PAGE_SIZE);
            } else {
                setHasMoreData(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setHasMoreData(false);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchTotalCount();
    }, [fetchTotalCount]);

    useEffect(() => {
        if (hasMoreData) {
            fetchAddons();
        }
    }, [page, hasMoreData, fetchAddons]);

    const loadMore = () => {
        if (!loading && hasMoreData) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <AddonsContext.Provider value={{ addons, loadMore, loading, hasMoreData, totalAddons, totalValidAddons }}>
            {children}
        </AddonsContext.Provider>
    );
};
