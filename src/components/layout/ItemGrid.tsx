import React from 'react';
import { cn } from '@/config/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton component for the grid items
const ItemSkeleton = () => {
  return (
    <div className='flex flex-col space-y-3'>
      <Skeleton className='h-40 w-full rounded-xl' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>
    </div>
  );
};

interface ItemGridProps<T> {
  items: T[] | undefined;
  renderItem: (item: T, index: number) => React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  loadingComponent?: React.ReactNode;
  className?: string;
  gridClassName?: string;
  // Infinite scroll props
  infiniteScrollEnabled?: boolean;
  loadingMoreComponent?: React.ReactNode;
  loadingMore?: boolean;
  sentinelRef?: (node: HTMLDivElement) => void;
}

export function ItemGrid<T>({
  items,
  renderItem,
  isLoading = false,
  isError = false,
  emptyMessage = 'No items found.',
  errorMessage = 'Failed to load items.',
  loadingComponent,
  className,
  gridClassName,
  infiniteScrollEnabled = false,
  loadingMoreComponent,
  loadingMore = false,
  sentinelRef,
}: ItemGridProps<T>) {
  if (isLoading && (!items || items.length === 0)) {
    return (
      <div className={cn('w-full', className)}>
        <div
          className={cn(
            'mx-auto grid max-w-[128rem]',
            'grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
            gridClassName
          )}>
          {/* Display a set of skeleton items during initial loading */}
          {loadingComponent || (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <ItemSkeleton key={`skeleton-${index}`} />
              ))}
            </>
          )}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          'text-destructive bg-destructive/10 rounded-md p-8 text-center font-semibold',
          className
        )}>
        {errorMessage}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={cn('py-12 text-center', className)}>
        <h3 className='text-lg font-semibold'>{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={cn(
          'mx-auto grid max-w-[128rem]',
          'grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          gridClassName
        )}>
        {items.map((item, index) => renderItem(item, index))}
      </div>

      {/* Loading more indicator and sentinel */}
      {infiniteScrollEnabled && (
        <>
          {loadingMore && (
            <div className='flex justify-center py-4'>
              {loadingMoreComponent || (
                <div className='flex flex-row items-center space-x-2'>
                  <Skeleton className='h-6 w-6 rounded-full' />
                  <Skeleton className='h-4 w-24' />
                </div>
              )}
            </div>
          )}
          <div ref={sentinelRef} className='mt-4 h-4 w-full' />
        </>
      )}
    </div>
  );
}
