import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AddonStatsWrapper } from './stats/AddonStatsWrapper';
import { UsersStatsDisplayRegistered } from './stats/UsersStats';
import { AddonReviewStats } from './dashboard/AddonReviewStats';
import {
  LayoutDashboard,
  Package,
  Users,
  Activity,
  TrendingUp,
  FileText,
  Shield,
  Clock,
} from 'lucide-react';

export const AdminMainDashboard = () => {
  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
          <p className='text-muted-foreground'>Monitor and manage your platform's activity</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Addons</CardTitle>
            <Package className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <AddonStatsWrapper type='scanned' />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Validated Addons</CardTitle>
            <Shield className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <AddonStatsWrapper type='validated' />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Registered Users</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <UsersStatsDisplayRegistered />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Recent Activity</CardTitle>
            <Activity className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>Active</div>
            <p className='text-muted-foreground text-xs'>System operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>
            <LayoutDashboard className='mr-2 h-4 w-4' />
            Overview
          </TabsTrigger>
          <TabsTrigger value='addons'>
            <Package className='mr-2 h-4 w-4' />
            Addon Stats
          </TabsTrigger>
          <TabsTrigger value='users'>
            <Users className='mr-2 h-4 w-4' />
            User Stats
          </TabsTrigger>
          <TabsTrigger value='activity'>
            <Activity className='mr-2 h-4 w-4' />
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <AddonReviewStats />

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <TrendingUp className='h-5 w-5' />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>New Addons (Today)</span>
                    <span className='text-sm font-medium'>+12</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>New Users (Today)</span>
                    <span className='text-sm font-medium'>+5</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Downloads (Today)</span>
                    <span className='text-sm font-medium'>+234</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Clock className='h-5 w-5' />
                  Recent Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='text-sm'>
                    <span className='font-medium'>User123</span> uploaded an addon
                    <span className='text-muted-foreground ml-1'>2m ago</span>
                  </div>
                  <div className='text-sm'>
                    <span className='font-medium'>Admin</span> reviewed 3 addons
                    <span className='text-muted-foreground ml-1'>15m ago</span>
                  </div>
                  <div className='text-sm'>
                    <span className='font-medium'>System</span> auto-validated 5 addons
                    <span className='text-muted-foreground ml-1'>1h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='addons' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Addon Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <AddonStatsWrapper type='detailed' />
              </CardContent>
            </Card>
            <AddonReviewStats />
          </div>
        </TabsContent>

        <TabsContent value='users' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <UsersStatsDisplayRegistered />
                <div className='text-muted-foreground text-sm'>
                  More detailed user analytics coming soon...
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='activity' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-muted-foreground text-sm'>Activity tracking coming soon...</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
