import type {
  SchematicFilters,
  SchematicFacetDistribution,
  ComplexityLevel,
  SchematicSortField,
} from '@/types/schematicFilters';
import type { FacetDistribution } from 'meilisearch';

/**
 * Build Meilisearch filter string from SchematicFilters
 */
export const buildSchematicFilterString = (
  filters: SchematicFilters & { user_id?: string }
): string => {
  const filterParts: string[] = [];

  // User filter (if provided)
  if (filters.user_id) {
    filterParts.push(`user_id = "${filters.user_id}"`);
  }

  // Category filters
  if (filters.categories.length > 0) {
    const categoryFilter = filters.categories.map((cat) => `categories = "${cat}"`).join(' OR ');
    filterParts.push(`(${categoryFilter})`);
  }

  // Subcategory filters
  if (filters.subcategories.length > 0) {
    const subcategoryFilter = filters.subcategories
      .map((sub) => `subcategories = "${sub}"`)
      .join(' OR ');
    filterParts.push(`(${subcategoryFilter})`);
  }

  // Dimension filters
  const dimensionFilters: string[] = [];

  if (filters.dimensions.width.min !== undefined) {
    dimensionFilters.push(`dimensions_width >= ${filters.dimensions.width.min}`);
  }
  if (filters.dimensions.width.max !== undefined) {
    dimensionFilters.push(`dimensions_width <= ${filters.dimensions.width.max}`);
  }

  if (filters.dimensions.height.min !== undefined) {
    dimensionFilters.push(`dimensions_height >= ${filters.dimensions.height.min}`);
  }
  if (filters.dimensions.height.max !== undefined) {
    dimensionFilters.push(`dimensions_height <= ${filters.dimensions.height.max}`);
  }

  if (filters.dimensions.depth.min !== undefined) {
    dimensionFilters.push(`dimensions_depth >= ${filters.dimensions.depth.min}`);
  }
  if (filters.dimensions.depth.max !== undefined) {
    dimensionFilters.push(`dimensions_depth <= ${filters.dimensions.depth.max}`);
  }

  if (filters.dimensions.blockCount.min !== undefined) {
    dimensionFilters.push(`dimensions_blockCount >= ${filters.dimensions.blockCount.min}`);
  }
  if (filters.dimensions.blockCount.max !== undefined) {
    dimensionFilters.push(`dimensions_blockCount <= ${filters.dimensions.blockCount.max}`);
  }

  if (dimensionFilters.length > 0) {
    filterParts.push(...dimensionFilters);
  }

  // Material filters
  if (filters.materials.primary.length > 0) {
    const materialFilter = filters.materials.primary
      .map((mat) => `materials_primary = "${mat}"`)
      .join(' OR ');
    filterParts.push(`(${materialFilter})`);
  }

  if (filters.materials.exclude.length > 0) {
    filters.materials.exclude.forEach((mat) => {
      filterParts.push(`materials_primary != "${mat}"`);
    });
  }

  if (!filters.materials.includeModded) {
    filterParts.push('materials_hasModded = false');
  }

  // Complexity filters
  if (filters.complexity.levels.length > 0) {
    const complexityFilter = filters.complexity.levels
      .map((level) => `complexity_level = "${level}"`)
      .join(' OR ');
    filterParts.push(`(${complexityFilter})`);
  }

  if (filters.complexity.buildTime.min !== undefined) {
    filterParts.push(`complexity_buildTime >= ${filters.complexity.buildTime.min}`);
  }
  if (filters.complexity.buildTime.max !== undefined) {
    filterParts.push(`complexity_buildTime <= ${filters.complexity.buildTime.max}`);
  }

  // Compatibility filters
  if (filters.compatibility.minecraftVersions.length > 0) {
    const versionFilter = filters.compatibility.minecraftVersions
      .map((ver) => `requirements_minecraftVersion = "${ver}"`)
      .join(' OR ');
    filterParts.push(`(${versionFilter})`);
  }

  if (filters.compatibility.createVersions.length > 0) {
    const createFilter = filters.compatibility.createVersions
      .map((ver) => `create_versions = "${ver}"`)
      .join(' OR ');
    filterParts.push(`(${createFilter})`);
  }

  if (filters.compatibility.requiredMods.length > 0) {
    filters.compatibility.requiredMods.forEach((mod) => {
      filterParts.push(`requirements_mods = "${mod}"`); // Fixed to match Appwrite field name
    });
  }

  if (!filters.compatibility.allowRedstone) {
    filterParts.push('requirements_hasRedstone = false');
  }

  if (!filters.compatibility.allowCommandBlocks) {
    filterParts.push('requirements_hasCommandBlocks = false');
  }

  // Meta filters
  if (filters.meta.authors.length > 0) {
    const authorFilter = filters.meta.authors.map((author) => `author = "${author}"`).join(' OR ');
    filterParts.push(`(${authorFilter})`);
  }

  if (filters.meta.minRating > 0) {
    filterParts.push(`rating >= ${filters.meta.minRating}`);
  }

  if (filters.meta.minDownloads > 0) {
    filterParts.push(`downloads >= ${filters.meta.minDownloads}`);
  }

  if (filters.meta.uploadedAfter) {
    const timestamp = Math.floor(filters.meta.uploadedAfter.getTime() / 1000);
    filterParts.push(`uploadDate >= ${timestamp}`);
  }

  if (filters.meta.uploadedBefore) {
    const timestamp = Math.floor(filters.meta.uploadedBefore.getTime() / 1000);
    filterParts.push(`uploadDate <= ${timestamp}`);
  }

  if (filters.meta.featured) {
    filterParts.push('featured = true');
  }

  // Always show valid schematics (if the field exists in documents)
  // Comment this out if isValid field is not present in Meilisearch documents
  // filterParts.push('isValid = true');

  return filterParts.length > 0 ? filterParts.join(' AND ') : '';
};

