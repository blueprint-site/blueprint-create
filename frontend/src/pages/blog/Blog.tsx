import { useFetchBlogs } from '@/api/appwrite/useBlogs';
import { ItemGrid } from '@/components/layout/ItemGrid';
import { ListPageLayout } from '@/layouts/ListPageLayout';
import { useListPageFilters } from '@/hooks/useListPageFilters';
import { useInfiniteScroll } from '@/hooks';
import type { Blog } from '@/types';
import { useState, useEffect, useCallback, useMemo } from 'react';
import BlogCard from '@/components/features/blog/BlogCard';

const BlogPage = () => {
  const [page, setPage] = useState(1);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  // Use the simplified list page filters hook
  const { searchValue, handleSearchChange, resetFilters } = useListPageFilters({
    onFilterChange: () => {
      setPage(1);
    },
  });

  // Fetch blogs based on filters
  const { data, isLoading, isFetching } = useFetchBlogs(searchValue, 'all', page);

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
  }, [searchValue]);

  // Append new blogs to the accumulated list
  useEffect(() => {
    if (blogs?.length) {
      const processedBlogs = processBlogs(blogs);

      setAllBlogs((prev) => (page === 1 ? processedBlogs : [...prev, ...processedBlogs]));
    }
  }, [blogs, page, processBlogs]);

  // Check if there are active filters
  const hasActiveFilters = searchValue !== '';

  // Blog pages don't need additional filters beyond search
  const filters = (
    <div className='text-muted-foreground text-sm'>
      Use the search bar above to find blog posts by title or content.
    </div>
  );

  return (
    <ListPageLayout
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      searchPlaceholder='Search blog posts...'
      filters={filters}
      onResetFilters={resetFilters}
      filterTitle='Blog Filters'
      hasActiveFilters={hasActiveFilters}
    >
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
    </ListPageLayout>
  );
};

export default BlogPage;
