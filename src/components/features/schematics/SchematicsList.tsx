// src/pages/schematics/SchematicsList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { SchematicCardAdapter } from '@/components/features/schematics/SchematicCardAdapter';
import { buttonVariants } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { ListPageLayout } from '@/layouts/ListPageLayout';
import { ItemGrid } from '@/components/layout/ItemGrid';
import { useInfiniteScroll } from '@/hooks';
import { useAdvancedSchematicFilters } from '@/hooks/useAdvancedSchematicFilters';
import { useSearchSchematicsAdvanced } from '@/api/meilisearch/useSearchSchematicsAdvanced';
import { SchematicFilterPanel } from '@/components/features/schematics/filters/SchematicFilterPanel';
import type { SchematicSearchResult } from '@/types/schematicSearch';

function SchematicsList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [allSchematics, setAllSchematics] = useState<SchematicSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Use the new advanced filter hook
  const {
    filters,
    facets,
    filterString,
    hasActiveFilters,
    updateFilter,
    applyPreset,
    clearFilters,
  } = useAdvancedSchematicFilters();

  // Set a consistent item limit for all fetches
  const ITEMS_PER_PAGE = 16;

  // Update search query in filters
  useEffect(() => {
    updateFilter('query', searchQuery);
  }, [searchQuery, updateFilter]);

  const {
    data: searchData,
    isLoading,
    isError,
  } = useSearchSchematicsAdvanced({
    filters: { ...filters, query: searchQuery },
    page,
    limit: ITEMS_PER_PAGE,
    enableFacets: true,
  });

  const hits = React.useMemo(() => searchData?.hits || [], [searchData]);
  const hasNextPage = searchData ? page * ITEMS_PER_PAGE < searchData.estimatedTotalHits : false;
  const isFetching = isLoading;

  // Use the useInfiniteScroll hook
  const { sentinelRef, loadingMore } = useInfiniteScroll({
    loading: isLoading || isFetching,
    hasMore: hasNextPage,
    onLoadMore: () => {
      if (hasNextPage && !isFetching) {
        console.log('Loading more schematics. Current page:', page);
        setPage((prev) => prev + 1);
      }
    },
  });

  // Reset accumulated schematics when filters change (except page)
  useEffect(() => {
    setAllSchematics([]);
    setPage(1);
  }, [filterString, searchQuery, filters.sort]);

  // Append new schematics to the accumulated list
  useEffect(() => {
    if (hits && hits.length > 0) {
      console.log(`New hits fetched: ${hits.length} items`);
      if (page === 1) {
        setAllSchematics(hits as SchematicSearchResult[]);
      } else {
        setAllSchematics((prev) => {
          // Check if we already have these items to prevent duplicates
          const existingIds = new Set(prev.map((schematic) => schematic.$id || schematic.id));
          const newItems = hits.filter(
            (schematic: SchematicSearchResult) => !existingIds.has(schematic.$id || schematic.id)
          );
          if (newItems.length > 0) {
            return [...prev, ...(newItems as SchematicSearchResult[])];
          }
          return prev;
        });
      }
    }
  }, [hits, page]);

  const handleResetFilters = () => {
    clearFilters();
    setPage(1);
    setAllSchematics([]);
  };

  // Simple render function - no need for animation wrapper since ItemGrid handles it
  const renderSchematic = (schematic: SchematicSearchResult) => {
    const schematicId = schematic.$id || schematic.id;
    return (
      <SchematicCardAdapter
        key={schematicId}
        schematic={schematic}
        onClick={() => navigate(`../schematics/${schematicId}/${schematic.slug}`)}
      />
    );
  };

  // Get active filter count
  const activeFilterCount = [
    filters.categories.length,
    filters.subcategories.length,
    filters.materials.primary.length,
    filters.complexity.levels.length,
    filters.compatibility.requiredMods.length,
    filters.dimensions.width.min || filters.dimensions.width.max ? 1 : 0,
    filters.dimensions.height.min || filters.dimensions.height.max ? 1 : 0,
    filters.dimensions.blockCount.min || filters.dimensions.blockCount.max ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Filter panel content - using the new SchematicFilterPanel
  const filtersContent = (
    <SchematicFilterPanel
      filters={filters}
      facets={facets}
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      onApplyPreset={applyPreset}
    />
  );

  const headerContent = (
    <Link className={buttonVariants({ variant: 'default' })} to='../schematics/upload'>
      <Upload className='mr-2 h-4 w-4' /> Upload Schematic
    </Link>
  );

  return (
    <ListPageLayout
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder='Search schematics...'
      filters={filtersContent}
      onResetFilters={handleResetFilters}
      filterTitle={`Schematic Filters${activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}`}
      hasActiveFilters={hasActiveFilters}
      headerContent={headerContent}
    >
      <ItemGrid
        items={allSchematics}
        renderItem={renderSchematic}
        isLoading={isLoading && page === 1} // Only show loading state for initial page
        isError={isError}
        emptyMessage='No schematics found matching your filters.'
        errorMessage='Oops! Failed to load schematics.'
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
}

export default SchematicsList;
