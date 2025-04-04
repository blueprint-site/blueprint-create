import { create } from 'zustand';
import { useUserStore } from '@/api/stores/userStore';
import { fetchFeatureFlags } from '@/api/endpoints/useFeatureFlags';

/**
 * Feature flags store state interface
 */
interface FeatureFlagsState {
  /** Map of feature flag keys to their enabled status */
  flags: Record<string, boolean>;
  /** Loading state indicator */
  isLoading: boolean;
  /** Error state if flag fetching fails */
  error: Error | null;
  /** Check if a feature flag is enabled */
  isEnabled: (flag: string) => boolean;
  /** Fetch the latest feature flags from the server */
  refreshFlags: () => Promise<void>;
}

/**
 * Store for managing feature flags
 */
export const useFeatureFlagsStore = create<FeatureFlagsState>((set, get) => ({
  flags: {},
  isLoading: true,
  error: null,

  isEnabled: (flag: string): boolean => {
    return Boolean(get().flags[flag]);
  },

  refreshFlags: async (): Promise<void> => {
    const userStore = useUserStore.getState();
    const userId = userStore.user?.$id ?? 'anonymous';

    set({ isLoading: true });

    try {
      const featureFlags = await fetchFeatureFlags(userId);

      set({
        flags: featureFlags,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      console.error('Failed to fetch feature flags:', e);
      set({
        isLoading: false,
        error: e instanceof Error ? e : new Error(String(e)),
      });
    }
  },
}));

// Initialize flags when the store is imported
useFeatureFlagsStore.getState().refreshFlags();

// Subscribe to user changes to refresh flags automatically
const unsubscribeUserStore = useUserStore.subscribe((state, prevState) => {
  const userId = state.user?.$id;
  const prevUserId = prevState.user?.$id;

  // Only refresh flags when the user ID changes
  if (userId !== prevUserId) {
    useFeatureFlagsStore.getState().refreshFlags();
  }
});

// Set up periodic refresh only in browser environments
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

if (typeof window !== 'undefined') {
  const intervalId = window.setInterval(() => {
    useFeatureFlagsStore.getState().refreshFlags();
  }, REFRESH_INTERVAL);

  // Clean up interval and subscription on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
    unsubscribeUserStore();
  });
}

/**
 * Hook for checking if a feature flag is enabled
 *
 * @param flagKey - The feature flag key to check
 * @returns True if the feature flag is enabled, false otherwise
 */
export function useFeatureFlag(flagKey: string): boolean {
  const isEnabled = useFeatureFlagsStore((state) => state.isEnabled(flagKey));
  const isLoading = useFeatureFlagsStore((state) => state.isLoading);

  // Default to false when loading or if flag is not defined
  return !isLoading && isEnabled;
}
