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
  AlertTriangle,
  ExternalLink,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/config/utils';

interface ReviewAction {
  id: string;
  addonId: string;
  addonName: string;
  field: 'isChecked' | 'isValid';
  previousValue: boolean;
  newValue: boolean;
  timestamp: number;
}

type FilterType = 'all' | 'reviewed' | 'unreviewed' | 'unsorted';

export const OptimizedAddonsTableV3 = () => {
  // Core state
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('unsorted');

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
  const {
    data: addonData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminAddons(
    {
      reviewStatus: filterType,
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
  const addonsNeedingReview = useMemo(() => {
    return filteredAddons.filter((addon: Addon) => !addon.isChecked || !addon.isValid);
  }, [filteredAddons]);

  // Reset states when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedAddonIndex(0);
    if (filterType !== 'unsorted') {
      setHiddenAddonIds(new Set());
    }
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

  // Fullscreen Review Component
  const FullscreenReview = () => {
    const targetAddons = isReviewMode ? addonsNeedingReview : filteredAddons;
    const currentAddon = targetAddons[selectedAddonIndex];

    if (!currentAddon) return null;

    // Generate addon URL for iframe
    const getAddonUrl = (addon: Addon) => {
      try {
        if (addon.modrinth_raw) {
          const modrinthData =
            typeof addon.modrinth_raw === 'string'
              ? JSON.parse(addon.modrinth_raw)
              : addon.modrinth_raw;
          if (modrinthData?.slug) {
            return `https://modrinth.com/mod/${modrinthData.slug}`;
          }
        }
        if (addon.curseforge_raw) {
          const curseforgeData =
            typeof addon.curseforge_raw === 'string'
              ? JSON.parse(addon.curseforge_raw)
              : addon.curseforge_raw;
          if (curseforgeData?.links?.websiteUrl) {
            return curseforgeData.links.websiteUrl;
          }
        }
      } catch (error) {
        console.warn('Failed to parse addon URLs:', error);
      }
      return null;
    };

    const addonUrl = getAddonUrl(currentAddon);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='bg-background fixed inset-0 z-50 flex flex-col'
      >
        {/* Header */}
        <div className='bg-card flex items-center justify-between border-b p-4'>
          <div className='flex items-center gap-4'>
            <Button variant='outline' size='sm' onClick={() => setIsFullscreenReview(false)}>
              <Minimize2 className='mr-2 h-4 w-4' />
              Exit Fullscreen
            </Button>

            <div className='flex items-center gap-2'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={currentAddon.icon || ''} />
                <AvatarFallback>{currentAddon.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className='font-semibold'>{currentAddon.name}</h2>
                <p className='text-muted-foreground text-sm'>
                  {currentAddon.authors?.join(', ') || 'Unknown'}
                </p>
              </div>
            </div>

            <Badge variant={currentAddon.isValid ? 'default' : 'destructive'}>
              {currentAddon.isValid ? 'Active' : 'Inactive'}
            </Badge>

            <Badge variant={currentAddon.isChecked ? 'default' : 'secondary'}>
              {currentAddon.isChecked ? 'Reviewed' : 'Needs Review'}
            </Badge>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>
              {selectedAddonIndex + 1} of {targetAddons.length}
            </span>

            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateReview('prev')}
              disabled={selectedAddonIndex === 0}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateReview('next')}
              disabled={selectedAddonIndex === targetAddons.length - 1}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className='flex flex-1'>
          {/* Left Panel - Addon Info & Actions */}
          <div className='bg-card w-96 overflow-y-auto border-r p-6'>
            <div className='space-y-6'>
              {/* Addon Details */}
              <div>
                <h3 className='mb-3 font-semibold'>Addon Information</h3>
                <div className='space-y-3'>
                  <div>
                    <label className='text-sm font-medium'>Description</label>
                    <p className='text-muted-foreground mt-1 text-sm'>
                      {currentAddon.description || 'No description available'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium'>Categories</label>
                    <div className='mt-1 flex flex-wrap gap-1'>
                      {(Array.isArray(currentAddon.categories) ? currentAddon.categories : []).map(
                        (cat: string) => (
                          <Badge key={cat} variant='outline' className='text-xs'>
                            {cat}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className='text-sm font-medium'>Downloads</label>
                    <p className='text-muted-foreground mt-1 flex items-center gap-1 text-sm'>
                      <Download className='h-4 w-4' />
                      {currentAddon.downloads?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div>
                <h3 className='mb-3 font-semibold'>Review Actions</h3>
                <div className='space-y-4'>
                  {/* Review Status */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        checked={currentAddon.isChecked}
                        onCheckedChange={(checked) =>
                          handleReviewStatusChange(currentAddon, checked === true, true)
                        }
                        disabled={isUpdating || hasPermissionError}
                      />
                      <label className='text-sm font-medium'>Mark as Reviewed</label>
                    </div>
                  </div>

                  <Separator />

                  {/* Enable/Disable */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Switch
                        checked={currentAddon.isValid}
                        onCheckedChange={(checked) =>
                          handleValidityChange(currentAddon, checked, true)
                        }
                        disabled={isUpdating || hasPermissionError}
                      />
                      <label className='text-sm font-medium'>
                        {currentAddon.isValid ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div className='grid grid-cols-2 gap-2'>
                    <Button
                      size='sm'
                      onClick={() => handleReviewStatusChange(currentAddon, true, true)}
                      disabled={currentAddon.isChecked || isUpdating || hasPermissionError}
                      className='bg-green-600 hover:bg-green-700'
                    >
                      <CheckCircle2 className='mr-1 h-4 w-4' />
                      Approve
                    </Button>

                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleValidityChange(currentAddon, true, true)}
                      disabled={currentAddon.isValid || isUpdating || hasPermissionError}
                    >
                      <Eye className='mr-1 h-4 w-4' />
                      Enable
                    </Button>

                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleValidityChange(currentAddon, false, true)}
                      disabled={!currentAddon.isValid || isUpdating || hasPermissionError}
                    >
                      <EyeOff className='mr-1 h-4 w-4' />
                      Disable
                    </Button>

                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleReviewStatusChange(currentAddon, false, true)}
                      disabled={isUpdating || hasPermissionError}
                    >
                      <AlertTriangle className='mr-1 h-4 w-4' />
                      Needs Work
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Addon Details */}
          <div className='flex flex-1 flex-col overflow-hidden'>
            <div className='bg-muted/50 flex items-center justify-between border-b p-4'>
              <div className='flex items-center gap-2'>
                <Globe className='h-4 w-4' />
                <span className='font-medium'>Addon Details</span>
              </div>
              {addonUrl && (
                <Button size='sm' variant='default' asChild>
                  <Link to={addonUrl} target='_blank'>
                    <ExternalLink className='mr-2 h-4 w-4' />
                    View on {addonUrl.includes('modrinth') ? 'Modrinth' : 'CurseForge'}
                  </Link>
                </Button>
              )}
            </div>

            <div className='flex-1 overflow-y-auto p-6'>
              <div className='max-w-2xl space-y-6'>
                {/* Rich Addon Info from Raw Data */}
                {(() => {
                  let rawData = null;
                  let platform = null;

                  // Try to get parsed data from modrinth_raw or curseforge_raw
                  try {
                    if (currentAddon.modrinth_raw) {
                      rawData =
                        typeof currentAddon.modrinth_raw === 'string'
                          ? JSON.parse(currentAddon.modrinth_raw)
                          : currentAddon.modrinth_raw;
                      platform = 'Modrinth';
                    } else if (currentAddon.curseforge_raw) {
                      rawData =
                        typeof currentAddon.curseforge_raw === 'string'
                          ? JSON.parse(currentAddon.curseforge_raw)
                          : currentAddon.curseforge_raw;
                      platform = 'CurseForge';
                    }
                  } catch (error) {
                    console.warn('Failed to parse raw addon data:', error);
                  }

                  return (
                    <>
                      {/* Main Description */}
                      <div>
                        <div className='mb-3 flex items-center gap-2'>
                          <h3 className='text-lg font-semibold'>Description</h3>
                          {platform && (
                            <Badge variant='outline' className='text-xs'>
                              From {platform}
                            </Badge>
                          )}
                        </div>
                        <p className='text-muted-foreground leading-relaxed'>
                          {rawData?.description ||
                            currentAddon.description ||
                            'No description available for this addon.'}
                        </p>
                      </div>

                      {/* Gallery/Screenshots */}
                      {rawData?.gallery && rawData.gallery.length > 0 && (
                        <div>
                          <h4 className='mb-3 font-semibold'>Screenshots</h4>
                          <div className='grid grid-cols-2 gap-2'>
                            {rawData.gallery
                              .slice(0, 4)
                              .map(
                                (
                                  image: { url?: string; title?: string } | string,
                                  index: number
                                ) => (
                                  <div key={index} className='group relative'>
                                    <img
                                      src={typeof image === 'string' ? image : image.url || ''}
                                      alt={
                                        typeof image === 'string'
                                          ? `Screenshot ${index + 1}`
                                          : image.title || `Screenshot ${index + 1}`
                                      }
                                      className='h-32 w-full cursor-pointer rounded-md border object-cover transition-transform hover:scale-105'
                                    />
                                    {typeof image !== 'string' && image.title && (
                                      <div className='absolute inset-x-0 bottom-0 rounded-b-md bg-black/70 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100'>
                                        {typeof image !== 'string' ? image.title : ''}
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            {rawData.gallery.length > 4 && (
                              <div className='bg-muted flex h-32 items-center justify-center rounded-md border border-dashed'>
                                <span className='text-muted-foreground text-sm'>
                                  +{rawData.gallery.length - 4} more images
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Project Details */}
                      {rawData && (
                        <div className='space-y-4'>
                          <h4 className='font-semibold'>Project Information</h4>

                          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {/* License */}
                            {rawData.license && (
                              <div>
                                <label className='text-sm font-medium'>License</label>
                                <p className='text-muted-foreground mt-1 text-sm'>
                                  {rawData.license.name || rawData.license.id || rawData.license}
                                </p>
                              </div>
                            )}

                            {/* Project Type */}
                            {rawData.project_type && (
                              <div>
                                <label className='text-sm font-medium'>Project Type</label>
                                <Badge variant='secondary' className='mt-1'>
                                  {rawData.project_type}
                                </Badge>
                              </div>
                            )}

                            {/* Status */}
                            {rawData.status && (
                              <div>
                                <label className='text-sm font-medium'>Status</label>
                                <Badge
                                  variant={rawData.status === 'approved' ? 'default' : 'secondary'}
                                  className='mt-1'
                                >
                                  {rawData.status}
                                </Badge>
                              </div>
                            )}

                            {/* Client/Server Side */}
                            {(rawData.client_side || rawData.server_side) && (
                              <div>
                                <label className='text-sm font-medium'>Compatibility</label>
                                <div className='mt-1 flex gap-2'>
                                  {rawData.client_side && (
                                    <Badge variant='outline'>Client: {rawData.client_side}</Badge>
                                  )}
                                  {rawData.server_side && (
                                    <Badge variant='outline'>Server: {rawData.server_side}</Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Team Members */}
                          {rawData.team && rawData.team.length > 0 && (
                            <div>
                              <h5 className='mb-2 font-medium'>Team Members</h5>
                              <div className='space-y-2'>
                                {rawData.team.map(
                                  (
                                    member: {
                                      user?: { avatar_url?: string; username?: string };
                                      name?: string;
                                      role?: string;
                                    },
                                    index: number
                                  ) => (
                                    <div key={index} className='flex items-center gap-2 text-sm'>
                                      {member.user?.avatar_url && (
                                        <img
                                          src={member.user.avatar_url}
                                          alt={member.user.username}
                                          className='h-6 w-6 rounded-full'
                                        />
                                      )}
                                      <span className='font-medium'>
                                        {member.user?.username || member.name}
                                      </span>
                                      <Badge variant='outline' className='text-xs'>
                                        {member.role}
                                      </Badge>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Donation URLs */}
                          {rawData.donation_urls && rawData.donation_urls.length > 0 && (
                            <div>
                              <h5 className='mb-2 font-medium'>Support the Developer</h5>
                              <div className='flex flex-wrap gap-2'>
                                {rawData.donation_urls.map(
                                  (donation: { url: string; platform?: string }, index: number) => (
                                    <Button key={index} variant='outline' size='sm' asChild>
                                      <Link to={donation.url} target='_blank'>
                                        {donation.platform || 'Donate'}
                                      </Link>
                                    </Button>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* External Links */}
                          {(rawData.issues_url ||
                            rawData.source_url ||
                            rawData.wiki_url ||
                            rawData.discord_url) && (
                            <div>
                              <h5 className='mb-2 font-medium'>External Links</h5>
                              <div className='grid grid-cols-2 gap-2'>
                                {rawData.issues_url && (
                                  <Button variant='outline' size='sm' asChild>
                                    <Link to={rawData.issues_url} target='_blank'>
                                      🐛 Issues
                                    </Link>
                                  </Button>
                                )}
                                {rawData.source_url && (
                                  <Button variant='outline' size='sm' asChild>
                                    <Link to={rawData.source_url} target='_blank'>
                                      💻 Source Code
                                    </Link>
                                  </Button>
                                )}
                                {rawData.wiki_url && (
                                  <Button variant='outline' size='sm' asChild>
                                    <Link to={rawData.wiki_url} target='_blank'>
                                      📖 Wiki
                                    </Link>
                                  </Button>
                                )}
                                {rawData.discord_url && (
                                  <Button variant='outline' size='sm' asChild>
                                    <Link to={rawData.discord_url} target='_blank'>
                                      💬 Discord
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Technical Details */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {/* Categories */}
                  {currentAddon.categories && currentAddon.categories.length > 0 && (
                    <div>
                      <h4 className='mb-2 font-semibold'>Categories</h4>
                      <div className='flex flex-wrap gap-2'>
                        {(Array.isArray(currentAddon.categories)
                          ? currentAddon.categories
                          : []
                        ).map((category: string) => (
                          <Badge key={category} variant='secondary'>
                            {category
                              .replace(/[-_]/g, ' ')
                              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Minecraft Versions */}
                  {currentAddon.minecraft_versions &&
                    currentAddon.minecraft_versions.length > 0 && (
                      <div>
                        <h4 className='mb-2 font-semibold'>Minecraft Versions</h4>
                        <div className='flex flex-wrap gap-1'>
                          {(Array.isArray(currentAddon.minecraft_versions)
                            ? currentAddon.minecraft_versions
                            : []
                          )
                            .slice(0, 8)
                            .map((version: string) => (
                              <Badge key={version} variant='outline' className='text-xs'>
                                {version}
                              </Badge>
                            ))}
                          {currentAddon.minecraft_versions.length > 8 && (
                            <Badge variant='outline' className='text-xs'>
                              +{currentAddon.minecraft_versions.length - 8} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Mod Loaders */}
                  {currentAddon.loaders && currentAddon.loaders.length > 0 && (
                    <div>
                      <h4 className='mb-2 font-semibold'>Mod Loaders</h4>
                      <div className='flex flex-wrap gap-2'>
                        {(Array.isArray(currentAddon.loaders) ? currentAddon.loaders : []).map(
                          (loader: string) => (
                            <Badge key={loader} variant='secondary'>
                              {loader}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Create Versions */}
                  {currentAddon.create_versions && currentAddon.create_versions.length > 0 && (
                    <div>
                      <h4 className='mb-2 font-semibold'>Create Mod Versions</h4>
                      <div className='flex flex-wrap gap-1'>
                        {currentAddon.create_versions.map((version: string) => (
                          <Badge key={version} variant='outline' className='text-xs'>
                            {version}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Statistics */}
                <div>
                  <h4 className='mb-3 font-semibold'>Statistics</h4>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                    <Card className='p-4'>
                      <div className='flex items-center gap-2'>
                        <Download className='text-primary h-5 w-5' />
                        <div>
                          <div className='font-medium'>
                            {currentAddon.downloads?.toLocaleString() || '0'}
                          </div>
                          <div className='text-muted-foreground text-sm'>Downloads</div>
                        </div>
                      </div>
                    </Card>

                    <Card className='p-4'>
                      <div className='flex items-center gap-2'>
                        <Clock className='text-primary h-5 w-5' />
                        <div>
                          <div className='font-medium'>
                            {currentAddon.created_at
                              ? new Date(currentAddon.created_at).toLocaleDateString()
                              : 'Unknown'}
                          </div>
                          <div className='text-muted-foreground text-sm'>Created</div>
                        </div>
                      </div>
                    </Card>

                    <Card className='p-4'>
                      <div className='flex items-center gap-2'>
                        <RefreshCw className='text-primary h-5 w-5' />
                        <div>
                          <div className='font-medium'>
                            {currentAddon.updated_at
                              ? new Date(currentAddon.updated_at).toLocaleDateString()
                              : 'Unknown'}
                          </div>
                          <div className='text-muted-foreground text-sm'>Updated</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Raw Data Sources */}
                <div className='space-y-4'>
                  <h4 className='font-semibold'>Data Sources</h4>
                  <div className='grid gap-2'>
                    {currentAddon.modrinth_id && (
                      <div className='flex items-center gap-2 text-sm'>
                        <Badge variant='outline'>Modrinth</Badge>
                        <span className='font-mono text-xs'>{currentAddon.modrinth_id}</span>
                      </div>
                    )}
                    {currentAddon.curseforge_id && (
                      <div className='flex items-center gap-2 text-sm'>
                        <Badge variant='outline'>CurseForge</Badge>
                        <span className='font-mono text-xs'>{currentAddon.curseforge_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Claimed Status */}
                {currentAddon.claimed_by && (
                  <div>
                    <h4 className='mb-2 font-semibold'>Claim Status</h4>
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary'>Claimed</Badge>
                      <span className='text-muted-foreground text-sm'>
                        by {currentAddon.claimed_by}
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick Access */}
                {addonUrl && (
                  <Card className='from-primary/5 to-primary/10 border-primary/20 bg-gradient-to-r p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-semibold'>View Full Details</h4>
                        <p className='text-muted-foreground text-sm'>
                          Open this addon&apos;s page in a new tab to see all details, images, and
                          versions.
                        </p>
                      </div>
                      <Button asChild>
                        <Link to={addonUrl} target='_blank'>
                          <ExternalLink className='mr-2 h-4 w-4' />
                          Open Page
                        </Link>
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with shortcuts */}
        <div className='bg-card border-t p-4'>
          <div className='flex justify-center'>
            <div className='text-muted-foreground grid grid-cols-4 gap-4 text-xs'>
              <div>
                <kbd className='bg-background rounded px-2 py-1'>A</kbd> Approve
              </div>
              <div>
                <kbd className='bg-background rounded px-2 py-1'>E</kbd> Enable
              </div>
              <div>
                <kbd className='bg-background rounded px-2 py-1'>X</kbd> Disable
              </div>
              <div>
                <kbd className='bg-background rounded px-2 py-1'>←/→</kbd> Navigate
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Simple filter buttons (no tabs)
  const FilterButtons = () => {
    const filters: { key: FilterType; label: string; count?: number }[] = [
      {
        key: 'unsorted',
        label: 'Needs Review',
        count: addonData?.addons?.filter((a: Addon) => !a.isValid).length,
      },
      {
        key: 'unreviewed',
        label: 'Unreviewed',
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
              <Badge variant={key === 'unsorted' ? 'destructive' : 'secondary'} className='ml-1'>
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
      <AnimatePresence>{isFullscreenReview && <FullscreenReview />}</AnimatePresence>
    </>
  );
};
