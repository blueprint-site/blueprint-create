class StatsTracker {
  private static instance: StatsTracker;
  private loginTracked = false;

  private constructor() {}

  public static getInstance(): StatsTracker {
    if (!StatsTracker.instance) {
      StatsTracker.instance = new StatsTracker();
    }
    return StatsTracker.instance;
  }

  // Track user login (call once per session)
  async trackLogin(
    userId: string,
    trackLoginMutation: { mutateAsync: (userId: string) => Promise<unknown> }
  ) {
    if (this.loginTracked) return;

    try {
      await trackLoginMutation.mutateAsync(userId);
      this.loginTracked = true;
    } catch (error) {
      console.error('Failed to track login:', error);
    }
  }

  // Track content creation
  async trackContentCreation(
    userId: string,
    contentType: 'schematic' | 'addon' | 'blog',
    trackContentMutation: {
      mutateAsync: (data: { userId: string; contentType: string }) => Promise<unknown>;
    }
  ) {
    try {
      await trackContentMutation.mutateAsync({ userId, contentType });
    } catch (error) {
      console.error('Failed to track content creation:', error);
    }
  }

  // Track downloads
  async trackDownload(
    userId: string,
    incrementStatMutation: {
      mutateAsync: (data: { userId: string; field: string; value: number }) => Promise<unknown>;
    },
    isReceiver: boolean = false
  ) {
    try {
      const field = isReceiver ? 'totalDownloadsReceived' : 'totalDownloadsMade';
      await incrementStatMutation.mutateAsync({ userId, field, value: 1 });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  }

  // Track likes
  async trackLike(
    userId: string,
    incrementStatMutation: {
      mutateAsync: (data: { userId: string; field: string; value: number }) => Promise<unknown>;
    },
    isReceiver: boolean = false
  ) {
    try {
      const field = isReceiver ? 'totalLikesReceived' : 'totalLikesGiven';
      await incrementStatMutation.mutateAsync({ userId, field, value: 1 });
    } catch (error) {
      console.error('Failed to track like:', error);
    }
  }

  // Track comments
  async trackComment(
    userId: string,
    incrementStatMutation: {
      mutateAsync: (data: { userId: string; field: string; value: number }) => Promise<unknown>;
    }
  ) {
    try {
      await incrementStatMutation.mutateAsync({ userId, field: 'totalComments', value: 1 });
    } catch (error) {
      console.error('Failed to track comment:', error);
    }
  }

  // Track follows
  async trackFollow(
    userId: string,
    targetUserId: string,
    incrementStatMutation: {
      mutateAsync: (data: { userId: string; field: string; value: number }) => Promise<unknown>;
    },
    isFollowing: boolean = true
  ) {
    try {
      // Update follower's following count
      await incrementStatMutation.mutateAsync({
        userId,
        field: 'totalFollowing',
        value: isFollowing ? 1 : -1,
      });

      // Update target's follower count
      await incrementStatMutation.mutateAsync({
        userId: targetUserId,
        field: 'totalFollowers',
        value: isFollowing ? 1 : -1,
      });
    } catch (error) {
      console.error('Failed to track follow:', error);
    }
  }

  // Track ratings
  async trackRating(userId: string, rating: number) {
    try {
      // This would need to fetch current stats and recalculate average
      // Implementation depends on your specific requirements
      console.log('Rating tracked:', { userId, rating });
    } catch (error) {
      console.error('Failed to track rating:', error);
    }
  }

  // Track featured content
  async trackFeaturedContent(
    userId: string,
    incrementStatMutation: {
      mutateAsync: (data: { userId: string; field: string; value: number }) => Promise<unknown>;
    }
  ) {
    try {
      await incrementStatMutation.mutateAsync({
        userId,
        field: 'featuredContentCount',
        value: 1,
      });
    } catch (error) {
      console.error('Failed to track featured content:', error);
    }
  }

  // Reset login tracking for new sessions
  resetSession() {
    this.loginTracked = false;
  }
}

export const statsTracker = StatsTracker.getInstance();
