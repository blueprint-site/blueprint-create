import { useFetchAllFeaturedAddons } from '@/api/endpoints/useFeaturedAddons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUpdateFeaturedAddon, useDeleteFeaturedAddon } from '@/api/endpoints/useFeaturedAddons';
import type { FeaturedAddon } from '@/types';
import { Trash2, GripVertical, Save, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/config/utils';
import { useToast } from '@/hooks/useToast';

export default function FeaturedAddonsList() {
  const { data: featuredAddons, isLoading, refetch } = useFetchAllFeaturedAddons();
  const { mutate: updateFeaturedAddon } = useUpdateFeaturedAddon();
  const { mutate: deleteFeaturedAddon } = useDeleteFeaturedAddon();
  const { toast } = useToast();

  const [addonToDelete, setAddonToDelete] = useState<FeaturedAddon | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [localAddons, setLocalAddons] = useState<FeaturedAddon[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveCountdown, setSaveCountdown] = useState(0);

  const dragCounter = useRef(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep track of what we've saved to avoid reverting
  const [savedOrderSignature, setSavedOrderSignature] = useState<string>('');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Initialize local state when data loads (but don't overwrite after we've made changes)
  useEffect(() => {
    if (featuredAddons && !hasUnsavedChanges) {
      const incomingSignature = featuredAddons.map((a) => a.$id).join(',');
      const localSignature = localAddons.map((a) => a.$id).join(',');

      // Only update if server data is different and we haven't just saved it
      if (incomingSignature !== localSignature && incomingSignature !== savedOrderSignature) {
        setLocalAddons(featuredAddons);
      }
    }
  }, [featuredAddons, hasUnsavedChanges]);

  const handleDragStart = (e: React.DragEvent, addonId: string) => {
    setDraggedItem(addonId);
    e.dataTransfer.effectAllowed = 'move';
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedItem(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    dragCounter.current = 0;

    if (!draggedItem) return;

    const draggedIndex = localAddons.findIndex((a) => a.$id === draggedItem);
    if (draggedIndex === dropIndex) {
      setDraggedItem(null);
      return;
    }

    // Update local state immediately for instant feedback
    const items = Array.from(localAddons);
    const [reorderedItem] = items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, reorderedItem);

    // Update display_order for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index,
    }));

    setLocalAddons(updatedItems);
    setHasUnsavedChanges(true);
    setDraggedItem(null);

    // Debounce the save operation
    scheduleSave(updatedItems);
  };

  const scheduleSave = useCallback((items: FeaturedAddon[]) => {
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Clear any existing countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Start countdown
    setSaveCountdown(5);

    // Start countdown interval
    countdownIntervalRef.current = setInterval(() => {
      setSaveCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as any;

    // Set a new timeout to save after 5 seconds of no activity
    saveTimeoutRef.current = setTimeout(() => {
      setSaveCountdown(0);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      saveChanges(items);
    }, 5000);
  }, []);

  const saveChanges = async (items: FeaturedAddon[]) => {
    setIsSaving(true);

    try {
      // Batch update all items with their new positions
      const updatePromises = items.map((item, index) =>
        updateFeaturedAddon({
          id: item.$id,
          addon: {
            display_order: index,
          },
        })
      );

      await Promise.all(updatePromises);

      // Remember this order so we don't revert it
      const orderSignature = items.map((a) => a.$id).join(',');
      setSavedOrderSignature(orderSignature);

      setHasUnsavedChanges(false);
      toast({
        title: '✓ Auto-saved',
        description: 'Order updated successfully',
        duration: 1500,
      });
    } catch (error) {
      toast({
        title: 'Error saving order',
        description: 'Failed to update addon order. Please try again.',
        variant: 'destructive',
      });
      // Reload from server on error
      refetch();
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNow = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setSaveCountdown(0);
    saveChanges(localAddons);
  };

  const handleToggleActive = async (addon: FeaturedAddon) => {
    updateFeaturedAddon({
      id: addon.$id,
      addon: {
        active: !addon.active,
      },
    });
  };

  const handleDelete = async (addon: FeaturedAddon) => {
    setAddonToDelete(addon);
  };

  const confirmDelete = () => {
    if (addonToDelete) {
      deleteFeaturedAddon(addonToDelete.$id, {
        onSuccess: () => {
          refetch();
          setAddonToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Manage Featured Addons</CardTitle>
            {(hasUnsavedChanges || isSaving) && (
              <div className='animate-in fade-in slide-in-from-right-2 flex items-center gap-3 duration-200'>
                {isSaving ? (
                  <div className='flex items-center gap-2'>
                    <Loader2 className='text-primary h-4 w-4 animate-spin' />
                    <span className='text-sm font-medium'>Auto-saving...</span>
                  </div>
                ) : (
                  <>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-orange-500' />
                      <span className='text-muted-foreground text-sm'>
                        Will auto-save in{' '}
                        <span className='text-foreground font-medium'>{saveCountdown}s</span>
                      </span>
                    </div>
                    <Button size='sm' variant='ghost' onClick={handleSaveNow} className='h-7 px-2'>
                      <Save className='mr-1 h-3.5 w-3.5' />
                      Save Now
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {localAddons?.map((addon, index) => (
              <div
                key={addon.$id}
                draggable
                onDragStart={(e) => handleDragStart(e, addon.$id)}
                onDragEnd={handleDragEnd}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-4 transition-all',
                  draggedItem === addon.$id && 'opacity-50',
                  dragOverIndex === index && 'border-primary bg-accent/50'
                )}
              >
                <div className='flex items-center space-x-4'>
                  <div className='text-muted-foreground hover:text-foreground cursor-move'>
                    <GripVertical className='h-5 w-5' />
                  </div>
                  <img
                    src={addon.image_url}
                    alt={addon.title}
                    className='h-16 w-16 rounded object-cover'
                  />
                  <div>
                    <h3 className='font-medium'>{addon.title}</h3>
                    <p className='text-muted-foreground text-sm'>Position: {addon.display_order}</p>
                  </div>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id={`active-${addon.$id}`}
                      checked={addon.active}
                      onCheckedChange={() => handleToggleActive(addon)}
                    />
                    <Label htmlFor={`active-${addon.$id}`}>Active</Label>
                  </div>
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() => handleDelete(addon)}
                    className='h-8 w-8'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!addonToDelete} onOpenChange={() => setAddonToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Featured Addon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{addonToDelete?.title}&quot;? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setAddonToDelete(null)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
