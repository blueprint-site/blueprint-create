import { useFetchBlogs } from '@/api/appwrite/useBlogs';
import { FiltersContainer } from '@/components/layout/FiltersContainer';
import { ItemGrid } from '@/components/layout/ItemGrid';
import { SearchFilter } from '@/components/layout/SearchFilter';
import { useInfiniteScroll } from '@/hooks';
import { ListPageContent, ListPageLayout, ListPageFilters } from '@/layouts/ListPageLayout';
import type { Blog } from '@/types';
import { useState, useEffect, useCallback, useMemo } from 'react';
import BlogCard from '@/components/features/blog/BlogCard';

const BlogPage = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  // Fetch blogs based on filters
  const { data, isLoading, isFetching } = useFetchBlogs(query, 'all', page);

  // Extract the needed properties from the data
  const blogs = useMemo(() => data?.data || [], [data?.data]);
  const hasNextPage = data?.hasNextPage || false;

  // Simple blog processor - now without tag processing
  const processBlogs = useCallback((blogsToProcess: Blog[]) => {
    if (!blogsToProcess?.length) return [];
    return blogsToProcess;
  }, []);

  // Handle loading more blogs
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [hasNextPage, isFetching]);

  // Use the useInfiniteScroll hook
  const { sentinelRef, loadingMore } = useInfiniteScroll({
    loading: isLoading || isFetching,
    hasMore: hasNextPage,
    onLoadMore: handleLoadMore,
  });

  // Reset accumulated blogs when filters change (except page)
  useEffect(() => {
    setAllBlogs([]);
    setPage(1);
  }, [query]);

  // Append new blogs to the accumulated list
  useEffect(() => {
    if (blogs?.length) {
      const processedBlogs = processBlogs(blogs);

      setAllBlogs((prev) => (page === 1 ? processedBlogs : [...prev, ...processedBlogs]));
    }
  }, [blogs, page, processBlogs]);

  // Reset filters handler
  const resetFilters = useCallback(() => {
    setQuery('');
    setPage(1);
  }, []);

  return (
    <ListPageLayout>
      <ListPageFilters>
        <FiltersContainer>
          <div className='flex items-center justify-between'>
            <div className='text-foreground font-minecraft text-xl font-semibold'>Filters</div>
            <button
              onClick={resetFilters}
              className='text-primary flex items-center gap-1 text-sm'
              aria-label='Reset filters'
            >
              Reset
            </button>
          </div>

          <SearchFilter value={query} onChange={setQuery} placeholder='Search blog posts...' />
        </FiltersContainer>
      </ListPageFilters>

      <ListPageContent>
        <ItemGrid
          items={allBlogs}
          renderItem={(item) => <BlogCard key={item.$id} blog={item} />}
          isLoading={isLoading}
          isError={false}
          emptyMessage='No blog posts found.'
          infiniteScrollEnabled={true}
          loadingMore={loadingMore}
          sentinelRef={sentinelRef}
        />
      </ListPageContent>
    </ListPageLayout>
  );
};

export default BlogPage;
