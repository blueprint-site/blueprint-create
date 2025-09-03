// src/hooks/useSchematicFilters.ts
import { useMemo } from 'react';
import { useFilters } from './useFilters';
import type { FilterOption } from '@/components/layout/SelectFilter';
import { CREATE_VERSIONS, MINECRAFT_VERSIONS, SCHEMATIC_CATEGORIES } from '@/data';

export function useSchematicFilters(options = {}) {
  const {
    filters,
    setQuery,
    setPage,
    setCategory,
    setSubCategory,
    setVersion,
    setLoaders,
    setCreateVersion,
    resetFilters,
    loadMore, // Make sure this is included from useFilters
  } = useFilters(options);

  const schematicCategories = SCHEMATIC_CATEGORIES;
  const minecraftVersions = MINECRAFT_VERSIONS;
  const createVersions = CREATE_VERSIONS;

  // Convert to FilterOption format and memoize to prevent unnecessary recalculations
  const categoryOptions = useMemo<FilterOption[]>(() => {
    return schematicCategories.map((cat) => ({
      value: cat.category,
      label: cat.category,
    }));
  }, [schematicCategories]);

  const selectedCategory = useMemo(() => {
    return schematicCategories.find((cat) => cat.category === filters.category);
  }, [filters.category, schematicCategories]);

  const subCategoryOptions = useMemo<FilterOption[]>(() => {
    if (!selectedCategory?.subcategories?.length) {
      return [];
    }
    return selectedCategory.subcategories.map((subCat) => ({
      value: subCat,
      label: subCat,
    }));
  }, [selectedCategory]);

  const versionOptions = useMemo<FilterOption[]>(() => {
    return minecraftVersions.map((version) => ({
      value: version.value,
      label: version.value,
    }));
  }, [minecraftVersions]);

  const loaderOptions = useMemo<FilterOption[]>(
    () => [
      { value: 'all', label: 'All' },
      { value: 'forge', label: 'Forge' },
      { value: 'fabric', label: 'Fabric' },
    ],
    []
  );

  const createVersionOptions = useMemo<FilterOption[]>(() => {
    return Object.values(createVersions).map((ver) => ({
      value: ver.value,
      label: ver.label,
    }));
  }, [createVersions]);

  return {
    filters,
    setQuery,
    setPage,
    setCategory,
    setSubCategory,
    setVersion,
    setLoaders,
    setCreateVersion,
    resetFilters,
    loadMore, // Include this in the return value
    categoryOptions,
    createVersionOptions,
    subCategoryOptions,
    versionOptions,
    loaderOptions,
    hasSubCategories: subCategoryOptions.length > 0,
  };
}
