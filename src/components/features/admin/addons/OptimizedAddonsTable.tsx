import { Input } from '@/components/ui/input.tsx';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/tables/addonChecks/data-table';
import { useAdminAddons, useUpdateAddon, useSearchAddons } from '@/api/appwrite/useAddons';
import { toast, useReviewModeShortcuts } from '@/hooks';
import type { Addon } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Search,
  Download,
  Check,
  XCircle,
  Loader2,
  Keyboard,
  Undo2,
  ArrowLeft,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router';

interface ReviewAction {
  id: string;
  addonId: string;
  addonName: string;
  field: 'isChecked' | 'isValid';
  previousValue: boolean;
  newValue: boolean;
  timestamp: number;
}

interface ReviewedMod {
  id: string;
  addon: Addon;
  action: 'approved' | 'rejected' | 'enabled' | 'disabled';
  timestamp: number;
}

export const OptimizedAddonsTable = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<
    'all' | 'reviewed' | 'unreviewed' | 'unsorted' | 'history'
  >('unsorted');

  // Review mode state
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [selectedAddonIndex, setSelectedAddonIndex] = useState(0);
  const [reviewHistory, setReviewHistory] = useState<ReviewAction[]>([]);

  // History state for reviewed mods
  const [reviewedModsHistory, setReviewedModsHistory] = useState<ReviewedMod[]>([]);

  // Hidden addons (ones that have been acted upon)
  const [hiddenAddonIds, setHiddenAddonIds] = useState<Set<string>>(new Set());

  const PAGE_SIZE = 25;

  // Fetch data with optimized pagination
  const {
    data: addonData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminAddons(
    {
      search: filterType === 'history' || search.trim() ? '' : '', // Don't search in useAdminAddons when using global search
      reviewStatus: filterType === 'history' ? 'all' : filterType,
    },
    currentPage,
    PAGE_SIZE
  );

  // Global search hook
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchAddons(search.trim(), currentPage, PAGE_SIZE);

  const { mutateAsync: updateAddon, isPending: isUpdating } = useUpdateAddon();

  const tableRef = useRef<HTMLDivElement>(null);

  // Determine which data to use based on search and filter
  const getActiveData = () => {
    if (filterType === 'history') {
      return {
        addons: reviewedModsHistory.map((item) => item.addon),
        total: reviewedModsHistory.length,
        totalPages: Math.ceil(reviewedModsHistory.length / PAGE_SIZE),
      };
    }

    if (search.trim()) {
      // Use search results
      return searchData || { addons: [], total: 0, totalPages: 1 };
    }

    // Use regular filtered data
    return addonData || { addons: [], total: 0, totalPages: 1 };
  };

  const activeData = getActiveData();

  // Filter addons based on current tab and hidden status (except for history and search)
  const filteredAddons =
    filterType === 'history' || search.trim()
      ? activeData.addons
      : activeData.addons.filter((addon) => !hiddenAddonIds.has(addon.$id));

  const addons = filteredAddons;
  const totalPages =
    filterType === 'history'
      ? Math.ceil(reviewedModsHistory.length / PAGE_SIZE)
      : activeData.totalPages;

  // Determine loading state
  const isCurrentlyLoading = search.trim() ? isSearchLoading : isLoading;
  const isCurrentlyFetching = search.trim() ? isSearchFetching : isFetching;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedAddonIndex(0);

    // Clear hidden addons when switching to history tab
    if (filterType === 'history') {
      setHiddenAddonIds(new Set());
    }
  }, [search, filterType]);

  // Reset selected index when page changes (unless auto-advancing already set it)
  useEffect(() => {
    if (selectedAddonIndex >= addons.length && addons.length > 0) {
      setSelectedAddonIndex(0);
    }
  }, [currentPage, addons.length, selectedAddonIndex]);

  // Add a review action to history (max 10 items)
  const addToHistory = useCallback((action: Omit<ReviewAction, 'id' | 'timestamp'>) => {
    const newAction: ReviewAction = {
      ...action,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    setReviewHistory((prev) => {
      const updated = [newAction, ...prev];
      return updated.slice(0, 10); // Keep only last 10 actions
    });
  }, []);

  // Add reviewed mod to history (max 10 items)
  const addToModHistory = useCallback(
    (addon: Addon, action: 'approved' | 'rejected' | 'enabled' | 'disabled') => {
      const newReviewedMod: ReviewedMod = {
        id: `${Date.now()}-${Math.random()}`,
        addon: { ...addon },
        action,
        timestamp: Date.now(),
      };

      setReviewedModsHistory((prev) => {
        const updated = [newReviewedMod, ...prev];
        return updated.slice(0, 10); // Keep only last 10 reviewed mods
      });

      // Hide the addon from current view
      setHiddenAddonIds((prev) => new Set([...prev, addon.$id]));
    },
    []
  );

  // Clear review history
  const clearHistory = useCallback(() => {
    setReviewedModsHistory([]);
    toast({
      title: 'History cleared',
      description: 'Review history has been cleared.',
    });
  }, []);

  // Undo last review action
  const undoLastAction = useCallback(async () => {
    if (reviewHistory.length === 0) return;

    const lastAction = reviewHistory[0];

    try {
      await updateAddon({
        addonId: lastAction.addonId,
        data: { [lastAction.field]: lastAction.previousValue },
      });

      // Remove the action from history
      setReviewHistory((prev) => prev.slice(1));

      // Remove the addon from hidden list (make it visible again)
      setHiddenAddonIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lastAction.addonId);
        return newSet;
      });

      // Remove from reviewed mods history if it exists
      setReviewedModsHistory((prev) =>
        prev.filter((item) => item.addon.$id !== lastAction.addonId)
      );

      toast({
        title: 'Action undone',
        description: `Reverted ${lastAction.addonName} to previous state.`,
      });

      // Always refetch after undo to ensure consistency
      refetch();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Undo failed',
        description: 'Could not undo the last action.',
      });
    }
  }, [reviewHistory, updateAddon, refetch]);

  // Handle addon review status change
  const handleReviewStatusChange = async (
    addon: Addon,
    isChecked: boolean,
    autoAdvance = false
  ) => {
    try {
      addToHistory({
        addonId: addon.$id,
        addonName: addon.name,
        field: 'isChecked',
        previousValue: addon.isChecked,
        newValue: isChecked,
      });

      await updateAddon({ addonId: addon.$id, data: { isChecked } });

      // Determine action type and add to mod history
      const action = isChecked ? 'approved' : 'rejected';
      addToModHistory(addon, action);

      toast({
        title: `Addon ${isChecked ? 'approved' : 'marked for review'}`,
        description: `${addon.name} has been ${isChecked ? 'approved' : 'marked for review'}.`,
      });

      // Adjust selected index if in review mode - keep pointing to the same position
      if (isReviewMode && autoAdvance) {
        // Don't increment selectedAddonIndex since the addon at current position is removed
        // The next addon will automatically move into the current position
        const remainingAddons = addons.filter((a) => a.$id !== addon.$id);

        // If we're at the last position and it's being removed, move to previous
        if (selectedAddonIndex >= remainingAddons.length && remainingAddons.length > 0) {
          setSelectedAddonIndex(remainingAddons.length - 1);
        }
        // Otherwise keep the same index since next addon moves into current position
      }

      // Force a refetch to get updated data
      refetch();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'There was an error updating the review status.',
      });
    }
  };

  // Handle addon validity status change
  const handleValidityChange = async (addon: Addon, isValid: boolean, autoAdvance = false) => {
    try {
      addToHistory({
        addonId: addon.$id,
        addonName: addon.name,
        field: 'isValid',
        previousValue: addon.isValid,
        newValue: isValid,
      });

      const updateData = isValid ? { isValid, isChecked: true } : { isValid };
      await updateAddon({ addonId: addon.$id, data: updateData });

      // Determine action type and add to mod history
      const action = isValid ? 'enabled' : 'disabled';
      addToModHistory(addon, action);

      let toastMessage = {
        title: `Addon ${isValid ? 'activated' : 'deactivated'} successfully`,
        description: `${addon.name} has been ${isValid ? 'approved' : 'disabled'}.`,
      };

      if (isValid && !addon.isChecked) {
        toastMessage.description += ' It has also been marked as reviewed.';
      }

      toast(toastMessage);

      // Adjust selected index if in review mode - keep pointing to the same position
      if (isReviewMode && autoAdvance) {
        // Don't increment selectedAddonIndex since the addon at current position is removed
        // The next addon will automatically move into the current position
        const remainingAddons = addons.filter((a) => a.$id !== addon.$id);

        // If we're at the last position and it's being removed, move to previous
        if (selectedAddonIndex >= remainingAddons.length && remainingAddons.length > 0) {
          setSelectedAddonIndex(remainingAddons.length - 1);
        }
        // Otherwise keep the same index since next addon moves into current position
      }

      // Force a refetch to get updated data
      refetch();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'There was an error updating the addon status.',
      });
    }
  };

  // Keyboard shortcuts for review mode
  useReviewModeShortcuts(
    {
      onApprove: () => {
        const currentAddon = addons[selectedAddonIndex];
        if (currentAddon && !currentAddon.isChecked) {
          handleReviewStatusChange(currentAddon, true, true); // Auto-advance enabled
        }
      },
      onReject: () => {
        const currentAddon = addons[selectedAddonIndex];
        if (currentAddon && !currentAddon.isChecked) {
          handleReviewStatusChange(currentAddon, true, true); // Mark as reviewed but don't enable - Auto-advance enabled
        }
      },
      onEnable: () => {
        const currentAddon = addons[selectedAddonIndex];
        if (currentAddon && !currentAddon.isValid) {
          handleValidityChange(currentAddon, true, true); // Auto-advance enabled
        }
      },
      onDisable: () => {
        const currentAddon = addons[selectedAddonIndex];
        if (currentAddon && currentAddon.isValid) {
          handleValidityChange(currentAddon, false, true); // Auto-advance enabled
        }
      },
      onNext: () => {
        setSelectedAddonIndex((prev) => Math.min(prev + 1, addons.length - 1));
      },
      onPrevious: () => {
        setSelectedAddonIndex((prev) => Math.max(prev - 1, 0));
      },
      onUndo: undoLastAction,
      onExit: () => setIsReviewMode(false),
    },
    isReviewMode && addons.length > 0
  );

  // Auto-scroll to selected addon in review mode
  useEffect(() => {
    if (isReviewMode && tableRef.current) {
      const selectedRow = tableRef.current.querySelector(
        `[data-addon-index="${selectedAddonIndex}"]`
      );
      if (selectedRow) {
        selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedAddonIndex, isReviewMode]);

  // Table columns configuration
  const columns: ColumnDef<Addon>[] = [
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ row }) => (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar className='h-12 w-12'>
            <AvatarImage src={row.original.icon || ''} alt={`${row.original.name} icon`} />
            <AvatarFallback>{row.original.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </motion.div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        let url = null;

        // Parse Modrinth raw data first (preferred)
        if (row.original.modrinth_raw) {
          try {
            const modrinthData =
              typeof row.original.modrinth_raw === 'string'
                ? JSON.parse(row.original.modrinth_raw)
                : row.original.modrinth_raw;

            if (modrinthData?.slug) {
              url = `https://modrinth.com/mod/${modrinthData.slug}`;
            }
          } catch (error) {
            console.warn('Failed to parse modrinth_raw data:', error);
          }
        }

        // Fall back to CurseForge if no Modrinth URL
        if (!url && row.original.curseforge_raw) {
          try {
            const curseforgeData =
              typeof row.original.curseforge_raw === 'string'
                ? JSON.parse(row.original.curseforge_raw)
                : row.original.curseforge_raw;

            if (curseforgeData?.links?.websiteUrl) {
              url = curseforgeData.links.websiteUrl;
            }
          } catch (error) {
            console.warn('Failed to parse curseforge_raw data:', error);
          }
        }

        if (url) {
          return (
            <Link to={url} target='_blank' rel='noopener noreferrer'>
              <div className='font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400'>
                {row.original.name}
              </div>
            </Link>
          );
        }

        return <div className='font-medium'>{row.original.name}</div>;
      },
    },
    {
      accessorKey: 'authors',
      header: 'Authors',
      cell: ({ row }) => (
        <div className='text-muted-foreground text-sm'>
          {row.original.authors.join(', ') || 'Unknown'}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className='max-w-md truncate text-sm'>
          {row.original.description || 'No description available'}
        </div>
      ),
    },
    // Conditional columns based on current tab
    ...(filterType === 'history'
      ? [
          {
            accessorKey: 'action',
            header: 'Action Taken',
            cell: ({ row }: { row: { original: Addon } }) => {
              const historyItem = reviewedModsHistory.find(
                (item) => item.addon.$id === row.original.$id
              );
              if (!historyItem) return null;
              const actionColors = {
                approved: 'bg-green-100 text-green-800 border-green-300',
                rejected: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                enabled: 'bg-blue-100 text-blue-800 border-blue-300',
                disabled: 'bg-red-100 text-red-800 border-red-300',
              };
              return (
                <div className='flex flex-col space-y-1'>
                  <Badge variant='outline' className={actionColors[historyItem.action]}>
                    {historyItem.action.charAt(0).toUpperCase() + historyItem.action.slice(1)}
                  </Badge>
                  <span className='text-muted-foreground text-xs'>
                    {new Date(historyItem.timestamp).toLocaleString()}
                  </span>
                </div>
              );
            },
          } as ColumnDef<Addon>,
        ]
      : [
          {
            accessorKey: 'review',
            header: 'Review Status',
            cell: ({ row, table }) => {
              const rowIndex = table
                .getRowModel()
                .rows.findIndex((r) => r.original.$id === row.original.$id);
              const isSelected = isReviewMode && selectedAddonIndex === rowIndex;

              return (
                <div
                  className={`flex flex-col space-y-2 rounded-md p-2 transition-colors ${
                    isSelected ? 'bg-blue-100 ring-2 ring-blue-500 dark:bg-blue-900/20' : ''
                  }`}
                  data-addon-index={rowIndex}
                >
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id={`review-${row.original.$id}`}
                      checked={row.original.isChecked}
                      onCheckedChange={(checked) =>
                        handleReviewStatusChange(row.original, checked === true)
                      }
                      disabled={isUpdating || row.original.isValid}
                    />
                    <label
                      htmlFor={`review-${row.original.$id}`}
                      className={`text-sm ${
                        row.original.isValid
                          ? 'text-muted-foreground cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      {row.original.isChecked ? 'Reviewed' : 'Mark as reviewed'}
                      {row.original.isValid &&
                        !row.original.isChecked &&
                        ' (auto-marked when enabled)'}
                    </label>
                  </div>

                  {!row.original.isChecked ? (
                    <Badge
                      variant='outline'
                      className='w-fit border-yellow-300 bg-yellow-100 text-yellow-800'
                    >
                      Needs Review
                    </Badge>
                  ) : (
                    <Badge
                      variant='outline'
                      className='w-fit border-green-300 bg-green-100 text-green-800'
                    >
                      Reviewed
                    </Badge>
                  )}
                </div>
              );
            },
          } as ColumnDef<Addon>,
          {
            accessorKey: 'isValid',
            header: 'Status',
            cell: ({ row }) => (
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id={`valid-${row.original.$id}`}
                    checked={row.original.isValid}
                    onCheckedChange={(checked) => handleValidityChange(row.original, checked)}
                    disabled={isUpdating}
                  />
                  <label htmlFor={`valid-${row.original.$id}`} className='text-sm'>
                    {row.original.isValid ? 'Enabled' : 'Disabled'}
                  </label>
                </div>

                <Badge variant={row.original.isValid ? 'default' : 'destructive'} className='w-fit'>
                  {row.original.isValid ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ),
          } as ColumnDef<Addon>,
        ]),
    {
      accessorKey: 'downloads',
      header: 'Downloads',
      cell: ({ row }) => (
        <div className='flex items-center space-x-1'>
          <Download size={14} className='text-muted-foreground' />
          <span className='text-sm'>{row.original.downloads?.toLocaleString() || '0'}</span>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='space-y-4 text-center'>
          <div className='flex items-center space-x-2 text-red-600'>
            <XCircle size={24} />
            <span className='text-lg font-medium'>Failed to load addons</span>
          </div>
          <p className='text-muted-foreground text-sm'>{error?.message || 'Unknown error'}</p>
          <Button onClick={() => refetch()} variant='outline'>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 px-4 md:px-8'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-semibold'>Addons Management</h2>
            <p className='text-muted-foreground'>
              Review and manage addon extensions efficiently
              {addonData && addonData.total > 0 && (
                <span className='ml-1'>
                  (Page {currentPage} of {totalPages}, {addonData.total} total)
                </span>
              )}
            </p>
          </div>

          <div className='flex items-center space-x-2'>
            {reviewHistory.length > 0 && (
              <Button
                variant='outline'
                size='sm'
                onClick={undoLastAction}
                disabled={isUpdating}
                className='flex items-center space-x-1'
              >
                <Undo2 size={16} />
                <span>Undo ({reviewHistory.length})</span>
              </Button>
            )}

            {filterType === 'history' && reviewedModsHistory.length > 0 && (
              <Button
                variant='outline'
                size='sm'
                onClick={clearHistory}
                className='flex items-center space-x-1'
              >
                <Trash2 size={16} />
                <span>Clear History</span>
              </Button>
            )}

            <Button
              variant={isReviewMode ? 'default' : 'outline'}
              size='sm'
              onClick={() => setIsReviewMode(!isReviewMode)}
              className='flex items-center space-x-1'
            >
              <Keyboard size={16} />
              <span>{isReviewMode ? 'Exit Review Mode' : 'Review Mode'}</span>
            </Button>
          </div>
        </div>

        {/* Review Mode Help */}
        <AnimatePresence>
          {isReviewMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='mb-4 space-y-3'
            >
              <Alert className='border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'>
                <Keyboard className='h-4 w-4' />
                <AlertDescription>
                  <div className='mb-2 flex items-center justify-between'>
                    <span>
                      <strong>Review Mode Active</strong>
                    </span>
                    <span className='rounded bg-blue-100 px-2 py-1 text-xs dark:bg-blue-900'>
                      {selectedAddonIndex + 1} of {addons.length} addon
                      {addons.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className='text-sm'>
                    <kbd className='rounded-sm bg-gray-200 p-1 text-xs dark:bg-gray-700'>A</kbd>{' '}
                    approve,{' '}
                    <kbd className='rounded-sm bg-gray-200 p-1 text-xs dark:bg-gray-700'>R</kbd>{' '}
                    reject,{' '}
                    <kbd className='rounded-sm bg-gray-200 p-1 text-xs dark:bg-gray-700'>E</kbd>{' '}
                    enable,{' '}
                    <kbd className='rounded-sm bg-gray-200 p-1 text-xs dark:bg-gray-700'>X</kbd>{' '}
                    disable,{' '}
                    <kbd className='rounded-sm bg-gray-200 p-1 text-xs dark:bg-gray-700'>↑/↓</kbd>{' '}
                    navigate,{' '}
                    <kbd className='rounded-sm bg-gray-200 p-1 text-xs dark:bg-gray-700'>
                      Ctrl+Z
                    </kbd>{' '}
                    undo,{' '}
                    <kbd className='rounded-sm bg-gray-200 p-1 text-xs dark:bg-gray-700'>Esc</kbd>{' '}
                    exit
                  </div>
                  {addons.length > 0 && (
                    <div className='mt-2 text-xs'>
                      💡 Actions automatically move to the next addon for faster review
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Filters and Search */}
      <Tabs
        defaultValue='unsorted'
        className='w-full'
        onValueChange={(value) => setFilterType(value as typeof filterType)}
      >
        <div className='mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
          <TabsList>
            <TabsTrigger value='unsorted'>
              Unsorted
              {addonData && (
                <Badge variant='destructive' className='ml-1'>
                  {addonData.addons.filter((a) => !a.isValid && !hiddenAddonIds.has(a.$id)).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value='all'>All Addons (Approved)</TabsTrigger>
            <TabsTrigger value='unreviewed'>
              Needs Review
              {addonData && (
                <Badge variant='secondary' className='ml-1'>
                  {
                    addonData.addons.filter((a) => !a.isChecked && !hiddenAddonIds.has(a.$id))
                      .length
                  }
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value='reviewed'>Reviewed</TabsTrigger>
            <TabsTrigger value='history'>
              History
              <Badge variant='outline' className='ml-1'>
                {reviewedModsHistory.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder={filterType === 'history' ? 'Search history...' : 'Search all addons...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-[300px] pl-10'
              disabled={filterType === 'history'} // Disable search in history tab
            />
          </div>
        </div>

        <TabsContent value={filterType} className='mt-0'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={`${currentPage}-${filterType}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className='p-0'>
                  <div ref={tableRef} className='max-h-[70vh] overflow-auto'>
                    {isCurrentlyLoading || isCurrentlyFetching ? (
                      <div className='flex h-64 items-center justify-center'>
                        <div className='flex items-center space-x-2'>
                          <Loader2 className='h-4 w-4 animate-spin' />
                          <span>{search.trim() ? 'Searching addons...' : 'Loading addons...'}</span>
                        </div>
                      </div>
                    ) : (
                      <DataTable
                        columns={columns}
                        data={
                          filterType === 'history'
                            ? reviewedModsHistory
                                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                                .map((item) => item.addon)
                            : addons
                        }
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='mt-4 flex items-center justify-center space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isFetching}
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </Button>

                  <div className='flex items-center space-x-1'>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        // If total pages is 5 or less, show all pages
                        pageNumber = i + 1;
                      } else {
                        // For more than 5 pages, show 5 pages centered around current page
                        const start = Math.max(1, currentPage - 2);
                        const end = Math.min(totalPages, start + 4);
                        const adjustedStart = Math.max(1, end - 4);
                        pageNumber = adjustedStart + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? 'default' : 'outline'}
                          size='sm'
                          onClick={() => setCurrentPage(pageNumber)}
                          disabled={isFetching}
                          className='w-10'
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || isFetching}
                  >
                    Next
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}

              {/* Status */}
              <div className='text-muted-foreground mt-4 flex items-center justify-between text-sm'>
                <div>
                  {isCurrentlyFetching && filterType !== 'history' ? (
                    <div className='flex items-center space-x-2'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <span>{search.trim() ? 'Searching...' : 'Loading...'}</span>
                    </div>
                  ) : (
                    <span>
                      Showing {addons.length} of{' '}
                      {filterType === 'history' ? reviewedModsHistory.length : activeData.total}{' '}
                      addons
                      {filterType === 'history' && ' (from recent actions)'}
                      {search.trim() && ' (search results)'}
                    </span>
                  )}
                </div>

                {reviewHistory.length > 0 && (
                  <div>
                    Last {reviewHistory.length} action{reviewHistory.length !== 1 ? 's' : ''} in
                    history
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* No results */}
      {!isCurrentlyLoading && !isCurrentlyFetching && addons.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='flex h-40 items-center justify-center rounded-md border border-dashed'
        >
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Check size={20} className='text-muted-foreground' />
            <div>
              <p className='text-sm font-medium'>
                {filterType === 'history'
                  ? 'No review history yet'
                  : search.trim()
                    ? 'No addons found'
                    : 'No addons found'}
              </p>
              <p className='text-muted-foreground text-xs'>
                {filterType === 'history'
                  ? 'Actions taken on addons will appear here.'
                  : search.trim()
                    ? 'Try adjusting your search terms.'
                    : filterType === 'unreviewed'
                      ? 'All addons have been reviewed!'
                      : 'Try adjusting your search criteria.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
