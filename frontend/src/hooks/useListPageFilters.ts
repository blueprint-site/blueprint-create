import { useState, useCallback } from 'react';

interface UseListPageFiltersOptions {
  initialSearchValue?: string;
  onFilterChange?: () => void;
}

export function useListPageFilters({
  initialSearchValue = '',
  onFilterChange,
}: UseListPageFiltersOptions = {}) {
  const [searchValue, setSearchValue] = useState(initialSearchValue);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      onFilterChange?.();
    },
    [onFilterChange]
  );

  const resetFilters = useCallback(() => {
    setSearchValue('');
    onFilterChange?.();
  }, [onFilterChange]);

  return {
    searchValue,
    handleSearchChange,
    resetFilters,
  };
}
