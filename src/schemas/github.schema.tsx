// src/schemas/github.schema.tsx
import { z } from 'zod';

/**
 * Schema for GitHub user data
 */
export const GitHubUserSchema = z.object({
  login: z.string(),
  id: z.number().int().positive(),
  avatar_url: z.string().url('Must be a valid URL'),
  contributions: z.number().int().nonnegative(),
});

/**
 * Schema for contributor statistics
 */
export const ContributorStatsSchema = z.object({
  login: z.string(),
  id: z.number().int().positive(),
  avatar_url: z.string().url('Must be a valid URL'),
  frontendContributions: z.number().int().nonnegative(),
  apiContributions: z.number().int().nonnegative(),
});

/**
 * Schema for GitHub repository data
 */
export const GitHubRepoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url('Must be a valid URL'),
  description: z.string().nullable(),
  fork: z.boolean(),
  language: z.string().nullable(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  open_issues_count: z.number().int().nonnegative(),
  default_branch: z.string(),
  topics: z.array(z.string()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  pushed_at: z.string().datetime().optional(),
});

/**
 * Schema for GitHub API response when fetching contributors
 */

export const GitHubContributorsResponseSchema = z.array(GitHubUserSchema);
