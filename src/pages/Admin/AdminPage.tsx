import { useAdminAddons, useUpdateAddon } from '@/utils/useAddons';
import type { Addon } from '@/types/addons';
import type * as z from 'zod';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

type AddonType = z.infer<typeof Addon>;

interface UndoAction {
  id: string;
  type: 'enable' | 'review';
  addon: AddonType;
  timestamp: number;
}

export default function AdminPage() {
  const { data, isLoading, error, refetch } = useAdminAddons({ reviewStatus: 'unreviewed' });
  const updateAddonMutation = useUpdateAddon();

  const [processedAddons, setProcessedAddons] = useState<Set<string>>(new Set());
  const [undoHistory, setUndoHistory] = useState<UndoAction[]>([]);

  const uncheckedAddons = (data?.addons || []).filter((addon) => !processedAddons.has(addon.$id));

  const addToUndoHistory = useCallback((action: UndoAction) => {
    setUndoHistory((prev) => {
      const newHistory = [action, ...prev].slice(0, 20);
      return newHistory;
    });
  }, []);

  function fetchAddons() {
    if (!isLoading) {
      void refetch();
    }
  }

  useEffect(() => {
    fetchAddons();
  }, []);

  useEffect(() => {
    if (!isLoading && !error && uncheckedAddons.length === 0) {
      fetchAddons();
    }
  }, [uncheckedAddons.length, isLoading, error]);

  const enableAddon = useCallback(
    (addon: AddonType) => {
      addToUndoHistory({
        id: addon.$id,
        type: 'enable',
        addon: { ...addon },
        timestamp: Date.now(),
      });

      updateAddonMutation.mutate(
        {
          addonId: addon.$id,
          data: {
            isChecked: true,
            isValid: true,
            reviewedAt: new Date().toISOString(),
          },
        },
        {
          onSuccess: () => {
            setProcessedAddons((prev) => new Set([...prev, addon.$id]));
            toast.success(`Addon "${addon.name}" has been enabled`);
          },
          onError: (error) => {
            console.error('Failed to enable addon:', error);
            toast.error(`Failed to enable addon "${addon.name}"`);

            setUndoHistory((prev) => prev.slice(1));
          },
        }
      );
    },
    [updateAddonMutation, addToUndoHistory]
  );

  const reviewAddon = useCallback(
    (addon: AddonType) => {
      addToUndoHistory({
        id: addon.$id,
        type: 'review',
        addon: { ...addon },
        timestamp: Date.now(),
      });

      updateAddonMutation.mutate(
        {
          addonId: addon.$id,
          data: {
            isChecked: true,
            isValid: false,
            reviewedAt: new Date().toISOString(),
          },
        },
        {
          onSuccess: () => {
            setProcessedAddons((prev) => new Set([...prev, addon.$id]));
            toast.success(`Addon "${addon.name}" has been marked as reviewed (not an addon)`);
          },
          onError: (error) => {
            console.error('Failed to review addon:', error);
            toast.error(`Failed to review addon "${addon.name}"`);

            setUndoHistory((prev) => prev.slice(1));
          },
        }
      );
    },
    [updateAddonMutation, addToUndoHistory]
  );

  const undoLastAction = useCallback(() => {
    if (undoHistory.length === 0) {
      toast.error('No actions to undo');
      return;
    }

    const lastAction = undoHistory[0];

    updateAddonMutation.mutate(
      {
        addonId: lastAction.id,
        data: {
          isChecked: lastAction.addon.isChecked,
          isValid: lastAction.addon.isValid,
          reviewedAt: lastAction.addon.reviewedAt,
        },
      },
      {
        onSuccess: () => {
          setProcessedAddons((prev) => {
            const newSet = new Set(prev);
            newSet.delete(lastAction.id);
            return newSet;
          });

          setUndoHistory((prev) => prev.slice(1));

          toast.success(`Undid ${lastAction.type} action for "${lastAction.addon.name}"`);
        },
        onError: (error) => {
          console.error('Failed to undo action:', error);
          toast.error(`Failed to undo action for "${lastAction.addon.name}"`);
        },
      }
    );
  }, [undoHistory, updateAddonMutation]);

  return (
    <div className='p-4 lg:px-50'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Admin Addons Page</h1>
        <div className='flex gap-2 items-center'>
          <span className='text-sm'>Undo History: {undoHistory.length}/20</span>
          <button
            onClick={undoLastAction}
            disabled={undoHistory.length === 0 || updateAddonMutation.isPending}
            className='bg-accent text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all'
          >
            Undo Last Action
          </button>
        </div>
      </div>

      {isLoading && <p>Loading addons...</p>}
      {error && <p className='text-red-500'>Error loading addons: {error.message}</p>}

      {!isLoading && !error && (
        <>
          <div className='mb-4 text-sm text-gray-600'>
            Showing {uncheckedAddons.length} unreviewed addon
            {uncheckedAddons.length !== 1 ? 's' : ''}
          </div>

          {uncheckedAddons.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-lg text-gray-500'>No unreviewed addons found!</p>
              <p className='text-sm text-gray-400 mt-2'>All addons have been processed.</p>
            </div>
          ) : (
            <ul className='space-y-4'>
              {uncheckedAddons.map((addon: AddonType) => (
                <li
                  key={addon.$id}
                  className='mb-2 p-4 border rounded-lg shadow-sm bg-blueprint flex gap-5'
                >
                  <img
                    src={addon.icon}
                    alt={addon.name}
                    className='w-20 h-20 rounded object-cover shrink-0'
                  />
                  <div className='grow'>
                    <h2 className='text-xl text-black font-minecraft font-semibold'>
                      {addon.name}
                    </h2>
                    <p className='text-black/70 mb-2'>{addon.description}</p>
                    <div className='flex gap-3'>
                      <p className='text-sm text-black/60 mb-2'>
                        Authors: {addon.authors.join(', ')}
                      </p>
                      <p className='text-sm text-black opacity-70 mb-3'>
                        Status: {addon.isValid ? 'Valid' : 'Invalid'}, Is Checked:{' '}
                        {addon.isChecked ? 'Yes' : 'No'}
                      </p>
                    </div>

                    <div className='flex gap-3'>
                      <button
                        onClick={() => enableAddon(addon)}
                        disabled={updateAddonMutation.isPending}
                        className='bg-green-700 text-white font-minecraft px-5 py-2 rounded hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                      >
                        {updateAddonMutation.isPending ? 'Processing...' : 'Enable'}
                      </button>
                      <button
                        onClick={() => reviewAddon(addon)}
                        disabled={updateAddonMutation.isPending}
                        className='bg-red-700 text-white font-minecraft px-5 py-2 rounded hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                      >
                        {updateAddonMutation.isPending ? 'Processing...' : 'Mark as Reviewed'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
