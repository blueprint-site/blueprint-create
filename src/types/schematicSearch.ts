/**
 * Unified SchematicSearchResult interface for Meilisearch responses
 * This interface bridges the gap between Meilisearch documents and our Schematic type
 */

export interface SchematicSearchResult {
  // Core identifier fields
  id: string;
  $id?: string; // Appwrite document ID when available

  // Basic information
  title: string;
  description: string;
  slug: string;

  // Author information
  authors?: string[]; // Array from database
  author?: string; // Single display name
  author_display_name?: string; // Alternative field name

  // Visual content
  thumbnail?: string;
  image_urls?: string[]; // Array of images

  // Dimensions (flattened for Meilisearch)
  dimensions_width?: number;
  dimensions_height?: number;
  dimensions_depth?: number;
  dimensions_blockCount?: number;
  // Nested structure for compatibility
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    blockCount: number;
  };

  // Categories and classification
  categories: string[];
  subcategories?: string[];
  sub_categories?: string[]; // Alternative field name

  // Materials (flattened for Meilisearch)
  materials_primary?: string[];
  materials_hasModded?: boolean;
  // Nested structure for compatibility
  materials?: {
    primary: string[];
    hasModded: boolean;
  };

  // Complexity (flattened for Meilisearch)
  complexity_level?: 'simple' | 'moderate' | 'complex' | 'extreme';
  complexity_buildTime?: number;
  // Nested structure for compatibility
  complexity?: {
    level: 'simple' | 'moderate' | 'complex' | 'extreme';
    buildTime: number;
  };

  // Requirements (flattened for Meilisearch)
  requirements_mods?: string[];
  requirements_minecraftVersion?: string;
  requirements_hasRedstone?: boolean;
  requirements_hasCommandBlocks?: boolean;
  // Nested structure for compatibility
  requirements?: {
    mods: string[];
    minecraftVersion: string;
    hasRedstone: boolean;
    hasCommandBlocks: boolean;
  };

  // Statistics
  downloads: number;
  rating?: number;
  totalRatings?: number;
  likes?: number;

  // Metadata
  uploadDate?: string;
  featured?: boolean;
  isValid?: boolean;
  status?: 'draft' | 'published' | 'archived';
  user_id?: string;

  // Meilisearch-specific fields
  _formatted?: {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };

  // Allow additional properties for flexibility
  [key: string]: unknown;
}

/**
 * Helper function to normalize SchematicSearchResult to have consistent nested structures
 */
export const normalizeSchematicSearchResult = (
  result: SchematicSearchResult
): SchematicSearchResult => {
  return {
    ...result,
    // Ensure nested dimensions structure
    dimensions: result.dimensions || {
      width: result.dimensions_width || 0,
      height: result.dimensions_height || 0,
      depth: result.dimensions_depth || 0,
      blockCount: result.dimensions_blockCount || 0,
    },
    // Ensure nested materials structure
    materials: result.materials || {
      primary: result.materials_primary || [],
      hasModded: result.materials_hasModded || false,
    },
    // Ensure nested complexity structure
    complexity: result.complexity || {
      level: result.complexity_level || 'simple',
      buildTime: result.complexity_buildTime || 0,
    },
    // Ensure nested requirements structure
    requirements: result.requirements || {
      mods: result.requirements_mods || [],
      minecraftVersion: result.requirements_minecraftVersion || '',
      hasRedstone: result.requirements_hasRedstone || false,
      hasCommandBlocks: result.requirements_hasCommandBlocks || false,
    },
    // Normalize author field
    author:
      result.author ||
      result.author_display_name ||
      (result.authors && result.authors.length > 0 ? result.authors[0] : 'Unknown'),
    // Normalize subcategories
    subcategories: result.subcategories || result.sub_categories || [],
  };
};
