import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Users,
  Package,
  FileText,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Layers,
  BookOpen,
  Puzzle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useAdminStats,
  useAdminRecentActivity,
  useAdminPendingContent,
} from '@/api/appwrite/useAdminStats';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';

// Stats Card Component
const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading = false,
}: {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  loading?: boolean;
}) => (
  <Card>
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      <Icon className='text-muted-foreground h-4 w-4' />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className='h-8 w-24' />
      ) : (
        <>
          <div className='text-2xl font-bold'>{value}</div>
          {description && <p className='text-muted-foreground mt-1 text-xs'>{description}</p>}
          {trend !== undefined && (
            <div className='mt-2 flex items-center'>
              <TrendingUp
                className={`mr-1 h-3 w-3 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}
              />
              <span className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}
                {trend}%
              </span>
            </div>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

// Activity Item Component
const ActivityItem = ({
  title,
  description,
  time,
  type,
}: {
  title: string;
  description: string;
  time?: string;
  type: 'addon' | 'schematic' | 'blog' | 'user';
}) => {
  const icons = {
    addon: <Puzzle className='h-4 w-4' />,
    schematic: <Layers className='h-4 w-4' />,
    blog: <BookOpen className='h-4 w-4' />,
    user: <Users className='h-4 w-4' />,
  };

  const colors = {
    addon: 'text-blue-500',
    schematic: 'text-green-500',
    blog: 'text-purple-500',
    user: 'text-orange-500',
  };

  return (
    <div className='flex items-start space-x-3 border-b py-3 last:border-0'>
      <div className={`mt-1 ${colors[type]}`}>{icons[type]}</div>
      <div className='flex-1 space-y-1'>
        <p className='text-sm leading-none font-medium'>{title}</p>
        <p className='text-muted-foreground text-xs'>{description}</p>
        {time && <p className='text-muted-foreground text-xs'>{time}</p>}
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentActivity, isLoading: activityLoading } = useAdminRecentActivity();
  const { data: pendingContent, isLoading: pendingLoading } = useAdminPendingContent();

  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' size='sm'>
            <Activity className='mr-2 h-4 w-4' />
            View Logs
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Users'
          value={stats?.users.total || 0}
          description={`${stats?.users.newThisWeek || 0} new this week`}
          icon={Users}
          loading={statsLoading}
        />
        <StatsCard
          title='Total Addons'
          value={stats?.addons.total || 0}
          description={`${stats?.addons.validated || 0} validated`}
          icon={Package}
          loading={statsLoading}
        />
        <StatsCard
          title='Total Schematics'
          value={stats?.schematics.total || 0}
          description={`${stats?.schematics.totalDownloads || 0} total downloads`}
          icon={Layers}
          loading={statsLoading}
        />
        <StatsCard
          title='Blog Posts'
          value={stats?.blogs.total || 0}
          description={`${stats?.blogs.published || 0} published`}
          icon={BookOpen}
          loading={statsLoading}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='pending'>Pending Moderation</TabsTrigger>
          <TabsTrigger value='activity'>Recent Activity</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {/* Addons Status */}
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>Addons Status</CardTitle>
                <CardDescription>Current addon validation status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center'>
                    <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>Validated</p>
                      <p className='text-muted-foreground text-xs'>
                        {stats?.addons.validated || 0} addons
                      </p>
                    </div>
                    <Badge variant='default'>{stats?.addons.validated || 0}</Badge>
                  </div>
                  <div className='flex items-center'>
                    <Clock className='mr-2 h-4 w-4 text-yellow-500' />
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>Pending</p>
                      <p className='text-muted-foreground text-xs'>
                        {stats?.addons.pending || 0} awaiting review
                      </p>
                    </div>
                    <Badge variant='secondary'>{stats?.addons.pending || 0}</Badge>
                  </div>
                  <div className='flex items-center'>
                    <AlertCircle className='mr-2 h-4 w-4 text-blue-500' />
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>Featured</p>
                      <p className='text-muted-foreground text-xs'>
                        {stats?.addons.featured || 0} featured
                      </p>
                    </div>
                    <Badge variant='outline'>{stats?.addons.featured || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schematics Overview */}
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>Schematics Overview</CardTitle>
                <CardDescription>Schematic statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Total Schematics</span>
                    <span className='text-sm font-bold'>{stats?.schematics.total || 0}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Featured</span>
                    <span className='text-sm font-bold'>{stats?.schematics.featured || 0}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Avg Complexity</span>
                    <Badge variant='outline'>
                      {stats?.schematics.averageComplexity || 'moderate'}
                    </Badge>
                  </div>
                  <div className='pt-2'>
                    <p className='text-muted-foreground mb-2 text-xs'>Download Distribution</p>
                    <Progress value={75} className='h-2' />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blog Stats */}
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>Blog Statistics</CardTitle>
                <CardDescription>Content publication status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Published</span>
                    <Badge variant='default'>{stats?.blogs.published || 0}</Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Drafts</span>
                    <Badge variant='secondary'>{stats?.blogs.draft || 0}</Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Total Likes</span>
                    <span className='text-sm font-bold'>{stats?.blogs.totalLikes || 0}</span>
                  </div>
                  <div className='pt-2'>
                    <Button className='w-full' size='sm' onClick={() => navigate('/admin/blog')}>
                      <FileText className='mr-2 h-4 w-4' />
                      Manage Blog
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-2 md:grid-cols-4'>
                <Button
                  variant='outline'
                  className='justify-start'
                  onClick={() => navigate('/admin/addons')}
                >
                  <Package className='mr-2 h-4 w-4' />
                  Manage Addons
                </Button>
                <Button
                  variant='outline'
                  className='justify-start'
                  onClick={() => navigate('/admin/schematics')}
                >
                  <Layers className='mr-2 h-4 w-4' />
                  Manage Schematics
                </Button>
                <Button
                  variant='outline'
                  className='justify-start'
                  onClick={() => navigate('/admin/users')}
                >
                  <Users className='mr-2 h-4 w-4' />
                  Manage Users
                </Button>
                <Button
                  variant='outline'
                  className='justify-start'
                  onClick={() => navigate('/admin/featured')}
                >
                  <BarChart3 className='mr-2 h-4 w-4' />
                  Featured Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Moderation Tab */}
        <TabsContent value='pending' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-3'>
            {/* Pending Addons */}
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>Pending Addons</CardTitle>
                <CardDescription>Addons awaiting validation</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className='h-[300px]'>
                  {pendingLoading ? (
                    <div className='space-y-2'>
                      <Skeleton className='h-12 w-full' />
                      <Skeleton className='h-12 w-full' />
                      <Skeleton className='h-12 w-full' />
                    </div>
                  ) : pendingContent?.addons.length === 0 ? (
                    <p className='text-muted-foreground py-4 text-center text-sm'>
                      No pending addons
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {pendingContent?.addons.map((addon) => (
                        <div
                          key={addon.$id}
                          className='flex items-center justify-between rounded border p-2'
                        >
                          <div className='flex-1'>
                            <p className='text-sm font-medium'>{addon.name}</p>
                            <p className='text-muted-foreground text-xs'>
                              {addon.sources?.join(', ')}
                            </p>
                          </div>
                          <Button size='sm' variant='outline'>
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Draft Blogs */}
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>Draft Blogs</CardTitle>
                <CardDescription>Unpublished blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className='h-[300px]'>
                  {pendingLoading ? (
                    <div className='space-y-2'>
                      <Skeleton className='h-12 w-full' />
                      <Skeleton className='h-12 w-full' />
                      <Skeleton className='h-12 w-full' />
                    </div>
                  ) : pendingContent?.blogs.length === 0 ? (
                    <p className='text-muted-foreground py-4 text-center text-sm'>No draft blogs</p>
                  ) : (
                    <div className='space-y-2'>
                      {pendingContent?.blogs.map((blog) => (
                        <div
                          key={blog.$id}
                          className='flex items-center justify-between rounded border p-2'
                        >
                          <div className='flex-1'>
                            <p className='text-sm font-medium'>{blog.title || 'Untitled'}</p>
                            <p className='text-muted-foreground text-xs'>
                              by {blog.authors || 'Unknown'}
                            </p>
                          </div>
                          <Button size='sm' variant='outline'>
                            Edit
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Unvalidated Schematics */}
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>Unvalidated Schematics</CardTitle>
                <CardDescription>Schematics needing review</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className='h-[300px]'>
                  {pendingLoading ? (
                    <div className='space-y-2'>
                      <Skeleton className='h-12 w-full' />
                      <Skeleton className='h-12 w-full' />
                      <Skeleton className='h-12 w-full' />
                    </div>
                  ) : pendingContent?.schematics.length === 0 ? (
                    <p className='text-muted-foreground py-4 text-center text-sm'>
                      No unvalidated schematics
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {pendingContent?.schematics.map((schematic) => (
                        <div
                          key={schematic.$id}
                          className='flex items-center justify-between rounded border p-2'
                        >
                          <div className='flex-1'>
                            <p className='text-sm font-medium'>{schematic.title}</p>
                            <p className='text-muted-foreground text-xs'>
                              {schematic.complexity_level || 'Unknown'} complexity
                            </p>
                          </div>
                          <Button size='sm' variant='outline'>
                            Validate
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value='activity' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-3'>
            {/* Recent Addons */}
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>Recent Addons</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className='h-[300px]'>
                  {activityLoading ? (
                    <div className='space-y-2'>
                      <Skeleton className='h-12 w-full' />
                      <Skeleton className='h-12 w-full' />
                    </div>
                  ) : (
                    <div className='space-y-1'>
                      {recentActivity?.addons.map((addon) => (
                        <ActivityItem
                          key={addon.$id}
                          title={addon.name}
                          description={`Added from ${addon.sources?.join(', ') || 'Unknown'}`}
                          time={
                            addon.$createdAt
                              ? format(new Date(addon.$createdAt), 'MMM d, h:mm a')
                              : ''
                          }
                          type='addon'
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Recent Schematics */}
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>Recent Schematics</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className='h-[300px]'>
                  {activityLoading ? (
                    <div className='space-y-2'>
                      <Skeleton className='h-12 w-full' />
                      <Skeleton className='h-12 w-full' />
                    </div>
                  ) : (
                    <div className='space-y-1'>
                      {recentActivity?.schematics.map((schematic) => (
                        <ActivityItem
                          key={schematic.$id}
                          title={schematic.title}
                          description={`${schematic.complexity_level || 'Unknown'} complexity`}
                          time={
                            schematic.$createdAt
                              ? format(new Date(schematic.$createdAt), 'MMM d, h:mm a')
                              : ''
                          }
                          type='schematic'
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Recent Blogs */}
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium'>Recent Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className='h-[300px]'>
                  {activityLoading ? (
                    <div className='space-y-2'>
                      <Skeleton className='h-12 w-full' />
                      <Skeleton className='h-12 w-full' />
                    </div>
                  ) : (
                    <div className='space-y-1'>
                      {recentActivity?.blogs.map((blog) => (
                        <ActivityItem
                          key={blog.$id}
                          title={blog.title || 'Untitled'}
                          description={`Status: ${blog.status || 'draft'}`}
                          time={
                            blog.$createdAt
                              ? format(new Date(blog.$createdAt), 'MMM d, h:mm a')
                              : ''
                          }
                          type='blog'
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value='analytics' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Overview of content types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Addons</span>
                      <span className='text-sm font-bold'>{stats?.addons.total || 0}</span>
                    </div>
                    <Progress value={(stats?.addons.total || 0) / 10} className='h-2' />
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Schematics</span>
                      <span className='text-sm font-bold'>{stats?.schematics.total || 0}</span>
                    </div>
                    <Progress value={(stats?.schematics.total || 0) / 10} className='h-2' />
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Blog Posts</span>
                      <span className='text-sm font-bold'>{stats?.blogs.total || 0}</span>
                    </div>
                    <Progress value={(stats?.blogs.total || 0) / 10} className='h-2' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>User interaction statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Total Downloads</span>
                    <span className='text-sm font-bold'>
                      {stats?.schematics.totalDownloads || 0}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Blog Likes</span>
                    <span className='text-sm font-bold'>{stats?.blogs.totalLikes || 0}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Featured Content</span>
                    <span className='text-sm font-bold'>
                      {(stats?.addons.featured || 0) + (stats?.schematics.featured || 0)}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Active Users</span>
                    <span className='text-sm font-bold'>{stats?.users.total || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