/**
 * Build sort array for Meilisearch
 */
export const buildSchematicSortArray = (sort: SchematicFilters['sort']): string[] => {
  if (sort.field === 'relevance') {
    return []; // Use default Meilisearch relevance
  }

  const fieldMap: Record<string, string> = {
    downloads: 'downloads',
    rating: 'rating',
    date: 'uploadDate',
    size: 'dimensions_blockCount',
    complexity: 'complexity_buildTime',
    name: 'title',
  };

  const sortField = fieldMap[sort.field] || sort.field;
  return [`${sortField}:${sort.order}`];
};

/**
 * Parse filters from URL search params
 */
export const parseSchematicFiltersFromUrl = (
  params: URLSearchParams
): Partial<SchematicFilters> => {
  const filters: Partial<SchematicFilters> = {};

  // Query
  const query = params.get('q');
  if (query) filters.query = query;

  // Categories
  const categories = params.get('cat');
  if (categories) filters.categories = categories.split(',');

  // Subcategories
  const subcategories = params.get('subcat');
  if (subcategories) filters.subcategories = subcategories.split(',');

  // Dimensions
  const widthMin = params.get('w_min');
  const widthMax = params.get('w_max');
  const heightMin = params.get('h_min');
  const heightMax = params.get('h_max');
  const blocksMin = params.get('b_min');
  const blocksMax = params.get('b_max');

  if (widthMin || widthMax || heightMin || heightMax || blocksMin || blocksMax) {
    filters.dimensions = {
      width: {
        ...(widthMin && { min: parseInt(widthMin) }),
        ...(widthMax && { max: parseInt(widthMax) }),
      },
      height: {
        ...(heightMin && { min: parseInt(heightMin) }),
        ...(heightMax && { max: parseInt(heightMax) }),
      },
      depth: {},
      blockCount: {
        ...(blocksMin && { min: parseInt(blocksMin) }),
        ...(blocksMax && { max: parseInt(blocksMax) }),
      },
    };
  }

  // Complexity
  const complexity = params.get('complexity');
  if (complexity) {
    filters.complexity = {
      levels: complexity.split(',') as ComplexityLevel[],
      buildTime: {},
    };
  }

  // Mods
  const mods = params.get('mods');
  if (mods) {
    filters.compatibility = {
      requiredMods: mods.split(','),
      minecraftVersions: [],
      createVersions: [],
      allowRedstone: true,
      allowCommandBlocks: true,
    };
  }

  // Sort
  const sort = params.get('sort');
  const order = params.get('order');
  if (sort) {
    filters.sort = {
      field: sort as SchematicSortField,
      order: (order as 'asc' | 'desc') || 'desc',
    };
  }

  return filters;
};

