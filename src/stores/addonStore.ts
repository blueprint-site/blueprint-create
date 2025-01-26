// src/stores/addonStore.ts
import { Addon } from '@/types';
import axios from 'axios';
import { create } from 'zustand';

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
      const lastUpdated = localStorage.getItem("addonsLastUpdated");
      const needsUpdate = !lastUpdated || Date.now() - parseInt(lastUpdated) > 3600000;

      let data: Addon[];
      if (!storedData || needsUpdate) {
        const response = await axios.get<Addon[]>(import.meta.env.APP_ADDONSAPI_URL);
        data = response.data;
        localStorage.setItem("addonList", JSON.stringify(data));
        localStorage.setItem("addonsLastUpdated", Date.now().toString());
      } else {
        data = JSON.parse(storedData) as Addon[];
      }

      const uniqueVersions = Array.from(new Set(
        data.flatMap(addon => addon.versions as string[])
      )).sort();
      
      set({ 
        addons: data,
        versions: uniqueVersions,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to fetch addons', isLoading: false });
      console.error('Error fetching addons:', error);
    }
  }
}));