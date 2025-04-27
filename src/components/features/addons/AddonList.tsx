import { useState, useEffect } from 'react';
import { useSearchAddons } from '@/api';
import { ListPageLayout, ListPageFilters, ListPageContent } from '@/layouts/ListPageLayout';
import { SearchFilter } from '@/components/layout/SearchFilter';
import { SelectFilter } from '@/components/layout/SelectFilter';
import { FiltersContainer } from '@/components/layout/FiltersContainer';
import { ItemGrid } from '@/components/layout/ItemGrid';
import AddonCard from '@/components/features/addons/addon-card/AddonCard.tsx';
import { useInfiniteScroll } from '@/hooks';
import type { Addon } from '@/types';

const AddonsList = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [loaders, setLoaders] = useState('');
  const [version, setVersion] = useState('');
  const [sort, setSort] = useState('downloads:desc'); // Default sort option
  const [allAddons, setAllAddons] = useState<Addon[]>([]);

  // Set a consistent item limit for all fetches
  const ITEMS_PER_PAGE = 16;

  const {
    data: hits,
    isLoading,
    isFetching,
    hasNextPage,
  } = useSearchAddons({
    query,
    page,
    category,
    version,
    loaders,
    limit: ITEMS_PER_PAGE,
    sort, // Pass the sort option to the hook
  });

  // Use the useInfiniteScroll hook
  const { sentinelRef, loadingMore } = useInfiniteScroll({
    loading: isLoading || isFetching,
    hasMore: hasNextPage,
    onLoadMore: () => {
      if (hasNextPage && !isFetching) {
        console.log('Loading more addons. Current page:', page);
        setPage((prev) => prev + 1);
      }
    },
  });

  // Reset accumulated addons when filters or sort change (except page)
  useEffect(() => {
    setAllAddons([]);
    setPage(1);
  }, [query, category, loaders, version, sort]);

  // Append new addons to the accumulated list
  useEffect(() => {
    if (hits && hits.length > 0) {
      console.log(`New hits fetched: ${hits.length} items`);
      if (page === 1) {
        setAllAddons(hits);
      } else {
        setAllAddons((prev) => [...prev, ...hits]);
      }
    }
  }, [hits, page]);

  // Sort options
  const sortOptions = [
    { value: 'downloads:desc', label: 'Downloads (most to least)' },
    { value: 'downloads:asc', label: 'Downloads (least to most)' },
    // created_at and updated_at does not get properly handled by our API
    // { value: 'createdAt:desc', label: 'Creation date (newest first)' },
    // { value: 'updatedAt:desc', label: 'Last update (newest first)' },
    { value: 'followers:desc', label: 'Followers (most to least)' },
    { value: 'followers:asc', label: 'Followers (least to most)' },
    { value: 'name:asc', label: 'Name (A-Z)' },
    { value: 'name:desc', label: 'Name (Z-A)' },
  ];

  return (
    <ListPageLayout>
      <ListPageFilters>
        <FiltersContainer>
          <div className='flex items-center justify-between'>
            <div className='text-foreground font-minecraft font-semibold md:text-xl'>Filters</div>
            <button
              onClick={() => {
                setQuery('');
                setCategory('');
                setLoaders('');
                setVersion('');
                setSort('downloads:desc');
                setPage(1);
              }}
              className='text-primary text-sm'
              aria-label='Reset filters'
            >
              Reset
            </button>
          </div>
          <SearchFilter value={query} onChange={setQuery} placeholder='Search addons...' />
          <SelectFilter
            label='Category'
            value={category}
            onChange={setCategory}
            options={[
              { value: 'all', label: 'All' },
              { value: 'tech', label: 'Tech' },
              { value: 'energy', label: 'Energy' },
              { value: 'magic', label: 'Magic' },
            ]}
          />
          <SelectFilter
            label='Loaders'
            value={loaders}
            onChange={setLoaders}
            options={[
              { value: 'all', label: 'All' },
              { value: 'Forge', label: 'Forge' },
              { value: 'Fabric', label: 'Fabric' },
              { value: 'NeoForge', label: 'NeoForge' },
              { value: 'Quilt', label: 'Quilt' },
            ]}
          />
          <SelectFilter
            label='Version'
            value={version}
            onChange={setVersion}
            options={[
              { value: 'all', label: 'All' },
              { value: '1.18.2', label: '1.18.2' },
              { value: '1.19.2', label: '1.19.2' },
              { value: '1.21.1', label: '1.21.1' },
            ]}
          />
          <SelectFilter label='Sort by' value={sort} onChange={setSort} options={sortOptions} />
        </FiltersContainer>
      </ListPageFilters>

      <ListPageContent>
        <ItemGrid
          items={allAddons}
          renderItem={(addon) => <AddonCard key={addon.$id} addon={addon} />}
          isLoading={isLoading && page === 1} // Only show loading state for initial page
          isError={false}
          emptyMessage='No addons found.'
          infiniteScrollEnabled={true}
          loadingMore={loadingMore}
          sentinelRef={sentinelRef}
          animationEnabled={true} // Toggle animations on/off
          animationDelay={0.1} // Control the stagger delay
          animationDuration={0.4} // Control the animation duration
          staggerItemCount={ITEMS_PER_PAGE} // Match to our items per page
          skeletonCount={ITEMS_PER_PAGE} // Show the right number of skeletons
        />
      </ListPageContent>
    </ListPageLayout>
  );
};

export default AddonsList;
