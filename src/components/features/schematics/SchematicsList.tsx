// src/pages/schematics/SchematicsList.tsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import SchematicCard from '@/components/features/schematics/SchematicCard';
import { useSearchSchematics } from '@/api';
import { buttonVariants } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { ListPageLayout } from '@/layouts/ListPageLayout';
import { SelectFilter } from '@/components/layout/SelectFilter';
import { ItemGrid } from '@/components/layout/ItemGrid';
import { useSchematicFilters } from '@/hooks';
import { useInfiniteScroll } from '@/hooks';
import type { Schematic } from '@/types';

function SchematicsList() {
  const navigate = useNavigate();
  const [allSchematics, setAllSchematics] = useState<Schematic[]>([]);
  const [page, setPage] = useState(1); // Add separate page state

  const {
    filters,
    setQuery,
    setCategory,
    setSubCategory,
    setCreateVersion,
    setVersion,
    setLoaders,
    resetFilters,
    categoryOptions,
    createVersionOptions,
    subCategoryOptions,
    versionOptions,
    loaderOptions,
    hasSubCategories,
  } = useSchematicFilters();

  // Search functionality that integrates with schematic filters
  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
    setAllSchematics([]);
  };

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
        setPage((prevPage) => prevPage + 1); // Increment local page state
      }
    },
  });

  // Reset accumulated schematics when filters change (except page)
  useEffect(() => {
    setAllSchematics([]);
    setPage(1); // Reset to first page when filters change
  }, [
    filters.query,
    filters.category,
    filters.subCategory,
    filters.version,
    filters.loaders,
    filters.createVersion,
  ]);

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

  // Check if there are active filters
  const hasActiveFilters =
    filters.category !== '' ||
    filters.subCategory !== '' ||
    filters.version !== '' ||
    filters.loaders !== '' ||
    filters.createVersion !== '' ||
    filters.query !== '';

  const filtersContent = (
    <>
      <SelectFilter
        label='Category'
        value={filters.category}
        onChange={setCategory}
        options={categoryOptions}
        placeholder={'Select Category'}
      />

      {/* Only show subcategories if available */}
      {hasSubCategories && (
        <SelectFilter
          label='Subcategory'
          value={filters.subCategory || ''}
          onChange={setSubCategory}
          options={subCategoryOptions}
        />
      )}

      <SelectFilter
        label='Version'
        value={filters.version}
        onChange={setVersion}
        options={versionOptions}
      />

      <SelectFilter
        label='Loaders'
        value={filters.loaders}
        onChange={setLoaders}
        options={loaderOptions}
      />
      <SelectFilter
        label='Create version'
        value={filters.createVersion}
        onChange={setCreateVersion}
        options={createVersionOptions}
      />
    </>
  );

  const headerContent = (
    <Link className={buttonVariants({ variant: 'default' })} to='../schematics/upload'>
      <Upload className='mr-2 h-4 w-4' /> Upload Schematic
    </Link>
  );

  return (
    <ListPageLayout
      searchValue={filters.query}
      onSearchChange={handleSearchChange}
      searchPlaceholder='Search schematics...'
      filters={filtersContent}
      onResetFilters={handleResetFilters}
      filterTitle='Schematic Filters'
      hasActiveFilters={hasActiveFilters}
      headerContent={headerContent}
    >
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
        emptyMessage='No schematics found.'
        errorMessage='Oops! Failed to load schematics.'
        infiniteScrollEnabled={true}
        loadingMore={loadingMore}
        sentinelRef={sentinelRef}
      />
    </ListPageLayout>
  );
}

export default SchematicsList;
