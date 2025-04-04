import type { Hits, SearchResponse } from 'meilisearch';
import type { Addon, Schematic, Blog } from '@/types/appwrite';
import type { AddonWithParsedFields } from '@/types/addons/addon-details';

/**
 * Type definitions for Meilisearch responses
 *
 * These types build on our canonical Appwrite document types
 * to provide proper typing for search results.
 */

// Addon search types
export type MeiliAddonResponse = SearchResponse<Addon>;
export type MeiliAddonHits = Hits<Addon>;
export type MeiliAddonHit = MeiliAddonHits[number];

// Schematic search types
export type MeiliSchematicResponse = SearchResponse<Schematic>;
export type MeiliSchematicHits = Hits<Schematic>;
export type MeiliSchematicHit = MeiliSchematicHits[number];

// Blog search types
export type MeiliBlogResponse = SearchResponse<Blog>;
export type MeiliBlogHits = Hits<Blog>;
export type MeiliBlogHit = MeiliBlogHits[number];

/**
 * Utility type for search results that combines React Query's result
 * with document-specific data
 */
export interface SearchResult<T> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  totalHits: number;
  page: number;
  limit?: number;
}

// Use the extended addon type for search results
export type SearchAddonResult = SearchResult<AddonWithParsedFields>;
export type SearchSchematicResult = SearchResult<Schematic>;
export type SearchBlogResult = SearchResult<Blog>;
