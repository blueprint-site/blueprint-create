import React from 'react';
import { cn } from '@/config/utils';

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
  loadingMore?: boolean; // Add loadingMore prop
  sentinelRef?: (node: HTMLDivElement) => void; // Add sentinelRef prop
}

export function ItemGrid<T>({ 
  items,
  renderItem,
  isLoading = false,
  isError = false,
  emptyMessage = "No items found.",
  errorMessage = "Failed to load items.",
  loadingComponent,
  className,
  gridClassName,
  // Infinite scroll props
  infiniteScrollEnabled = false,
  loadingMoreComponent,
  loadingMore = false, // Add loadingMore prop
  sentinelRef, // Add sentinelRef prop
}: ItemGridProps<T>) {
  if (isLoading && (!items || items.length === 0)) {
    return (
      <div className={cn("flex justify-center items-center min-h-40", className)}>
        {loadingComponent || <p>Loading...</p>}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn("text-destructive text-center font-semibold p-8 bg-destructive/10 rounded-md", className)}>
        {errorMessage}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <h3 className="text-lg font-semibold">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", gridClassName)}>
        {items.map((item, index) => renderItem(item, index))}
      </div>

      {/* Loading more indicator and sentinel */}
      {infiniteScrollEnabled && (
        <>
          {loadingMore && (
            <div className="py-4 flex justify-center">
              {loadingMoreComponent || <p>Loading more...</p>}
            </div>
          )}
          <div ref={sentinelRef} className="h-4 w-full mt-4" /> {/* Attach sentinelRef */}
        </>
      )}
    </div>
  );
}