// src/schemas/user.schema.tsx
import { z } from 'zod';

/**
 * Schema for Target object in User
 */
export const TargetSchema = z.object({
  $id: z.string(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  name: z.string(),
  userId: z.string(),
  providerId: z.string(),
  providerType: z.string(),
  identifier: z.string(),
});

/**
 * Schema for Easter Eggs configuration
 */
const EasterEggsSchema = z.object({
  // Eggs that the user has discovered
  discovered: z.array(z.string()).default([]),
  // Eggs that the user has enabled (after discovering)
  enabled: z.record(z.string(), z.boolean()).default({}),
  // Last discovery timestamp
  lastDiscovery: z.number().optional(),
});

/**
 * Schema for Easter Eggs configuration
 */
const EasterEggsSchema = z.object({
  // Eggs that the user has discovered
  discovered: z.array(z.string()).default([]),
  // Eggs that the user has enabled (after discovering)
  enabled: z.record(z.string(), z.boolean()).default({}),
  // Last discovery timestamp
  lastDiscovery: z.number().optional()
});

/**
 * Schema for UserPreferences object
 */
export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark']),
  language: z.string(),
  notificationsEnabled: z.boolean(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  roles: z.array(z.string()),
  easterEggs: EasterEggsSchema.optional(),
});

/**
 * Main User schema with all properties
 */
export const UserSchema = z.object({
  $id: z.string(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  name: z.string(),
  registration: z.string(),
  status: z.boolean(),
  labels: z.array(z.string()),
  passwordUpdate: z.string(),
  email: z.string().email(),
  phone: z.string(),
  emailVerification: z.boolean(),
  phoneVerification: z.boolean(),
  mfa: z.boolean(),
  prefs: UserPreferencesSchema,
  targets: z.array(TargetSchema),
  accessedAt: z.string(),
});

/**
 * Lightweight User schema for creating new users
 */
export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

/**
 * Schema for user profile updates
 */
export const UpdateUserProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
});

/**
 * Schema for user preferences updates
 */
export const UpdateUserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  language: z.string().optional(),
  notificationsEnabled: z.boolean().optional(),
  easterEggs: EasterEggsSchema.optional(),
});

// Easter Egg types
export interface EasterEggDefinition {
  id: string;
  name: string;
  description: string;
  discoveryHint: string;
  component?: React.ComponentType<{ enabled: boolean }>;
}

// Export types based on the schemas
export type User = z.infer<typeof UserSchema>;
export type Target = z.infer<typeof TargetSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type EasterEggs = z.infer<typeof EasterEggsSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
export type UpdateUserPreferencesInput = z.infer<typeof UpdateUserPreferencesSchema>;
