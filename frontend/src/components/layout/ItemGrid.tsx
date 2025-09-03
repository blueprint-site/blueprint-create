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
  readonly getItemKey?: (item: T, index: number) => string | number;
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
  getItemKey,
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
  // Only track animation states if animation is enabled
  const [animationState, setAnimationState] = useState(
    animationEnabled ? { initialRender: true, prevItemsCount: 0 } : null
  );

  // Standardized grid classes
  const gridClasses = cn(
    'mx-auto grid max-w-[128rem]',
    'grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
    gridClassName
  );

  // Handle initial animation completion
  useEffect(() => {
    if (!animationEnabled || !animationState || !items?.length || isLoading) return;

    const timeoutDuration = Math.max(
      1000,
      staggerItemCount * animationDelay * 1000 + animationDuration * 1000
    );

    const timeout = setTimeout(() => {
      setAnimationState({
        initialRender: false,
        prevItemsCount: items.length,
      });
    }, timeoutDuration);

    return () => clearTimeout(timeout);
  }, [
    items,
    isLoading,
    animationEnabled,
    staggerItemCount,
    animationDelay,
    animationDuration,
    animationState,
  ]);

  // Track newly loaded items
  useEffect(() => {
    if (
      !animationEnabled ||
      !animationState ||
      !items?.length ||
      animationState.initialRender ||
      items.length <= animationState.prevItemsCount
    )
      return;

    setAnimationState({
      ...animationState,
      prevItemsCount: items.length,
    });
  }, [items, animationState, animationEnabled]);

  // Calculate animation delay based on item position
  const calculateDelay = (index: number, initialRender: boolean, prevItemsCount: number) => {
    const isNewItem = index >= prevItemsCount;

    if (initialRender) {
      return (animationDelay * (index % staggerItemCount)) / 4;
    }

    if (isNewItem) {
      return (animationDelay * ((index - prevItemsCount) % staggerItemCount)) / 8;
    }

    return 0;
  };

  // Render functions for different states
  if (isLoading && (!items || items.length === 0)) {
    return (
      <div className={cn('w-full', className)}>
        <div className={gridClasses}>
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
        )}
      >
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
      <div className={gridClasses}>
        {items.map((item, index) => {
          // Generate a key for each item
          const itemKey = getItemKey ? getItemKey(item, index) : `item-${index}`;

          if (!animationEnabled) {
            return (
              <div key={itemKey} className='h-full'>
                {renderItem(item, index)}
              </div>
            );
          }

          // Animation is enabled
          const { initialRender, prevItemsCount } = animationState!;
          const isNewItem = index >= prevItemsCount;
          const delay = calculateDelay(index, initialRender, prevItemsCount);

          return (
            <motion.div
              key={itemKey}
              initial={isNewItem || initialRender ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: animationDuration,
                delay,
                ease: 'easeOut',
              }}
            >
              {renderItem(item, index)}
            </motion.div>
          );
        })}
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
