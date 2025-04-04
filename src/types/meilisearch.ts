// Note: If 'meilisearch' package doesn't directly export these types,
// you may need to use '@meilisearch/instant-meilisearch' or define your own
import type { Hit, SearchResponse } from 'meilisearch';

// Define Hits type if it's not directly available from the library
type Hits<T> = Array<Hit<T>>;
import type { Schematic } from '@/types/appwrite';

/**
 * Types for Meilisearch responses and hits
 *
 * These types provide proper typing for Meilisearch-specific structures
 * while leveraging our canonical Appwrite document types.
 */

// Type for a full Meilisearch search response with Schematic data
export type MeiliSchematicResponse = SearchResponse<Schematic>;

// Type for an array of Meilisearch hits with Schematic data
// This includes Meilisearch-specific properties like _matchesPosition
export type MeiliSchematicHits = Hits<Schematic>;

// Type for a single Meilisearch hit with Schematic data
export type MeiliSchematicHit = MeiliSchematicHits[number];
