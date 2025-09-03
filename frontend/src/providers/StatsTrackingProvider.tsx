import React, { createContext, useContext, useEffect } from 'react';
import { useUserStore } from '@/api/stores/userStore';
import {
  useTrackLogin,
  useTrackContentCreation,
  useIncrementUserStat,
} from '@/api/appwrite/useUserStats';
import { AchievementService } from '@/api/services/achievementService';

interface StatsTrackingContextType {
  trackLogin: () => void;
  trackContentCreation: (contentType: 'schematic' | 'addon') => void;
  trackDownload: (contentOwnerId: string, contentId?: string) => void;
  trackLike: (contentOwnerId: string, contentId?: string) => void;
  trackFollow: (targetUserId: string, isFollowing: boolean) => void;
  trackProfileCompletion: (profileData: Record<string, unknown>) => void;
  trackEmailVerification: () => void;
  runFullAchievementCheck: () => void;
}

const StatsTrackingContext = createContext<StatsTrackingContextType | null>(null);

export const useStatsTracking = () => {
  const context = useContext(StatsTrackingContext);
  if (!context) {
    throw new Error('useStatsTracking must be used within a StatsTrackingProvider');
  }
  return context;
};

interface StatsTrackingProviderProps {
  children: React.ReactNode;
}

export const StatsTrackingProvider: React.FC<StatsTrackingProviderProps> = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const { mutate: trackLoginMutation } = useTrackLogin();
  const { mutate: trackContentMutation } = useTrackContentCreation();
  const { mutate: incrementStatMutation } = useIncrementUserStat();

  // Track login automatically when user state changes
  useEffect(() => {
    if (user?.$id) {
      trackLoginMutation(user.$id);
      // Check login achievements
      AchievementService.trackUserLogin(user.$id);
    }
  }, [user?.$id, trackLoginMutation]);

  const trackLogin = () => {
    if (user?.$id) {
      trackLoginMutation(user.$id);
      // Check login achievements
      AchievementService.trackUserLogin(user.$id);
    }
  };

  const trackContentCreation = (contentType: 'schematic' | 'addon') => {
    if (!user?.$id) return;

    trackContentMutation({ userId: user.$id, contentType });
    // Check upload achievements
    AchievementService.trackContentUpload(user.$id, contentType);
  };

  const trackDownload = (contentOwnerId: string, contentId?: string) => {
    if (!user?.$id) return;

    // Track download for current user (downloader)
    incrementStatMutation({ userId: user.$id, field: 'totalDownloadsMade', value: 1 });

    // Track download received for content owner
    if (contentOwnerId !== user.$id) {
      incrementStatMutation({ userId: contentOwnerId, field: 'totalDownloadsReceived', value: 1 });
    }

    // Check download achievements
    AchievementService.trackContentDownload(user.$id, contentOwnerId, contentId || 'unknown');
  };

  const trackLike = (contentOwnerId: string, contentId?: string) => {
    if (!user?.$id) return;

    // Track like given by current user
    incrementStatMutation({ userId: user.$id, field: 'totalLikesGiven', value: 1 });

    // Track like received for content owner
    if (contentOwnerId !== user.$id) {
      incrementStatMutation({ userId: contentOwnerId, field: 'totalLikesReceived', value: 1 });
    }

    // Check like achievements
    AchievementService.trackLike(user.$id, contentOwnerId, contentId || 'unknown');
  };

  const trackFollow = (targetUserId: string, isFollowing: boolean) => {
    if (!user?.$id) return;

    // Update follower's following count
    incrementStatMutation({
      userId: user.$id,
      field: 'totalFollowing',
      value: isFollowing ? 1 : -1,
    });

    // Update target's follower count
    incrementStatMutation({
      userId: targetUserId,
      field: 'totalFollowers',
      value: isFollowing ? 1 : -1,
    });

    // Check follow achievements (only when following, not unfollowing)
    if (isFollowing) {
      AchievementService.trackFollow(user.$id, targetUserId);
    }
  };

  const trackProfileCompletion = (profileData: Record<string, unknown>) => {
    if (!user?.$id) return;

    // Check profile completion achievements
    AchievementService.trackProfileCompletion(user.$id, profileData);
  };

  const trackEmailVerification = () => {
    if (!user?.$id) return;

    // Check email verification achievements
    AchievementService.trackEmailVerification(user.$id);
  };

  const runFullAchievementCheck = () => {
    if (!user?.$id) return;

    // Run comprehensive achievement check
    AchievementService.runFullAchievementCheck(user.$id);
  };

  const value: StatsTrackingContextType = {
    trackLogin,
    trackContentCreation,
    trackDownload,
    trackLike,
    trackFollow,
    trackProfileCompletion,
    trackEmailVerification,
    runFullAchievementCheck,
  };

  return <StatsTrackingContext.Provider value={value}>{children}</StatsTrackingContext.Provider>;
};
