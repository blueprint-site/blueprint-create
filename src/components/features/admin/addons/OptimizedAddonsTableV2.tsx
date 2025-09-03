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
  Shield,
  AlertTriangle,
  ExternalLink,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

interface ReviewedMod {
  id: string;
  addon: Addon;
  action: 'approved' | 'rejected' | 'enabled' | 'disabled';
  timestamp: number;
}

export const OptimizedAddonsTableV2 = () => {
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

  // Permission error state
  const [hasPermissionError, setHasPermissionError] = useState(false);

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
      search: filterType === 'history' || search.trim() !== '' ? '' : undefined,
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
      return searchData || { addons: [], total: 0, totalPages: 1 };
    }

    return addonData || { addons: [], total: 0, totalPages: 1 };
  };

  const activeData = getActiveData();

  // Filter addons based on current tab and hidden status
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

    if (filterType === 'history') {
      setHiddenAddonIds(new Set());
    }
  }, [search, filterType]);

  // Reset selected index when page changes
  useEffect(() => {
    if (selectedAddonIndex >= addons.length && addons.length > 0) {
      setSelectedAddonIndex(0);
    }
  }, [currentPage, addons.length, selectedAddonIndex]);

  // Add a review action to history
  const addToHistory = useCallback((action: Omit<ReviewAction, 'id' | 'timestamp'>) => {
    const newAction: ReviewAction = {
      ...action,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    setReviewHistory((prev) => {
      const updated = [newAction, ...prev];
      return updated.slice(0, 10);
    });
  }, []);

  // Add reviewed mod to history
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
        return updated.slice(0, 10);
      });

      setHiddenAddonIds((prev) => new Set([...prev, addon.$id]));
    },
    []
  );

  // Clear review history
  const clearHistory = useCallback(() => {
    setReviewedModsHistory([]);
    toast({
      title: '✨ History cleared',
      description: 'Review history has been cleared successfully.',
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

      setReviewHistory((prev) => prev.slice(1));

      setHiddenAddonIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lastAction.addonId);
        return newSet;
      });

      setReviewedModsHistory((prev) =>
        prev.filter((item) => item.addon.$id !== lastAction.addonId)
      );

      toast({
        title: '↩️ Action undone',
        description: `Reverted ${lastAction.addonName} to previous state.`,
      });

      refetch();
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

      const action = isChecked ? 'approved' : 'rejected';
      addToModHistory(addon, action);

      toast({
        title: isChecked ? '✅ Addon approved' : '⚠️ Marked for review',
        description: `${addon.name} has been ${isChecked ? 'approved' : 'marked for review'}.`,
      });

      if (isReviewMode && autoAdvance) {
        const remainingAddons = addons.filter((a) => a.$id !== addon.$id);
        if (selectedAddonIndex >= remainingAddons.length && remainingAddons.length > 0) {
          setSelectedAddonIndex(remainingAddons.length - 1);
        }
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
          description:
            'You need admin permissions to update addons. Please check your permissions in Appwrite.',
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

      const action = isValid ? 'enabled' : 'disabled';
      addToModHistory(addon, action);

      let toastMessage = {
        title: isValid ? '✅ Addon activated' : '🚫 Addon deactivated',
        description: `${addon.name} has been ${isValid ? 'approved and enabled' : 'disabled'}.`,
      };

      if (isValid && !addon.isChecked) {
        toastMessage.description += ' It has also been marked as reviewed.';
      }

      toast(toastMessage);

      if (isReviewMode && autoAdvance) {
        const remainingAddons = addons.filter((a) => a.$id !== addon.$id);
        if (selectedAddonIndex >= remainingAddons.length && remainingAddons.length > 0) {
          setSelectedAddonIndex(remainingAddons.length - 1);
        }
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
          description:
            'You need admin permissions to update addons. Please check your permissions in Appwrite.',
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

  // Keyboard shortcuts for review mode
  useReviewModeShortcuts(
    {
      onApprove: () => {
        const currentAddon = addons[selectedAddonIndex];
        if (currentAddon && !currentAddon.isChecked) {
          handleReviewStatusChange(currentAddon, true, true);
        }
      },
      onReject: () => {
        const currentAddon = addons[selectedAddonIndex];
        if (currentAddon && !currentAddon.isChecked) {
          handleReviewStatusChange(currentAddon, true, true);
        }
      },
      onEnable: () => {
        const currentAddon = addons[selectedAddonIndex];
        if (currentAddon && !currentAddon.isValid) {
          handleValidityChange(currentAddon, true, true);
        }
      },
      onDisable: () => {
        const currentAddon = addons[selectedAddonIndex];
        if (currentAddon && currentAddon.isValid) {
          handleValidityChange(currentAddon, false, true);
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
      header: 'Addon',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className='ring-border h-12 w-12 ring-2'>
              <AvatarImage src={row.original.icon || ''} alt={`${row.original.name} icon`} />
              <AvatarFallback className='from-primary/20 to-primary/10 bg-gradient-to-br'>
                {row.original.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className='flex flex-col'>
            {(() => {
              let url = null;

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
                  <Link to={url} target='_blank' rel='noopener noreferrer' className='group'>
                    <div className='hover:text-primary flex items-center gap-1 font-medium transition-colors'>
                      {row.original.name}
                      <ExternalLink className='h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100' />
                    </div>
                  </Link>
                );
              }

              return <div className='font-medium'>{row.original.name}</div>;
            })()}
            <div className='text-muted-foreground text-xs'>
              by {row.original.authors?.join(', ') || 'Unknown'}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='text-muted-foreground max-w-md cursor-help truncate text-sm'>
                {row.original.description || 'No description available'}
              </div>
            </TooltipTrigger>
            <TooltipContent className='max-w-sm'>
              <p>{row.original.description || 'No description available'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
              const actionConfig = {
                approved: {
                  color:
                    'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400',
                  icon: CheckCircle2,
                },
                rejected: {
                  color:
                    'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400',
                  icon: AlertTriangle,
                },
                enabled: {
                  color:
                    'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400',
                  icon: Eye,
                },
                disabled: {
                  color:
                    'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400',
                  icon: EyeOff,
                },
              };
              const config = actionConfig[historyItem.action];
              const Icon = config.icon;
              return (
                <div className='flex flex-col gap-1'>
                  <Badge variant='outline' className={cn('w-fit', config.color)}>
                    <Icon className='mr-1 h-3 w-3' />
                    {historyItem.action.charAt(0).toUpperCase() + historyItem.action.slice(1)}
                  </Badge>
                  <span className='text-muted-foreground flex items-center gap-1 text-xs'>
                    <Clock className='h-3 w-3' />
                    {new Date(historyItem.timestamp).toLocaleString()}
                  </span>
                </div>
              );
            },
          } as ColumnDef<Addon>,
        ]
      : [
          {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row, table }) => {
              const rowIndex = table
                .getRowModel()
                .rows.findIndex((r) => r.original.$id === row.original.$id);
              const isSelected = isReviewMode && selectedAddonIndex === rowIndex;

              return (
                <div
                  className={cn(
                    'flex flex-col gap-3 rounded-lg p-3 transition-all',
                    isSelected && 'bg-primary/5 ring-primary shadow-sm ring-2'
                  )}
                  data-addon-index={rowIndex}
                >
                  {/* Review Status */}
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        id={`review-${row.original.$id}`}
                        checked={row.original.isChecked}
                        onCheckedChange={(checked) =>
                          handleReviewStatusChange(row.original, checked === true)
                        }
                        disabled={isUpdating || row.original.isValid || hasPermissionError}
                        className='data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600'
                      />
                      <label
                        htmlFor={`review-${row.original.$id}`}
                        className={cn(
                          'text-sm font-medium',
                          (row.original.isValid || hasPermissionError) &&
                            'text-muted-foreground cursor-not-allowed'
                        )}
                      >
                        Reviewed
                      </label>
                    </div>
                    {!row.original.isChecked ? (
                      <Badge
                        variant='outline'
                        className='w-fit border-yellow-500/50 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      >
                        <AlertTriangle className='mr-1 h-3 w-3' />
                        Needs Review
                      </Badge>
                    ) : (
                      <Badge
                        variant='outline'
                        className='w-fit border-green-500/50 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      >
                        <CheckCircle2 className='mr-1 h-3 w-3' />
                        Reviewed
                      </Badge>
                    )}
                  </div>

                  <Separator className='my-1' />

                  {/* Enable/Disable Status */}
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <Switch
                        id={`valid-${row.original.$id}`}
                        checked={row.original.isValid}
                        onCheckedChange={(checked) => handleValidityChange(row.original, checked)}
                        disabled={isUpdating || hasPermissionError}
                        className='data-[state=checked]:bg-primary'
                      />
                      <label
                        htmlFor={`valid-${row.original.$id}`}
                        className={cn(
                          'text-sm font-medium',
                          hasPermissionError && 'text-muted-foreground cursor-not-allowed'
                        )}
                      >
                        {row.original.isValid ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>

                    <Badge
                      variant={row.original.isValid ? 'default' : 'destructive'}
                      className='w-fit'
                    >
                      {row.original.isValid ? (
                        <>
                          <Eye className='mr-1 h-3 w-3' />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className='mr-1 h-3 w-3' />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              );
            },
          } as ColumnDef<Addon>,
        ]),
    {
      accessorKey: 'downloads',
      header: 'Stats',
      cell: ({ row }) => (
        <div className='flex items-center gap-2 text-sm'>
          <div className='text-muted-foreground flex items-center gap-1'>
            <Download size={14} />
            <span className='font-medium'>{row.original.downloads?.toLocaleString() || '0'}</span>
          </div>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <Card className='border-destructive/50'>
        <CardContent className='flex h-96 items-center justify-center'>
          <div className='space-y-4 text-center'>
            <div className='flex justify-center'>
              <div className='bg-destructive/10 rounded-full p-3'>
                <XCircle className='text-destructive h-8 w-8' />
              </div>
            </div>
            <div>
              <h3 className='text-lg font-semibold'>Failed to load addons</h3>
              <p className='text-muted-foreground mt-1 text-sm'>
                {error?.message || 'Unknown error'}
              </p>
            </div>
            <Button onClick={() => refetch()} variant='outline' className='gap-2'>
              <RefreshCw className='h-4 w-4' />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Permission Error Alert */}
      <AnimatePresence>
        {hasPermissionError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant='destructive' className='border-red-500/50'>
              <Shield className='h-4 w-4' />
              <AlertTitle>Permission Error</AlertTitle>
              <AlertDescription>
                You don&apos;t have permission to update addons. Please ensure:
                <ul className='mt-2 list-inside list-disc space-y-1'>
                  <li>You&apos;re logged in as an admin user</li>
                  <li>The admin team has write permissions on the addons collection</li>
                  <li>Your session is still valid</li>
                </ul>
                Contact your Appwrite administrator to grant proper permissions.
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
              <CardTitle className='text-2xl'>🎨 Addons Management (V2)</CardTitle>
              <CardDescription>
                Review and manage addon extensions efficiently
                {addonData && addonData.total > 0 && (
                  <span className='ml-1'>
                    • Page {currentPage} of {totalPages} • {addonData.total} total addons
                  </span>
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
                  className='gap-2'
                >
                  <Undo2 size={16} />
                  Undo ({reviewHistory.length})
                </Button>
              )}

              {filterType === 'history' && reviewedModsHistory.length > 0 && (
                <Button variant='outline' size='sm' onClick={clearHistory} className='gap-2'>
                  <Trash2 size={16} />
                  Clear History
                </Button>
              )}

              <Button
                variant={isReviewMode ? 'default' : 'outline'}
                size='sm'
                onClick={() => setIsReviewMode(!isReviewMode)}
                className='gap-2'
              >
                <Keyboard size={16} />
                {isReviewMode ? 'Exit Review Mode' : 'Review Mode'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Review Mode Help */}
      <AnimatePresence>
        {isReviewMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert className='border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20'>
              <Keyboard className='h-4 w-4' />
              <AlertTitle>Review Mode Active</AlertTitle>
              <AlertDescription>
                <div className='mb-2 flex items-center justify-between'>
                  <span>Use keyboard shortcuts for faster review</span>
                  <Badge variant='secondary'>
                    {selectedAddonIndex + 1} of {addons.length}
                  </Badge>
                </div>
                <div className='mt-3 grid grid-cols-2 gap-2 text-sm'>
                  <div>
                    <kbd className='bg-background rounded border px-2 py-1'>A</kbd> Approve addon
                  </div>
                  <div>
                    <kbd className='bg-background rounded border px-2 py-1'>R</kbd> Reject addon
                  </div>
                  <div>
                    <kbd className='bg-background rounded border px-2 py-1'>E</kbd> Enable addon
                  </div>
                  <div>
                    <kbd className='bg-background rounded border px-2 py-1'>X</kbd> Disable addon
                  </div>
                  <div>
                    <kbd className='bg-background rounded border px-2 py-1'>↑/↓</kbd> Navigate
                  </div>
                  <div>
                    <kbd className='bg-background rounded border px-2 py-1'>Ctrl+Z</kbd> Undo
                  </div>
                </div>
                {addons.length > 0 && (
                  <p className='text-muted-foreground mt-3 text-xs'>
                    💡 Actions automatically advance to the next addon
                  </p>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <Card>
        <CardContent className='pt-6'>
          <Tabs
            defaultValue='unsorted'
            className='w-full'
            onValueChange={(value) => setFilterType(value as typeof filterType)}
          >
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <TabsList className='grid w-full grid-cols-5 sm:w-auto'>
                <TabsTrigger value='unsorted' className='gap-2'>
                  <Filter className='h-4 w-4' />
                  Unsorted
                  {addonData && (
                    <Badge variant='destructive' className='ml-1'>
                      {
                        addonData.addons.filter((a) => !a.isValid && !hiddenAddonIds.has(a.$id))
                          .length
                      }
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value='all'>All Active</TabsTrigger>
                <TabsTrigger value='unreviewed' className='gap-2'>
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
                <TabsTrigger value='history' className='gap-2'>
                  History
                  <Badge variant='outline' className='ml-1'>
                    {reviewedModsHistory.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className='relative'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  placeholder={
                    filterType === 'history' ? 'Search history...' : 'Search all addons...'
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='w-[300px] pl-10'
                  disabled={filterType === 'history'}
                />
              </div>
            </div>

            <TabsContent value={filterType} className='mt-6'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={`${currentPage}-${filterType}-${search}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div ref={tableRef} className='overflow-hidden rounded-lg border'>
                    {isCurrentlyLoading || isCurrentlyFetching ? (
                      <div className='bg-muted/5 flex h-64 items-center justify-center'>
                        <div className='flex flex-col items-center gap-3'>
                          <Loader2 className='text-primary h-8 w-8 animate-spin' />
                          <span className='text-muted-foreground text-sm'>
                            {search.trim() ? 'Searching addons...' : 'Loading addons...'}
                          </span>
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className='mt-6 flex items-center justify-between'>
                      <div className='text-muted-foreground text-sm'>
                        Showing {addons.length} of{' '}
                        {filterType === 'history' ? reviewedModsHistory.length : activeData.total}{' '}
                        addons
                        {filterType === 'history' && ' (from recent actions)'}
                        {search.trim() && ' (search results)'}
                      </div>

                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1 || isFetching}
                        >
                          <ArrowLeft size={16} />
                          Previous
                        </Button>

                        <div className='flex items-center gap-1'>
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else {
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
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* No results */}
      {!isCurrentlyLoading && !isCurrentlyFetching && addons.length === 0 && (
        <Card className='border-dashed'>
          <CardContent className='flex h-40 items-center justify-center'>
            <div className='flex flex-col items-center gap-3 text-center'>
              <div className='bg-muted rounded-full p-3'>
                <Check size={24} className='text-muted-foreground' />
              </div>
              <div>
                <p className='font-medium'>
                  {filterType === 'history'
                    ? 'No review history yet'
                    : search.trim()
                      ? 'No addons found'
                      : 'No addons to display'}
                </p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  {filterType === 'history'
                    ? 'Actions taken on addons will appear here'
                    : search.trim()
                      ? 'Try adjusting your search terms'
                      : filterType === 'unreviewed'
                        ? 'All addons have been reviewed!'
                        : 'Try adjusting your filter criteria'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
