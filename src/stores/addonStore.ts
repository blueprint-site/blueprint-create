// src/stores/addonStore.ts
import { create } from 'zustand';
import {Addon} from "@/types";



interface AddonStore {
  addons: Addon[];
  versions: string[];
  isLoading: boolean;
  error: string | null;
  fetchAddons: () => Promise<void>;
}

export const useAddonStore = create<AddonStore>((set) => ({
  addons: [],
  versions: [],
  isLoading: false,
  error: null,
  fetchAddons: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const storedData = localStorage.getItem("addonList");
      const data = storedData ? JSON.parse(storedData) : [];
      
      // Extract unique versions
      const uniqueVersions = [...new Set(data.flatMap((addon: Addon) => addon.versions))].sort();
      
      set({ 
        addons: data,
        versions: uniqueVersions as string[],
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch addons',
        isLoading: false 
      });
    }
  }
}));