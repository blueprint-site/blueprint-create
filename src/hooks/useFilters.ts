// src/hooks/useFilters.ts
import { useState, useCallback } from 'react';

export interface FilterState {
  query: string;
  page: number;
  category: string;
  subCategory?: string;
  version: string;
  loaders: string;
}

interface UseFiltersOptions {
  initialValues?: Partial<FilterState>;
  onFilterChange?: (filters: FilterState) => void;
}

export function useFilters(options: UseFiltersOptions = {}) {
  const {
    initialValues = {},
    onFilterChange
  } = options;
  
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    page: 1,
    category: 'All',
    subCategory: 'All',
    version: 'All',
    loaders: 'all',
    ...initialValues
  });

  const updateFilter = useCallback((key: keyof FilterState, value: string | number) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // If changing category, reset subCategory
      if (key === 'category') {
        newFilters.subCategory = 'All';
      }
      
      // If changing any filter other than page, reset to page 1
      if (key !== 'page') {
        newFilters.page = 1;
      }

      // Call onFilterChange if provided
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  }, [onFilterChange]);

  const setQuery = useCallback((value: string) => updateFilter('query', value), [updateFilter]);
  const setPage = useCallback((value: number) => updateFilter('page', value), [updateFilter]);
  const setCategory = useCallback((value: string) => updateFilter('category', value), [updateFilter]);
  const setSubCategory = useCallback((value: string) => updateFilter('subCategory', value), [updateFilter]);
  const setVersion = useCallback((value: string) => updateFilter('version', value), [updateFilter]);
  const setLoaders = useCallback((value: string) => updateFilter('loaders', value), [updateFilter]);

  const resetFilters = useCallback(() => {
    setFilters({
      query: '',
      page: 1,
      category: 'All',
      subCategory: 'All',
      version: 'All',
      loaders: 'all',
      ...initialValues
    });
    
    if (onFilterChange) {
      onFilterChange({
        query: '',
        page: 1,
        category: 'All',
        subCategory: 'All',
        version: 'All',
        loaders: 'all',
        ...initialValues
      });
    }
  }, [initialValues, onFilterChange]);

  const loadMore = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      page: prev.page + 1
    }));
  }, []);

  return {
    filters,
    setQuery,
    setPage,
    setCategory,
    setSubCategory,
    setVersion,
    setLoaders,
    resetFilters,
    loadMore
  };
}