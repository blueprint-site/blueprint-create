import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PushChangesProps } from '../types';
import { useUserStore } from '@/api/stores/userStore';
import { useUpdateAddon } from '@/api/endpoints/useAddons';
import { LoadingSpinner } from '@/components/loading-overlays/LoadingSpinner';
import TimerProgress from '../components/TimerProgress';
import AddonFetcher from '../components/AddonFetcher';
import type { Addon } from '@/types';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ClaimAddonsStep({ selectedAddonSlugs }: Readonly<PushChangesProps>) {
  const [processingState, setProcessingState] = useState<
    'loading' | 'processing' | 'success' | 'error'
  >('loading');
  const [processedAddons, setProcessedAddons] = useState<{ slug: string; success: boolean }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const user = useUserStore((state) => state.user);
  const updateAddon = useUpdateAddon();

  const handleAddonFetched = useCallback(
    async (addon: Addon) => {
      try {
        if (!user?.$id) {
          throw new Error('User ID not available');
        }

        if (!addon?.$id) {
          throw new Error(`Missing ID for addon: ${addon.slug}`);
        }

        await updateAddon.mutateAsync({
          addonId: addon.$id,
          data: { claimed_by: user.$id },
        });

        setProcessedAddons((prev) => [...prev, { slug: addon.slug, success: true }]);
      } catch (err) {
        console.error(`Error processing addon ${addon.slug}:`, err);
        setProcessedAddons((prev) => [...prev, { slug: addon.slug, success: false }]);
        setError(`Failed to claim addon: ${addon.slug}. Please try again later.`);
      }
    },
    [user?.$id, updateAddon]
  );

  // Track processing state
  useEffect(() => {
    if (processedAddons.length === 0 && selectedAddonSlugs.length > 0) {
      setProcessingState('processing');
    } else if (processedAddons.length === selectedAddonSlugs.length) {
      setProcessingState(processedAddons.some((a) => !a.success) ? 'error' : 'success');
    }
  }, [processedAddons, selectedAddonSlugs]);

  // Calculate countdown time for next sync
  const nextSyncDate = new Date();
  nextSyncDate.setHours(nextSyncDate.getHours() + 1, 0, 0, 0);
  const countdownTime = Math.max(0, Math.floor((nextSyncDate.getTime() - Date.now()) / 1000));

  const successfulCount = processedAddons.filter((a) => a.success).length;
  const failedCount = processedAddons.filter((a) => !a.success).length;
  const progressPercentage = (processedAddons.length / selectedAddonSlugs.length) * 100;

  return (
    <div className='flex flex-col gap-4'>
      <DialogHeader>
        <DialogTitle className='text-lg font-medium'>Claiming Addons</DialogTitle>
        <DialogDescription className='text-muted-foreground text-sm'>
          Updating ownership for selected addons
        </DialogDescription>
      </DialogHeader>

      {/* Render fetchers for unprocessed addons */}
      {selectedAddonSlugs.map(
        (slug) =>
          !processedAddons.some((a) => a.slug === slug) && (
            <AddonFetcher key={slug} slug={slug} onAddonFetched={handleAddonFetched} />
          )
      )}

      {/* Processing Status */}
      {processingState === 'processing' && (
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <LoadingSpinner className='h-5 w-5' />
            <span className='text-sm'>
              Processing {processedAddons.length}/{selectedAddonSlugs.length} addons...
            </span>
          </div>
          <div className='bg-muted h-2 w-full overflow-hidden rounded-full'>
            <div
              className='bg-primary h-full transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Results Summary */}
      {processingState !== 'loading' && (
        <div className='rounded-md border p-4'>
          <h4 className='mb-3 flex items-center gap-2 font-medium'>
            {processingState === 'success' ? (
              <CheckCircle2 className='h-5 w-5 text-green-500' />
            ) : (
              <AlertCircle className='h-5 w-5 text-yellow-500' />
            )}
            Verification Results
          </h4>

          <div className='space-y-2 text-sm'>
            <p>
              <span className='font-medium'>Successful:</span> {successfulCount} addon
              {successfulCount !== 1 ? 's' : ''}
            </p>
            {failedCount > 0 && (
              <p className='text-yellow-600 dark:text-yellow-400'>
                <span className='font-medium'>Failed:</span> {failedCount} addon
                {failedCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='rounded-md border border-red-300 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-900/20'>
          <p className='flex items-center gap-2 font-medium text-red-600 dark:text-red-400'>
            <AlertCircle className='h-5 w-5' />
            Verification Error
          </p>
          <p className='mt-2 text-sm text-red-500 dark:text-red-400'>{error}</p>
        </div>
      )}

      {/* Success State */}
      {processingState === 'success' && (
        <div className='space-y-4'>
          <div className='rounded-md bg-green-50 p-4 dark:bg-green-900/20'>
            <p className='font-medium text-green-800 dark:text-green-300'>Verification complete!</p>
            <p className='mt-1 text-sm text-green-700 dark:text-green-400'>
              Changes will be visible after the next sync:
            </p>
          </div>

          <TimerProgress
            startTimestamp={Date.now()}
            countdownTime={countdownTime}
            description='Next sync happens in:'
            icon={<RefreshCcw size={16} />}
          />

          <div className='mt-2 space-y-2 text-sm'>
            <h4 className='font-medium'>Frequently Asked Questions</h4>
            <ul className='space-y-2'>
              <li className='flex gap-2'>
                <span>•</span>
                <div>
                  <p className='font-medium'>When will it show up?</p>
                  <p className='text-muted-foreground'>Changes appear within 1 hour</p>
                </div>
              </li>
              <li className='flex gap-2'>
                <span>•</span>
                <div>
                  <p className='font-medium'>How do I undo this?</p>
                  <p className='text-muted-foreground'>Contact support on Discord</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button disabled={processingState === 'processing'}>Done</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}
