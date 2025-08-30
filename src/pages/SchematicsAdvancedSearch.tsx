import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAdvancedSchematicFilters } from '@/hooks/useAdvancedSchematicFilters';
import { useSearchSchematicsInfinite } from '@/api/meilisearch/useSearchSchematicsAdvanced';
import { SchematicFilterPanel } from '@/components/features/schematics/filters/SchematicFilterPanel';
import { useInView } from 'react-intersection-observer';
import type { SchematicSearchResult } from '@/types/schematicSearch';
import { normalizeSchematicSearchResult } from '@/types/schematicSearch';

/**
 * Advanced schematic search page with dynamic filtering
 */
export default function SchematicsAdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Use the advanced filters hook
  const { filters, facets, hasActiveFilters, updateFilter, applyPreset, clearFilters } =
    useAdvancedSchematicFilters({ query: searchQuery });

  // Search schematics with infinite scrolling
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useSearchSchematicsInfinite({
      filters,
      limit: 24,
      enableFacets: true,
    });

  // Infinite scroll trigger
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  });

  // Auto-fetch next page when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('query', searchQuery);
  };

  // Calculate total results
  const totalResults = data?.pages[0]?.estimatedTotalHits || 0;
  const allSchematics = data?.pages.flatMap((page) => page.hits) || [];

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Schematic Library</h1>
        <p className='text-muted-foreground'>
          Discover and download amazing Minecraft schematics with advanced filtering
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className='mb-6'>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              type='search'
              placeholder='Search schematics...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>

          {/* Mobile Filter Toggle */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='lg:hidden'>
                <SlidersHorizontal className='h-4 w-4' />
                {hasActiveFilters && (
                  <span className='bg-primary absolute -top-1 -right-1 h-3 w-3 rounded-full' />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-80'>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className='mt-4'>
                <SchematicFilterPanel
                  filters={filters}
                  facets={facets}
                  onFilterChange={updateFilter}
                  onApplyPreset={applyPreset}
                  onClearFilters={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Button type='submit'>Search</Button>
        </div>
      </form>

      <div className='flex gap-8'>
        {/* Desktop Sidebar Filters */}
        <aside className='hidden w-80 shrink-0 lg:block'>
          <div className='sticky top-4'>
            <SchematicFilterPanel
              filters={filters}
              facets={facets}
              onFilterChange={updateFilter}
              onApplyPreset={applyPreset}
              onClearFilters={clearFilters}
            />
          </div>
        </aside>

        {/* Results */}
        <div className='flex-1'>
          {/* Results Header */}
          <div className='mb-4 flex items-center justify-between'>
            <p className='text-muted-foreground text-sm'>
              {isLoading ? (
                'Searching...'
              ) : (
                <>
                  Found <span className='font-semibold'>{totalResults}</span> schematics
                  {filters.query && (
                    <>
                      {' '}
                      for &ldquo;<span className='font-semibold'>{filters.query}</span>&rdquo;
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <SchematicCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className='py-12 text-center'>
              <p className='text-muted-foreground mb-4'>
                An error occurred while searching. Please try again.
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : allSchematics.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='text-muted-foreground mb-4'>
                No schematics found matching your criteria.
              </p>
              <Button variant='outline' onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {allSchematics.map((schematic) => (
                  <SchematicCard
                    key={schematic.id || schematic.$id}
                    schematic={normalizeSchematicSearchResult(schematic)}
                  />
                ))}
              </div>

              {/* Load More Trigger */}
              <div ref={loadMoreRef} className='mt-8 flex justify-center'>
                {isFetchingNextPage && (
                  <div className='flex items-center gap-2'>
                    <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
                    <span className='text-muted-foreground text-sm'>Loading more...</span>
                  </div>
                )}
                {!hasNextPage && allSchematics.length > 0 && (
                  <p className='text-muted-foreground text-sm'>No more schematics to load</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Schematic card component
 */
function SchematicCard({ schematic }: { schematic: SchematicSearchResult }) {
  return (
    <div className='group bg-card relative overflow-hidden rounded-lg border transition-all hover:shadow-lg'>
      {/* Thumbnail */}
      <div className='bg-muted aspect-video overflow-hidden'>
        {schematic.thumbnail || (schematic.image_urls && schematic.image_urls.length > 0) ? (
          <img
            src={schematic.thumbnail || schematic.image_urls?.[0]}
            alt={schematic.title}
            className='h-full w-full object-cover transition-transform group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <Package className='text-muted-foreground/50 h-12 w-12' />
          </div>
        )}

        {/* Featured Badge */}
        {schematic.featured && (
          <div className='absolute top-2 right-2'>
            <Badge variant='default' className='gap-1'>
              <Star className='h-3 w-3' />
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-4'>
        <h3 className='mb-1 line-clamp-1 font-semibold'>
          {schematic._formatted?.title ? (
            <div dangerouslySetInnerHTML={{ __html: schematic._formatted.title }} />
          ) : (
            schematic.title
          )}
        </h3>

        <p className='text-muted-foreground mb-3 line-clamp-2 text-sm'>
          {schematic._formatted?.description ? (
            <div dangerouslySetInnerHTML={{ __html: schematic._formatted.description }} />
          ) : (
            schematic.description
          )}
        </p>

        {/* Stats */}
        <div className='text-muted-foreground flex items-center justify-between text-xs'>
          <span>
            by{' '}
            {schematic.author ||
              (schematic.authors && schematic.authors.length > 0
                ? schematic.authors[0]
                : 'Unknown')}
          </span>
          <div className='flex items-center gap-3'>
            <span>{schematic.downloads?.toLocaleString() || 0} downloads</span>
            {schematic.rating && schematic.rating > 0 && (
              <span>⭐ {schematic.rating.toFixed(1)}</span>
            )}
          </div>
        </div>

        {/* Dimensions */}
        {schematic.dimensions && (
          <div className='mt-2 flex items-center gap-2 text-xs'>
            <Badge variant='outline'>
              {schematic.dimensions.width}×{schematic.dimensions.height}×
              {schematic.dimensions.depth}
            </Badge>
            <Badge variant='outline'>
              {schematic.dimensions.blockCount?.toLocaleString() || 0} blocks
            </Badge>
          </div>
        )}

        {/* Categories */}
        {schematic.categories && schematic.categories.length > 0 && (
          <div className='mt-2 flex flex-wrap gap-1'>
            {schematic.categories.slice(0, 2).map((cat: string) => (
              <Badge key={cat} variant='secondary' className='text-xs'>
                {cat}
              </Badge>
            ))}
            {schematic.categories.length > 2 && (
              <Badge variant='secondary' className='text-xs'>
                +{schematic.categories.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <a
        href={`/schematics/${schematic.slug}`}
        className='absolute inset-0'
        aria-label={`View ${schematic.title}`}
      />
    </div>
  );
}

/**
 * Skeleton loader for schematic cards
 */
function SchematicCardSkeleton() {
  return (
    <div className='bg-card overflow-hidden rounded-lg border'>
      <Skeleton className='aspect-video' />
      <div className='space-y-2 p-4'>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
        <div className='mt-3 flex gap-2'>
          <Skeleton className='h-5 w-20' />
          <Skeleton className='h-5 w-20' />
        </div>
      </div>
    </div>
  );
}

// Missing import for Package icon
import { Package } from 'lucide-react';
