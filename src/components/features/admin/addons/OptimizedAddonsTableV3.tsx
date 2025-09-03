import { Input } from '@/components/ui/input.tsx';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/tables/addonChecks/data-table';
import { useAdminAddons, useUpdateAddon } from '@/api/appwrite/useAddons';
import { useSearchAddons } from '@/api/meilisearch/useSearchAddons';
import { toast, useReviewModeShortcuts } from '@/hooks';
import type { Addon } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
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
  Shield,
  ExternalLink,
  RefreshCw,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router';
import { cn } from '@/config/utils';
import FullscreenAddonReview from './FullscreenAddonReview';

interface ReviewAction {
  id: string;
  addonId: string;
  addonName: string;
  field: 'isChecked' | 'isValid';
  previousValue: boolean;
  newValue: boolean;
  timestamp: number;
}

type FilterType = 'all' | 'reviewed' | 'unreviewed';

export const OptimizedAddonsTableV3 = () => {
  // Core state
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('unreviewed');

  // Review mode state
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isFullscreenReview, setIsFullscreenReview] = useState(false);
  const [selectedAddonIndex, setSelectedAddonIndex] = useState(0);
  const [reviewHistory, setReviewHistory] = useState<ReviewAction[]>([]);
  const [hiddenAddonIds, setHiddenAddonIds] = useState<Set<string>>(new Set());
  const [hasPermissionError, setHasPermissionError] = useState(false);

  const PAGE_SIZE = 25;
  const tableRef = useRef<HTMLDivElement>(null);

  // Optimized data fetching with proper dependencies
  // When in review mode, always fetch unreviewed addons
  const {
    data: addonData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminAddons(
    {
      reviewStatus: isReviewMode ? 'unreviewed' : filterType,
    },
    currentPage,
    PAGE_SIZE
  );

  // Global search with debouncing
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchAddons({ query: search.trim(), page: 1, limit: PAGE_SIZE });

  const { mutateAsync: updateAddon, isPending: isUpdating } = useUpdateAddon();

  // Memoized active data to prevent unnecessary recalculations
  const activeData = useMemo(() => {
    if (search.trim()) {
      return searchData || [];
    }
    return addonData?.addons || [];
  }, [search, searchData, addonData]);

  // Memoized filtered addons
  const filteredAddons = useMemo(() => {
    return search.trim()
      ? activeData
      : activeData.filter((addon: Addon) => !hiddenAddonIds.has(addon.$id));
  }, [search, activeData, hiddenAddonIds]);

  const totalPages = addonData?.totalPages || 1;
  const isCurrentlyLoading = search.trim() ? isSearchLoading : isLoading;
  const isCurrentlyFetching = search.trim() ? isSearchFetching : isFetching;

  // Get addons that need review for review mode
  // When in review mode, the data is already filtered at query level
  const addonsNeedingReview = useMemo(() => {
    // If we're in review mode, the API already filters for unreviewed addons
    // So we just return the filtered addons (minus hidden ones)
    return isReviewMode
      ? filteredAddons
      : filteredAddons.filter((addon: Addon) => !addon.isChecked);
  }, [filteredAddons, isReviewMode]);

  // Reset states when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedAddonIndex(0);
    setHiddenAddonIds(new Set());
  }, [search, filterType]);

  // Auto-adjust selected index when addons change
  useEffect(() => {
    const targetAddons = isReviewMode ? addonsNeedingReview : filteredAddons;
    if (selectedAddonIndex >= targetAddons.length && targetAddons.length > 0) {
      setSelectedAddonIndex(Math.max(0, targetAddons.length - 1));
    }
  }, [selectedAddonIndex, addonsNeedingReview, filteredAddons, isReviewMode]);

  // History management
  const addToHistory = useCallback((action: Omit<ReviewAction, 'id' | 'timestamp'>) => {
    const newAction: ReviewAction = {
      ...action,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    setReviewHistory((prev) => [newAction, ...prev].slice(0, 10));
  }, []);

  const addToModHistory = useCallback(
    (addon: Addon, _action: 'approved' | 'rejected' | 'enabled' | 'disabled') => {
      // TODO: Implement mod history tracking
      setHiddenAddonIds((prev) => new Set([...prev, addon.$id]));
    },
    []
  );

  // Undo functionality
  const undoLastAction = useCallback(async () => {
    if (reviewHistory.length === 0) return;

    const lastAction = reviewHistory[0];
    try {
      await updateAddon({
        addonId: lastAction.addonId,
        data: { [lastAction.field]: lastAction.previousValue },
      });

      setReviewHistory((prev) => prev.slice(1));
      setHiddenAddonIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lastAction.addonId);
        return newSet;
      });

      toast({
        title: '↩️ Action undone',
        description: `Reverted ${lastAction.addonName} to previous state.`,
      });
      refetch();
      setHasPermissionError(false);
    } catch (error) {
      if ((error as Error & { code?: number })?.code === 401) {
        setHasPermissionError(true);
      }
      toast({
        variant: 'destructive',
        title: '❌ Undo failed',
        description: 'Could not undo the last action.',
      });
    }
  }, [reviewHistory, updateAddon, refetch]);

  // Review status change
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

      const action = isChecked ? 'approved' : 'rejected';
      addToModHistory(addon, action);

      toast({
        title: isChecked ? '✅ Addon approved' : '⚠️ Marked for review',
        description: `${addon.name} has been ${isChecked ? 'approved' : 'marked for review'}.`,
      });

      if (autoAdvance && (isReviewMode || isFullscreenReview)) {
        const targetAddons = isReviewMode ? addonsNeedingReview : filteredAddons;
        const currentIndex = targetAddons.findIndex((a: Addon) => a.$id === addon.$id);
        const nextIndex =
          currentIndex < targetAddons.length - 1 ? currentIndex : Math.max(0, currentIndex - 1);
        setSelectedAddonIndex(nextIndex);
      }

      refetch();
      setHasPermissionError(false);
    } catch (error) {
      if (
        (error as Error & { code?: number })?.code === 401 ||
        (error as Error)?.message?.includes('not authorized')
      ) {
        setHasPermissionError(true);
        toast({
          variant: 'destructive',
          title: '🔒 Permission denied',
          description: 'You need admin permissions to update addons.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: '❌ Update failed',
          description: 'There was an error updating the review status.',
        });
      }
    }
  };

  // Validity change
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

      const action = isValid ? 'enabled' : 'disabled';
      addToModHistory(addon, action);

      toast({
        title: isValid ? '✅ Addon activated' : '🚫 Addon deactivated',
        description: `${addon.name} has been ${isValid ? 'approved and enabled' : 'disabled'}.`,
      });

      if (autoAdvance && (isReviewMode || isFullscreenReview)) {
        const targetAddons = isReviewMode ? addonsNeedingReview : filteredAddons;
        const currentIndex = targetAddons.findIndex((a: Addon) => a.$id === addon.$id);
        const nextIndex =
          currentIndex < targetAddons.length - 1 ? currentIndex : Math.max(0, currentIndex - 1);
        setSelectedAddonIndex(nextIndex);
      }

      refetch();
      setHasPermissionError(false);
    } catch (error) {
      if (
        (error as Error & { code?: number })?.code === 401 ||
        (error as Error)?.message?.includes('not authorized')
      ) {
        setHasPermissionError(true);
        toast({
          variant: 'destructive',
          title: '🔒 Permission denied',
          description: 'You need admin permissions to update addons.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: '❌ Update failed',
          description: 'There was an error updating the addon status.',
        });
      }
    }
  };

  // Navigation in review mode
  const navigateReview = useCallback(
    (direction: 'next' | 'prev') => {
      const targetAddons = isReviewMode ? addonsNeedingReview : filteredAddons;
      if (direction === 'next') {
        setSelectedAddonIndex((prev) => Math.min(prev + 1, targetAddons.length - 1));
      } else {
        setSelectedAddonIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    [isReviewMode, addonsNeedingReview, filteredAddons]
  );

  // Keyboard shortcuts
  useReviewModeShortcuts(
    {
      onApprove: () => {
        const targetAddons = isReviewMode ? addonsNeedingReview : filteredAddons;
        const currentAddon = targetAddons[selectedAddonIndex];
        if (currentAddon && !currentAddon.isChecked) {
          handleReviewStatusChange(currentAddon, true, true);
        }
      },
      onReject: () => {
        const targetAddons = isReviewMode ? addonsNeedingReview : filteredAddons;
        const currentAddon = targetAddons[selectedAddonIndex];
        if (currentAddon) {
          handleReviewStatusChange(currentAddon, false, true);
        }
      },
      onEnable: () => {
        const targetAddons = isReviewMode ? addonsNeedingReview : filteredAddons;
        const currentAddon = targetAddons[selectedAddonIndex];
        if (currentAddon && !currentAddon.isValid) {
          handleValidityChange(currentAddon, true, true);
        }
      },
      onDisable: () => {
        const targetAddons = isReviewMode ? addonsNeedingReview : filteredAddons;
        const currentAddon = targetAddons[selectedAddonIndex];
        if (currentAddon && currentAddon.isValid) {
          handleValidityChange(currentAddon, false, true);
        }
      },
      onNext: () => navigateReview('next'),
      onPrevious: () => navigateReview('prev'),
      onUndo: undoLastAction,
      onExit: () => {
        setIsReviewMode(false);
        setIsFullscreenReview(false);
      },
    },
    (isReviewMode || isFullscreenReview) &&
      (isReviewMode ? addonsNeedingReview.length > 0 : filteredAddons.length > 0)
  );

  // Auto-scroll in review mode
  useEffect(() => {
    if ((isReviewMode || isFullscreenReview) && tableRef.current && !isFullscreenReview) {
      const selectedRow = tableRef.current.querySelector(
        `[data-addon-index="${selectedAddonIndex}"]`
      );
      if (selectedRow) {
        selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedAddonIndex, isReviewMode, isFullscreenReview]);

  // Deleted old FullscreenReview component - now using FullscreenAddonReview

  const FilterButtons = () => {
    const filters: { key: FilterType; label: string; count?: number }[] = [
      {
        key: 'unreviewed',
        label: 'Needs Review',
        count: addonData?.addons?.filter((a: Addon) => !a.isChecked).length,
      },
      { key: 'reviewed', label: 'Reviewed' },
      { key: 'all', label: 'All Active' },
    ];

    return (
      <div className='flex flex-wrap gap-2'>
        {filters.map(({ key, label, count }) => (
          <Button
            key={key}
            variant={filterType === key ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilterType(key)}
            className='gap-2'
          >
            {label}
            {count !== undefined && count > 0 && (
              <Badge variant={key === 'unreviewed' ? 'destructive' : 'secondary'} className='ml-1'>
                {count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    );
  };

  // Table columns - simplified
  const columns: ColumnDef<Addon>[] = [
    {
      accessorKey: 'icon',
      header: 'Addon',
      cell: ({ row }) => {
        const addon = row.original;
        let url = null;

        try {
          if (addon.modrinth_raw) {
            const data =
              typeof addon.modrinth_raw === 'string'
                ? JSON.parse(addon.modrinth_raw)
                : addon.modrinth_raw;
            if (data?.slug) url = `https://modrinth.com/mod/${data.slug}`;
          }
          if (!url && addon.curseforge_raw) {
            const data =
              typeof addon.curseforge_raw === 'string'
                ? JSON.parse(addon.curseforge_raw)
                : addon.curseforge_raw;
            if (data?.links?.websiteUrl) url = data.links.websiteUrl;
          }
        } catch (error) {
          console.warn('URL parsing failed:', error);
        }

        return (
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src={addon.icon || ''} />
              <AvatarFallback>{addon.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              {url ? (
                <Link
                  to={url}
                  target='_blank'
                  className='hover:text-primary flex items-center gap-1 font-medium'
                >
                  {addon.name}
                  <ExternalLink className='h-3 w-3' />
                </Link>
              ) : (
                <div className='font-medium'>{addon.name}</div>
              )}
              <div className='text-muted-foreground text-xs'>
                {addon.authors?.join(', ') || 'Unknown'}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className='max-w-md truncate text-sm'>
          {row.original.description || 'No description'}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row, table }) => {
        const addon = row.original;
        const rowIndex = table.getRowModel().rows.findIndex((r) => r.original.$id === addon.$id);
        const isSelected = isReviewMode && selectedAddonIndex === rowIndex;

        return (
          <div
            className={cn(
              'flex items-center gap-4 rounded p-2',
              isSelected && 'bg-primary/10 ring-primary ring-1'
            )}
            data-addon-index={rowIndex}
          >
            <div className='flex items-center gap-2'>
              <Checkbox
                checked={addon.isChecked}
                onCheckedChange={(checked) => handleReviewStatusChange(addon, checked === true)}
                disabled={isUpdating || hasPermissionError}
              />
              <Badge variant={addon.isChecked ? 'default' : 'secondary'}>
                {addon.isChecked ? 'Reviewed' : 'Needs Review'}
              </Badge>
            </div>

            <div className='flex items-center gap-2'>
              <Switch
                checked={addon.isValid}
                onCheckedChange={(checked) => handleValidityChange(addon, checked)}
                disabled={isUpdating || hasPermissionError}
              />
              <Badge variant={addon.isValid ? 'default' : 'destructive'}>
                {addon.isValid ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'downloads',
      header: 'Downloads',
      cell: ({ row }) => (
        <div className='flex items-center gap-1 text-sm'>
          <Download className='h-4 w-4' />
          {row.original.downloads?.toLocaleString() || '0'}
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <Card className='border-destructive/50'>
        <CardContent className='flex h-96 items-center justify-center'>
          <div className='space-y-4 text-center'>
            <XCircle className='text-destructive mx-auto h-12 w-12' />
            <div>
              <h3 className='text-lg font-semibold'>Failed to load addons</h3>
              <p className='text-muted-foreground mt-1 text-sm'>
                {error?.message || 'Unknown error'}
              </p>
            </div>
            <Button onClick={() => refetch()} variant='outline'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className='space-y-4'>
        {/* Permission Error Alert */}
        <AnimatePresence>
          {hasPermissionError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert variant='destructive'>
                <Shield className='h-4 w-4' />
                <AlertTitle>Permission Error</AlertTitle>
                <AlertDescription>
                  You don&apos;t have permission to update addons. Please ensure you&apos;re logged
                  in as an admin user.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-2xl'>🚀 Addons Management (V3)</CardTitle>
                <CardDescription>
                  Streamlined addon review and management
                  {addonData && addonData.total > 0 && (
                    <span className='ml-2'>• {addonData.total} total addons</span>
                  )}
                </CardDescription>
              </div>

              <div className='flex items-center gap-2'>
                {reviewHistory.length > 0 && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={undoLastAction}
                    disabled={isUpdating}
                  >
                    <Undo2 className='mr-2 h-4 w-4' />
                    Undo ({reviewHistory.length})
                  </Button>
                )}

                <Button
                  variant={isReviewMode ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setIsReviewMode(!isReviewMode)}
                >
                  <Keyboard className='mr-2 h-4 w-4' />
                  {isReviewMode ? 'Exit Review' : 'Review Mode'}
                </Button>

                {isReviewMode && addonsNeedingReview.length > 0 && (
                  <Button variant='secondary' size='sm' onClick={() => setIsFullscreenReview(true)}>
                    <Maximize2 className='mr-2 h-4 w-4' />
                    Fullscreen Review
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Review Mode Alert */}
        <AnimatePresence>
          {isReviewMode && !isFullscreenReview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert>
                <Keyboard className='h-4 w-4' />
                <AlertTitle>Review Mode Active</AlertTitle>
                <AlertDescription>
                  <div className='flex items-center justify-between'>
                    <span>Use keyboard shortcuts for faster review</span>
                    <Badge variant='secondary'>
                      {selectedAddonIndex + 1} of {addonsNeedingReview.length} needing review
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters and Search */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <FilterButtons />

              <div className='relative'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  placeholder='Search all addons globally...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='w-[400px] pl-10'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className='p-0'>
            <div ref={tableRef} className='max-h-[70vh] overflow-auto'>
              {isCurrentlyLoading || isCurrentlyFetching ? (
                <div className='flex h-64 items-center justify-center'>
                  <div className='flex items-center gap-2'>
                    <Loader2 className='h-6 w-6 animate-spin' />
                    <span>{search.trim() ? 'Searching...' : 'Loading...'}</span>
                  </div>
                </div>
              ) : (
                <DataTable columns={columns} data={filteredAddons} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground text-sm'>
              Showing {filteredAddons.length} of {addonData?.total || 0} addons
              {search.trim() && ' (search results)'}
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isCurrentlyFetching}
              >
                <ArrowLeft className='h-4 w-4' />
                Previous
              </Button>

              <span className='text-sm'>
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isCurrentlyFetching}
              >
                Next
                <ArrowRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}

        {/* No results */}
        {!isCurrentlyLoading && !isCurrentlyFetching && filteredAddons.length === 0 && (
          <Card className='border-dashed'>
            <CardContent className='flex h-40 items-center justify-center'>
              <div className='text-center'>
                <Check className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                <p className='font-medium'>
                  {search.trim() ? 'No addons found' : 'No addons to display'}
                </p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  {search.trim() ? 'Try different search terms' : 'All addons have been processed!'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fullscreen Review Mode */}
      <AnimatePresence>
        {isFullscreenReview &&
          (() => {
            const targetAddons = isReviewMode ? addonsNeedingReview : filteredAddons;
            const currentAddon = targetAddons[selectedAddonIndex];

            if (!currentAddon) return null;

            return (
              <FullscreenAddonReview
                addon={currentAddon}
                selectedIndex={selectedAddonIndex}
                totalAddons={targetAddons.length}
                onClose={() => setIsFullscreenReview(false)}
                onNavigate={navigateReview}
                onReviewStatusChange={handleReviewStatusChange}
                onValidityChange={handleValidityChange}
                isUpdating={isUpdating}
                hasPermissionError={hasPermissionError}
              />
            );
          })()}
      </AnimatePresence>
    </>
  );
};
