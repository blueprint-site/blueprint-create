import { useEffect, useRef } from 'react';
import { useFetchAddonBySlug } from '@/api/endpoints/useAddons';
import { Addon } from '@/types';

interface AddonFetcherProps {
  slug: string;
  onAddonFetched: (addon: Addon) => void;
}

export default function AddonFetcher({ slug, onAddonFetched }: AddonFetcherProps) {
  const { data: addon, isLoading, error } = useFetchAddonBySlug(slug);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && addon && !error && !hasProcessedRef.current) {
      hasProcessedRef.current = true;
      onAddonFetched(addon);
    }
  }, [addon, isLoading, error, onAddonFetched]);

  return null;
}
