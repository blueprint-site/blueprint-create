import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databases } from '@/config/appwrite';
import type { Blog } from '@/types';
import { ID, Query } from 'appwrite';
import { parseJsonFields, serializeJsonFields } from '../utils/json-fields';
import { toast } from '@/hooks';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'blogs';

/**
 * Hook to fetch a single blog by ID.
 * @param {string} blogId - The ID of the blog to fetch.
 * @returns {Query} Query object to fetch a single blog.
 * @throws {Error} Throws an error if the blog cannot be fetched, or if the blogId is invalid.
 */
export const useFetchBlog = (blogId?: string) => {
  return useQuery<Blog | null>({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      if (!blogId || blogId === 'new') return null;

      try {
        const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, blogId);
        // Parse JSON fields before returning
        return parseJsonFields(response);
      } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
      }
    },
    enabled: Boolean(blogId),
  });
};

/**
 * Hook to fetch a single blog by slug.
 * @param {string} slug - The slug of the blog to fetch.
 * @returns {Query} Query object to fetch a single blog.
 */
export const useFetchBlogBySlug = (slug?: string) => {
  return useQuery<Blog | null>({
    queryKey: ['blog', slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const queryParams = [Query.equal('slug', slug), Query.limit(1)];

        const response = await databases.listDocuments<Blog>(
          DATABASE_ID,
          COLLECTION_ID,
          queryParams
        );

        if (response.documents.length === 0) {
          return null;
        }

        return parseJsonFields(response.documents[0]);
      } catch (err) {
        console.error('Error fetching blog:', err);
        throw new Error('Failed to fetch blog');
      }
    },
    refetchOnWindowFocus: false,
    retry: 2,
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
export const useFetchBlogs = (
  query: string = '',
  tagId: string = 'all',
  page: number = 1,
  limit: number = 12
) => {
  return useQuery({
    queryKey: ['blogs', query, tagId, page, limit],
    queryFn: async () => {
      try {
        const queryParams = [
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset((page - 1) * limit),
        ];

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

        const response = await databases.listDocuments<Blog>(
          DATABASE_ID,
          COLLECTION_ID,
          queryParams
        );

        // Parse JSON fields for each blog
        const parsedBlogs = response.documents.map((blog) => parseJsonFields(blog));

        const hasNextPage = page * limit < response.total;
        const hasPreviousPage = page > 1;

        return {
          data: parsedBlogs,
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
 * Hook for saving a blog.
 */
export const useSaveBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: Partial<Blog>) => {
      // Serialize before saving
      const serializedBlog = serializeJsonFields(blog);

      if (blog.$id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          $id,
          $collectionId,
          $databaseId,
          $createdAt,
          $updatedAt,
          $permissions,
          $sequence,
          ...updateData
        } = serializedBlog;
        return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, blog.$id, updateData);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          $id,
          $collectionId,
          $databaseId,
          $createdAt,
          $updatedAt,
          $permissions,
          $sequence,
          ...createData
        } = serializedBlog;
        return await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), createData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};

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
