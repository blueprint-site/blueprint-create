import { z } from 'zod';

/**
 * Schema for creating new feature flags
 */
export const CreateFeatureFlagSchema = z.object({
  key: z.string().min(1, 'Key must not be empty'),
  enabled: z.boolean().default(false),
  users: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  description: z.string().optional(),
});

/**
 * Schema for updating feature flags
 */
export const UpdateFeatureFlagSchema = z.object({
  key: z.string().min(1, 'Key must not be empty').optional(),
  enabled: z.boolean().optional(),
  users: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  description: z.string().optional(),
});

/**
 * Define the known feature flag keys (for TypeScript autocomplete)
 * This is for development convenience, not runtime behavior
 */
export const FeatureFlagKeySchema = z.enum([
  'new_dashboard',
  'advanced_search',
  'experimental_ui',
  // Add more feature flags here as needed
]);
