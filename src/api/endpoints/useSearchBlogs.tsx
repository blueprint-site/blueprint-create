import searchClient from "@/config/meilisearch";
import { useQuery } from "@tanstack/react-query";
import {Blog, SearchBlogProps, SearchBlogResult,} from "@/types";


export const useSearchBlogs = ({
                                        query = '',
                                        page = 1,
                                        tags = ['All'] ,
                                        id = 'all',
                                    }: SearchBlogProps): SearchBlogResult => {
    if(query === ''){
        query = '*'
    }
    // Define filter logic for category, version, and loaders
    const filter = (): string => {
        const filters: string[] = [];
        const addFilter = (field: string, value: string) => {
            if (value && value !== 'all' && value !== 'All') {
                const formattedValue = value.includes(' ') ? `"${value}"` : value;
                filters.push(`${field} = ${formattedValue}`);
            }
        };

        addFilter('$id', id);
        addFilter('tags', tags[0]);

        return filters.length > 0 ? filters.join(' AND ') : '';
    };
    const queryResult = useQuery({
        queryKey: ['searchBlogs', query, page, tags, id],
        queryFn: async () => {
            const index = searchClient.index('blogs');
            const result = await index.search(query, {
                limit: 20,
                offset: (page - 1) * 20,
                filter: filter(),
            });
            const blogList = result.hits as Blog[]
            console.log(filter())

            // Transform `Hits<SchematicsAnswer>` into `Schematic[]`
            const blogs: Blog[] = blogList.map((hit) => ({
                $id: hit.$id, // Ensure this matches the property returned by Meilisearch
                $createdAt: hit.$createdAt,
                $updatedAt: hit.$updatedAt,
                title: hit.title,
                content: hit.content,
                slug: hit.slug,
                img_url: hit.img_url,
                status: hit.status,
                links: hit.links,
                tags: hit.tags,
                likes: hit.likes,
                authors_uuid: hit.authors_uuid,
                authors: hit.authors,
            }));

            return {
                data: blogs,
                totalHits: result.estimatedTotalHits ?? 0,
            };
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!query,
    });

    const { data, isLoading, isError, error, isFetching } = queryResult;

    // `data` is now an array of Schematic objects
    const blogs = data?.data ?? [];

    const totalHits = data?.totalHits ?? 0;
    const hasNextPage = (page - 1) * 20 + blogs.length < totalHits;
    const hasPreviousPage = page > 1;

    return {
        ...queryResult,
        data: blogs,
        hasNextPage,
        hasPreviousPage,
        totalHits,
        page,
        isLoading,
        isError,
        error,
        isFetching
    }
};