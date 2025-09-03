import type { Blog, RawBlog, Addon, Schematic } from './appwrite';
import type { SearchResponse, Hits, FacetDistribution } from 'meilisearch';

/**
 * Type definitions for Meilisearch responses
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

// Raw blog search types (before parsing JSON fields)
export type MeiliRawBlogResponse = SearchResponse<RawBlog>;
export type MeiliRawBlogHits = Hits<RawBlog>;
export type MeiliRawBlogHit = MeiliRawBlogHits[number];

// Simple Meilisearch result type for direct API responses
export interface MeiliSearchResult<T> {
  hits: T[];
  query: string;
  processingTimeMs: number;
  estimatedTotalHits: number;
}
/**
 * Utility type for search results with React Query metadata
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
  facetDistribution?: FacetDistribution;
}

// Define search result types using the generic SearchResult
export type SearchAddonResult = SearchResult<Addon>;
export type SearchSchematicResult = SearchResult<Schematic>;
export type SearchBlogResult = SearchResult<Blog>;
