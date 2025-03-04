import { useState, useEffect } from 'react';
import { useSearchAddons } from '@/api';
import { ListPageLayout, ListPageFilters, ListPageContent } from '@/layouts/ListPageLayout';
import { SearchFilter } from '@/components/layout/SearchFilter';
import { SelectFilter } from '@/components/layout/SelectFilter';
import { FiltersContainer } from '@/components/layout/FiltersContainer';
import { ItemGrid } from '@/components/layout/ItemGrid';
import AddonCard from '@/components/features/addons/addon-card/AddonCard.tsx';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Addon } from '@/schemas/addon.schema.tsx';

const AddonsList = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [loaders, setLoaders] = useState('');
  const [version, setVersion] = useState('');
  const [allAddons, setAllAddons] = useState<Addon[]>([]);

  // Set a consistent item limit for all fetches
  const ITEMS_PER_PAGE = 16;

  const {
    data: hits,
    isLoading,
    isFetching,
    hasNextPage,
    totalHits,
  } = useSearchAddons(
    query,
    page,
    category,
    version,
    loaders,
    ITEMS_PER_PAGE
  );

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

  // Reset accumulated addons when filters change (except page)
  useEffect(() => {
    setAllAddons([]);
    setPage(1);
  }, [query, category, loaders, version]);

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

  // Filter options
  const categoryOptions = [
    { value: 'all', label: 'All' },
    { value: 'tech', label: 'Tech' },
    { value: 'energy', label: 'Energy' },
    { value: 'magic', label: 'Magic' },
  ];

  const loaderOptions = [
    { value: 'all', label: 'All' },
    { value: 'Forge', label: 'Forge' },
    { value: 'Fabric', label: 'Fabric' },
    { value: 'NeoForge', label: 'NeoForge' },
    { value: 'Quilt', label: 'Quilt' },
  ];

  const versionOptions = [
    { value: 'all', label: 'All' },
    { value: '1.18.2', label: '1.18.2' },
    { value: '1.19.2', label: '1.19.2' },
    { value: '1.21.1', label: '1.21.1' },
  ];

  const resetFilters = () => {
    setQuery('');
    setCategory('');
    setLoaders('');
    setVersion('');
    setPage(1);
  };

  // Simple render function - no need for animation wrapper since ItemGrid handles it
  const renderAddon = (addon) => {
    return <AddonCard key={addon.$id} addon={addon} />;
  };

  return (
    <ListPageLayout>
      <ListPageFilters>
        <FiltersContainer>
          <div className='flex items-center justify-between'>
            <div className='text-foreground font-minecraft md:text-xl font-semibold'>Filters</div>
            <button
              onClick={resetFilters}
              className='text-primary text-sm'
              aria-label='Reset filters'
            >
              Reset
            </button>
          </div>
          <div className='md:hidden'></div>
          <SearchFilter
            value={query}
            onChange={setQuery}
            placeholder='Search addons...'
          />
          <SelectFilter
            label='Category'
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />
          <SelectFilter
            label='Loaders'
            value={loaders}
            onChange={setLoaders}
            options={loaderOptions}
          />
          <SelectFilter
            label='Version'
            value={version}
            onChange={setVersion}
            options={versionOptions}
          />
        </FiltersContainer>
      </ListPageFilters>

      <ListPageContent>
        {/* Display total hits count */}
        {totalHits > 0 && !isLoading && (
          <div className="mb-4 text-sm text-muted-foreground">
            Found {totalHits} addon{totalHits !== 1 ? 's' : ''}
          </div>
        )}

        <ItemGrid
          items={allAddons}
          renderItem={renderAddon}
          isLoading={isLoading && page === 1} // Only show loading state for initial page
          isError={false}
          emptyMessage='No addons found.'
          infiniteScrollEnabled={true}
          loadingMore={loadingMore}
          sentinelRef={sentinelRef}
          // Animation props
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