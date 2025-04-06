// src/schemas/user.schema.tsx
import { z } from 'zod';
import type React from 'react';

/**
 * Schema for Easter Eggs configuration
 */
export const EasterEggsSchema = z.object({
  discovered: z.array(z.string()).default([]),
  enabled: z.record(z.string(), z.boolean()).default({}),
  lastDiscovery: z.number().optional(),
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
