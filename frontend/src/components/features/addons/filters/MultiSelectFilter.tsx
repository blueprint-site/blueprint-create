import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FilterOption } from '@/types/filters';

interface MultiSelectFilterProps {
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  searchable?: boolean;
  placeholder?: string;
  maxHeight?: number;
  grouped?: boolean;
  groups?: Record<string, string[]>;
}

export const MultiSelectFilter = ({
  options,
  selectedValues,
  onToggle,
  searchable = false,
  placeholder = 'Search...',
  maxHeight = 250,
  grouped = false,
  groups,
}: MultiSelectFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;

    const query = searchQuery.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Group options if needed
  const groupedOptions = useMemo(() => {
    if (!grouped || !groups) return { All: filteredOptions };

    const result: Record<string, FilterOption[]> = {};

    // Initialize groups
    Object.keys(groups).forEach((groupName) => {
      result[groupName] = [];
    });

    // Add "Other" group for ungrouped items
    result['Other'] = [];

    // Distribute options into groups
    filteredOptions.forEach((option) => {
      let added = false;
      for (const [groupName, groupValues] of Object.entries(groups)) {
        if (groupValues.includes(option.value)) {
          result[groupName].push(option);
          added = true;
          break;
        }
      }
      if (!added) {
        result['Other'].push(option);
      }
    });

    // Remove empty groups
    Object.keys(result).forEach((key) => {
      if (result[key].length === 0) {
        delete result[key];
      }
    });

    return result;
  }, [filteredOptions, grouped, groups]);

  const renderOption = (option: FilterOption) => (
    <label
      key={option.value}
      className='hover:bg-accent flex cursor-pointer items-center space-x-2 rounded px-2 py-1.5'
    >
      <Checkbox
        checked={selectedValues.includes(option.value)}
        onCheckedChange={() => onToggle(option.value)}
        className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
      />
      <span className='flex-1 text-sm'>{option.label}</span>
      {option.count !== undefined && (
        <span className='text-muted-foreground text-xs'>({option.count})</span>
      )}
    </label>
  );

  return (
    <div className='space-y-2'>
      {searchable && (
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
          <Input
            type='text'
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='h-9 pl-8'
          />
        </div>
      )}

      <ScrollArea
        className='bg-background rounded-md border'
        style={{ height: `${Math.min(maxHeight, filteredOptions.length * 36 + 20)}px` }}
      >
        <div className='p-2'>
          {grouped ? (
            Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <div key={groupName} className='mb-3 last:mb-0'>
                <div className='bg-background text-muted-foreground sticky top-0 px-2 py-1 text-xs font-semibold'>
                  {groupName}
                </div>
                <div className='space-y-1'>{groupOptions.map(renderOption)}</div>
              </div>
            ))
          ) : (
            <div className='space-y-1'>{filteredOptions.map(renderOption)}</div>
          )}

          {filteredOptions.length === 0 && (
            <div className='text-muted-foreground py-4 text-center text-sm'>No options found</div>
          )}
        </div>
      </ScrollArea>

      {selectedValues.length > 0 && (
        <div className='text-muted-foreground text-xs'>{selectedValues.length} selected</div>
      )}
    </div>
  );
};
