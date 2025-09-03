import React from 'react';
import { cn } from '@/config/utils';
import { useThemeStore } from '@/api/stores/themeStore';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import RotatingCogwheel from '@/components/common/Cogwheel';
import { FiltersContainer } from '@/components/layout/FiltersContainer';
import { SearchFilter } from '@/components/layout/SearchFilter';
import { MobileSearchFilterDrawer } from '@/components/layout/MobileSearchFilterDrawer';
import { RefreshCw } from 'lucide-react';

interface ListPageLayoutProps {
  children: React.ReactNode;
  className?: string;

  // Search functionality
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Filter functionality
  filters: React.ReactNode;
  onResetFilters: () => void;
  filterTitle?: string;
  hasActiveFilters?: boolean;

  // Header content (optional - for things like upload buttons)
  headerContent?: React.ReactNode;
}

export function ListPageLayout({
  children,
  className,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  onResetFilters,
  filterTitle = 'Filters',
  hasActiveFilters = false,
  headerContent,
}: ListPageLayoutProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        `flex min-h-screen w-full flex-col lg:flex-row ${isDarkMode ? 'dark' : ''}`,
        className
      )}
    >
      <AppHeader fullWidth />

      {/* Desktop Filters Sidebar */}
      <div className={cn('bg-surface-1 mt-16 hidden w-full shrink-0 p-4 lg:block lg:w-64')}>
        <FiltersContainer>
          <div className='flex items-center justify-between'>
            <div className='text-foreground font-minecraft text-xl font-semibold'>
              {filterTitle}
            </div>
            <button
              onClick={onResetFilters}
              className='text-primary flex items-center gap-1 text-sm'
              aria-label='Reset filters'
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>

          <SearchFilter
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />

          {filters}
        </FiltersContainer>
      </div>

      {/* Main Content */}
      <main
        id='main'
        className={cn('flex h-screen w-full flex-col justify-between overflow-y-scroll pt-16')}
      >
        <div
          className={`flex-1 p-8 ${isDarkMode ? 'bg-shadow_steel_casing' : 'bg-refined_radiance_casing'}`}
        >
          {headerContent && <div className='mb-4 flex justify-end'>{headerContent}</div>}
          {children}
        </div>
        <AppFooter />
      </main>

      <RotatingCogwheel />

      {/* Mobile Search and Filter Drawer */}
      <MobileSearchFilterDrawer
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onResetFilters={onResetFilters}
        placeholder={searchPlaceholder}
        title={filterTitle}
        hasActiveFilters={hasActiveFilters}
      >
        {filters}
      </MobileSearchFilterDrawer>
    </div>
  );
}
