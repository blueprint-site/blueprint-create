import { useMemo } from 'react';
import type { Addon } from '@/types';
import { addonValidator } from '@/utils/validation/addonValidator';

interface ProcessedAddon extends Addon {
  validationScore: ReturnType<typeof addonValidator.validateAddon>;
  stage: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'archived';
  priority: 'high' | 'medium' | 'low';
}

// Global cache for validation scores to persist across renders
const validationCache = new Map<string, ReturnType<typeof addonValidator.validateAddon>>();

export function useProcessedAddons(addons: Addon[]): ProcessedAddon[] {
  return useMemo(() => {
    // Only calculate validation for new/changed addons
    return addons.map((addon) => {
      const cacheKey = `${addon.$id}_${addon.$updatedAt}`;

      // Check if we have a cached validation for this exact version
      let validationScore = validationCache.get(cacheKey);

      if (!validationScore) {
        // Calculate and cache the validation
        validationScore = addonValidator.validateAddon(addon as any);
        validationCache.set(cacheKey, validationScore);

        // Clean up old cache entries for this addon
        validationCache.forEach((_, key) => {
          if (key.startsWith(addon.$id + '_') && key !== cacheKey) {
            validationCache.delete(key);
          }
        });
      }

      // Determine stage from addon properties
      const stage: ProcessedAddon['stage'] =
        (addon.stage as ProcessedAddon['stage']) ||
        (addon.isValid ? 'approved' : addon.isChecked ? 'rejected' : 'pending');

      // Set priority based on validation confidence
      const priority: ProcessedAddon['priority'] =
        validationScore.confidence === 'high'
          ? 'low'
          : validationScore.confidence === 'low'
            ? 'high'
            : 'medium';

      return {
        ...addon,
        validationScore,
        stage,
        priority,
      } as ProcessedAddon;
    });
  }, [addons]);
}

// Clear cache function for memory management
export function clearValidationCache() {
  validationCache.clear();
}

// Get cache size for debugging
export function getValidationCacheSize() {
  return validationCache.size;
}
