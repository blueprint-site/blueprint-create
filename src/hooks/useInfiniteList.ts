import { useState, useEffect, useCallback } from 'react';
import { useInfiniteScroll } from '@/hooks';

interface UseInfiniteListOptions<T> {
  // Data fetching
  fetchData: (page: number) => {
    hits: T[] | undefined;
    isLoading: boolean;
    isFetching?: boolean;
    isError?: boolean;
    hasNextPage?: boolean;
    estimatedTotalHits?: number;
  };

  // Configuration
  itemsPerPage?: number;
  dependencies?: unknown[]; // Dependencies that should trigger a reset

  // Item identification
  getItemId: (item: T) => string;

  // Optional callbacks
  onReset?: () => void;
  onPageChange?: (page: number) => void;
}

interface UseInfiniteListReturn<T> {
  // State
  items: T[];
  page: number;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;

  // Actions
  resetList: () => void;
  setPage: (page: number) => void;

  // Infinite scroll
  sentinelRef: (node: HTMLElement | null) => void;
  loadingMore: boolean;
}

export function useInfiniteList<T>({
  fetchData,
  itemsPerPage = 16,
  dependencies = [],
  getItemId,
  onReset,
  onPageChange,
}: UseInfiniteListOptions<T>): UseInfiniteListReturn<T> {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<T[]>([]);

  // Fetch data for current page
  const data = fetchData(page);
  const hits = data.hits || [];
  const isLoading = data.isLoading;
  const isFetching = data.isFetching ?? data.isLoading;
  const isError = data.isError ?? false;

  // Calculate hasNextPage
  const hasNextPage =
    data.hasNextPage !== undefined
      ? data.hasNextPage
      : data.estimatedTotalHits
        ? page * itemsPerPage < data.estimatedTotalHits
        : false;

  // Use infinite scroll hook
  const { sentinelRef: infiniteScrollRef, loadingMore } = useInfiniteScroll({
    loading: isLoading || isFetching,
    hasMore: hasNextPage,
    onLoadMore: () => {
      if (hasNextPage && !isFetching) {
        const newPage = page + 1;
        setPage(newPage);
        onPageChange?.(newPage);
      }
    },
  });

  // Type-safe wrapper for sentinelRef
  const sentinelRef = infiniteScrollRef as (node: HTMLElement | null) => void;

  // Reset when dependencies change
  useEffect(() => {
    setAllItems([]);
    setPage(1);
    onReset?.();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  // Append new items to the accumulated list
  useEffect(() => {
    if (hits && hits.length > 0) {
      if (page === 1) {
        setAllItems(hits);
      } else {
        setAllItems((prev) => {
          // Prevent duplicates
          const existingIds = new Set(prev.map(getItemId));
          const newItems = hits.filter((item) => !existingIds.has(getItemId(item)));

          if (newItems.length > 0) {
            return [...prev, ...newItems];
          }
          return prev;
        });
      }
    }
  }, [hits?.length, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetList = useCallback(() => {
    setAllItems([]);
    setPage(1);
    onReset?.();
  }, [onReset]);

  return {
    items: allItems,
    page,
    isLoading: isLoading && page === 1, // Only show loading for initial page
    isError,
    hasNextPage,
    resetList,
    setPage,
    sentinelRef,
    loadingMore,
  };
}

// Helper function to calculate active filter count for common filter structures
export function calculateActiveFilterCount(filters: Record<string, unknown>): number {
  let count = 0;

  const countValue = (value: unknown): number => {
    if (Array.isArray(value) && value.length > 0) {
      return 1;
    }
    if (typeof value === 'object' && value !== null) {
      // Check for range objects (min/max)
      const obj = value as Record<string, unknown>;
      if ('min' in obj || 'max' in obj) {
        return obj.min || obj.max ? 1 : 0;
      }
      // Recursively count nested objects
      return Object.values(obj).reduce((acc: number, val) => acc + countValue(val), 0);
    }
    if (typeof value === 'string' && value.length > 0) {
      return 1;
    }
    if (typeof value === 'number') {
      return 1;
    }
    return 0;
  };

  for (const value of Object.values(filters)) {
    count += countValue(value);
  }

  return count;
}
