import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import supabase from './Supabase';

const Updater = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ [key: string]: string } | null>(null);

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
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
        const addonList = localStorage.getItem('addonList');

        if (!lastUpdatedTime || lastUpdatedTime < oneHourAgo || !addonList) {
            console.log('[Updater]: Fetching new addons and categories...');
            try {
                // Fetch the addon list
                const response = await axios.get(import.meta.env.APP_ADDONSAPI_URL);
                const addonData = response.data;

                // Update localStorage
                localStorage.setItem('addonList', JSON.stringify(addonData));
                localStorage.setItem('addonsLastUpdated', Date.now().toString());

                console.log('Addon list updated:', addonData);

                // Fetch categories after updating addons
                await fetchCategories();

                // Update UI state if needed
                setStatus('Addons and categories updated.');
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.error('Failed to fetch addon list:', error.message);
                } else {
                    console.error('Failed to fetch addon list:', error);
                }
            }
            window.location.reload();
        } else {
            console.log('Addons were updated less than an hour ago. Skipping updates.');
            setStatus('No updates needed.');
        }
    }

    useEffect(() => {
        const categoriesLocal = localStorage.getItem('categories');
        if (!categoriesLocal) {
            console.log('Categories not found in localStorage. Fetching...');
            fetchCategories();
        } else {
            setCategories(JSON.parse(categoriesLocal));
            console.log('Loaded categories from localStorage.');
        }

        // Fetch addons and categories
        fetchAddonsAndCategories();
    }, []);

    return (
        <div>
            <h1>Updater</h1>
            <p>Status: {status || 'Idle'}</p>
            <pre>{JSON.stringify(categories, null, 2)}</pre>
        </div>
    );
};

export default Updater;
