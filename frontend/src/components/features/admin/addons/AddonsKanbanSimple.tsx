import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Archive,
  Save,
  Loader2,
  Calendar,
  Download,
  User,
  Hash,
} from 'lucide-react';
import type { Addon } from '@/types';
import { cn } from '@/config/utils.ts';
import { useToast } from '@/hooks/useToast';

interface AddonsKanbanProps {
  addons: Addon[];
  onUpdateAddon: (addonId: string, updates: Partial<Addon> & { stage?: string }) => Promise<void>;
  onViewAddon: (addon: Addon) => void;
}

type Stage = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'archived';

const COLUMNS: Array<{
  id: Stage;
  title: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'pending', title: 'Pending', bgColor: 'bg-gray-500', borderColor: '#6b7280', icon: Clock },
  {
    id: 'reviewing',
    title: 'Reviewing',
    bgColor: 'bg-blue-500',
    borderColor: '#3b82f6',
    icon: Eye,
  },
  {
    id: 'approved',
    title: 'Approved',
    bgColor: 'bg-green-500',
    borderColor: '#10b981',
    icon: CheckCircle2,
  },
  {
    id: 'rejected',
    title: 'Rejected',
    bgColor: 'bg-red-500',
    borderColor: '#ef4444',
    icon: XCircle,
  },
  {
    id: 'archived',
    title: 'Archived',
    bgColor: 'bg-gray-400',
    borderColor: '#9ca3af',
    icon: Archive,
  },
];

