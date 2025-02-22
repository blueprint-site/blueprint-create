import { useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch.ts';
import { Addon } from "@/schemas/addon.schema.tsx";

export const useSearchAddons = (query: string = 'create', page: number, category: string, version: string, loaders: string) => {

    // Define filter logic for category and version
    const filter = () => {
        let filterQuery = '';

        // Loader filter logic
        if (loaders && loaders !== 'all') {
            filterQuery = `loaders = ${loaders}`;
        }

        // Category filter logic
        if (category && category !== 'all') {
            if (filterQuery) filterQuery += ' AND ';
            filterQuery += `categories = ${category}`;
        }

        // Version filter logic
        if (version && version !== 'all') {
            if (filterQuery) filterQuery += ' AND ';
            filterQuery += `minecraft_versions = ${version}`;
        }
        console.log('query: ', filterQuery);
        return [filterQuery];

    };

    return useQuery({
        queryKey: ['searchAddons', query, page, category, version, loaders],
        queryFn: async () => {
            const index = searchClient.index('addons');
            const result = await index.search(query, {
                limit: 6,
                offset: (page - 1) * 6,
                filter: filter(),
            });
            return result.hits as Addon[];
        },
        enabled: !!query
    });
};


