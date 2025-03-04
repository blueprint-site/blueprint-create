import React, { useState, useEffect } from 'react';
import { cn } from '@/config/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

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
  loadingMore?: boolean;
  sentinelRef?: (node: HTMLDivElement) => void;
  // Animation props
  animationEnabled?: boolean;
  animationDelay?: number;
  animationDuration?: number;
  // Stagger control
  staggerItemCount?: number; // Number of items per stagger group
  skeletonCount?: number; // Number of skeleton items to show
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
  loadingMore = false,
  sentinelRef,
  // Animation props with defaults
  animationEnabled = false,
  animationDelay = 0.1,
  animationDuration = 0.4,
  // Stagger control - defaulting to 16 items per stagger group
  staggerItemCount = 16,
  skeletonCount = 16,
}: ItemGridProps<T>) {
  // Track if this is the initial render for animation purposes
  const [initialRender, setInitialRender] = useState(true);
  // Store the previously displayed items count to identify newly loaded ones
  const [prevItemsCount, setPrevItemsCount] = useState(0);

  // After the initial items are loaded and animated, set initialRender to false
  useEffect(() => {
    if (items && items.length > 0 && !isLoading && animationEnabled) {
      // Calculate timeout based directly on staggerItemCount
      // This ensures all items in the group have time to animate
      const timeoutDuration = Math.max(
        1000,
        staggerItemCount * animationDelay * 1000 + animationDuration * 1000
      );

      const timeout = setTimeout(() => {
        setInitialRender(false);
        setPrevItemsCount(items.length);
      }, timeoutDuration);

      return () => clearTimeout(timeout);
    }
  }, [items, isLoading, animationEnabled, staggerItemCount, animationDelay, animationDuration]);

  // Update prevItemsCount when new items are loaded
  useEffect(() => {
    if (items && items.length > prevItemsCount && !initialRender && animationEnabled) {
      setPrevItemsCount(items.length);
    }
  }, [items, prevItemsCount, initialRender, animationEnabled]);

  if (isLoading && (!items || items.length === 0)) {
    return (
      <div className={cn('w-full', className)}>
        <div
          className={cn(
            'mx-auto grid max-w-[128rem]',
            'grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            gridClassName
          )}>
          {/* Display a set of skeleton items during initial loading */}
          {loadingComponent || (
            <>
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <div key={`skeleton-${index}`}>
                  <ItemSkeleton />
                </div>
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

  // Function to wrap items with animation when animation is enabled
  const renderWithAnimation = (item: T, index: number) => {
    // Calculate if this is a newly loaded item
    const isNewItem = index >= prevItemsCount;

    // Apply different animation delays based on whether it's initial load or new items
    const getDelay = () => {
      if (initialRender) {
        // Initial render gets longer staggered delays
        // Use the staggerItemCount to determine how to group the animations
        return (animationDelay * (index % staggerItemCount)) / (staggerItemCount / 4);
      } else if (isNewItem) {
        // Newly loaded items get a medium stagger
        // Calculate position within the new batch
        const positionInBatch = index - prevItemsCount;
        return (
          ((animationDelay / 2) * (positionInBatch % staggerItemCount)) / (staggerItemCount / 4)
        );
      } else {
        // Already visible items don't need a delay
        return 0;
      }
    };

    const delay = getDelay();

    return (
      <motion.div
        key={index}
        initial={isNewItem || initialRender ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: animationDuration,
          delay,
          ease: 'easeOut',
        }}>
        {renderItem(item, index)}
      </motion.div>
    );
  };

  return (
    <div className={className}>
      <div
        className={cn(
          'mx-auto grid max-w-[128rem]',
          'grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          gridClassName
        )}>
        {items.map((item, index) =>
          animationEnabled ? (
            renderWithAnimation(item, index)
          ) : (
            <div key={index} className='h-full'>{renderItem(item, index)}</div>
          )
        )}
      </div>

      {/* Loading more indicator and sentinel */}
      {infiniteScrollEnabled && (
        <>
          {loadingMore && (
            <div className='flex justify-center py-4'>
              <div className='flex flex-row items-center space-x-2'>
                <Skeleton className='h-6 w-6 rounded-full' />
                <Skeleton className='h-4 w-24' />
              </div>
            </div>
          )}
          <div ref={sentinelRef} className='mt-4 h-4 w-full' />
        </>
      )}
    </div>
  );
}
