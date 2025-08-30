import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SchematicFilters } from '@/types/schematicFilters';
import { schematicCategories } from '@/types/schematicFilters';

interface SchematicFilterTagsProps {
  filters: SchematicFilters;
  onRemoveCategory: (category: string) => void;
  onRemoveSubcategory: (subcategory: string) => void;
  onRemoveMaterial: (material: string) => void;
  onRemoveMod: (mod: string) => void;
  onRemoveComplexity: (level: string) => void;
  onClearAll: () => void;
  className?: string;
}

export const SchematicFilterTags: React.FC<SchematicFilterTagsProps> = ({
  filters,
  onRemoveCategory,
  onRemoveSubcategory,
  onRemoveMaterial,
  onRemoveMod,
  onRemoveComplexity,
  onClearAll,
  className,
}) => {
  const activeTags: Array<{ type: string; value: string; label: string; onRemove: () => void }> =
    [];

  // Categories
  filters.categories.forEach((cat) => {
    const category = schematicCategories[cat];
    if (category) {
      activeTags.push({
        type: 'Category',
        value: cat,
        label: category.name,
        onRemove: () => onRemoveCategory(cat),
      });
    }
  });

  // Subcategories
  filters.subcategories.forEach((subcat) => {
    // Find the subcategory name
    let subcategoryName = subcat;
    for (const category of Object.values(schematicCategories)) {
      const found = category.subcategories.find((s) => s.id === subcat);
      if (found) {
        subcategoryName = found.name;
        break;
      }
    }

    activeTags.push({
      type: 'Subcategory',
      value: subcat,
      label: subcategoryName,
      onRemove: () => onRemoveSubcategory(subcat),
    });
  });

  // Dimensions
  if (filters.dimensions.width.min || filters.dimensions.width.max) {
    const label =
      filters.dimensions.width.min && filters.dimensions.width.max
        ? `Width: ${filters.dimensions.width.min}-${filters.dimensions.width.max}`
        : filters.dimensions.width.min
          ? `Width ≥ ${filters.dimensions.width.min}`
          : `Width ≤ ${filters.dimensions.width.max}`;

    activeTags.push({
      type: 'Dimension',
      value: 'width',
      label,
      onRemove: () => {}, // Need to handle dimension clearing differently
    });
  }

  if (filters.dimensions.height.min || filters.dimensions.height.max) {
    const label =
      filters.dimensions.height.min && filters.dimensions.height.max
        ? `Height: ${filters.dimensions.height.min}-${filters.dimensions.height.max}`
        : filters.dimensions.height.min
          ? `Height ≥ ${filters.dimensions.height.min}`
          : `Height ≤ ${filters.dimensions.height.max}`;

    activeTags.push({
      type: 'Dimension',
      value: 'height',
      label,
      onRemove: () => {}, // Need to handle dimension clearing differently
    });
  }

  if (filters.dimensions.blockCount.min || filters.dimensions.blockCount.max) {
    const label =
      filters.dimensions.blockCount.min && filters.dimensions.blockCount.max
        ? `Blocks: ${filters.dimensions.blockCount.min.toLocaleString()}-${filters.dimensions.blockCount.max.toLocaleString()}`
        : filters.dimensions.blockCount.min
          ? `Blocks ≥ ${filters.dimensions.blockCount.min.toLocaleString()}`
          : `Blocks ≤ ${filters.dimensions.blockCount.max?.toLocaleString()}`;

    activeTags.push({
      type: 'Dimension',
      value: 'blockCount',
      label,
      onRemove: () => {}, // Need to handle dimension clearing differently
    });
  }

  // Materials
  filters.materials.primary.forEach((material) => {
    activeTags.push({
      type: 'Material',
      value: material,
      label: material.replace(/_/g, ' '),
      onRemove: () => onRemoveMaterial(material),
    });
  });

  // Complexity
  filters.complexity.levels.forEach((level) => {
    activeTags.push({
      type: 'Complexity',
      value: level,
      label: level.charAt(0).toUpperCase() + level.slice(1),
      onRemove: () => onRemoveComplexity(level),
    });
  });

  // Mods
  filters.compatibility.requiredMods.forEach((mod) => {
    activeTags.push({
      type: 'Mod',
      value: mod,
      label: mod,
      onRemove: () => onRemoveMod(mod),
    });
  });

  // Special filters
  if (!filters.materials.includeModded) {
    activeTags.push({
      type: 'Special',
      value: 'vanilla',
      label: 'Vanilla Only',
      onRemove: () => {}, // Need to handle specially
    });
  }

  if (!filters.compatibility.allowRedstone) {
    activeTags.push({
      type: 'Special',
      value: 'no-redstone',
      label: 'No Redstone',
      onRemove: () => {}, // Need to handle specially
    });
  }

  if (!filters.compatibility.allowCommandBlocks) {
    activeTags.push({
      type: 'Special',
      value: 'no-commands',
      label: 'No Command Blocks',
      onRemove: () => {}, // Need to handle specially
    });
  }

  if (filters.meta.featured) {
    activeTags.push({
      type: 'Special',
      value: 'featured',
      label: 'Featured Only',
      onRemove: () => {}, // Need to handle specially
    });
  }

  if (activeTags.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-muted-foreground text-sm'>Active filters:</span>
        {activeTags.map((tag, index) => (
          <Badge
            key={`${tag.type}-${tag.value}-${index}`}
            variant='secondary'
            className='gap-1 pr-1'
          >
            <span className='text-muted-foreground text-xs'>{tag.type}:</span>
            {tag.label}
            <Button
              variant='ghost'
              size='sm'
              onClick={tag.onRemove}
              className='ml-1 h-4 w-4 p-0 hover:bg-transparent'
            >
              <X className='h-3 w-3' />
            </Button>
          </Badge>
        ))}
        <Button variant='ghost' size='sm' onClick={onClearAll} className='h-7 text-xs'>
          Clear all
        </Button>
      </div>
    </div>
  );
};
