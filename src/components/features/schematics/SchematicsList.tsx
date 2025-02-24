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

function SchematicsList() {
  const navigate = useNavigate();
  const [allSchematics, setAllSchematics] = useState<any[]>([]);

  const {
    filters,
    setQuery,
    setCategory,
    setSubCategory,
    setVersion,
    setLoaders,
    resetFilters,
    loadMore,
    categoryOptions,
    subCategoryOptions,
    versionOptions,
    loaderOptions,
    hasSubCategories
  } = useSchematicFilters();

  const {
    data: schematics,
    isLoading,
    isError,
    hasNextPage
  } = useSearchSchematics(filters);

  // When filters change (other than page), reset the accumulated schematics
  useEffect(() => {
    if (filters.page === 1) {
      setAllSchematics([]);
    }
  }, [filters.query, filters.category, filters.subCategory, filters.version, filters.loaders]);

  // When new data loads, append it to our accumulated data
  useEffect(() => {
    if (schematics && schematics.length > 0) {
      if (filters.page === 1) {
        setAllSchematics(schematics);
      } else {
        setAllSchematics(prev => [...prev, ...schematics]);
      }
    }
  }, [schematics, filters.page]);

  return (
    <ListPageLayout>
      <ListPageSidebar>
        <FiltersContainer>
          <div className="flex justify-between items-center">
            <div className="text-foreground font-minecraft text-xl font-semibold">Filters</div>
            <button
              onClick={resetFilters}
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
          isLoading={isLoading && filters.page === 1}
          isError={isError}
          loadingComponent={<GridLoadingState message="Loading schematics..." />}
          loadingMoreComponent={<GridLoadingState size="sm" message="Loading more schematics..." />}
          emptyMessage="No schematics found."
          errorMessage="Oops! Failed to load schematics."
          infiniteScrollEnabled={true}
          hasMore={!!hasNextPage}
          onLoadMore={loadMore}
        />
      </ListPageContent>
    </ListPageLayout>
  );
}

export default SchematicsList;