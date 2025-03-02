import { useFetchBlogs, useFetchBlogTags } from '@/api/endpoints/useBlogs';
import { FiltersContainer } from '@/components/layout/FiltersContainer';
import { ItemGrid } from '@/components/layout/ItemGrid';
import { SearchFilter } from '@/components/layout/SearchFilter';
import { SelectFilter } from '@/components/layout/SelectFilter';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ListPageContent, ListPageLayout, ListPageSidebar } from '@/layouts/ListPageLayout';
import { Blog } from '@/types';
import { useState, useEffect } from 'react';
import BlogCard from '@/components/features/blog/BlogCard';

const BlogPage = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [tagId, setTagId] = useState('all');
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  // Fetch blog tags for the filter
  const { data: tagOptions = [], isLoading: tagsLoading } = useFetchBlogTags();

  // Add "All" option to tags
  const allTagOptions = [
    { value: 'all', label: 'All Tags' },
    ...(tagOptions || [])
  ];

  const {
    data,
    isLoading,
    isFetching,
  } = useFetchBlogs(query, tagId, page);

  // Extract the needed properties from the data
  const blogs = data?.data || [];
  const hasNextPage = data?.hasNextPage || false;

  // Use the useInfiniteScroll hook
  const { sentinelRef, loadingMore } = useInfiniteScroll({
    loading: isLoading || isFetching,
    hasMore: hasNextPage,
    onLoadMore: () => {
      if (hasNextPage && !isFetching) {
        console.log('Loading more blogs. Current page:', page);
        setPage((prev) => prev + 1);
      }
    },
  });

  // Reset accumulated blogs when filters change (except page)
  useEffect(() => {
    setAllBlogs([]);
    setPage(1); // Reset to first page when filters change
  }, [query, tagId]);

  // Process blogs to map tag IDs to full tag objects
  const processBlogsWithTags = (blogsToProcess: Blog[]) => {
    if (!blogsToProcess || blogsToProcess.length === 0) return [];

    return blogsToProcess.map(blog => {
      // Check if blog has tags array and tagOptions is available
      if (blog.tags && blog.tags.length > 0 && tagOptions && tagOptions.length > 0) {
        // Map each tag ID to its corresponding tag object from tagOptions
        const mappedTags = blog.tags.map(tag => {
          // Assuming tag is an object with id property
          const tagId = typeof tag === 'string' ? tag : tag.id;
          const foundTag = tagOptions.find(t => t.value === tagId);
          return foundTag || { value: tagId, label: tagId }; // Fallback if tag not found
        });

        return {
          ...blog,
          tagObjects: mappedTags // Add new property with the full tag objects
        };
      }

      return {
        ...blog,
        tagObjects: [] // Empty array if no tags or tagOptions not loaded yet
      };
    });
  };

  // Append new blogs to the accumulated list with mapped tags
  useEffect(() => {
    if (blogs && blogs.length > 0) {
      console.log('New blogs fetched:', blogs);
      const processedBlogs = processBlogsWithTags(blogs);

      if (page === 1) {
        setAllBlogs(processedBlogs); // Replace the list if it's the first page
      } else {
        setAllBlogs((prev) => [...prev, ...processedBlogs]); // Append new blogs for subsequent pages
      }
    }
  }, [blogs, page, tagOptions]);

  const resetFilters = () => {
    setQuery('');
    setTagId('all');
    setPage(1);
  };

  return (
    <ListPageLayout>
      <ListPageSidebar>
        <FiltersContainer>
          <div className='flex items-center justify-between'>
            <div className='text-foreground font-minecraft text-xl font-semibold'>Filters</div>
            <button
              onClick={resetFilters}
              className='text-primary flex items-center gap-1 text-sm'
              aria-label='Reset filters'>
              Reset
            </button>
          </div>

          <SearchFilter value={query} onChange={setQuery} placeholder='Search blog posts...' />

          <SelectFilter
            label='Tags'
            value={tagId}
            onChange={setTagId}
            options={allTagOptions}
            isLoading={tagsLoading}
          />
        </FiltersContainer>
      </ListPageSidebar>

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