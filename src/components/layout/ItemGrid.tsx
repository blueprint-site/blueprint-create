import React, { useState, useEffect } from 'react';
import { cn } from '@/config/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

// Skeleton component for the grid items
const ItemSkeleton = () => (
  <div className='flex flex-col space-y-3'>
    <Skeleton className='h-40 w-full rounded-xl' />
    <div className='space-y-2'>
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-3/4' />
    </div>
  </div>
);

interface ItemGridProps<T> {
  readonly items: readonly T[] | undefined;
  readonly renderItem: (item: T, index: number) => React.ReactNode;
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly emptyMessage?: string;
  readonly errorMessage?: string;
  readonly loadingComponent?: React.ReactNode;
  readonly className?: string;
  readonly gridClassName?: string;
  // Infinite scroll props
  readonly infiniteScrollEnabled?: boolean;
  readonly loadingMore?: boolean;
  readonly sentinelRef?: (node: HTMLDivElement) => void;
  // Animation props
  readonly animationEnabled?: boolean;
  readonly animationDelay?: number;
  readonly animationDuration?: number;
  // Stagger control
  readonly staggerItemCount?: number;
  readonly skeletonCount?: number;
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
  // Stagger control
  staggerItemCount = 16,
  skeletonCount = 16,
}: ItemGridProps<T>) {
  const [initialRender, setInitialRender] = useState(true);
  const [prevItemsCount, setPrevItemsCount] = useState(0);

  // Handle initial animation completion
  useEffect(() => {
    if (items?.length && !isLoading && animationEnabled) {
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

  // Track newly loaded items
  useEffect(() => {
    if (items?.length > prevItemsCount && !initialRender && animationEnabled) {
      setPrevItemsCount(items.length);
    }
  }, [items, prevItemsCount, initialRender, animationEnabled]);

  // Render functions for different states
  const renderLoadingState = () => (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'mx-auto grid max-w-[128rem]',
          'grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
          gridClassName
        )}
      >
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

  const renderErrorState = () => (
    <div
      className={cn(
        'text-destructive bg-destructive/10 rounded-md p-8 text-center font-semibold',
        className
      )}
    >
      {errorMessage}
    </div>
  );

  const renderEmptyState = () => (
    <div className={cn('py-12 text-center', className)}>
      <h3 className='text-lg font-semibold'>{emptyMessage}</h3>
    </div>
  );

  const renderWithAnimation = (item: T, index: number) => {
    const isNewItem = index >= prevItemsCount;

    const getDelay = () => {
      if (initialRender) {
        // Initial render gets staggered delays
        return (animationDelay * (index % staggerItemCount)) / (staggerItemCount / 4);
      } else if (isNewItem) {
        // Newly loaded items get a medium stagger
        const positionInBatch = index - prevItemsCount;
        return (
          ((animationDelay / 2) * (positionInBatch % staggerItemCount)) / (staggerItemCount / 4)
        );
      }
      return 0; // Already visible items don't need a delay
    };

    return (
      <motion.div
        key={index}
        initial={isNewItem || initialRender ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: animationDuration,
          delay: getDelay(),
          ease: 'easeOut',
        }}
      >
        {renderItem(item, index)}
      </motion.div>
    );
  };

  // Handle different rendering states
  if (isLoading && (!items || items.length === 0)) {
    return renderLoadingState();
  }

  if (isError) {
    return renderErrorState();
  }

  if (!items || items.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className={className}>
      <div
        className={cn(
          'mx-auto grid max-w-[128rem]',
          'grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
          gridClassName
        )}
      >
        {items.map((item, index) =>
          animationEnabled ? (
            renderWithAnimation(item, index)
          ) : (
            <div key={index} className='h-full'>
              {renderItem(item, index)}
            </div>
          )
        )}
      </div>

      {/* Infinite scroll elements */}
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
