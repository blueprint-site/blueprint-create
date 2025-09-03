import type { AddonFilters, SortOption } from '@/types/filters';

/**
 * Build a Meilisearch filter string from AddonFilters
 */
export const buildFilterString = (filters: AddonFilters): string => {
  const parts: string[] = [];

  // Always include isValid filter
  parts.push('isValid = true');

  // Categories filter with OR logic
  if (filters.categories.length > 0) {
    const categoryFilter = filters.categories.map((cat) => `categories = "${cat}"`).join(' OR ');
    parts.push(`(${categoryFilter})`);
  }

  // Loaders filter with OR logic
  if (filters.loaders.length > 0) {
    const loaderFilter = filters.loaders.map((loader) => `loaders = "${loader}"`).join(' OR ');
    parts.push(`(${loaderFilter})`);
  }

  // Minecraft versions filter with OR logic
  if (filters.minecraft_versions.length > 0) {
    const versionFilter = filters.minecraft_versions
      .map((version) => `minecraft_versions = "${version}"`)
      .join(' OR ');
    parts.push(`(${versionFilter})`);
  }

  // Authors filter with OR logic
  if (filters.authors.length > 0) {
    const authorFilter = filters.authors.map((author) => `authors = "${author}"`).join(' OR ');
    parts.push(`(${authorFilter})`);
  }

  // Downloads range filter
  if (filters.downloads) {
    if (filters.downloads.min !== undefined) {
      parts.push(`downloads >= ${filters.downloads.min}`);
    }
    if (filters.downloads.max !== undefined) {
      parts.push(`downloads <= ${filters.downloads.max}`);
    }
  }

  // Last updated date filter
  if (filters.lastUpdated) {
    if (filters.lastUpdated.from) {
      const fromTimestamp = Math.floor(filters.lastUpdated.from.getTime() / 1000);
      parts.push(`updated_at >= ${fromTimestamp}`);
    }
    if (filters.lastUpdated.to) {
      const toTimestamp = Math.floor(filters.lastUpdated.to.getTime() / 1000);
      parts.push(`updated_at <= ${toTimestamp}`);
    }
  }

  return parts.join(' AND ');
};

/**
 * Parse filters from URL search params
 */
export const parseFiltersFromUrl = (params: URLSearchParams): AddonFilters => {
  const filters: AddonFilters = {
    categories: [],
    loaders: [],
    minecraft_versions: [],
    authors: [],
    sort: 'relevance',
  };

  // Parse categories
  const categories = params.get('cat');
  if (categories) {
    filters.categories = categories.split(',').filter(Boolean);
  }

  // Parse loaders
  const loaders = params.get('loader');
  if (loaders) {
    filters.loaders = loaders.split(',').filter(Boolean);
  }

  // Parse versions
  const versions = params.get('v');
  if (versions) {
    filters.minecraft_versions = versions.split(',').filter(Boolean);
  }

  // Parse authors
  const authors = params.get('author');
  if (authors) {
    filters.authors = authors.split(',').filter(Boolean);
  }

  // Parse sort
  const sort = params.get('sort') as SortOption;
  if (sort && isValidSortOption(sort)) {
    filters.sort = sort;
  }

  // Parse download range
  const minDownloads = params.get('min_dl');
  const maxDownloads = params.get('max_dl');
  if (minDownloads || maxDownloads) {
    filters.downloads = {
      min: minDownloads ? parseInt(minDownloads, 10) : undefined,
      max: maxDownloads ? parseInt(maxDownloads, 10) : undefined,
    };
  }

  // Parse date range
  const fromDate = params.get('from');
  const toDate = params.get('to');
  if (fromDate || toDate) {
    filters.lastUpdated = {
      from: fromDate ? new Date(fromDate) : undefined,
      to: toDate ? new Date(toDate) : undefined,
    };
  }

  return filters;
};

/**
 * Convert filters to URL search params
 */
export const filtersToUrlParams = (
  filters: AddonFilters,
  searchQuery?: string
): URLSearchParams => {
  const params = new URLSearchParams();

  if (searchQuery) {
    params.set('q', searchQuery);
  }

  if (filters.categories.length > 0) {
    params.set('cat', filters.categories.join(','));
  }

  if (filters.loaders.length > 0) {
    params.set('loader', filters.loaders.join(','));
  }

  if (filters.minecraft_versions.length > 0) {
    params.set('v', filters.minecraft_versions.join(','));
  }

  if (filters.authors.length > 0) {
    params.set('author', filters.authors.join(','));
  }

  if (filters.sort && filters.sort !== 'relevance') {
    params.set('sort', filters.sort);
  }

  if (filters.downloads?.min !== undefined) {
    params.set('min_dl', filters.downloads.min.toString());
  }

  if (filters.downloads?.max !== undefined) {
    params.set('max_dl', filters.downloads.max.toString());
  }

  if (filters.lastUpdated?.from) {
    params.set('from', filters.lastUpdated.from.toISOString());
  }

  if (filters.lastUpdated?.to) {
    params.set('to', filters.lastUpdated.to.toISOString());
  }

  return params;
};

/**
 * Check if a string is a valid sort option
 */
const isValidSortOption = (value: string): value is SortOption => {
  const validOptions: SortOption[] = [
    'relevance',
    'downloads:desc',
    'downloads:asc',
    'updated_at:desc',
    'created_at:desc',
    'name:asc',
    'name:desc',
  ];
  return validOptions.includes(value as SortOption);
};

/**
 * Get a human-readable label for a filter value
 */
export const getFilterLabel = (type: string, value: string): string => {
  // Capitalize first letter for categories
  if (type === 'category') {
    return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
  }

  // Return as-is for other types
  return value;
};

/**
 * Count active filters
 */
export const countActiveFilters = (filters: AddonFilters): number => {
  let count = 0;

  count += filters.categories.length;
  count += filters.loaders.length;
  count += filters.minecraft_versions.length;
  count += filters.authors.length;

  if (filters.downloads) count++;
  if (filters.lastUpdated) count++;
  if (filters.sort && filters.sort !== 'relevance') count++;

  return count;
};

/**
 * Check if any filters are active
 */
export const hasActiveFilters = (filters: AddonFilters): boolean => {
  return countActiveFilters(filters) > 0;
};
