import { useQuery } from '@tanstack/react-query';
import { databases } from '@/config/appwrite';
import { Query } from 'appwrite';
import type { FeatureFlag } from '@/types';

/**
 * Constants for database and collection IDs
 */
const DATABASE_ID = '67b1dc430020b4fb23e3';
const COLLECTION_ID = '67b232540003ed4d8e4f';
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Evaluates if a feature flag is enabled for a specific user
 *
 * @param flag - The feature flag object
 * @param userId - The user ID to check against
 * @returns Whether the flag is enabled for this user
 */
function evaluateFlag(flag: FeatureFlag | null, userId: string): boolean {
  if (!flag) return false;

  return (
    flag.enabled === true ||
    flag.users?.includes(userId) ||
    flag.groups?.some((group: string) => group === 'default') ||
    false
  );
}

/**
 * Fetch a single feature flag's status for a user
 *
 * @param userId - The user ID to check against
 * @param flagKey - The feature flag key to look up
 * @returns Boolean indicating if the feature is enabled
 */
export async function fetchFeatureFlag(userId: string, flagKey: string): Promise<boolean> {
  try {
    const response = await databases.listDocuments<FeatureFlag>(DATABASE_ID, COLLECTION_ID, [
      Query.equal('key', flagKey),
    ]);

    if (response.total === 0) return false;

    // Now TypeScript knows all the properties in our FeatureFlag
    const feature: FeatureFlag = response.documents[0];

    return evaluateFlag(feature, userId);
  } catch (error) {
    console.error(`Error checking feature flag ${flagKey}:`, error);
    return false; // Default to disabled on error
  }
}

/**
 * Fetch all feature flags for a user
 *
 * @param userId - The user ID to check against
 * @returns Record of flag keys to their enabled status
 */
export async function fetchFeatureFlags(userId: string): Promise<Record<string, boolean>> {
  const featureFlags: Record<string, boolean> = {};

  try {
    const response = await databases.listDocuments<FeatureFlag>(DATABASE_ID, COLLECTION_ID);

    for (const doc of response.documents) {
      const flag: FeatureFlag = doc;
      featureFlags[doc.key] = evaluateFlag(flag, userId);
    }

    return featureFlags;
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return {};
  }
}

/**
 * React Query hook for checking a single feature flag
 *
 * @param userId - The user ID to check against
 * @param flagKey - The feature flag key to look up
 * @returns React Query result with flag status
 */
export function useFeatureFlag(userId: string, flagKey: string) {
  return useQuery({
    queryKey: ['featureFlag', userId, flagKey],
    queryFn: () => fetchFeatureFlag(userId, flagKey),
    staleTime: STALE_TIME,
  });
}

/**
 * React Query hook for fetching all feature flags
 *
 * @param userId - The user ID to check against
 * @returns React Query result with all feature flags
 */
export function useAllFeatureFlags(userId: string) {
  return useQuery({
    queryKey: ['featureFlags', userId],
    queryFn: () => fetchFeatureFlags(userId),
    staleTime: STALE_TIME,
  });
}
