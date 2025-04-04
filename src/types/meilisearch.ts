import type { Hits, SearchResponse } from 'meilisearch';
import type { Schematic } from '@/types/appwrite';

/**
 * Types for Meilisearch responses and hits
 *
 * These types provide proper typing for Meilisearch-specific structures
 * while leveraging our canonical Appwrite document types.
 */

// Type for a full Meilisearch search response with Schematic data
export type MeiliSchematicResponse = SearchResponse<Schematic>;
export type MeiliSchematicHits = Hits<Schematic>;
export type MeiliSchematicHit = MeiliSchematicHits[number];
