import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Activity,
  BarChart3,
  PieChartIcon,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import type { Addon } from '@/types';
import { cn } from '@/config/utils';

interface AnalyticsDashboardProps {
  addons: Addon[];
  users?: any[];
  schematics?: any[];
  blogs?: any[];
  refreshData?: () => void;
  loading?: boolean;
}

interface StatCard {
  title: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  description: string;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

export function AnalyticsDashboard({
  addons = [],
  users = [],
  schematics = [],
  blogs = [],
  refreshData,
  loading = false,
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'addons' | 'users' | 'engagement'>(
    'all'
  );

  const dateRanges = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 365,
  };

  const stats = useMemo(() => {
    const now = new Date();
    const daysAgo = dateRanges[timeRange];
    const startDate = subDays(now, daysAgo);

    const recentAddons = addons.filter((a) => new Date(a.$createdAt) >= startDate);

    const approvedAddons = addons.filter((a) => a.isValid);
    const pendingAddons = addons.filter((a) => !a.isChecked);
    const rejectedAddons = addons.filter((a) => !a.isValid && a.isChecked);

    const totalDownloads = addons.reduce((sum, a) => sum + (a.downloads || 0), 0);
    const avgDownloads = totalDownloads / (addons.length || 1);

    const previousPeriodStart = subDays(startDate, daysAgo);
    const previousAddons = addons.filter((a) => {
      const created = new Date(a.$createdAt);
      return created >= previousPeriodStart && created < startDate;
    });

    const growthRate =
      previousAddons.length > 0
        ? ((recentAddons.length - previousAddons.length) / previousAddons.length) * 100
        : 0;

    return {
      totalAddons: addons.length,
      approvedAddons: approvedAddons.length,
      pendingAddons: pendingAddons.length,
      rejectedAddons: rejectedAddons.length,
      recentAddons: recentAddons.length,
      totalDownloads,
      avgDownloads: Math.round(avgDownloads),
      growthRate: Math.round(growthRate * 10) / 10,
      approvalRate: Math.round((approvedAddons.length / addons.length) * 100) || 0,
      totalUsers: users.length,
      totalSchematics: schematics.length,
      totalBlogs: blogs.length,
    };
  }, [addons, users, schematics, blogs, timeRange]);

  const timeSeriesData = useMemo(() => {
    const daysAgo = dateRanges[timeRange];
    const data = [];

    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const dayAddons = addons.filter((a) => {
        const created = new Date(a.$createdAt);
        return created >= dayStart && created <= dayEnd;
      });

      const approved = dayAddons.filter((a) => a.isValid).length;
      const rejected = dayAddons.filter((a) => !a.isValid && a.isChecked).length;
      const pending = dayAddons.filter((a) => !a.isChecked).length;

      data.push({
        date: format(date, 'MMM dd'),
        approved,
        rejected,
        pending,
        total: dayAddons.length,
      });
    }

    return data;
  }, [addons, timeRange]);