/**
 * Convert filters to URL search params
 */
export const schematicFiltersToUrlParams = (filters: SchematicFilters): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.query) params.set('q', filters.query);
  if (filters.categories.length > 0) params.set('cat', filters.categories.join(','));
  if (filters.subcategories.length > 0) params.set('subcat', filters.subcategories.join(','));

  // Dimensions
  if (filters.dimensions.width.min) params.set('w_min', filters.dimensions.width.min.toString());
  if (filters.dimensions.width.max) params.set('w_max', filters.dimensions.width.max.toString());
  if (filters.dimensions.height.min) params.set('h_min', filters.dimensions.height.min.toString());
  if (filters.dimensions.height.max) params.set('h_max', filters.dimensions.height.max.toString());
  if (filters.dimensions.blockCount.min)
    params.set('b_min', filters.dimensions.blockCount.min.toString());
  if (filters.dimensions.blockCount.max)
    params.set('b_max', filters.dimensions.blockCount.max.toString());

  // Complexity
  if (filters.complexity.levels.length > 0) {
    params.set('complexity', filters.complexity.levels.join(','));
  }

  // Mods
  if (filters.compatibility.requiredMods.length > 0) {
    params.set('mods', filters.compatibility.requiredMods.join(','));
  }

  // Sort
  if (filters.sort.field !== 'relevance') {
    params.set('sort', filters.sort.field);
    params.set('order', filters.sort.order);
  }

  return params;
};

/**
 * Process facet distribution from Meilisearch
 */
export const processSchematicFacetDistribution = (
  facets: FacetDistribution | undefined
): SchematicFacetDistribution => {
  return {
    categories: facets?.categories || {},
    subcategories: facets?.subcategories || {},
    materials_primary: facets?.['materials_primary'] || {},
    complexity_level: facets?.['complexity_level'] || {},
    requirement_mods: facets?.['requirements_mods'] || {}, // Fixed to use correct field name
    requirements_minecraftVersion: facets?.['requirements_minecraftVersion'] || {},
    authors: facets?.authors || {},
  };
};

/**
 * Check if filters are at default values
 */
export const hasActiveSchematicFilters = (filters: SchematicFilters): boolean => {
  return !!(
    filters.query ||
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.dimensions.width.min !== undefined ||
    filters.dimensions.width.max !== undefined ||
    filters.dimensions.height.min !== undefined ||
    filters.dimensions.height.max !== undefined ||
    filters.dimensions.blockCount.min !== undefined ||
    filters.dimensions.blockCount.max !== undefined ||
    filters.materials.primary.length > 0 ||
    filters.materials.exclude.length > 0 ||
    !filters.materials.includeModded ||
    filters.complexity.levels.length > 0 ||
    filters.complexity.buildTime.min !== undefined ||
    filters.complexity.buildTime.max !== undefined ||
    filters.compatibility.minecraftVersions.length > 0 ||
    filters.compatibility.createVersions.length > 0 ||
    filters.compatibility.requiredMods.length > 0 ||
    !filters.compatibility.allowRedstone ||
    !filters.compatibility.allowCommandBlocks ||
    filters.meta.authors.length > 0 ||
    filters.meta.minRating > 0 ||
    filters.meta.minDownloads > 0 ||
    filters.meta.uploadedAfter !== undefined ||
    filters.meta.uploadedBefore !== undefined ||
    filters.meta.featured ||
    filters.sort.field !== 'relevance'
  );
};

/**
 * Merge filter updates
 */
export const mergeSchematicFilters = (
  current: SchematicFilters,
  updates: Partial<SchematicFilters>
): SchematicFilters => {
  return {
    ...current,
    ...updates,
    dimensions: {
      ...current.dimensions,
      ...(updates.dimensions || {}),
    },
    materials: {
      ...current.materials,
      ...(updates.materials || {}),
    },
    complexity: {
      ...current.complexity,
      ...(updates.complexity || {}),
    },
    compatibility: {
      ...current.compatibility,
      ...(updates.compatibility || {}),
    },
    meta: {
      ...current.meta,
      ...(updates.meta || {}),
    },
    sort: {
      ...current.sort,
      ...(updates.sort || {}),
    },
  };
};
