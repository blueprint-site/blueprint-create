import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Blog } from '@/types';
import { toast } from '@/hooks/useToast';
import { databases, ID } from '@/config/appwrite.ts';
import { Query } from 'appwrite';

// Constantes pour votre base de données
const DATABASE_ID = '67b1dc430020b4fb23e3';
const COLLECTION_ID = '67b232540003ed4d8e4f';

/**
 * Hook to delete a blog.
 * @returns {Mutation} Mutation object to delete a blog.
 */
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Article deleted ✅',
        });
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error deleting the article ❌',
        });
        console.error('Error deleting blog:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

/**
 * Hook to fetch a single blog by ID.
 * @param {string} blogId - The ID of the blog to fetch.
 * @returns {Query} Query object to fetch a single blog.
 */
export const useFetchBlog = (blogId?: string) => {
  return useQuery<Blog | null>({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      if (!blogId || blogId === 'new') return null;

      const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, blogId);
      const blogData: Blog = {
        $id: response.$id,
        title: response.title || '',
        content: response.content || '',
        slug: response.slug || '',
        authors: response.author || '',
        $createdAt: response.$createdAt || '',
        $updatedAt: response.$updatedAt || '',
        img_url: response.img_url || '',
        status: response.status || '',
        links: response.links ? JSON.parse(response.links as string) : [],
        tags: response.tags ? JSON.parse(response.tags as string) : [],
        likes: response.likes || '',
        authors_uuid: response.authors_uuid || '',
      };

      return blogData;
    },
    enabled: Boolean(blogId),
    staleTime: 1000 * 60 * 5, // Rafraîchissement tous les 5 minutes
    retry: false, // Ne pas essayer en cas d'échec
  });
};

/**
 * Hook to fetch blog tags from the blog_tags collection.
 * @returns {Query} Query object with blog tags data
 */
export const useFetchBlogTags = () => {
  return useQuery({
    queryKey: ['blog_tags'],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, '67b2326100053d0e304f', []);

        return response.documents.map((tag) => ({
          value: tag.$id,
          label: tag.name || tag.$id,
        }));
      } catch (err) {
        console.error('Error fetching blog tags:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};

/**
 * Hook to fetch all blogs with pagination, search and tag filter support.
 * @param {string} query - Search query for blog titles
 * @param {string} tagId - Tag ID to filter blogs
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @returns {Query} Query object with blogs data structured for infinite scroll
 */
export const useFetchBlogs = (query: string = '', tagId: string = 'all', page: number = 1, limit: number = 12) => {
  return useQuery({
    queryKey: ['blogs', query, tagId, page, limit],
    queryFn: async () => {
      try {
        const queryParams = [Query.orderDesc('$createdAt'), Query.limit(limit), Query.offset((page - 1) * limit)];

        // Only add search query if it's not empty
        if (query && query.trim() !== '') {
          queryParams.unshift(Query.search('title', query));
        }

        // Add tag filter if it's not 'all'
        if (tagId && tagId !== 'all') {
          // We need to search in the JSON array
          // This assumes tags are stored as a JSON string array in the database
          queryParams.unshift(Query.search('tags', tagId));
        }

        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queryParams);

        const blogs: Blog[] = response.documents.map((doc) => ({
          $id: doc.$id,
          title: doc.title || '',
          content: doc.content || '',
          slug: doc.slug || '',
          authors: doc.authors || [],
          $createdAt: doc.$createdAt || '',
          $updatedAt: doc.$updatedAt || '',
          img_url: doc.img_url || '',
          status: doc.status || '',
          links: doc.links ? JSON.parse(doc.links as string) : [],
          tags: doc.tags ? JSON.parse(doc.tags as string) : [],
          likes: doc.likes || 0,
          authors_uuid: doc.authors_uuid || [],
          // Add missing fields based on Blog schema
          blog_tags: [], // This might need to be populated from somewhere else
        }));

        const hasNextPage = page * limit < response.total;
        const hasPreviousPage = page > 1;

        return {
          data: blogs,
          isLoading: false,
          isFetching: false,
          hasNextPage,
          hasPreviousPage,
          total: response.total,
        };
      } catch (err) {
        console.error('Error fetching blogs:', err);
        throw new Error('Failed to fetch blogs');
      }
    },
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

/**
 * Hook to save or update a blog.
 * @returns {Mutation} Mutation object to save or update a blog.
 */
export const useSaveBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: Partial<Blog>) => {
      // Sérialiser les objets JSON avant de les envoyer à Appwrite
      const serializedBlog = {
        ...blog,
        authors: blog.authors ? blog.authors : [],
        likes: blog.likes ? blog.likes : 0,
        links: blog.links ? JSON.stringify(blog.links) : undefined,
        tags: blog.tags ? JSON.stringify(blog.tags) : undefined,
      };

      // Si l'ID du blog n'est pas présent, créer un nouveau document
      if (!blog.$id) {
        return databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), serializedBlog);
      }
      // Si un ID existe, mettre à jour le document existant
      return databases.updateDocument(DATABASE_ID, COLLECTION_ID, blog.$id, serializedBlog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
