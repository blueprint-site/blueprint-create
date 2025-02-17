import { useQuery } from '@tanstack/react-query';
import searchClient from '@/lib/meilisearch';
import {Schematic} from "@/types";

const useSearchSchematics = (query: string, page: number, category: string, version: string, loaders: string) => {
    if (!query) {
        query = '*';
    }

    // Define filter logic for category and version
    const filter = () => {
        let filterQuery = '';

        // Loader filter logic
        if (loaders && loaders !== 'all') {
            filterQuery = `modloaders = ${loaders}`;
        }

        // Category filter logic
        if (category && category !== 'all') {
            if (filterQuery) filterQuery += ' AND ';
            filterQuery += `categories = ${category}`;
        }

        // Version filter logic
        if (version && version !== 'all') {
            if (filterQuery) filterQuery += ' AND ';
            filterQuery += `game_versions = ${version}`;
        }
        console.log('query: ', filterQuery);
        return [filterQuery];

    };

    return useQuery({
        queryKey: ['searchSchematics', query, page, category, version, loaders],
        queryFn: async () => {
            const index = searchClient.index('schematics');
            const result = await index.search(query, {
                limit: 6,
                offset: (page - 1) * 6,
                filter: filter(),
            });
            return result.hits as Schematic[];
        },
        enabled: !!query
    });
};

export default useSearchSchematics;
