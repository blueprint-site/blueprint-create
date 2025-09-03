import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MultiSelectFilter } from '@/components/features/addons/filters/MultiSelectFilter';
import { FilterTag } from '@/components/features/addons/filters/FilterTag';
import { SchematicQuickFiltersModal } from './SchematicQuickFiltersModal';
import type { FilterOption } from '@/types/filters';
import type {
  SchematicFilters,
  SchematicFacetDistribution,
  SchematicFilterPreset,
  SchematicSortField,
  ComplexityLevel,
} from '@/types/schematicFilters';

interface SchematicFilterPanelProps {
  filters: SchematicFilters;
  facets: SchematicFacetDistribution | null;
  onFilterChange: <K extends keyof SchematicFilters>(
    filterType: K,
    value: SchematicFilters[K]
  ) => void;
  onClearFilters: () => void;
  onApplyPreset: (preset: SchematicFilterPreset) => void;
}

const schematicSortOptions = [
  { value: 'relevance:desc', label: 'Relevance' },
  { value: 'downloads:desc', label: 'Most Downloaded' },
  { value: 'downloads:asc', label: 'Least Downloaded' },
  { value: 'date:desc', label: 'Newest First' },
  { value: 'date:asc', label: 'Oldest First' },
  { value: 'size:desc', label: 'Largest First' },
  { value: 'size:asc', label: 'Smallest First' },
  { value: 'complexity:desc', label: 'Most Complex' },
  { value: 'complexity:asc', label: 'Simplest First' },
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
];

