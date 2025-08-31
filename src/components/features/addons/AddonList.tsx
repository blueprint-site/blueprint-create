import { useState, useEffect } from 'react';
import { useSearchAddons } from '@/api';
import { ListPageLayout } from '@/layouts/ListPageLayout';
import { ItemGrid } from '@/components/layout/ItemGrid';
import AddonCard from '@/components/features/addons/addon-card/AddonCard.tsx';
import { FilterPanel } from '@/components/features/addons/filters/FilterPanel';
import { useInfiniteScroll } from '@/hooks';
import { useAddonFilters } from '@/hooks/useAddonFilters';
import type { Addon } from '@/types';

const AddonsList = () => {
  const [page, setPage] = useState(1);
  const [allAddons, setAllAddons] = useState<Addon[]>([]);

  // Use the new filter hook
  const {
    filters,
    facets,
    allFacets,
    filterString,
    searchQuery,
    setSearchQuery,
    updateFilter,
    clearFilters,
    applyPreset,
    hasActiveFilters,
    activeFilterCount,
  } = useAddonFilters();

  // Set a consistent item limit for all fetches
  const ITEMS_PER_PAGE = 16;

  const {
    data: hits,
    isLoading,
    isFetching,
    hasNextPage,
    facetDistribution,
  } = useSearchAddons({
    query: searchQuery,
    page,
    filterString,
    sort: filters.sort,
    limit: ITEMS_PER_PAGE,
    includeFacets: true,
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
  }, [filterString, searchQuery, filters.sort]);

  // Append new addons to the accumulated list
  useEffect(() => {
    if (hits && hits.length > 0) {
      console.log(`New hits fetched: ${hits.length} items`);
      if (page === 1) {
        setAllAddons(hits);
      } else {
        setAllAddons((prev) => {
          // Check if we already have these items to prevent duplicates
          const existingIds = new Set(prev.map((addon) => addon.$id));
          const newItems = hits.filter((addon) => !existingIds.has(addon.$id));
          if (newItems.length > 0) {
            return [...prev, ...newItems];
          }
          return prev;
        });
      }
    }
  }, [hits, page]);

  const handleResetFilters = () => {
    clearFilters();
    setPage(1);
    setAllAddons([]);
  };

  // Simple render function - no need for animation wrapper since ItemGrid handles it
  const renderAddon = (addon: Addon) => {
    return <AddonCard key={addon.$id} addon={addon} />;
  };

  // Filter panel content - use allFacets for showing all available options
  const filtersContent = (
    <FilterPanel
      filters={filters}
      facets={allFacets || facetDistribution || facets}
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      onApplyPreset={applyPreset}
    />
  );

  return (
    <ListPageLayout
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder='Search addons...'
      filters={filtersContent}
      onResetFilters={handleResetFilters}
      filterTitle={`Addon Filters${activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}`}
      hasActiveFilters={hasActiveFilters}
    >
      <ItemGrid
        items={allAddons}
        renderItem={renderAddon}
        isLoading={isLoading && page === 1} // Only show loading state for initial page
        isError={false}
        emptyMessage='No addons found matching your filters.'
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
