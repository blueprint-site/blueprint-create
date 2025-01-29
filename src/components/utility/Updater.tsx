
import { useEffect, useState } from 'react';
import supabase from "@/components/utility/Supabase";

const Updater = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ [key: string]: string } | null>(null);
    const [needsReload, setNeedsReload] = useState(false);

    async function fetchCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select();

            if (error) {
                console.error('Error fetching categories:', error);
                return [];
            }

            if (data) {
                // Create a map for quick lookup and save it to localStorage
                const categoryMap = data.reduce((acc: { [key: string]: string }, category: { id: string; name: string }) => {
                    acc[category.id] = category.name;
                    return acc;
                }, {});

                localStorage.setItem('categories', JSON.stringify(categoryMap));
                setCategories(categoryMap);
                console.log('Categories updated:', categoryMap);
            }

            return data || [];
        } catch (err) {
            console.error('Error fetching categories:', err);
            return [];
        }
    }

    async function fetchAddonsAndCategories() {
        const addonsLastUpdated = localStorage.getItem('addonsLastUpdated');
        const lastUpdatedTime = addonsLastUpdated ? new Date(parseInt(addonsLastUpdated)) : null;
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 10); // 1 hour ago
        const addonList = localStorage.getItem('addonList');

        if (!lastUpdatedTime || lastUpdatedTime < oneHourAgo || !addonList) {
            console.log('[Updater]: Fetching new addons and categories...');
            try {

                const { data, error } = await supabase
                .from('mods')
                .select('*')
                .eq('isValid', 'true')
                    .eq('isChecked', 'true')
        
              if (error) {
                console.error('Error fetching addons:', error);
                return;
              }
        
              // Vérifier si les données existent et les typer explicitement
              if (data) {
                  // Fetch the addon list
                  const addonData = data;
  
                  // Update localStorage
                  localStorage.setItem('addonList', JSON.stringify(addonData));
                  localStorage.setItem('addonsLastUpdated', Date.now().toString());
  
                  console.log('Addon list updated:', addonData);
  
                  // Fetch categories after updating addons
                  await fetchCategories();
  
                  // Update UI state
                  setStatus('Addons and categories updated.');
                  
                  // Instead of forcing a page reload, set a flag
                  setNeedsReload(true);
              }
              
            } catch (error) {
                if (error) {
                    console.error('Failed to fetch addon list:', error);
                } else {
                    console.error('Failed to fetch addon list:', error);
                }
                setStatus('Error updating addons.');
            }
        } else {
            console.log('Addons were updated less than an hour ago. Skipping updates.');
            setStatus('No updates needed.');
        }
    }

    useEffect(() => {
        const categoriesLocal = localStorage.getItem('categories');
        if (!categoriesLocal) {
            console.log('Categories not found in localStorage. Fetching...');
            fetchCategories().then();
        } else {
            setCategories(JSON.parse(categoriesLocal));
            console.log('Loaded categories from localStorage.');
        }

        // Fetch addons and categories
        fetchAddonsAndCategories().then();
    }, []);

    // Handle the reload notification
    useEffect(() => {
        if (needsReload) {
            // Show a notification to the user that new content is available
            const shouldReload = window.confirm('New content is available. Would you like to reload the page to see the updates?');
            if (shouldReload) {
                window.location.reload();
            }
            setNeedsReload(false);
        }
    }, [needsReload]);

    // Don't render anything if being used as a hook
    if (typeof window !== 'undefined' && window.location.pathname === '/updater') {
        return (
            <div>
                <h1>Updater</h1>
                <p>Status: {status || 'Idle'}</p>
                <pre>{JSON.stringify(categories, null, 2)}</pre>
            </div>
        );
    }

    return null;
};

export default Updater;
