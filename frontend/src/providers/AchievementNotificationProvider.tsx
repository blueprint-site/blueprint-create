import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useUserStore } from '@/api/stores/userStore';
import { useUserAchievements } from '@/api/appwrite/useUserAchievements';
import { useBadges } from '@/api/appwrite/useBadges';
import { AchievementNotification } from '@/components/features/achievements/AchievementNotification';
import { client, databases } from '@/config/appwrite';
import { Query } from 'appwrite';
import type { RealtimeResponseEvent } from 'appwrite';
import type { UserAchievement } from '@/schemas/userAchievement.schema';
import type { Badge } from '@/schemas/badge.schema';

interface NotificationData {
  achievement: UserAchievement;
  badge: Badge;
}

interface AchievementNotificationContextType {
  checkForNewAchievements: () => void;
}

const AchievementNotificationContext = createContext<AchievementNotificationContextType | null>(
  null
);

export const useAchievementNotifications = () => {
  const context = useContext(AchievementNotificationContext);
  if (!context) {
    throw new Error(
      'useAchievementNotifications must be used within AchievementNotificationProvider'
    );
  }
  return context;
};

interface AchievementNotificationProviderProps {
  children: React.ReactNode;
}

export const AchievementNotificationProvider: React.FC<AchievementNotificationProviderProps> = ({
  children,
}) => {
  const user = useUserStore((state) => state.user);
  const { refetch: refetchAchievements } = useUserAchievements();
  const { data: badges } = useBadges();
  const [notificationQueue, setNotificationQueue] = useState<NotificationData[]>([]);
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const lastCheckRef = useRef<string[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Subscribe to real-time updates for user achievements
  useEffect(() => {
    if (!user?.$id) return;

    // Subscribe to user_achievements collection for real-time updates
    const channel = `databases.main.collections.user_achievements.documents`;

    unsubscribeRef.current = client.subscribe(
      channel,
      async (response: RealtimeResponseEvent<UserAchievement>) => {
        // Check if this is a create event for the current user
        if (
          response.events.includes(
            'databases.main.collections.user_achievements.documents.*.create'
          ) &&
          response.payload.userId === user.$id
        ) {
          // New achievement earned!
          const achievement = response.payload;
          const badge = badges?.find((b) => b.$id === achievement.badgeId);

          if (badge) {
            // Add to notification queue
            setNotificationQueue((prev) => [...prev, { ...achievement, badge }]);

            // Mark as seen after showing
            setTimeout(async () => {
              try {
                await databases.updateDocument('main', 'user_achievements', achievement.$id, {
                  isNew: false,
                });
              } catch (error) {
                console.error('Error marking achievement as seen:', error);
              }
            }, 1000);
          }
        }
      }
    );

    // Also check for existing new achievements on mount
    const checkForNew = async () => {
      try {
        // Get achievements marked as new
        const response = await databases.listDocuments('main', 'user_achievements', [
          Query.equal('userId', user.$id),
          Query.equal('isNew', true),
          Query.limit(10),
        ]);

        if (response.documents.length > 0) {
          // Get badge details for new achievements
          const newAchievements = response.documents.filter(
            (doc) => !lastCheckRef.current.includes(doc.$id)
          );

          if (newAchievements.length > 0) {
            const achievementsWithBadges = newAchievements
              .map((achievement) => {
                const badge = badges?.find((b) => b.$id === achievement.badgeId);
                return {
                  ...achievement,
                  badge,
                };
              })
              .filter((a) => a.badge);

            // Add to notification queue
            setNotificationQueue((prev) => [...prev, ...achievementsWithBadges]);

            // Update last check
            lastCheckRef.current = response.documents.map((doc) => doc.$id);

            // Mark achievements as seen after a delay
            setTimeout(async () => {
              for (const achievement of newAchievements) {
                try {
                  await databases.updateDocument('main', 'user_achievements', achievement.$id, {
                    isNew: false,
                  });
                } catch (error) {
                  console.error('Error marking achievement as seen:', error);
                }
              }
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Error checking for new achievements:', error);
      }
    };

    // Initial check for any existing new achievements
    checkForNew();

    return () => {
      // Unsubscribe from real-time updates
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user?.$id, badges]);

  // Process notification queue
  useEffect(() => {
    if (notificationQueue.length > 0 && !currentNotification) {
      const [next, ...rest] = notificationQueue;
      setCurrentNotification(next);
      setNotificationQueue(rest);
    }
  }, [notificationQueue, currentNotification]);

  const handleNotificationClose = () => {
    setCurrentNotification(null);
  };

  const checkForNewAchievements = () => {
    if (user?.$id) {
      refetchAchievements();
    }
  };

  return (
    <AchievementNotificationContext.Provider value={{ checkForNewAchievements }}>
      {children}
      {currentNotification && currentNotification.badge && (
        <AchievementNotification
          badge={currentNotification.badge}
          onClose={handleNotificationClose}
        />
      )}
    </AchievementNotificationContext.Provider>
  );
};