export function AddonsKanbanSimple({ addons, onUpdateAddon, onViewAddon }: AddonsKanbanProps) {
  const { toast } = useToast();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Stage | null>(null);
  const [localAddons, setLocalAddons] = useState<Addon[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<
    Map<string, Partial<Addon> & { stage?: string }>
  >(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [hoveredAddon, setHoveredAddon] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const [lastChangeTime, setLastChangeTime] = useState(0);
  const [saveCountdown, setSaveCountdown] = useState(0);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Initialize local state from props only once
  useEffect(() => {
    if (!hasInitialized && addons.length > 0) {
      setLocalAddons(addons);
      setHasInitialized(true);
    }
  }, [addons, hasInitialized]);

  // Only sync with props on external changes (add/remove)
  useEffect(() => {
    if (hasInitialized && !draggedItem && pendingUpdates.size === 0 && !isSaving) {
      // Check for external additions or removals
      const localIds = new Set(localAddons.map((a) => a.$id));
      const propsIds = new Set(addons.map((a) => a.$id));

      const hasAdditions = addons.some((a) => !localIds.has(a.$id));
      const hasRemovals = localAddons.some((a) => !propsIds.has(a.$id));

      // Only update if addons were added/removed externally
      if (hasAdditions || hasRemovals) {
        // Preserve local changes for existing addons
        const updatedAddons = addons.map((addon) => {
          const localAddon = localAddons.find((a) => a.$id === addon.$id);
          if (localAddon) {
            // Keep local changes for existing addons
            return localAddon;
          }
          return addon;
        });
        setLocalAddons(updatedAddons);
      }
    }
  }, [addons, hasInitialized, draggedItem, pendingUpdates.size, isSaving, localAddons]);

  // Get stage for addon
  const getStage = (addon: Addon): Stage => {
    const stage = (addon as any).stage;
    if (stage) return stage;

    if (addon.isValid && addon.isChecked) return 'approved';
    if (!addon.isValid && addon.isChecked) return 'rejected';
    return 'pending';
  };

  // Group addons by stage
  const columns = useMemo(() => {
    const grouped: Record<Stage, Addon[]> = {
      pending: [],
      reviewing: [],
      approved: [],
      rejected: [],
      archived: [],
    };

    localAddons.forEach((addon) => {
      const stage = getStage(addon);
      grouped[stage].push(addon);
    });

    return COLUMNS.map((col) => ({
      ...col,
      items: grouped[col.id],
    }));
  }, [localAddons]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, addonId: string) => {
    setDraggedItem(addonId);
    e.dataTransfer.effectAllowed = 'move';

    // Add a visual effect
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, stage: Stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(stage);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetStage: Stage) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedItem) return;

    const addon = localAddons.find((a) => a.$id === draggedItem);
    if (!addon) return;

    const currentStage = getStage(addon);
    if (currentStage === targetStage) {
      setDraggedItem(null);
      return;
    }

    // Prepare updates
    const updates: any = { stage: targetStage };

    switch (targetStage) {
      case 'approved':
        updates.isValid = true;
        updates.isChecked = true;
        break;
      case 'rejected':
        updates.isValid = false;
        updates.isChecked = true;
        break;
      case 'pending':
        updates.isValid = false;
        updates.isChecked = false;
        break;
    }

    // Optimistic update - apply changes immediately
    setLocalAddons((prev) =>
      prev.map((a) => (a.$id === draggedItem ? ({ ...a, ...updates } as any) : a))
    );

    // Track pending update
    setPendingUpdates((prev) => {
      const newUpdates = new Map(prev);
      newUpdates.set(addon.$id, updates);
      return newUpdates;
    });

    setDraggedItem(null);

    // Schedule batch save
    scheduleSave();
  };

  // Move saveAllPendingUpdates before scheduleSave so it can be referenced
  const saveAllPendingUpdates = useCallback(async () => {
    const updates = pendingUpdates;
    if (updates.size === 0) return;

    setIsSaving(true);
    const updateArray = Array.from(updates.entries());

    try {
      // Batch save all pending updates
      await Promise.all(
        updateArray.map(([addonId, updateData]) => onUpdateAddon(addonId, updateData))
      );

      // Clear pending updates on success and record save time
      setPendingUpdates(new Map());
      setLastSaveTime(Date.now());

      toast({
        title: '✓ Auto-saved',
        description: `${updateArray.length} change${updateArray.length > 1 ? 's' : ''} saved`,
        duration: 1500,
      });

      // Local state is maintained - no changes needed
    } catch (error) {
      console.error('Save error:', error);

      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });

      // Keep the updates pending so user can retry
    } finally {
      setIsSaving(false);
    }
  }, [pendingUpdates, onUpdateAddon, toast]);

  const scheduleSave = useCallback(() => {
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Clear any existing countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Record the time of this change
    setLastChangeTime(Date.now());
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
      saveAllPendingUpdates();
    }, 5000); // Wait for 5 seconds of inactivity before saving
  }, [saveAllPendingUpdates]);

  const handleSaveNow = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setSaveCountdown(0);
    saveAllPendingUpdates();
  };

  const handleCardHover = (addonId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredAddon(addonId);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPopover(true);
    }, 800); // Show after 800ms
  };

  const handleCardLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowPopover(false);
    setHoveredAddon(null);
  };

  return (
    <div className='flex h-[calc(100vh-250px)] flex-col'>
      {/* Save status bar */}
      {(pendingUpdates.size > 0 || isSaving) && (
        <div className='bg-accent/50 animate-in fade-in slide-in-from-top-2 mb-3 flex items-center justify-between rounded-lg px-4 py-2 duration-200'>
          <div className='flex items-center gap-3'>
            {isSaving ? (
              <>
                <Loader2 className='text-primary h-4 w-4 animate-spin' />
                <span className='text-sm font-medium'>Auto-saving...</span>
              </>
            ) : (
              <>
                <div className='h-2 w-2 animate-pulse rounded-full bg-orange-500' />
                <span className='text-muted-foreground text-sm'>
                  {pendingUpdates.size} unsaved change{pendingUpdates.size > 1 ? 's' : ''}
                  {saveCountdown > 0 && (
                    <>
                      {' '}
                      - auto-save in{' '}
                      <span className='text-foreground font-medium'>{saveCountdown}s</span>
                    </>
                  )}
                </span>
              </>
            )}
          </div>
          {!isSaving && (
            <Button size='sm' variant='ghost' onClick={handleSaveNow} className='h-7 px-2'>
              <Save className='mr-1 h-3.5 w-3.5' />
              Save Now
            </Button>
          )}
        </div>
      )}

      {/* Kanban columns container */}
      <div className='flex-1 overflow-hidden'>
        <div className='grid h-full grid-cols-5 gap-3 px-1'>
          {columns.map((column) => (
            <div key={column.id} className='flex h-full flex-col'>
              <Card className='h-full'>
                <CardHeader className='border-b px-3 py-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1.5'>
                      <div className={cn('rounded p-0.5 text-white', column.bgColor)}>
                        <column.icon className='h-3.5 w-3.5' />
                      </div>
                      <CardTitle className='text-sm font-medium'>{column.title}</CardTitle>
                    </div>
                    <Badge variant='secondary' className='h-5 px-1.5 text-xs'>
                      {column.items.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent
                  className={cn(
                    'flex-1 overflow-hidden p-2 transition-colors',
                    dragOverColumn === column.id && 'bg-primary/5 ring-primary/20 ring-2'
                  )}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div className='h-full space-y-1.5 overflow-y-auto pr-1'>
                    {column.items.length > 0 ? (
                      column.items.slice(0, 50).map((addon) => (
                        <Popover
                          key={addon.$id}
                          open={hoveredAddon === addon.$id && showPopover}
                          onOpenChange={() => {}}
                        >
                          <PopoverTrigger asChild>
                            <div
                              draggable
                              onDragStart={(e) => handleDragStart(e, addon.$id)}
                              onDragEnd={handleDragEnd}
                              onMouseEnter={() => handleCardHover(addon.$id)}
                              onMouseLeave={handleCardLeave}
                              className={cn(
                                'cursor-move transition-all',
                                draggedItem === addon.$id && 'scale-95 opacity-50'
                              )}
                              onClick={() => onViewAddon(addon)}
                            >
                              <Card
                                className='border-l-2 transition-all hover:scale-[1.02] hover:shadow-sm'
                                style={{ borderLeftColor: column.borderColor }}
                              >
                                <CardContent className='p-2'>
                                  <h4 className='mb-0.5 truncate text-xs font-medium'>
                                    {addon.name}
                                  </h4>
                                  <div className='flex items-center justify-between'>
                                    <p className='text-muted-foreground truncate text-[10px]'>
                                      {addon.authors?.[0] || 'Unknown'}
                                    </p>
                                    <Badge variant='outline' className='h-4 px-1 text-[10px]'>
                                      {addon.downloads || 0}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent side='right' className='w-96 p-4' align='start'>
                            <div className='space-y-3'>
                              {/* Header with name and icon */}
                              <div className='flex items-start gap-3'>
                                {addon.icon && (
                                  <img
                                    src={addon.icon}
                                    alt={addon.name}
                                    className='h-12 w-12 rounded-lg object-cover'
                                  />
                                )}
                                <div className='flex-1'>
                                  <h3 className='text-sm font-semibold'>{addon.name}</h3>
                                  <div className='mt-1 flex items-center gap-2'>
                                    {addon.slug && (
                                      <span className='text-muted-foreground text-[10px]'>
                                        @{addon.slug}
                                      </span>
                                    )}
                                    {(addon.curseforge_id || addon.modrinth_id) && (
                                      <div className='flex items-center gap-1'>
                                        {addon.curseforge_id && (
                                          <Badge variant='outline' className='px-1 text-[10px]'>
                                            CF
                                          </Badge>
                                        )}
                                        {addon.modrinth_id && (
                                          <Badge variant='outline' className='px-1 text-[10px]'>
                                            MR
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              <p className='text-muted-foreground line-clamp-4 text-xs'>
                                {addon.description || 'No description available'}
                              </p>

                              {/* Key Information Grid */}
                              <div className='grid grid-cols-2 gap-2 text-xs'>
                                <div className='text-muted-foreground flex items-center gap-1.5'>
                                  <User className='h-3 w-3' />
                                  <span className='truncate'>
                                    {addon.authors?.join(', ') || 'Unknown'}
                                  </span>
                                </div>
                                <div className='text-muted-foreground flex items-center gap-1.5'>
                                  <Download className='h-3 w-3' />
                                  <span>{(addon.downloads || 0).toLocaleString()}</span>
                                </div>
                                <div className='text-muted-foreground flex items-center gap-1.5'>
                                  <Calendar className='h-3 w-3' />
                                  <span>
                                    {addon.created_at
                                      ? new Date(addon.created_at).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                        })
                                      : 'Unknown'}
                                  </span>
                                </div>
                                <div className='text-muted-foreground flex items-center gap-1.5'>
                                  <Hash className='h-3 w-3' />
                                  <span className='truncate'>{addon.$id || 'N/A'}</span>
                                </div>
                              </div>

                              {/* Categories */}
                              {addon.categories &&
                                Array.isArray(addon.categories) &&
                                addon.categories.length > 0 && (
                                  <div className='space-y-1'>
                                    <div className='text-muted-foreground text-[10px] font-medium uppercase'>
                                      Categories
                                    </div>
                                    <div className='flex flex-wrap gap-1'>
                                      {addon.categories.map((cat) => (
                                        <Badge
                                          key={cat}
                                          variant='secondary'
                                          className='px-1.5 py-0 text-[10px]'
                                        >
                                          {cat}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              {/* Loaders */}
                              {addon.loaders &&
                                Array.isArray(addon.loaders) &&
                                addon.loaders.length > 0 && (
                                  <div className='space-y-1'>
                                    <div className='text-muted-foreground text-[10px] font-medium uppercase'>
                                      Loaders
                                    </div>
                                    <div className='flex flex-wrap gap-1'>
                                      {addon.loaders.map((loader) => (
                                        <Badge
                                          key={loader}
                                          variant='outline'
                                          className='px-1.5 py-0 text-[10px]'
                                        >
                                          {loader}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              {/* Status */}
                              <div className='space-y-2 border-t pt-2'>
                                <div className='flex items-center justify-between text-xs'>
                                  <span className='text-muted-foreground'>Validation Status</span>
                                  <div className='flex items-center gap-2'>
                                    <Badge
                                      variant={addon.isChecked ? 'default' : 'outline'}
                                      className='text-[10px]'
                                    >
                                      {addon.isChecked ? 'Checked' : 'Pending'}
                                    </Badge>
                                    <Badge
                                      className={cn(
                                        'text-[10px]',
                                        addon.isValid
                                          ? 'bg-green-500 hover:bg-green-600'
                                          : 'bg-red-500 hover:bg-red-600'
                                      )}
                                    >
                                      {addon.isValid ? 'Valid' : 'Invalid'}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Last Updated */}
                                {addon.updated_at && (
                                  <div className='flex items-center justify-between text-xs'>
                                    <span className='text-muted-foreground'>Last Updated</span>
                                    <span>
                                      {new Date(addon.updated_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ))
                    ) : (
                      <div
                        className={cn(
                          'flex h-full items-center justify-center rounded-lg border-2 border-dashed transition-colors',
                          dragOverColumn === column.id
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/20'
                        )}
                      >
                        <div className='p-4 text-center'>
                          <Archive className='text-muted-foreground/30 mx-auto mb-2 h-8 w-8' />
                          <div className='text-muted-foreground text-xs'>Drop addons here</div>
                          <div className='text-muted-foreground/60 mt-1 text-[10px]'>
                            or drag from other columns
                          </div>
                        </div>
                      </div>
                    )}
                    {column.items.length > 50 && (
                      <div className='text-muted-foreground mt-1 border-t py-1 text-center text-[10px]'>
                        +{column.items.length - 50} more
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
