import { useQuery } from '@tanstack/react-query';
import searchClient from '@/config/meilisearch.ts';
import {Schematic, SearchSchematicsProps} from "@/types";
export const useSearchSchematics = ({
                                        query = '',
                                        page = 1,
                                        category = 'All',
                                        subCategory = 'All',
                                        version = 'all',
                                        loaders = 'all',
                                        id = 'all',
                                    }: SearchSchematicsProps) => {
    if(!query) {
        query = '*'
    }
    // Define filter logic for category and version
    const filter = () => {
        const filters: string[] = [];

        const addFilter = (field: string, value: string) => {
            if (value && value !== 'all' && value !== 'All') {
                // Entourer la valeur de guillemets si elle contient des espaces
                const formattedValue = value.includes(' ') ? `"${value}"` : value;
                filters.push(`${field} = ${formattedValue}`);
            }
        };

        addFilter('modloaders', loaders);
        addFilter('categories', category);
        addFilter('subCategories', subCategory);
        addFilter('user_id', id);
        addFilter('game_versions', version);

        console.log(filters);
        return filters.length > 0 ? filters.join(' AND ') : '';
    };


    return useQuery({
        queryKey: ['searchSchematics', query, page, category, subCategory, version, loaders, id],
        queryFn: async () => {
            const index = searchClient.index('schematics');
            const result = await index.search(query, {
                limit: 20,
                offset: (page - 1) * 20,
                filter: filter(),
            });
            return result.hits as Schematic[];

        },
        enabled: !!query
    });
};
