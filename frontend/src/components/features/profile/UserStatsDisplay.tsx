import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStats } from '@/api/appwrite/useUserStats';
import {
  Download,
  Upload,
  Heart,
  Users,
  Star,
  Trophy,
  Calendar,
  TrendingUp,
  Package,
  Layers,
} from 'lucide-react';
import { cn } from '@/config/utils';

interface UserStatsDisplayProps {
  userId: string;
  className?: string;
  variant?: 'full' | 'compact';
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, className }) => {
  return (
    <div className={cn('bg-muted/50 flex items-center gap-3 rounded-lg p-3', className)}>
      <div>{icon}</div>
      <div className='flex-1'>
        <p className='text-muted-foreground text-xs'>{label}</p>
        <div className='flex items-center gap-2'>
          <p className='text-lg font-semibold'>{value}</p>
          {trend !== undefined && trend > 0 && (
            <span className='flex items-center text-xs text-green-500'>
              <TrendingUp className='h-3 w-3' />+{trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const UserStatsDisplay: React.FC<UserStatsDisplayProps> = ({
  userId,
  className,
  variant = 'full',
}) => {
  const { data: stats, isLoading } = useUserStats(userId);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className='h-6 w-32' />
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className='h-20' />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (variant === 'compact') {
    return (
      <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-4', className)}>
        <StatCard
          icon={<Download className='h-4 w-4 text-green-500' />}
          label='Downloads'
          value={stats.totalDownloadsReceived}
        />
        <StatCard
          icon={<Heart className='h-4 w-4 text-red-500' />}
          label='Likes'
          value={stats.totalLikesReceived}
        />
        <StatCard
          icon={<Users className='h-4 w-4 text-blue-500' />}
          label='Followers'
          value={stats.totalFollowers}
        />
        <StatCard
          icon={<Star className='h-4 w-4 text-yellow-500' />}
          label='Rating'
          value={stats.averageRating.toFixed(1)}
        />
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Trophy className='h-5 w-5' />
          User Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Activity Stats */}
        <div>
          <h3 className='text-muted-foreground mb-3 text-sm font-medium'>Activity</h3>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
            <StatCard
              icon={<Calendar className='h-4 w-4 text-orange-500' />}
              label='Login Streak'
              value={`${stats.consecutiveLoginDays} days`}
            />
            <StatCard
              icon={<TrendingUp className='h-4 w-4 text-purple-500' />}
              label='Days Active'
              value={stats.totalDaysActive}
            />
            <StatCard
              icon={<Calendar className='h-4 w-4 text-indigo-500' />}
              label='Last Login'
              value={formatDate(stats.lastLoginAt)}
            />
          </div>
        </div>

        {/* Content Stats */}
        <div>
          <h3 className='text-muted-foreground mb-3 text-sm font-medium'>Content Created</h3>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
            <StatCard
              icon={<Layers className='h-4 w-4 text-blue-600' />}
              label='Schematics'
              value={stats.totalSchematics}
            />
            <StatCard
              icon={<Package className='h-4 w-4 text-emerald-600' />}
              label='Addons'
              value={stats.totalAddons}
            />
          </div>
        </div>

        {/* Engagement Stats */}
        <div>
          <h3 className='text-muted-foreground mb-3 text-sm font-medium'>Engagement</h3>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
            <StatCard
              icon={<Download className='h-4 w-4 text-green-500' />}
              label='Downloads Received'
              value={stats.totalDownloadsReceived}
            />
            <StatCard
              icon={<Upload className='h-4 w-4 text-teal-500' />}
              label='Downloads Made'
              value={stats.totalDownloadsMade}
            />
            <StatCard
              icon={<Heart className='h-4 w-4 text-red-500' />}
              label='Likes Received'
              value={stats.totalLikesReceived}
            />
            <StatCard
              icon={<Heart className='h-4 w-4 text-pink-500' />}
              label='Likes Given'
              value={stats.totalLikesGiven}
            />
            <StatCard
              icon={<Users className='h-4 w-4 text-blue-500' />}
              label='Followers'
              value={stats.totalFollowers}
            />
            <StatCard
              icon={<Users className='h-4 w-4 text-cyan-500' />}
              label='Following'
              value={stats.totalFollowing}
            />
          </div>
        </div>

        {/* Quality Metrics */}
        <div>
          <h3 className='text-muted-foreground mb-3 text-sm font-medium'>Quality Metrics</h3>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
            <StatCard
              icon={<Star className='h-4 w-4 text-yellow-500' />}
              label='Average Rating'
              value={`${stats.averageRating.toFixed(1)} / 5.0`}
            />
            <StatCard
              icon={<Star className='h-4 w-4 text-amber-500' />}
              label='Total Ratings'
              value={stats.totalRatingsReceived}
            />
            <StatCard
              icon={<Trophy className='h-4 w-4 text-yellow-600' />}
              label='Featured Content'
              value={stats.featuredContentCount}
            />
          </div>
        </div>

        {/* Milestones */}
        {(stats.reached100Downloads || stats.reached1000Downloads) && (
          <div>
            <h3 className='text-muted-foreground mb-3 text-sm font-medium'>Milestones Achieved</h3>
            <div className='space-y-2'>
              {stats.reached100Downloads && (
                <div className='bg-muted/30 flex items-center gap-2 rounded p-2'>
                  <Trophy className='h-4 w-4 text-yellow-500' />
                  <span className='text-sm'>
                    100 Downloads - {formatDate(stats.reached100Downloads)}
                  </span>
                </div>
              )}
              {stats.reached1000Downloads && (
                <div className='bg-muted/30 flex items-center gap-2 rounded p-2'>
                  <Trophy className='h-4 w-4 text-yellow-500' />
                  <span className='text-sm'>
                    1000 Downloads - {formatDate(stats.reached1000Downloads)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
