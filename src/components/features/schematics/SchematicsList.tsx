// src/pages/schematics/SchematicsList.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SchematicCard from '@/components/features/schematics/SchematicCard';
import { useSearchSchematics } from '@/api';
import { buttonVariants } from '@/components/ui/button';
import { Upload, RefreshCw } from 'lucide-react';
import { ListPageLayout, ListPageSidebar, ListPageContent } from '@/layouts/ListPageLayout';
import { SearchFilter } from '@/components/layout/SearchFilter';
import { SelectFilter } from '@/components/layout/SelectFilter';
import { FiltersContainer } from '@/components/layout/FiltersContainer';
import { ItemGrid } from '@/components/layout/ItemGrid';
import { GridLoadingState } from '@/components/layout/GridLoadingState';
import { useSchematicFilters } from '@/hooks/useSchematicFilters';
import { Link } from 'react-router-dom';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Schematic } from '@/types';

function SchematicsList() {
  const navigate = useNavigate();
  const [allSchematics, setAllSchematics] = useState<Schematic[]>([]);
  const [page, setPage] = useState(1); // Add separate page state

  const {
    filters,
    setQuery,
    setCategory,
    setSubCategory,
    setVersion,
    setLoaders,
    resetFilters,
    categoryOptions,
    subCategoryOptions,
    versionOptions,
    loaderOptions,
    hasSubCategories,
  } = useSchematicFilters();

  // Modify to use the separate page state
  const {
    data: schematics,
    isLoading,
    isError,
    isFetching,
    hasNextPage,
  } = useSearchSchematics({
    ...filters,
    page: page, // Use the local page state
  });

  // Use the useInfiniteScroll hook
  const { sentinelRef, loadingMore } = useInfiniteScroll({
    loading: isLoading || isFetching,
    hasMore: hasNextPage,
    onLoadMore: () => {
      if (hasNextPage && !isFetching) {
        console.log('Loading more schematics. Current page:', page);
        setPage(prevPage => prevPage + 1); // Increment local page state
      }
    },
  });

  // Reset accumulated schematics when filters change (except page)
  useEffect(() => {
    setAllSchematics([]);
    setPage(1); // Reset to first page when filters change
  }, [filters.query, filters.category, filters.subCategory, filters.version, filters.loaders]);

  // Append new schematics to the accumulated list
  useEffect(() => {
    if (schematics && schematics.length > 0) {
      if (page === 1) {
        setAllSchematics(schematics);
      } else {
        setAllSchematics((prev) => [...prev, ...schematics]);
      }
    }
  }, [schematics, page]);

  // Handle filter reset
  const handleResetFilters = () => {
    resetFilters();
    setPage(1);
    setAllSchematics([]);
  };

  return (
    <ListPageLayout>
      <ListPageSidebar>
        <FiltersContainer>
          <div className="flex justify-between items-center">
            <div className="text-foreground font-minecraft text-xl font-semibold">Filters</div>
            <button
              onClick={handleResetFilters}
              className="text-sm text-primary flex items-center gap-1"
              aria-label="Reset filters"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>

          <SearchFilter
            value={filters.query}
            onChange={setQuery}
            placeholder="Search schematics..."
          />

          <SelectFilter
            label="Category"
            value={filters.category}
            onChange={setCategory}
            options={categoryOptions}
          />

          {/* Only show subcategories if available */}
          {hasSubCategories && (
            <SelectFilter
              label="Subcategory"
              value={filters.subCategory || ''}
              onChange={setSubCategory}
              options={subCategoryOptions}
            />
          )}

          <SelectFilter
            label="Version"
            value={filters.version}
            onChange={setVersion}
            options={versionOptions}
          />

          <SelectFilter
            label="Loaders"
            value={filters.loaders}
            onChange={setLoaders}
            options={loaderOptions}
          />
        </FiltersContainer>
      </ListPageSidebar>

      <ListPageContent>
        <div className="flex justify-end mb-6">
          <Link
            className={buttonVariants({ variant: 'default' })}
            to="../schematics/upload"
          >
            <Upload className="mr-2 h-4 w-4" /> Upload Schematic
          </Link>
        </div>

        <ItemGrid
          items={allSchematics}
          renderItem={(schematic) => (
            <SchematicCard
              key={schematic.$id}
              schematic={schematic}
              onClick={() => navigate(`../schematics/${schematic.$id}/${schematic.slug}`)}
            />
          )}
          isLoading={isLoading && page === 1}
          isError={isError}
          loadingComponent={<GridLoadingState message="Loading schematics..." />}
          loadingMoreComponent={
            <GridLoadingState
              size="sm"
              message={loadingMore ? "Loading more schematics..." : "No more schematics"}
            />
          }
          emptyMessage="No schematics found."
          errorMessage="Oops! Failed to load schematics."
          infiniteScrollEnabled={true}
          loadingMore={loadingMore}
          sentinelRef={sentinelRef}
        />
      </ListPageContent>
    </ListPageLayout>
  );
}

export default SchematicsList;