export const SchematicFilterPanel = ({
  filters,
  facets,
  onFilterChange,
  onClearFilters,
  onApplyPreset,
}: SchematicFilterPanelProps) => {
  console.log('SchematicFilterPanel props:', { filters, facets });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: false,
    materials: false,
    complexity: false,
    compatibility: false,
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

    filters.subcategories.forEach((subcat) => {
      tags.push({ type: 'subcategory', value: subcat, label: `Subcategory: ${subcat}` });
    });

    filters.materials.primary.forEach((material) => {
      tags.push({
        type: 'material',
        value: material,
        label: `Material: ${material.replace(/_/g, ' ')}`,
      });
    });

    filters.complexity.levels.forEach((level) => {
      tags.push({ type: 'complexity', value: level, label: `Complexity: ${level}` });
    });

    filters.compatibility.requiredMods.forEach((mod) => {
      tags.push({ type: 'mod', value: mod, label: `Mod: ${mod}` });
    });

    const sortValue = `${filters.sort.field}:${filters.sort.order}`;
    if (sortValue !== 'relevance:desc') {
      const sortLabel =
        schematicSortOptions.find((opt) => opt.value === sortValue)?.label || sortValue;
      tags.push({ type: 'sort', value: sortValue, label: `Sort: ${sortLabel}` });
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
      case 'subcategory':
        onFilterChange(
          'subcategories',
          filters.subcategories.filter((s) => s !== value)
        );
        break;
      case 'material':
        onFilterChange('materials', {
          ...filters.materials,
          primary: filters.materials.primary.filter((m) => m !== value),
        });
        break;
      case 'complexity':
        onFilterChange('complexity', {
          ...filters.complexity,
          levels: filters.complexity.levels.filter((l) => l !== value),
        });
        break;
      case 'mod':
        onFilterChange('compatibility', {
          ...filters.compatibility,
          requiredMods: filters.compatibility.requiredMods.filter((m) => m !== value),
        });
        break;
      case 'sort':
        onFilterChange('sort', { field: 'relevance', order: 'desc' });
        break;
    }
  };

  const activeTags = getActiveFilterTags();

  // Convert facets to options for MultiSelectFilter
  const getCategoryOptions = (): FilterOption[] => {
    console.log('Categories facet data:', facets?.categories);

    if (facets?.categories && Object.keys(facets.categories).length > 0) {
      return Object.entries(facets.categories)
        .filter(([value, count]) => value && value !== 'null' && count > 0)
        .map(([value, count]) => ({
          value,
          label: value.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          count,
        }))
        .sort((a, b) => b.count - a.count);
    }

    // Return empty array when no facet data available
    return [];
  };

  const getMaterialOptions = (): FilterOption[] => {
    if (facets?.['materials_primary'] && Object.keys(facets['materials_primary']).length > 0) {
      return Object.entries(facets['materials_primary'])
        .filter(([value, count]) => value && count > 0)
        .map(([value, count]) => ({
          value,
          label: value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          count,
        }))
        .sort((a, b) => b.count - a.count);
    }

    // Return empty array when no facet data available
    return [];
  };

  const getComplexityOptions = (): FilterOption[] => {
    if (facets?.['complexity_level'] && Object.keys(facets['complexity_level']).length > 0) {
      const options = [
        { value: 'simple', label: 'Simple' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'complex', label: 'Complex' },
        { value: 'extreme', label: 'Extreme' },
      ];

      return options
        .map((opt) => ({
          ...opt,
          count: facets['complexity_level'][opt.value] || 0,
        }))
        .filter((opt) => opt.count > 0);
    }

    // Return empty array when no facet data available
    return [];
  };

  const getModOptions = (): FilterOption[] => {
    if (facets?.['requirement_mods'] && Object.keys(facets['requirement_mods']).length > 0) {
      return Object.entries(facets['requirement_mods'])
        .filter(([value, count]) => value && count > 0)
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }))
        .sort((a, b) => b.count - a.count);
    }

    return [];
  };

  return (
    <div className='space-y-4'>
      {/* Quick Filters Button */}
      <div className='flex justify-center'>
        <SchematicQuickFiltersModal onApplyPreset={onApplyPreset} />
      </div>

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
            value={`${filters.sort.field}:${filters.sort.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split(':');
              onFilterChange('sort', {
                field: field as SchematicSortField,
                order: order as 'asc' | 'desc',
              });
            }}
            className='bg-background w-full border-0 px-3 py-2 text-sm focus:outline-none'
          >
            {schematicSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </ScrollArea>
      </div>

      {/* Categories Filter - only show if we have options */}
      {getCategoryOptions().length > 0 && (
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
      )}

      {/* Materials Filter - only show if we have options */}
      {getMaterialOptions().length > 0 && (
        <Collapsible open={expandedSections.materials}>
          <CollapsibleTrigger
            onClick={() => toggleSection('materials')}
            className='hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1'
          >
            <span className='text-sm font-medium'>Materials</span>
            {expandedSections.materials ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='pt-2'>
            <MultiSelectFilter
              options={getMaterialOptions()}
              selectedValues={filters.materials.primary}
              onToggle={(value) => {
                const newMaterials = filters.materials.primary.includes(value)
                  ? filters.materials.primary.filter((m) => m !== value)
                  : [...filters.materials.primary, value];
                onFilterChange('materials', {
                  ...filters.materials,
                  primary: newMaterials,
                });
              }}
              searchable
              placeholder='Search materials...'
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Complexity Filter - only show if we have options */}
      {getComplexityOptions().length > 0 && (
        <Collapsible open={expandedSections.complexity}>
          <CollapsibleTrigger
            onClick={() => toggleSection('complexity')}
            className='hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1'
          >
            <span className='text-sm font-medium'>Complexity</span>
            {expandedSections.complexity ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='pt-2'>
            <MultiSelectFilter
              options={getComplexityOptions()}
              selectedValues={filters.complexity.levels}
              onToggle={(value) => {
                const complexityValue = value as ComplexityLevel;
                const newLevels = filters.complexity.levels.includes(complexityValue)
                  ? filters.complexity.levels.filter((l) => l !== complexityValue)
                  : [...filters.complexity.levels, complexityValue];
                onFilterChange('complexity', {
                  ...filters.complexity,
                  levels: newLevels,
                });
              }}
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Required Mods Filter - only show if we have options */}
      {getModOptions().length > 0 && (
        <Collapsible open={expandedSections.compatibility}>
          <CollapsibleTrigger
            onClick={() => toggleSection('compatibility')}
            className='hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1'
          >
            <span className='text-sm font-medium'>Required Mods</span>
            {expandedSections.compatibility ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='pt-2'>
            <MultiSelectFilter
              options={getModOptions()}
              selectedValues={filters.compatibility.requiredMods}
              onToggle={(value) => {
                const newMods = filters.compatibility.requiredMods.includes(value)
                  ? filters.compatibility.requiredMods.filter((m) => m !== value)
                  : [...filters.compatibility.requiredMods, value];
                onFilterChange('compatibility', {
                  ...filters.compatibility,
                  requiredMods: newMods,
                });
              }}
              searchable
              placeholder='Search mods...'
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Show message when no filter options are available */}
      {getCategoryOptions().length === 0 &&
        getMaterialOptions().length === 0 &&
        getComplexityOptions().length === 0 &&
        getModOptions().length === 0 && (
          <div className='text-muted-foreground py-8 text-center'>
            <p className='mb-2 text-sm'>Advanced filters are not available yet.</p>
            <p className='text-xs'>
              Filters will appear once the Meilisearch index is configured with facets.
            </p>
          </div>
        )}
    </div>
  );
};
