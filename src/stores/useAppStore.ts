import { create } from "zustand";
import supabase from "@/components/utility/Supabase";
import {Addon} from "@/types";

interface AppStore {
    isLoading: boolean;
    status: string;
    categories: { [key: string]: string };
    addons: Addon[];
    lastUpdated: number | null;

    loadAppData: () => Promise<void>;
    refreshData: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
    isLoading: false,
    status: "Idle",
    categories: {'1':"error loading category"},
    addons: [],
    lastUpdated: null,

    loadAppData: async () => {
        set({ isLoading: true, status: "Loading data..." });

        try {
            // Charger les données directement depuis Supabase
            const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select();
            if (categoriesError) throw categoriesError;

            const categoryMap = categoriesData.reduce((acc: { [key: string]: string }, category: { id: string; name: string }) => {
                acc[category.id] = category.name;
                return acc;
            }, {});
            set({ categories: categoryMap });

            const { data: addonsData, error: addonsError } = await supabase
                .from("mods")
                .select("*")
                .eq("isValid", true)
                .eq("isChecked", true);
            if (addonsError) throw addonsError;

            set({ addons: addonsData, lastUpdated: Date.now() });

            console.log("✅ Data loaded from Supabase");
        } catch (error) {
            console.error("Error loading data from Supabase:", error);
        }

        set({ isLoading: false, status: "Data loaded." });
    },

    refreshData: async () => {
        set({ isLoading: true, status: "Updating data..." });

        try {
            const lastUpdatedTime = useAppStore.getState().lastUpdated;
            const oneHourAgo = Date.now() - 60 * 60 * 1000; // 1 heure

            if (lastUpdatedTime && lastUpdatedTime > oneHourAgo) {
                console.log("⏳ Data is still fresh, skipping update.");
                set({ isLoading: false, status: "No update needed." });
                return;
            }

            console.log("🔄 Fetching new data from Supabase...");

            const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select();
            if (categoriesError) throw categoriesError;

            const categoryMap = categoriesData.reduce((acc: { [key: string]: string }, category: { id: string; name: string }) => {
                acc[category.id] = category.name;
                return acc;
            }, {});
            set({ categories: categoryMap });

            const { data: addonsData, error: addonsError } = await supabase
                .from("mods")
                .select("*")
                .eq("isValid", true)
                .eq("isChecked", true);
            if (addonsError) throw addonsError;

            set({ addons: addonsData, lastUpdated: Date.now() });

            console.log("✅ Data updated successfully from Supabase!");
            set({ status: "Data updated." });
        } catch (error) {
            console.error("❌ Error updating data:", error);
            set({ status: "Error updating data." });
        } finally {
            set({ isLoading: false });
        }
    },
}));
