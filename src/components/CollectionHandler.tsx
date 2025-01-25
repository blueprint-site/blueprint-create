// CollectionHandler.ts
const CollectionHandler = {
    collectionAdded: (addonName: string): void => {
      const savedCollection = localStorage.getItem("savedAddonCollection");
  
      let collection: string[] = savedCollection ? JSON.parse(savedCollection) : [];
  
      collection.push(addonName);
  
      localStorage.setItem("savedAddonCollection", JSON.stringify(collection));
    },
  
    getCollection: (): string[] => {
      const savedCollection = localStorage.getItem("savedAddonCollection");
      return savedCollection ? JSON.parse(savedCollection) : [];
    },
  
    clearCollection: (): void => {
      localStorage.removeItem("savedAddonCollection");
    },
  
    // New function to remove an item from the collection
    removeAddon: (addonName: string): void => {
      const savedCollection = localStorage.getItem("savedAddonCollection");
  
      let collection: string[] = savedCollection ? JSON.parse(savedCollection) : [];
  
      // Filter out the item to be removed
      collection = collection.filter((addon) => addon !== addonName);
  
      // Update localStorage with the new collection
      localStorage.setItem("savedAddonCollection", JSON.stringify(collection));
    }
  };
  
  export default CollectionHandler;
  