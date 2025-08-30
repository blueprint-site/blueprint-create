/**
 * Utility functions for safe array operations
 */

/**
 * Ensures a value is always an array, converting null/undefined to empty array
 */
export function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Safely map over a potentially null/undefined array
 */
export function safeMap<T, R>(
  array: T[] | null | undefined,
  mapFn: (item: T, index: number, array: T[]) => R
): R[] {
  return ensureArray(array).map(mapFn);
}

/**
 * Safely filter a potentially null/undefined array
 */
export function safeFilter<T>(
  array: T[] | null | undefined,
  filterFn: (item: T, index: number, array: T[]) => boolean
): T[] {
  return ensureArray(array).filter(filterFn);
}

/**
 * Check if array exists and has items
 */
export function hasItems<T>(array: T[] | null | undefined): boolean {
  return Array.isArray(array) && array.length > 0;
}
