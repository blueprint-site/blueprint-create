// src/hooks/useInfiniteScroll.ts
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
  // How many pixels before the end to trigger loading more
  offset?: number;
}

export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  rootMargin = '0px',
  threshold = 0.1,
  offset = 300
}: UseInfiniteScrollOptions) {
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // Set up the intersection observer to watch the sentinel element
  const sentinelRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
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

  // Alternative method using scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Don't load more if already loading, if no more items, or if initial load
      if (loading || !hasMore || loadingMore) return;

      // Check if we're near the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - offset
      ) {
        setLoadingMore(true);
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, onLoadMore, offset, loadingMore]);

  // Reset loadingMore when loading state changes
  useEffect(() => {
    if (!loading) {
      setLoadingMore(false);
    }
  }, [loading]);

  return {
    sentinelRef,
    loadingMore
  };
}