  const categoryData = useMemo(() => {
    const categoryCount: Record<string, number> = {};

    addons.forEach((addon) => {
      (addon.categories || []).forEach((category) => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });

    return Object.entries(categoryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [addons]);

  const validationScoreDistribution = useMemo(() => {
    const distribution = {
      high: 0,
      medium: 0,
      low: 0,
    };

    addons.forEach((addon) => {
      const mockScore = Math.random() * 100;
      if (mockScore >= 85) distribution.high++;
      else if (mockScore >= 60) distribution.medium++;
      else distribution.low++;
    });

    return [
      { name: 'High (85-100%)', value: distribution.high, color: '#10b981' },
      { name: 'Medium (60-84%)', value: distribution.medium, color: '#f59e0b' },
      { name: 'Low (0-59%)', value: distribution.low, color: '#ef4444' },
    ];
  }, [addons]);

  const performanceMetrics = useMemo(() => {
    return [
      { metric: 'Approval Rate', value: stats.approvalRate, fullMark: 100 },
      { metric: 'Auto-Approval', value: 65, fullMark: 100 },
      { metric: 'Review Speed', value: 78, fullMark: 100 },
      { metric: 'User Satisfaction', value: 88, fullMark: 100 },
      { metric: 'System Health', value: 92, fullMark: 100 },
    ];
  }, [stats]);

  const statCards: StatCard[] = [
    {
      title: 'Total Addons',
      value: stats.totalAddons.toLocaleString(),
      change: stats.growthRate,
      trend: stats.growthRate > 0 ? 'up' : stats.growthRate < 0 ? 'down' : 'neutral',
      icon: <Package className='h-4 w-4' />,
      description: `${stats.recentAddons} new in ${timeRange}`,
    },
    {
      title: 'Approval Rate',
      value: `${stats.approvalRate}%`,
      change: 5.2,
      trend: 'up',
      icon: <CheckCircle2 className='h-4 w-4' />,
      description: `${stats.approvedAddons} approved addons`,
    },
    {
      title: 'Total Downloads',
      value: stats.totalDownloads.toLocaleString(),
      change: 12.5,
      trend: 'up',
      icon: <Download className='h-4 w-4' />,
      description: `Avg ${stats.avgDownloads.toLocaleString()} per addon`,
    },
    {
      title: 'Active Users',
      value: stats.totalUsers.toLocaleString(),
      change: 8.3,
      trend: 'up',
      icon: <Users className='h-4 w-4' />,
      description: 'Registered users',
    },
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className='h-3 w-3' />;
      case 'down':
        return <ArrowDown className='h-3 w-3' />;
      default:
        return <Minus className='h-3 w-3' />;
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Analytics Dashboard</h2>
          <p className='text-muted-foreground'>Real-time metrics and performance insights</p>
        </div>
        <div className='flex items-center gap-2'>
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='7d'>Last 7 days</SelectItem>
              <SelectItem value='30d'>Last 30 days</SelectItem>
              <SelectItem value='90d'>Last 90 days</SelectItem>
              <SelectItem value='1y'>Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' size='icon' onClick={refreshData} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <div className='mt-2 flex items-center justify-between'>
                <p className='text-muted-foreground text-xs'>{stat.description}</p>
                <div
                  className={cn(
                    'flex items-center text-xs font-medium',
                    stat.trend === 'up' && 'text-green-600',
                    stat.trend === 'down' && 'text-red-600',
                    stat.trend === 'neutral' && 'text-gray-600'
                  )}
                >
                  {getTrendIcon(stat.trend)}
                  <span className='ml-1'>{Math.abs(stat.change)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='addons'>Addons</TabsTrigger>
          <TabsTrigger value='performance'>Performance</TabsTrigger>
          <TabsTrigger value='categories'>Categories</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Addon Submissions</CardTitle>
                <CardDescription>Daily addon submissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type='monotone'
                      dataKey='approved'
                      stackId='1'
                      stroke='#10b981'
                      fill='#10b981'
                      fillOpacity={0.6}
                    />
                    <Area
                      type='monotone'
                      dataKey='pending'
                      stackId='1'
                      stroke='#f59e0b'
                      fill='#f59e0b'
                      fillOpacity={0.6}
                    />
                    <Area
                      type='monotone'
                      dataKey='rejected'
                      stackId='1'
                      stroke='#ef4444'
                      fill='#ef4444'
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Validation Score Distribution</CardTitle>
                <CardDescription>Breakdown of addon validation scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={validationScoreDistribution}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {validationScoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
              <CardDescription>Distribution of content across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Addons</span>
                    <Badge variant='secondary'>{stats.totalAddons}</Badge>
                  </div>
                  <Progress value={100} className='h-2' />
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Users</span>
                    <Badge variant='secondary'>{stats.totalUsers}</Badge>
                  </div>
                  <Progress value={75} className='h-2' />
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Schematics</span>
                    <Badge variant='secondary'>{stats.totalSchematics}</Badge>
                  </div>
                  <Progress value={50} className='h-2' />
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Blogs</span>
                    <Badge variant='secondary'>{stats.totalBlogs}</Badge>
                  </div>
                  <Progress value={25} className='h-2' />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='addons' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Addon Trends</CardTitle>
              <CardDescription>Submission trends and approval rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='total' stroke='#3b82f6' name='Total' />
                  <Line type='monotone' dataKey='approved' stroke='#10b981' name='Approved' />
                  <Line type='monotone' dataKey='pending' stroke='#f59e0b' name='Pending' />
                  <Line type='monotone' dataKey='rejected' stroke='#ef4444' name='Rejected' />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className='grid gap-4 md:grid-cols-3'>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-yellow-600'>{stats.pendingAddons}</div>
                <p className='text-muted-foreground mt-1 text-xs'>Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>Auto-Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-green-600'>
                  {Math.round(stats.approvedAddons * 0.65)}
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>Via automation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>Average Review Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold'>2.5h</div>
                <p className='text-muted-foreground mt-1 text-xs'>Per addon</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='performance' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance and efficiency indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey='metric' />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name='Performance'
                    dataKey='value'
                    stroke='#3b82f6'
                    fill='#3b82f6'
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Automation Efficiency</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Auto-approval rate</span>
                  <span className='text-sm font-medium'>65%</span>
                </div>
                <Progress value={65} className='h-2' />
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Validation accuracy</span>
                  <span className='text-sm font-medium'>92%</span>
                </div>
                <Progress value={92} className='h-2' />
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>False positive rate</span>
                  <span className='text-sm font-medium'>3%</span>
                </div>
                <Progress value={3} className='h-2' />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Admin Activity</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Active admins</span>
                  <Badge variant='secondary'>5</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Reviews today</span>
                  <Badge variant='secondary'>48</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Avg response time</span>
                  <Badge variant='secondary'>15 min</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Pending actions</span>
                  <Badge variant='secondary'>{stats.pendingAddons}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='categories' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
              <CardDescription>Most common addon categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='value' fill='#3b82f6'>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className='grid gap-4 md:grid-cols-3'>
            {categoryData.slice(0, 6).map((category, index) => (
              <Card key={index}>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium capitalize'>
                      {category.name.replace('-', ' ')}
                    </span>
                    <Badge style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                      {category.value}
                    </Badge>
                  </div>
                  <Progress
                    value={(category.value / (categoryData[0]?.value || 1)) * 100}
                    className='mt-2 h-2'
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
