import { Input } from '@/components/ui/input.tsx';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/tables/addonChecks/data-table';
import { useFetchAllAddons, useUpdateAddon } from '@/api/appwrite/useAddons';
import { toast } from '@/hooks';
import type { Addon } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Download, Check, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox';

export const AddonsTable = () => {
  // Configuration
  const INITIAL_DISPLAY_COUNT = 15;
  const LOAD_MORE_COUNT = 10;
  const TABLE_HEIGHT = '60vh'; // Fixed height for the scrollable area

  // State
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { data, isLoading, isError, error, refetch } = useFetchAllAddons();
  const { mutateAsync: updateAddon, isPending: isUpdating } = useUpdateAddon();
  const tableContainerRef = useRef(null);
  const loaderRef = useRef(null);

  const addons: Addon[] = data || [];

  // Filter addons based on search and filter type
  const filteredAddons = addons.filter((addon) => {
    const matchesSearch =
      search === '' ||
      addon.name.toLowerCase().includes(search.toLowerCase()) ||
      addon.authors?.join(', ').toLowerCase().includes(search.toLowerCase()) ||
      addon.description?.toLowerCase().includes(search.toLowerCase());

    if (filterType === 'unchecked') {
      return matchesSearch && !addon.isChecked;
    }

    return matchesSearch;
  });

  // Only display a subset of filtered addons
  const displayedAddons = filteredAddons.slice(0, displayCount);
  const hasMoreToLoad = displayCount < filteredAddons.length;

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  }, [search, filterType]);

  // Load more items when user scrolls
  const loadMoreItems = useCallback(() => {
    if (!hasMoreToLoad) return;

    setDisplayCount((prev) => Math.min(prev + LOAD_MORE_COUNT, filteredAddons.length));
  }, [hasMoreToLoad, filteredAddons.length]);

  // Set up intersection observer for infinite scroll within the fixed height container
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreToLoad) {
          loadMoreItems();
        }
      },
      {
        root: tableContainerRef.current, // Set the container as the viewport for the observer
        threshold: 0.1,
        rootMargin: '100px', // Load more before reaching the absolute bottom
      }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [loadMoreItems, hasMoreToLoad]);

  // Handle addon review status change
  const handleReviewStatusChange = async (addon: Addon, isChecked: boolean) => {
    try {
      await updateAddon({ addonId: addon.$id, data: { isChecked } });
      toast({
        title: `Addon ${isChecked ? 'marked as reviewed' : 'marked for review'}`,
        description: `${addon.name} has been ${isChecked ? 'reviewed' : 'marked for review'}.`,
      });
      refetch();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'There was an error updating the review status.',
      });
      console.error('Unexpected error:', error);
    }
  };

  // Handle addon validity status change
  const handleValidityChange = async (addon: Addon, isValid: boolean) => {
    try {
      // If we're enabling the addon, automatically mark it as reviewed as well
      const updateData = isValid ? { isValid, isChecked: true } : { isValid };

      await updateAddon({ addonId: addon.$id, data: updateData });

      let toastMessage = {
        title: `Addon ${isValid ? 'activated' : 'deactivated'} successfully`,
        description: `${addon.name} has been ${isValid ? 'approved' : 'disabled'}.`,
      };

      // Add extra info if we auto-marked it as reviewed
      if (isValid && !addon.isChecked) {
        toastMessage.description += ' It has also been marked as reviewed.';
      }

      toast(toastMessage);
      refetch();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'There was an error updating the addon status.',
      });
      console.error('Unexpected error:', error);
    }
  };

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
          <Avatar className='border-border h-12 w-12 border'>
            <AvatarImage src={row.original.icon || ''} alt={row.original.name} />
            <AvatarFallback className='bg-primary/10 text-xs'>
              {row.original.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className='font-medium'>{row.original.name}</div>,
    },
    {
      accessorKey: 'author',
      header: 'Author',
      cell: ({ row }) => (
        <div className='text-muted-foreground text-sm'>
          {row.original.authors?.join(', ') || 'Unknown'}
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
    {
      accessorKey: 'review',
      header: 'Review Status',
      cell: ({ row }) => (
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id={`review-${row.original.$id}`}
              checked={row.original.isChecked}
              onCheckedChange={(checked) =>
                handleReviewStatusChange(row.original, checked === true)
              }
              disabled={isUpdating || row.original.isValid} // Disable checkbox if addon is enabled
            />
            <label
              htmlFor={`review-${row.original.$id}`}
              className={`text-sm ${row.original.isValid ? 'text-muted-foreground cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {row.original.isChecked ? 'Reviewed' : 'Mark as reviewed'}
              {row.original.isValid && !row.original.isChecked && ' (auto-marked when enabled)'}
            </label>
          </div>

          {!row.original.isChecked ? (
            <Badge variant='outline' className='border-yellow-300 bg-yellow-100 text-yellow-800'>
              Needs Review
            </Badge>
          ) : (
            <Badge variant='outline' className='border-green-300 bg-green-100 text-green-800'>
              Reviewed
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'isValid',
      header: 'Status',
      cell: ({ row }) => (
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center space-x-2'>
            <Switch
              id={`status-${row.original.$id}`}
              checked={row.original.isValid}
              onCheckedChange={(checked) => handleValidityChange(row.original, checked)}
              disabled={isUpdating}
            />
            <label htmlFor={`status-${row.original.$id}`} className='cursor-pointer text-sm'>
              {row.original.isValid ? 'Enabled' : 'Disabled'}
            </label>
          </div>

          {row.original.isValid ? (
            <Badge variant='outline' className='border-green-300 bg-green-100 text-green-800'>
              Approved
            </Badge>
          ) : (
            <Badge variant='outline' className='border-red-300 bg-red-100 text-red-800'>
              Disabled
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'downloads',
      header: 'Downloads',
      cell: ({ row }) => (
        <div className='flex items-center space-x-1'>
          <Download size={14} className='text-muted-foreground' />
          <span>{row.original.downloads || 0}</span>
        </div>
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className='flex min-h-[400px] w-full items-center justify-center'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent'></div>
          <p className='text-muted-foreground'>Loading addons...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className='flex min-h-[400px] w-full items-center justify-center'>
        <div className='text-destructive flex flex-col items-center space-y-4'>
          <XCircle size={48} />
          <div>
            <p className='font-medium'>Error loading addons</p>
            <p className='text-muted-foreground text-sm'>{error?.message || 'Unknown error'}</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => refetch()} variant='outline'>
              Retry
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 px-4 md:px-8'>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='mb-4'>
          <h2 className='text-2xl font-semibold'>Addons Management</h2>
          <p className='text-muted-foreground'>
            Review and manage addon extensions
            {addons.filter((a) => !a.isChecked).length > 0 && (
              <span className='ml-1'>
                (
                <span className='font-medium text-yellow-600'>
                  {addons.filter((a) => !a.isChecked).length}
                </span>{' '}
                need review)
              </span>
            )}
          </p>
        </div>

        <Tabs defaultValue='all' className='w-full' onValueChange={setFilterType}>
          <div className='mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
            <TabsList>
              <TabsTrigger value='all'>All Addons</TabsTrigger>
              <TabsTrigger value='unchecked'>
                Needs Review
                {!isLoading && addons.filter((a) => !a.isChecked).length > 0 && (
                  <Badge variant='secondary' className='ml-1'>
                    {addons.filter((a) => !a.isChecked).length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className='relative'>
              <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
              <Input
                placeholder='Search addons...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full max-w-xs pl-8'
              />
            </div>
          </div>

          <div className='bg-background/60 text-muted-foreground sticky top-0 z-10 flex items-center justify-between border-b py-2 text-sm backdrop-blur-sm'>
            <span>
              Displaying {displayedAddons.length} of {filteredAddons.length} addons
            </span>
            {filteredAddons.length > INITIAL_DISPLAY_COUNT && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setDisplayCount(filteredAddons.length)}
                disabled={displayCount >= filteredAddons.length}
              >
                Show all
              </Button>
            )}
          </div>

          <AnimatePresence mode='wait'>
            <motion.div
              key={filterType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='relative'
            >
              {/* Fixed height container with scroll */}
              <div
                ref={tableContainerRef}
                className='border-border overflow-y-auto rounded-md border'
                style={{ height: TABLE_HEIGHT }}
              >
                <TabsContent value='all' className='mt-0'>
                  <DataTable columns={columns} data={displayedAddons} />

                  {/* Loader element inside the scrollable container */}
                  {hasMoreToLoad && (
                    <div ref={loaderRef} className='flex items-center justify-center py-4'>
                      <div className='flex items-center space-x-2'>
                        <Loader2 className='text-muted-foreground h-5 w-5 animate-spin' />
                        <span className='text-muted-foreground text-sm'>Loading more...</span>
                      </div>
                    </div>
                  )}

                  {!hasMoreToLoad &&
                    displayCount === filteredAddons.length &&
                    filteredAddons.length > INITIAL_DISPLAY_COUNT && (
                      <div className='text-muted-foreground flex items-center justify-center py-4 text-sm'>
                        Showing all {filteredAddons.length} results
                      </div>
                    )}
                </TabsContent>

                <TabsContent value='unchecked' className='mt-0'>
                  <DataTable columns={columns} data={displayedAddons} />

                  {/* Loader element inside the scrollable container */}
                  {hasMoreToLoad && (
                    <div ref={loaderRef} className='flex items-center justify-center py-4'>
                      <div className='flex items-center space-x-2'>
                        <Loader2 className='text-muted-foreground h-5 w-5 animate-spin' />
                        <span className='text-muted-foreground text-sm'>Loading more...</span>
                      </div>
                    </div>
                  )}

                  {!hasMoreToLoad &&
                    displayCount === filteredAddons.length &&
                    filteredAddons.length > INITIAL_DISPLAY_COUNT && (
                      <div className='text-muted-foreground flex items-center justify-center py-4 text-sm'>
                        Showing all {filteredAddons.length} results
                      </div>
                    )}
                </TabsContent>
              </div>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>

      {filteredAddons.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='flex h-40 items-center justify-center rounded-md border border-dashed'
        >
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Check size={20} className='text-muted-foreground' />
            <div>
              <p className='text-sm font-medium'>No addons found</p>
              <p className='text-muted-foreground text-xs'>
                {filterType === 'unchecked'
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

export default AddonsTable;
