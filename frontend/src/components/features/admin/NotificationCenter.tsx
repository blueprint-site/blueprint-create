import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bell,
  BellOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Package,
  User,
  MessageSquare,
  Flag,
  Zap,
  Clock,
  Settings,
  Archive,
  Trash2,
  Check,
  X,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  Monitor,
  Filter,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/config/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/useToast';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'addon' | 'user' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  actionLabel?: string;
  source?: string;
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
  onAction?: (notification: Notification) => void;
}

interface NotificationSettings {
  soundEnabled: boolean;
  desktopEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  autoMarkAsRead: boolean;
  groupSimilar: boolean;
  priorities: {
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  types: {
    addon: boolean;
    user: boolean;
    system: boolean;
  };
}

const defaultSettings: NotificationSettings = {
  soundEnabled: true,
  desktopEnabled: true,
  emailEnabled: false,
  pushEnabled: false,
  autoMarkAsRead: false,
  groupSimilar: true,
  priorities: {
    high: true,
    medium: true,
    low: true,
  },
  types: {
    addon: true,
    user: true,
    system: true,
  },
};

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  onAction,
}: NotificationCenterProps) {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [filter, setFilter] = useState<'all' | 'unread' | 'addon' | 'user' | 'system'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'addon') return n.type === 'addon';
    if (filter === 'user') return n.type === 'user';
    if (filter === 'system') return n.type === 'system';
    return true;
  });

  const groupedNotifications = settings.groupSimilar
    ? filteredNotifications.reduce(
        (acc, notif) => {
          const key = `${notif.type}-${notif.source || 'default'}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(notif);
          return acc;
        },
        {} as Record<string, Notification[]>
      )
    : { default: filteredNotifications };

  useEffect(() => {
    if (settings.desktopEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [settings.desktopEnabled]);

  useEffect(() => {
    const latestUnread = notifications.find((n) => !n.read);
    if (latestUnread && settings.soundEnabled && soundEnabled) {
      playNotificationSound();
    }
    if (latestUnread && settings.desktopEnabled) {
      showDesktopNotification(latestUnread);
    }
  }, [notifications, settings, soundEnabled]);

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const showDesktopNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon.png',
        tag: notification.id,
      });
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'high') return <AlertTriangle className='h-4 w-4 text-red-500' />;

    switch (type) {
      case 'success':
        return <CheckCircle2 className='h-4 w-4 text-green-500' />;
      case 'warning':
        return <AlertTriangle className='h-4 w-4 text-yellow-500' />;
      case 'error':
        return <XCircle className='h-4 w-4 text-red-500' />;
      case 'addon':
        return <Package className='h-4 w-4 text-blue-500' />;
      case 'user':
        return <User className='h-4 w-4 text-purple-500' />;
      case 'system':
        return <Zap className='h-4 w-4 text-orange-500' />;
      default:
        return <Info className='h-4 w-4 text-gray-500' />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      default:
        return 'border-gray-200 dark:border-gray-800';
    }
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={cn(
        'cursor-pointer rounded-lg border p-3 transition-all hover:shadow-sm',
        !notification.read && 'bg-muted/50',
        getPriorityColor(notification.priority)
      )}
      onClick={() => {
        if (!notification.read) {
          onMarkAsRead(notification.id);
        }
        if (notification.actionUrl && onAction) {
          onAction(notification);
        }
      }}
    >
      <div className='flex items-start justify-between'>
        <div className='flex items-start gap-3'>
          {getNotificationIcon(notification.type, notification.priority)}
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>{notification.title}</p>
            <p className='text-muted-foreground text-sm'>{notification.message}</p>
            <div className='mt-2 flex items-center gap-2'>
              <span className='text-muted-foreground text-xs'>
                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
              </span>
              {notification.source && (
                <>
                  <span className='text-muted-foreground text-xs'>•</span>
                  <span className='text-muted-foreground text-xs'>{notification.source}</span>
                </>
              )}
              {notification.actionUrl && (
                <>
                  <span className='text-muted-foreground text-xs'>•</span>
                  <Button
                    variant='link'
                    size='sm'
                    className='h-auto p-0 text-xs'
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAction) {
                        onAction(notification);
                      }
                    }}
                  >
                    <ExternalLink className='mr-1 h-3 w-3' />
                    {notification.actionLabel || 'View'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6'
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className='h-3 w-3' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {!notification.read && (
              <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                <Check className='mr-2 h-3 w-3' />
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(notification.id)}>
              <Trash2 className='mr-2 h-3 w-3' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <h3 className='text-sm font-medium'>Notification Channels</h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='sound' className='flex cursor-pointer items-center gap-2'>
              <Volume2 className='h-4 w-4' />
              Sound Notifications
            </Label>
            <Switch
              id='sound'
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='desktop' className='flex cursor-pointer items-center gap-2'>
              <Monitor className='h-4 w-4' />
              Desktop Notifications
            </Label>
            <Switch
              id='desktop'
              checked={settings.desktopEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, desktopEnabled: checked })}
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='email' className='flex cursor-pointer items-center gap-2'>
              <Mail className='h-4 w-4' />
              Email Notifications
            </Label>
            <Switch
              id='email'
              checked={settings.emailEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, emailEnabled: checked })}
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='push' className='flex cursor-pointer items-center gap-2'>
              <Smartphone className='h-4 w-4' />
              Push Notifications
            </Label>
            <Switch
              id='push'
              checked={settings.pushEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, pushEnabled: checked })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className='space-y-4'>
        <h3 className='text-sm font-medium'>Notification Types</h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='flex cursor-pointer items-center gap-2'>
              <Package className='h-4 w-4' />
              Addon Notifications
            </Label>
            <Switch
              checked={settings.types.addon}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  types: { ...settings.types, addon: checked },
                })
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label className='flex cursor-pointer items-center gap-2'>
              <User className='h-4 w-4' />
              User Notifications
            </Label>
            <Switch
              checked={settings.types.user}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  types: { ...settings.types, user: checked },
                })
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label className='flex cursor-pointer items-center gap-2'>
              <Zap className='h-4 w-4' />
              System Notifications
            </Label>
            <Switch
              checked={settings.types.system}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  types: { ...settings.types, system: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className='space-y-4'>
        <h3 className='text-sm font-medium'>Priority Levels</h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='flex cursor-pointer items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-red-500' />
              High Priority
            </Label>
            <Switch
              checked={settings.priorities.high}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  priorities: { ...settings.priorities, high: checked },
                })
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label className='flex cursor-pointer items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-yellow-500' />
              Medium Priority
            </Label>
            <Switch
              checked={settings.priorities.medium}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  priorities: { ...settings.priorities, medium: checked },
                })
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label className='flex cursor-pointer items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-gray-500' />
              Low Priority
            </Label>
            <Switch
              checked={settings.priorities.low}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  priorities: { ...settings.priorities, low: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className='space-y-4'>
        <h3 className='text-sm font-medium'>Other Settings</h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='cursor-pointer'>Auto-mark as read</Label>
            <Switch
              checked={settings.autoMarkAsRead}
              onCheckedChange={(checked) => setSettings({ ...settings, autoMarkAsRead: checked })}
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label className='cursor-pointer'>Group similar notifications</Label>
            <Switch
              checked={settings.groupSimilar}
              onCheckedChange={(checked) => setSettings({ ...settings, groupSimilar: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='relative'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' size='icon' className='relative'>
            {soundEnabled ? <Bell className='h-4 w-4' /> : <BellOff className='h-4 w-4' />}
            {unreadCount > 0 && (
              <Badge
                variant='destructive'
                className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0'
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end' className='w-96 p-0'>
          <Card className='border-0'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle>Notifications</CardTitle>
                <div className='flex items-center gap-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? (
                      <Volume2 className='h-4 w-4' />
                    ) : (
                      <VolumeX className='h-4 w-4' />
                    )}
                  </Button>
                  <Sheet open={showSettings} onOpenChange={setShowSettings}>
                    <SheetTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <Settings className='h-4 w-4' />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Notification Settings</SheetTitle>
                        <SheetDescription>Configure how you receive notifications</SheetDescription>
                      </SheetHeader>
                      <div className='mt-6'>
                        <NotificationSettings />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              <CardDescription>You have {unreadCount} unread notifications</CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
                <TabsList className='grid grid-cols-5 rounded-none border-b'>
                  <TabsTrigger value='all'>All</TabsTrigger>
                  <TabsTrigger value='unread'>
                    Unread
                    {unreadCount > 0 && (
                      <Badge variant='secondary' className='ml-1 h-4 px-1 text-xs'>
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value='addon'>Addons</TabsTrigger>
                  <TabsTrigger value='user'>Users</TabsTrigger>
                  <TabsTrigger value='system'>System</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className='m-0'>
                  <ScrollArea className='h-[400px]'>
                    <div className='space-y-2 p-3'>
                      {filteredNotifications.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-8'>
                          <Bell className='text-muted-foreground mb-2 h-8 w-8' />
                          <p className='text-muted-foreground text-sm'>No notifications</p>
                        </div>
                      ) : (
                        <>
                          {settings.groupSimilar &&
                            Object.entries(groupedNotifications).map(([key, notifs]) => {
                              if (notifs.length === 1) {
                                return <NotificationItem key={key} notification={notifs[0]} />;
                              }
                              return (
                                <div key={key} className='space-y-2'>
                                  <div className='text-muted-foreground text-xs font-medium'>
                                    {notifs[0].source || notifs[0].type} ({notifs.length})
                                  </div>
                                  {notifs.map((notif) => (
                                    <NotificationItem key={notif.id} notification={notif} />
                                  ))}
                                </div>
                              );
                            })}
                          {!settings.groupSimilar &&
                            filteredNotifications.map((notif) => (
                              <NotificationItem key={notif.id} notification={notif} />
                            ))}
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              {notifications.length > 0 && (
                <div className='flex items-center justify-between border-t p-3'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={onMarkAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <Check className='mr-2 h-4 w-4' />
                    Mark all as read
                  </Button>
                  <Button variant='ghost' size='sm' onClick={onDeleteAll}>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
