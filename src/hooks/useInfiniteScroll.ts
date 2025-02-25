import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
}

export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  rootMargin = '0px',
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // Set up the intersection observer to watch the sentinel element
  const sentinelRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return; // Prevent multiple calls
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
            setLoadingMore(true);
            onLoadMore();
          }
        },
        { rootMargin, threshold }
      );

      if (node) {
        lastElementRef.current = node;
        observer.current.observe(node);
      }
    },
    [loading, hasMore, onLoadMore, rootMargin, threshold, loadingMore]
  );

  // Reset loadingMore when loading state changes
  useEffect(() => {
    if (!loading) {
      setLoadingMore(false);
    }
  }, [loading]);

  return {
    sentinelRef,
    loadingMore,
  };
}