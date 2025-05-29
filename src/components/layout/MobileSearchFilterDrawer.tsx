import React, { useRef, useState } from 'react';
import { Search, Filter, RefreshCw, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/config/utils';

interface MobileSearchFilterDrawerProps {
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly onResetFilters: () => void;
  readonly children: React.ReactNode;
  readonly placeholder?: string;
  readonly title?: string;
  readonly hasActiveFilters?: boolean;
  readonly className?: string;
}

export function MobileSearchFilterDrawer({
  searchValue,
  onSearchChange,
  onResetFilters,
  children,
  placeholder = 'Search...',
  title = 'Filters',
  hasActiveFilters = false,
  className,
}: MobileSearchFilterDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn('lg:hidden', className)}>
      {/* Invisible Overlay - Covers the area above the drawer when expanded */}
      {isExpanded && (
        <div
          className='fixed inset-0 z-30 bg-transparent'
          onClick={() => setIsExpanded(false)}
          aria-label='Close filters'
        />
      )}

      {/* Filter Options Drawer - Expands upward above the search bar */}
      {isExpanded && (
        <div
          ref={filterContentRef}
          className='bg-background fixed right-0 bottom-18 left-0 z-40 max-h-[60vh] rounded-t-lg border border-b-0 shadow-lg transition-all duration-300 ease-in-out'
        >
          <div className='flex items-center justify-between border-b p-4'>
            <h3 className='text-foreground font-minecraft text-xl font-semibold'>{title}</h3>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={onResetFilters}
                className='text-primary flex items-center gap-1 text-sm'
                aria-label='Reset filters'
              >
                <RefreshCw size={14} />
                Reset
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsExpanded(false)}
                className='h-8 w-8'
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>Collapse filters</span>
              </Button>
            </div>
          </div>

          <div className='max-h-[50vh] overflow-y-auto p-4'>
            <div className='space-y-4'>{children}</div>
          </div>
        </div>
      )}

      {/* Search Bar - Always sticky at bottom */}
      <div
        className='bg-background fixed right-0 bottom-0 left-0 z-50 border-t shadow-lg'
        data-search-bar
      >
        <div className='flex items-center gap-3 p-4'>
          <div className='relative flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              type='text'
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className='font-minecraft pr-4 pl-10'
            />
          </div>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'h-10 w-10 shrink-0',
              (hasActiveFilters || isExpanded) && 'border-primary text-primary'
            )}
            aria-label='Toggle filters'
          >
            <Filter className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind the sticky search bar */}
      <div className='h-20' />
    </div>
  );
}
