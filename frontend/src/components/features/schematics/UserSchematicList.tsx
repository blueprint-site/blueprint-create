import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { SchematicCardAdapter } from '@/components/features/schematics/SchematicCardAdapter';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Upload, Edit, Trash2, RefreshCw } from 'lucide-react';
import { ItemGrid } from '@/components/layout/ItemGrid';
import { FiltersContainer } from '@/components/layout/FiltersContainer';
import { SearchFilter } from '@/components/layout/SearchFilter';
import { MobileSearchFilterDrawer } from '@/components/layout/MobileSearchFilterDrawer';
import { useInfiniteScroll } from '@/hooks';
import { useAdvancedSchematicFilters } from '@/hooks/useAdvancedSchematicFilters';
import { useSearchSchematicsAdvanced } from '@/api/meilisearch/useSearchSchematicsAdvanced';
import { SchematicFilterPanel } from '@/components/features/schematics/filters/SchematicFilterPanel';
import { useDeleteSchematics } from '@/api/appwrite/useSchematics';
import { useUserStore } from '@/api/stores/userStore';
import { cn } from '@/config/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import type { SchematicSearchResult } from '@/types/schematicSearch';

// Extended SchematicCardAdapter with edit/delete buttons
const UserSchematicCard = ({
  schematic,
  onClick,
  onEdit,
  onDelete,
}: {
  schematic: SchematicSearchResult;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: () => void;
}) => {
  return (
    <div className='group relative'>
      <SchematicCardAdapter schematic={schematic} onClick={onClick} />

      {/* Action buttons overlay */}
      <div className='absolute top-2 right-2 z-20 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
        <Button
          variant='default'
          size='icon'
          className='bg-primary/90 h-8 w-8 backdrop-blur'
          onClick={onEdit}
          title='Edit'
        >
          <Edit className='h-4 w-4' />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              className='h-8 w-8'
              title='Delete'
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Schematic</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{schematic.title}&quot;? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const UserSchematicList = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { mutate: deleteSchematic } = useDeleteSchematics(user?.$id);

  const [page, setPage] = useState(1);
  const [allSchematics, setAllSchematics] = useState<SchematicSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Use the advanced filter hook
  const {
    filters,
    facets,
    filterString,
    hasActiveFilters,
    updateFilter,
    applyPreset,
    clearFilters,
  } = useAdvancedSchematicFilters();

  const ITEMS_PER_PAGE = 12;

  // Update search query in filters
  useEffect(() => {
    updateFilter('query', searchQuery);
  }, [searchQuery, updateFilter]);

  // Modified filters to include user_id
  const userFilters = {
    ...filters,
    query: searchQuery,
    user_id: user?.$id || '',
  };

  const {
    data: searchData,
    isLoading,
    isError,
    refetch,
  } = useSearchSchematicsAdvanced({
    filters: userFilters,
    page,
    limit: ITEMS_PER_PAGE,
    enableFacets: true,
  });

  const hits = React.useMemo(() => searchData?.hits || [], [searchData]);
  const hasNextPage = searchData ? page * ITEMS_PER_PAGE < searchData.estimatedTotalHits : false;
  const isFetching = isLoading;

  // Use infinite scroll
  const { sentinelRef, loadingMore } = useInfiniteScroll({
    loading: isLoading || isFetching,
    hasMore: hasNextPage,
    onLoadMore: () => {
      if (hasNextPage && !isFetching) {
        setPage((prev) => prev + 1);
      }
    },
  });

  // Reset when filters change
  useEffect(() => {
    setAllSchematics([]);
    setPage(1);
  }, [filterString, searchQuery, filters.sort]);

  // Append new schematics
  useEffect(() => {
    if (hits && hits.length > 0) {
      if (page === 1) {
        setAllSchematics(hits as SchematicSearchResult[]);
      } else {
        setAllSchematics((prev) => {
          const existingIds = new Set(prev.map((s) => s.$id || s.id));
          const newItems = hits.filter(
            (s: SchematicSearchResult) => !existingIds.has(s.$id || s.id)
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

  const handleDelete = (id: string) => {
    deleteSchematic(id, {
      onSuccess: () => {
        console.log(`Schematic ${id} deleted successfully`);
        setAllSchematics((prev) => prev.filter((s) => (s.$id || s.id) !== id));
        refetch();
      },
      onError: (error) => {
        console.error('Failed to delete schematic:', error);
      },
    });
  };

  const handleCardClick = (schematic: SchematicSearchResult) => {
    const id = schematic.$id || schematic.id;
    navigate(`/schematics/${id}/${schematic.slug}`);
  };

  const handleEditClick = (event: React.MouseEvent, schematic: SchematicSearchResult) => {
    event.stopPropagation();
    const id = schematic.$id || schematic.id;
    navigate(`/schematics/edit/${id}`);
  };

  // Render function with edit/delete capabilities
  const renderSchematic = (schematic: SchematicSearchResult) => {
    const schematicId = schematic.$id || schematic.id;
    return (
      <UserSchematicCard
        key={schematicId}
        schematic={schematic}
        onClick={() => handleCardClick(schematic)}
        onEdit={(e) => handleEditClick(e, schematic)}
        onDelete={() => handleDelete(schematicId)}
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

  if (!user) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <p className='text-muted-foreground'>Please log in to view your schematics</p>
      </div>
    );
  }

  // Filter panel content
  const filterContent = (
    <SchematicFilterPanel
      filters={filters}
      facets={facets}
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      onApplyPreset={applyPreset}
    />
  );

  return (
    <div className='flex w-full flex-col gap-4 lg:flex-row'>
      {/* Desktop Filters Sidebar */}
      <div className={cn('hidden shrink-0 lg:block lg:w-64')}>
        <FiltersContainer>
          <div className='mb-4 flex items-center justify-between'>
            <div className='text-foreground font-minecraft text-xl font-semibold'>
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </div>
            <button
              onClick={handleResetFilters}
              className='text-primary flex items-center gap-1 text-sm'
              aria-label='Reset filters'
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>

          <SearchFilter
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder='Search your schematics...'
          />

          {filterContent}
        </FiltersContainer>
      </div>

      {/* Main Content */}
      <div className='flex-1'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>My Schematics</h2>
          <Link
            className={buttonVariants({ variant: 'default', size: 'sm' })}
            to='/schematics/upload'
          >
            <Upload className='mr-2 h-4 w-4' /> Upload New
          </Link>
        </div>

        <ItemGrid
          items={allSchematics}
          renderItem={renderSchematic}
          isLoading={isLoading && page === 1}
          isError={isError}
          emptyMessage='You have not uploaded any schematics yet.'
          errorMessage='Failed to load your schematics.'
          infiniteScrollEnabled={true}
          loadingMore={loadingMore}
          sentinelRef={sentinelRef}
          animationEnabled={true}
          animationDelay={0.1}
          animationDuration={0.4}
          staggerItemCount={ITEMS_PER_PAGE}
          skeletonCount={ITEMS_PER_PAGE}
        />
      </div>

      {/* Mobile Search and Filter Drawer */}
      <MobileSearchFilterDrawer
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onResetFilters={handleResetFilters}
        placeholder='Search your schematics...'
        title={`Filters${activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}`}
        hasActiveFilters={hasActiveFilters}
      >
        {filterContent}
      </MobileSearchFilterDrawer>
    </div>
  );
};

export default UserSchematicList;
