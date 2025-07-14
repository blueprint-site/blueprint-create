import { useState, useEffect } from 'react';
import { useSearchAddons } from '@/api';
import { ListPageLayout } from '@/layouts/ListPageLayout';
import { SelectFilter } from '@/components/layout/SelectFilter';
import { ItemGrid } from '@/components/layout/ItemGrid';
import AddonCard from '@/components/features/addons/addon-card/AddonCard.tsx';
import { useInfiniteScroll } from '@/hooks';
import { useListPageFilters } from '@/hooks/useListPageFilters';
import type { Addon } from '@/types';

const AddonsList = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [loaders, setLoaders] = useState('');
  const [version, setVersion] = useState('');
  const [allAddons, setAllAddons] = useState<Addon[]>([]);

  // Search functionality
  const {
    searchValue,
    handleSearchChange,
    resetFilters: resetSearchFilters,
  } = useListPageFilters({
    onFilterChange: () => {
      setPage(1);
      setAllAddons([]);
    },
  });

  // Set a consistent item limit for all fetches
  const ITEMS_PER_PAGE = 16;

  const {
    data: hits,
    isLoading,
    isFetching,
    hasNextPage,
  } = useSearchAddons({
    query: searchValue,
    page,
    category,
    version,
    loaders,
    limit: ITEMS_PER_PAGE,
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

  // Reset accumulated addons when filters change (except page)
  useEffect(() => {
    setAllAddons([]);
    setPage(1);
  }, [searchValue, category, loaders, version]);

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

  const resetFilters = () => {
    resetSearchFilters();
    setCategory('');
    setLoaders('');
    setVersion('');
    setPage(1);
    setAllAddons([]);
  };

  // Check if there are active filters
  const hasActiveFilters =
    category !== '' || loaders !== '' || version !== '' || searchValue !== '';

  // Simple render function - no need for animation wrapper since ItemGrid handles it
  const renderAddon = (addon: Addon) => {
    return <AddonCard key={addon.$id} addon={addon} />;
  };

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

  const filtersContent = (
    <>
      <SelectFilter
        label='Category'
        value={category}
        onChange={setCategory}
        options={categoryOptions}
      />
      <SelectFilter label='Loaders' value={loaders} onChange={setLoaders} options={loaderOptions} />
      <SelectFilter
        label='Version'
        value={version}
        onChange={setVersion}
        options={versionOptions}
      />
    </>
  );

  return (
    <ListPageLayout
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      searchPlaceholder='Search addons...'
      filters={filtersContent}
      onResetFilters={resetFilters}
      filterTitle='Addon Filters'
      hasActiveFilters={hasActiveFilters}
    >
      <ItemGrid
        items={allAddons}
        renderItem={renderAddon}
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
    </ListPageLayout>
  );
};

export default AddonsList;
