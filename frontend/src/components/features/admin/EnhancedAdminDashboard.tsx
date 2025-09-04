import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Grid3x3,
  List,
  Kanban,
  ChevronRight,
  Zap,
  Shield,
  Activity,
  TrendingUp,
} from 'lucide-react';

// Import all the new components
import {
  SmartReviewQueue,
  ManualAddForm,
  AddonsKanban,
  BulkOperationsPanel,
  ReviewInterface,
} from './addons';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { NotificationCenter, type Notification } from './NotificationCenter';

// Import hooks
import { useFetchAllAddons } from '@/api/appwrite/useAddons';
import {
  usePendingValidation,
  useBulkOperation,
  useReviewAction,
  useValidationAnalytics,
  useAdminNotifications,
  useMarkNotificationAsRead,
} from '@/api/appwrite/useAddonValidation';

import type { Addon } from '@/types';
import { cn } from '@/config/utils.ts';
import { toast } from '@/hooks/useToast';

export function EnhancedAdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine view from URL
  const getViewFromPath = (
    pathname: string
  ): 'dashboard' | 'queue' | 'kanban' | 'table' | 'add' => {
    if (pathname.includes('/review')) return 'queue';
    if (pathname.includes('/kanban')) return 'kanban';
    if (pathname.includes('/list')) return 'table';
    if (pathname.includes('/add')) return 'add';
    return 'dashboard';
  };

  const [view, setView] = useState<'dashboard' | 'queue' | 'kanban' | 'table' | 'add'>(
    getViewFromPath(location.pathname)
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Update view when URL changes
  useEffect(() => {
    const newView = getViewFromPath(location.pathname);
    setView(newView);
  }, [location.pathname]);

  // Handle view change and navigate to appropriate URL
  const handleViewChange = useCallback(
    (newView: 'dashboard' | 'queue' | 'kanban' | 'table' | 'add') => {
      setView(newView);
      const pathMap = {
        dashboard: '/admin/addons',
        queue: '/admin/addons/review',
        kanban: '/admin/addons/kanban',
        table: '/admin/addons/list',
        add: '/admin/addons/add',
      };
      navigate(pathMap[newView]);
    },
    [navigate]
  );

  // Fetch data
  const {
    data: addons = [],
    isLoading: addonsLoading,
    refetch: refetchAddons,
  } = useFetchAllAddons();
  const { data: pendingAddons = [] } = usePendingValidation();
  const { data: adminNotifications = [] } = useAdminNotifications();
  const { data: analytics } = useValidationAnalytics('30d');

  // Mutations
  const bulkOperationMutation = useBulkOperation();
  const reviewActionMutation = useReviewAction();
  const markNotificationAsReadMutation = useMarkNotificationAsRead();

  // Convert admin notifications to notification format
  useEffect(() => {
    setNotifications(adminNotifications as Notification[]);
  }, [adminNotifications]);

  // Filter addons based on search query
  const filteredAddons = searchQuery
    ? addons.filter(
        (addon) =>
          addon.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addon.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addon.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addon.categories?.some((cat: string) =>
            cat.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : addons;

  // Filter pending addons based on search query
  const filteredPendingAddons = searchQuery
    ? pendingAddons.filter(
        (addon) =>
          addon.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addon.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addon.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addon.categories?.some((cat: string) =>
            cat.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : pendingAddons;

  const stats = {
    totalAddons: filteredAddons.length,
    pendingReview: filteredPendingAddons.length,
    approvedToday: analytics?.approvedAddons || 0,
    rejectedToday: analytics?.rejectedAddons || 0,
    approvalRate: analytics?.approvalRate || 0,
  };

  const handleBulkApprove = async (addonIds: string[]) => {
    await bulkOperationMutation.mutateAsync({
      addonIds,
      operation: 'approve',
    });
    setSelectedAddons([]);
    refetchAddons();
  };

  const handleBulkReject = async (addonIds: string[]) => {
    await bulkOperationMutation.mutateAsync({
      addonIds,
      operation: 'reject',
      data: { reason: 'Bulk rejection' },
    });
    setSelectedAddons([]);
    refetchAddons();
  };

  const handleBulkDelete = async (addonIds: string[]) => {
    await bulkOperationMutation.mutateAsync({
      addonIds,
      operation: 'delete',
    });
    setSelectedAddons([]);
    refetchAddons();
  };

  const handleReviewAction = async (addon: any, action: 'approve' | 'reject', notes?: string) => {
    await reviewActionMutation.mutateAsync({
      addonId: addon.$id,
      action,
      notes,
    });
    refetchAddons();
  };

  const handleMarkNotificationAsRead = useCallback(
    async (id: string) => {
      await markNotificationAsReadMutation.mutateAsync(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    [markNotificationAsReadMutation, notifications]
  );

  const handleMarkAllNotificationsAsRead = useCallback(() => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  }, [notifications]);

  const handleDeleteNotification = useCallback(
    (id: string) => {
      setNotifications(notifications.filter((n) => n.id !== id));
    },
    [notifications]
  );

  const handleDeleteAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const QuickActions = () => (
    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
      <Card
        className='cursor-pointer transition-shadow hover:shadow-md'
        onClick={() => handleViewChange('add')}
      >
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>Add Addon</p>
              <p className='text-muted-foreground text-xs'>Manual or import</p>
            </div>
            <Plus className='text-muted-foreground h-5 w-5' />
          </div>
        </CardContent>
      </Card>

      <Card
        className='cursor-pointer transition-shadow hover:shadow-md'
        onClick={() => handleViewChange('queue')}
      >
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>Review Queue</p>
              <p className='text-muted-foreground text-xs'>{stats.pendingReview} pending</p>
            </div>
            <List className='h-5 w-5 text-orange-500' />
          </div>
        </CardContent>
      </Card>

      <Card
        className='cursor-pointer transition-shadow hover:shadow-md'
        onClick={() => handleViewChange('kanban')}
      >
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>Kanban Board</p>
              <p className='text-muted-foreground text-xs'>Visual workflow</p>
            </div>
            <Kanban className='h-5 w-5 text-purple-500' />
          </div>
        </CardContent>
      </Card>

      <Card className='cursor-pointer transition-shadow hover:shadow-md'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>Export Data</p>
              <p className='text-muted-foreground text-xs'>Download CSV</p>
            </div>
            <Download className='text-muted-foreground h-5 w-5' />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ViewSelector = useMemo(
    () => (
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Search addons...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-64 pl-9'
            />
          </div>
          <Select value={view} onValueChange={(v: any) => handleViewChange(v)}>
            <SelectTrigger className='w-40'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='dashboard'>
                <div className='flex items-center gap-2'>
                  <LayoutDashboard className='h-4 w-4' />
                  Dashboard
                </div>
              </SelectItem>
              <SelectItem value='queue'>
                <div className='flex items-center gap-2'>
                  <List className='h-4 w-4' />
                  Review Queue
                </div>
              </SelectItem>
              <SelectItem value='kanban'>
                <div className='flex items-center gap-2'>
                  <Kanban className='h-4 w-4' />
                  Kanban Board
                </div>
              </SelectItem>
              <SelectItem value='table'>
                <div className='flex items-center gap-2'>
                  <Grid3x3 className='h-4 w-4' />
                  Table View
                </div>
              </SelectItem>
              <SelectItem value='add'>
                <div className='flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  Add Addon
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onDelete={handleDeleteNotification}
            onDeleteAll={handleDeleteAllNotifications}
            onAction={(notif) => {
              if (notif.actionUrl) {
                window.location.href = notif.actionUrl;
              }
            }}
          />
          <Button variant='outline' size='icon' onClick={() => refetchAddons()}>
            <RefreshCw className={cn('h-4 w-4', addonsLoading && 'animate-spin')} />
          </Button>
        </div>
      </div>
    ),
    [
      searchQuery,
      view,
      notifications,
      handleViewChange,
      handleMarkNotificationAsRead,
      handleMarkAllNotificationsAsRead,
      handleDeleteNotification,
      handleDeleteAllNotifications,
      refetchAddons,
      addonsLoading,
    ]
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Addon Management</h1>
          <p className='text-muted-foreground'>Manage addons with validation and review tools</p>
        </div>
        <div className='flex items-center gap-4'>
          <div className='text-right'>
            <p className='text-muted-foreground text-sm'>Approval Rate</p>
            <p className='text-2xl font-bold text-green-600'>{stats.approvalRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <QuickActions />
      {ViewSelector}

      {reviewMode ? (
        <ReviewInterface
          addons={pendingAddons}
          currentIndex={currentReviewIndex}
          onApprove={async (addon, notes) => {
            await handleReviewAction(addon, 'approve', notes);
          }}
          onReject={async (addon, reason) => {
            await handleReviewAction(addon, 'reject', reason);
          }}
          onSkip={(addon) => {
            setCurrentReviewIndex(currentReviewIndex + 1);
          }}
          onFlag={(addon, reason) => {
            bulkOperationMutation.mutate({
              addonIds: [addon.$id],
              operation: 'flag',
              data: { reason },
            });
          }}
          onNavigate={setCurrentReviewIndex}
          onClose={() => setReviewMode(false)}
        />
      ) : (
        <>
          {view === 'dashboard' && (
            <AnalyticsDashboard
              addons={filteredAddons as Addon[]}
              refreshData={refetchAddons}
              loading={addonsLoading}
            />
          )}

          {view === 'queue' && (
            <SmartReviewQueue
              addons={filteredPendingAddons}
              onApprove={(addon) => handleReviewAction(addon, 'approve')}
              onReject={(addon) => handleReviewAction(addon, 'reject')}
              onReview={(addon) => {
                const index = filteredPendingAddons.findIndex((a) => a.$id === addon.$id);
                setCurrentReviewIndex(index);
                setReviewMode(true);
              }}
              onRefresh={refetchAddons}
              loading={addonsLoading}
            />
          )}

          {view === 'kanban' && (
            <AddonsKanban
              addons={filteredAddons as Addon[]}
              onUpdateAddon={async (addonId, updates) => {
                // Handle stage-based updates properly
                if (updates.stage) {
                  let operation: string = 'update';

                  // Map stage to the appropriate operation
                  if (updates.stage === 'approved') {
                    operation = 'approve';
                  } else if (updates.stage === 'rejected') {
                    operation = 'reject';
                  } else if (updates.stage === 'archived') {
                    operation = 'archive';
                  } else if (updates.stage === 'reviewing') {
                    operation = 'assign';
                    updates.assignedTo = 'admin'; // Set current user
                  }

                  // Execute the bulk operation
                  await bulkOperationMutation.mutateAsync({
                    addonIds: [addonId],
                    operation: operation as any,
                    data: updates,
                  });
                } else if (updates.isValid !== undefined) {
                  // Fallback for direct isValid updates
                  await bulkOperationMutation.mutateAsync({
                    addonIds: [addonId],
                    operation: updates.isValid ? 'approve' : 'reject',
                  });
                }

                // Refresh the addons list
                refetchAddons();
              }}
              onViewAddon={(addon) => {
                const index = filteredAddons.findIndex((a) => a.$id === addon.$id);
                setCurrentReviewIndex(index);
                setReviewMode(true);
              }}
            />
          )}

          {view === 'table' && selectedAddons.length > 0 && (
            <BulkOperationsPanel
              selectedAddons={
                filteredAddons.filter((a) => selectedAddons.includes(a.$id)) as Addon[]
              }
              onApprove={handleBulkApprove}
              onReject={handleBulkReject}
              onDelete={handleBulkDelete}
              onUpdateCategory={async (ids, categories) => {
                await bulkOperationMutation.mutateAsync({
                  addonIds: ids,
                  operation: 'approve',
                  data: { categories },
                });
                refetchAddons();
              }}
              onUpdateTags={async (ids, tags) => {
                await bulkOperationMutation.mutateAsync({
                  addonIds: ids,
                  operation: 'approve',
                  data: { tags },
                });
                refetchAddons();
              }}
              onExport={(ids) => {
                // Export functionality
                toast({
                  title: 'Export Started',
                  description: `Exporting ${ids.length} addons...`,
                });
              }}
              onClearSelection={() => setSelectedAddons([])}
              totalAddons={filteredAddons.length}
            />
          )}

          {view === 'add' && (
            <ManualAddForm
              onSubmit={async (data) => {
                // Create addon logic
                toast({
                  title: 'Addon Created',
                  description: `${data.name} has been added`,
                });
                handleViewChange('dashboard');
                refetchAddons();
              }}
              onCancel={() => handleViewChange('dashboard')}
            />
          )}
        </>
      )}
    </div>
  );
}
