// src/stores/collectionStore.ts
import Collections from '@/components/utility/CollectionHandler.tsx';
import { create } from 'zustand';

interface CollectionStore {
  collection: string[];
  addAddon: (addonSlug: string) => void;
  removeAddon: (addonSlug: string) => void;
  initializeCollection: () => void;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
  collection: [],
  
  initializeCollection: () => {
    const savedCollection = Collections.getCollection();
    set({ collection: savedCollection });
  },
  
  addAddon: (addonSlug: string) => {
    Collections.collectionAdded(addonSlug);
    set({ collection: Collections.getCollection() });
  },
  
  removeAddon: (addonSlug: string) => {
    Collections.removeAddon(addonSlug);
    set({ collection: Collections.getCollection() });
  }
}));