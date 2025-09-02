import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { useIsFollowing, useToggleFollow } from '@/api/appwrite/useUserFollow';
import { useUserStore } from '@/api/stores/userStore';
import { useStatsTracking } from '@/providers/StatsTrackingProvider';
import { cn } from '@/config/utils';

interface FollowButtonProps {
  targetUserId: string;
  targetUserName?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showText?: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  targetUserName: _,
  variant = 'default',
  size = 'default',
  className,
  showText = true,
}) => {
  const user = useUserStore((state) => state.user);
  const { data: isFollowing, isLoading: isCheckingFollow } = useIsFollowing(targetUserId);
  const { mutate: toggleFollow, isPending: isToggling } = useToggleFollow();
  const { trackFollow } = useStatsTracking();

  // Don't show follow button for own profile or when not logged in
  if (!user || user.$id === targetUserId) {
    return null;
  }

  const handleToggleFollow = () => {
    const willBeFollowing = !isFollowing;
    
    toggleFollow(
      { targetUserId, isCurrentlyFollowing: isFollowing || false },
      {
        onSuccess: () => {
          // Track the follow/unfollow action
          trackFollow(targetUserId, willBeFollowing);
        },
      }
    );
  };

  const isLoading = isCheckingFollow || isToggling;

  return (
    <Button
      variant={isFollowing ? 'outline' : variant}
      size={size}
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200',
        isFollowing && 'hover:bg-destructive hover:text-destructive-foreground hover:border-destructive',
        className
      )}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : isFollowing ? (
        <>
          <UserMinus className="h-4 w-4" />
          {showText && <span className="ml-2 hidden group-hover:inline sm:inline">Unfollow</span>}
          {showText && <span className="ml-2 group-hover:hidden sm:hidden">Following</span>}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          {showText && <span className="ml-2">Follow</span>}
        </>
      )}
    </Button>
  );
};