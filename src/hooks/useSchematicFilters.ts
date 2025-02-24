// src/hooks/useSchematicFilters.ts
import { useMemo } from 'react';
import { useFilters } from './useFilters';
import schematicCategories from '@/config/schematicsCategory';
import minecraftVersions from '@/config/minecraft';
import { FilterOption } from '@/components/layout/SelectFilter';

export function useSchematicFilters(options = {}) {
  const {
    filters,
    setQuery,
    setPage,
    setCategory,
    setSubCategory,
    setVersion,
    setLoaders,
    resetFilters,
    loadMore // Make sure this is included from useFilters
  } = useFilters(options);

  // Convert to FilterOption format and memoize to prevent unnecessary recalculations
  const categoryOptions = useMemo<FilterOption[]>(() => {
    return schematicCategories.map(cat => ({
      value: cat.category,
      label: cat.category
    }));
  }, []);

  const selectedCategory = useMemo(() => {
    return schematicCategories.find(cat => cat.category === filters.category);
  }, [filters.category]);

  const subCategoryOptions = useMemo<FilterOption[]>(() => {
    if (!selectedCategory?.subcategories?.length) {
      return [];
    }
    return selectedCategory.subcategories.map(subCat => ({
      value: subCat,
      label: subCat
    }));
  }, [selectedCategory]);

  const versionOptions = useMemo<FilterOption[]>(() => {
    return minecraftVersions.map(ver => ({
      value: ver.version,
      label: ver.version
    }));
  }, []);

  const loaderOptions = useMemo<FilterOption[]>(() => [
    { value: 'all', label: 'All' },
    { value: 'forge', label: 'Forge' },
    { value: 'fabric', label: 'Fabric' }
  ], []);

  return {
    filters,
    setQuery,
    setPage,
    setCategory,
    setSubCategory,
    setVersion,
    setLoaders,
    resetFilters,
    loadMore, // Include this in the return value
    categoryOptions,
    subCategoryOptions,
    versionOptions,
    loaderOptions,
    hasSubCategories: subCategoryOptions.length > 0
  };
}