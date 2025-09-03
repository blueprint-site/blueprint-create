import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MultiSelectFilter } from './MultiSelectFilter';
import { FilterTag } from './FilterTag';
import { QuickFiltersModal } from './QuickFiltersModal';
import type { SearchFiltersProps, FilterOption, SortOption } from '@/types/filters';
import { sortOptions, versionGroups } from '@/types/filters';

export const FilterPanel = ({
  filters,
  facets,
  onFilterChange,
  onClearFilters,
  onApplyPreset,
}: SearchFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: false,
    loaders: false,
    versions: false,
    authors: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get active filter tags
  const getActiveFilterTags = () => {
    const tags: Array<{ type: string; value: string; label: string }> = [];

    filters.categories.forEach((cat) => {
      tags.push({ type: 'category', value: cat, label: `Category: ${cat}` });
    });

    filters.loaders.forEach((loader) => {
      tags.push({ type: 'loader', value: loader, label: `Loader: ${loader}` });
    });

    filters.minecraft_versions.forEach((version) => {
      tags.push({ type: 'version', value: version, label: `Version: ${version}` });
    });

    filters.authors.forEach((author) => {
      tags.push({ type: 'author', value: author, label: `Author: ${author}` });
    });

    if (filters.sort && filters.sort !== 'relevance') {
      const sortLabel =
        sortOptions.find((opt) => opt.value === filters.sort)?.label || filters.sort;
      tags.push({ type: 'sort', value: filters.sort, label: `Sort: ${sortLabel}` });
    }

    return tags;
  };

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case 'category':
        onFilterChange(
          'categories',
          filters.categories.filter((c) => c !== value)
        );
        break;
      case 'loader':
        onFilterChange(
          'loaders',
          filters.loaders.filter((l) => l !== value)
        );
        break;
      case 'version':
        onFilterChange(
          'minecraft_versions',
          filters.minecraft_versions.filter((v) => v !== value)
        );
        break;
      case 'author':
        onFilterChange(
          'authors',
          filters.authors.filter((a) => a !== value)
        );
        break;
      case 'sort':
        onFilterChange('sort', 'relevance');
        break;
    }
  };

  const activeTags = getActiveFilterTags();

  // Convert facets to options for MultiSelectFilter with fallbacks
  const getCategoryOptions = (): FilterOption[] => {
    if (facets?.categories && Object.keys(facets.categories).length > 0) {
      return Object.entries(facets.categories)
        .filter(([value, count]: [string, number]) => {
          // Filter out weird/invalid categories
          return (
            value &&
            value.length > 1 &&
            !value.includes(',') && // Skip any remaining comma-separated values
            !value.includes('null') &&
            !value.includes('undefined') &&
            count > 0
          );
        })
        .map(([value, count]: [string, number]) => {
          // Format the label properly
          const label = value
            .split(/[-_]/) // Split on hyphens or underscores
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

          return {
            value,
            label,
            count,
          };
        })
        .sort((a, b) => b.count - a.count); // Sort by count, highest first
    }
    // Fallback options when facets aren't available
    return [
      { value: 'tech', label: 'Tech' },
      { value: 'industrial', label: 'Industrial' },
      { value: 'automation', label: 'Automation' },
      { value: 'energy', label: 'Energy' },
      { value: 'magic', label: 'Magic' },
      { value: 'adventure', label: 'Adventure' },
      { value: 'decoration', label: 'Decoration' },
      { value: 'utility', label: 'Utility' },
      { value: 'worldgen', label: 'World Gen' },
    ];
  };

  const getLoaderOptions = (): FilterOption[] => {
    if (facets?.loaders && Object.keys(facets.loaders).length > 0) {
      return Object.entries(facets.loaders)
        .filter(([value, count]: [string, number]) => {
          // Filter out invalid loaders
          return (
            value &&
            value.length > 1 &&
            !value.includes(',') && // Skip any remaining comma-separated values
            !value.includes('null') &&
            !value.includes('undefined') &&
            count > 0
          );
        })
        .map(([value, count]) => ({
          value,
          label: value, // Loaders usually have proper names already
          count,
        }))
        .sort((a, b) => b.count - a.count); // Sort by count, highest first
    }
    // Fallback options when facets aren't available
    return [
      { value: 'Forge', label: 'Forge' },
      { value: 'Fabric', label: 'Fabric' },
      { value: 'NeoForge', label: 'NeoForge' },
      { value: 'Quilt', label: 'Quilt' },
    ];
  };

  const getVersionOptions = (): FilterOption[] => {
    if (facets?.minecraft_versions && Object.keys(facets.minecraft_versions).length > 0) {
      return Object.entries(facets.minecraft_versions)
        .filter(([value, count]: [string, number]) => {
          // Filter out invalid versions
          return (
            value &&
            value.match(/^\d+\.\d+(\.\d+)?$/) && // Valid version format
            !value.includes(',') && // Skip comma-separated values
            count > 0
          );
        })
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }))
        .sort((a, b) => {
          // Sort versions properly (newest first)
          const aParts = a.value.split('.').map(Number);
          const bParts = b.value.split('.').map(Number);

          for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            if (aPart !== bPart) return bPart - aPart;
          }
          return 0;
        });
    }
    // Fallback options when facets aren't available
    return [
      { value: '1.21.1', label: '1.21.1' },
      { value: '1.21', label: '1.21' },
      { value: '1.20.6', label: '1.20.6' },
      { value: '1.20.4', label: '1.20.4' },
      { value: '1.20.1', label: '1.20.1' },
      { value: '1.19.2', label: '1.19.2' },
      { value: '1.18.2', label: '1.18.2' },
      { value: '1.16.5', label: '1.16.5' },
      { value: '1.12.2', label: '1.12.2' },
    ];
  };

  const getAuthorOptions = () => {
    if (facets?.authors && Object.keys(facets.authors).length > 0) {
      return Object.entries(facets.authors)
        .slice(0, 50) // Limit to top 50 authors
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }));
    }
    // Return empty array for authors when facets aren't available
    // since we can't provide meaningful fallback author names
    return [];
  };

  return (
    <div className='space-y-4'>
      {/* Quick Filters Button */}
      {onApplyPreset && (
        <div className='flex justify-center'>
          <QuickFiltersModal onApplyPreset={onApplyPreset} />
        </div>
      )}

      {/* Active Filters */}
      {activeTags.length > 0 && (
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium'>Active Filters ({activeTags.length})</h3>
            <Button variant='ghost' size='sm' onClick={onClearFilters} className='h-6 px-2 text-xs'>
              Clear All
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {activeTags.map((tag, index) => (
              <FilterTag
                key={`${tag.type}-${tag.value}-${index}`}
                label={tag.label}
                onRemove={() => removeFilter(tag.type, tag.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Sort By</label>
        <ScrollArea className='h-10 w-full rounded-md border'>
          <select
            value={filters.sort || 'relevance'}
            onChange={(e) => onFilterChange('sort', e.target.value as SortOption)}
            className='bg-background w-full border-0 px-3 py-2 text-sm focus:outline-none'
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </ScrollArea>
      </div>

      {/* Categories Filter */}
      <Collapsible open={expandedSections.categories}>
        <CollapsibleTrigger
          onClick={() => toggleSection('categories')}
          className='hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1'
        >
          <span className='text-sm font-medium'>Categories</span>
          {expandedSections.categories ? (
            <ChevronUp className='h-4 w-4' />
          ) : (
            <ChevronDown className='h-4 w-4' />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className='pt-2'>
          <MultiSelectFilter
            options={getCategoryOptions()}
            selectedValues={filters.categories}
            onToggle={(value) => {
              const newCategories = filters.categories.includes(value)
                ? filters.categories.filter((c) => c !== value)
                : [...filters.categories, value];
              onFilterChange('categories', newCategories);
            }}
            searchable
            placeholder='Search categories...'
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Loaders Filter */}
      <Collapsible open={expandedSections.loaders}>
        <CollapsibleTrigger
          onClick={() => toggleSection('loaders')}
          className='hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1'
        >
          <span className='text-sm font-medium'>Mod Loaders</span>
          {expandedSections.loaders ? (
            <ChevronUp className='h-4 w-4' />
          ) : (
            <ChevronDown className='h-4 w-4' />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className='pt-2'>
          <MultiSelectFilter
            options={getLoaderOptions()}
            selectedValues={filters.loaders}
            onToggle={(value) => {
              const newLoaders = filters.loaders.includes(value)
                ? filters.loaders.filter((l) => l !== value)
                : [...filters.loaders, value];
              onFilterChange('loaders', newLoaders);
            }}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Versions Filter */}
      <Collapsible open={expandedSections.versions}>
        <CollapsibleTrigger
          onClick={() => toggleSection('versions')}
          className='hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1'
        >
          <span className='text-sm font-medium'>Minecraft Versions</span>
          {expandedSections.versions ? (
            <ChevronUp className='h-4 w-4' />
          ) : (
            <ChevronDown className='h-4 w-4' />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className='pt-2'>
          <MultiSelectFilter
            options={getVersionOptions()}
            selectedValues={filters.minecraft_versions}
            onToggle={(value) => {
              const newVersions = filters.minecraft_versions.includes(value)
                ? filters.minecraft_versions.filter((v) => v !== value)
                : [...filters.minecraft_versions, value];
              onFilterChange('minecraft_versions', newVersions);
            }}
            searchable
            placeholder='Search versions...'
            grouped
            groups={versionGroups}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Authors Filter */}
      {getAuthorOptions().length > 0 && (
        <Collapsible open={expandedSections.authors}>
          <CollapsibleTrigger
            onClick={() => toggleSection('authors')}
            className='hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1'
          >
            <span className='text-sm font-medium'>Authors</span>
            {expandedSections.authors ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='pt-2'>
            <MultiSelectFilter
              options={getAuthorOptions()}
              selectedValues={filters.authors}
              onToggle={(value) => {
                const newAuthors = filters.authors.includes(value)
                  ? filters.authors.filter((a) => a !== value)
                  : [...filters.authors, value];
                onFilterChange('authors', newAuthors);
              }}
              searchable
              placeholder='Search authors...'
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
