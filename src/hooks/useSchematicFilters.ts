// src/hooks/useSchematicFilters.ts
import { useMemo } from 'react';
import { useFilters } from './useFilters';
import schematicCategories from '@/config/schematicsCategory';
import { FilterOption } from '@/components/layout/SelectFilter';
import {createVersion, minecraftVersion} from "@/config/minecraft.ts";

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
    return minecraftVersion.map(ver => ({
      value: ver.version,
      label: ver.version
    }));
  }, []);

  const loaderOptions = useMemo<FilterOption[]>(() => [
    { value: 'all', label: 'All' },
    { value: 'forge', label: 'Forge' },
    { value: 'fabric', label: 'Fabric' }
  ], []);

  const createVersionOptions = useMemo<FilterOption[]>(() => {
    return createVersion.map(ver => ({
    value: ver,
    label: ver
    }))
  }, [])

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
    hasSubCategories: subCategoryOptions.length > 0
  };
}