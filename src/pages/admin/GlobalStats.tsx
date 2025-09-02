import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllUserStats } from '@/api/appwrite/useUserStats';
import {
  Users,
  Download,
  Heart,
  Package,
  Layers,
  TrendingUp,
  Trophy,
  Star,
  Calendar,
} from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  description: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description, trend }) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className='text-muted-foreground'>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{description}</p>
        {trend !== undefined && (
          <div className='flex items-center text-xs text-green-500 mt-1'>
            <TrendingUp className='h-3 w-3 mr-1' />
            +{trend}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const GlobalStats = () => {
  const { data: allUserStats, isLoading } = useAllUserStats();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold'>Global Statistics</h1>
          <p className='text-muted-foreground'>Platform-wide user activity and engagement metrics</p>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className='h-32' />
          ))}
        </div>
      </div>
    );
  }

  if (!allUserStats || allUserStats.length === 0) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold'>Global Statistics</h1>
          <p className='text-muted-foreground'>Platform-wide user activity and engagement metrics</p>
        </div>
        
        <Card>
          <CardContent className='pt-6'>
            <p className='text-center text-muted-foreground'>No user statistics available yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate global totals
  const totalUsers = allUserStats.length;
  const totalLogins = allUserStats.reduce((sum, stat) => sum + (stat.totalLogins || 0), 0);
  const totalSchematics = allUserStats.reduce((sum, stat) => sum + (stat.totalSchematics || 0), 0);
  const totalAddons = allUserStats.reduce((sum, stat) => sum + (stat.totalAddons || 0), 0);
  const totalDownloads = allUserStats.reduce((sum, stat) => sum + (stat.totalDownloadsReceived || 0), 0);
  const totalLikes = allUserStats.reduce((sum, stat) => sum + (stat.totalLikesReceived || 0), 0);
  const totalFollows = allUserStats.reduce((sum, stat) => sum + (stat.totalFollowers || 0), 0);
  const totalRatings = allUserStats.reduce((sum, stat) => sum + (stat.totalRatingsReceived || 0), 0);
  const averageRating = totalRatings > 0 
    ? allUserStats.reduce((sum, stat) => sum + (stat.averageRating || 0), 0) / allUserStats.length
    : 0;
  
  // Active users (logged in within last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeUsers = allUserStats.filter(stat => 
    stat.lastLoginAt && new Date(stat.lastLoginAt) > thirtyDaysAgo
  ).length;

  // Top performers
  const topDownloadUser = allUserStats.reduce((max, stat) => 
    (stat.totalDownloadsReceived || 0) > (max.totalDownloadsReceived || 0) ? stat : max
  , allUserStats[0]);

  const topContentCreator = allUserStats.reduce((max, stat) => 
    ((stat.totalSchematics || 0) + (stat.totalAddons || 0)) > 
    ((max.totalSchematics || 0) + (max.totalAddons || 0)) ? stat : max
  , allUserStats[0]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold'>Global Statistics</h1>
        <p className='text-muted-foreground'>Platform-wide user activity and engagement metrics</p>
      </div>

      {/* Overview Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          icon={<Users className='h-4 w-4' />}
          title='Total Users'
          value={totalUsers.toLocaleString()}
          description='Registered users'
        />
        <StatCard
          icon={<Users className='h-4 w-4' />}
          title='Active Users'
          value={activeUsers.toLocaleString()}
          description='Active in last 30 days'
        />
        <StatCard
          icon={<Calendar className='h-4 w-4' />}
          title='Total Logins'
          value={totalLogins.toLocaleString()}
          description='All-time login sessions'
        />
        <StatCard
          icon={<Star className='h-4 w-4' />}
          title='Average Rating'
          value={averageRating.toFixed(1)}
          description='Platform-wide content rating'
        />
      </div>

      {/* Content Stats */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>Content Statistics</h2>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            icon={<Layers className='h-4 w-4' />}
            title='Total Schematics'
            value={totalSchematics.toLocaleString()}
            description='User-created schematics'
          />
          <StatCard
            icon={<Package className='h-4 w-4' />}
            title='Total Addons'
            value={totalAddons.toLocaleString()}
            description='User-created addons'
          />
        </div>
      </div>

      {/* Engagement Stats */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>Engagement Statistics</h2>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <StatCard
            icon={<Download className='h-4 w-4' />}
            title='Total Downloads'
            value={totalDownloads.toLocaleString()}
            description='Content downloads'
          />
          <StatCard
            icon={<Heart className='h-4 w-4' />}
            title='Total Likes'
            value={totalLikes.toLocaleString()}
            description='Content likes'
          />
          <StatCard
            icon={<Users className='h-4 w-4' />}
            title='Total Follows'
            value={totalFollows.toLocaleString()}
            description='User follows'
          />
        </div>
      </div>

      {/* Top Performers */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>Top Performers</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Trophy className='h-5 w-5 text-yellow-500' />
                Most Downloaded Creator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <p className='text-lg font-semibold'>User {topDownloadUser.userId}</p>
                <p className='text-sm text-muted-foreground'>
                  {(topDownloadUser.totalDownloadsReceived || 0).toLocaleString()} downloads
                </p>
                <div className='text-xs text-muted-foreground'>
                  {topDownloadUser.totalSchematics || 0} schematics • {topDownloadUser.totalAddons || 0} addons
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Trophy className='h-5 w-5 text-blue-500' />
                Most Active Creator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <p className='text-lg font-semibold'>User {topContentCreator.userId}</p>
                <p className='text-sm text-muted-foreground'>
                  {((topContentCreator.totalSchematics || 0) + 
                    (topContentCreator.totalAddons || 0)).toLocaleString()} total content pieces
                </p>
                <div className='text-xs text-muted-foreground'>
                  {topContentCreator.totalSchematics || 0} schematics • {topContentCreator.totalAddons || 0} addons
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Milestones */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>Recent Milestones</h2>
        <Card>
          <CardContent className='pt-6'>
            <div className='space-y-4'>
              {allUserStats
                .filter(stat => stat.reached100Downloads || stat.reached1000Downloads)
                .slice(0, 5)
                .map((stat, index) => (
                  <div key={index} className='flex items-center justify-between py-2 border-b last:border-b-0'>
                    <div className='flex items-center gap-3'>
                      <Trophy className='h-4 w-4 text-yellow-500' />
                      <div>
                        <p className='font-medium'>User {stat.userId}</p>
                        <p className='text-xs text-muted-foreground'>
                          {stat.reached1000Downloads 
                            ? 'Reached 1,000 downloads' 
                            : 'Reached 100 downloads'}
                        </p>
                      </div>
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {stat.reached1000Downloads 
                        ? new Date(stat.reached1000Downloads).toLocaleDateString()
                        : stat.reached100Downloads 
                        ? new Date(stat.reached100Downloads).toLocaleDateString()
                        : ''}
                    </div>
                  </div>
                ))}
              {allUserStats.filter(stat => stat.reached100Downloads || stat.reached1000Downloads).length === 0 && (
                <p className='text-center text-muted-foreground'>No milestones reached yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};