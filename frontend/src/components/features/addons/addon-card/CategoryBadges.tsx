import { Badge } from '@/components/ui/badge.tsx';
import { memo } from 'react';
import { MODLOADER_OPTIONS } from '@/data/modloaders';
import { ensureArray } from '@/utils/arrayUtils';

// Extract just the values from MODLOADER_OPTIONS for filtering
const MODLOADERS = MODLOADER_OPTIONS.map((option) => option.value.toLowerCase());

const toTitleCase = (str: string) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface AddonCategoriesProps {
  categories: string[] | null | undefined;
}

const CategoryBadges = ({ categories }: AddonCategoriesProps) => {
  // Ensure categories is always an array
  const safeCategories = ensureArray(categories);

  if (safeCategories.length === 0) return null;

  const processedCategories = [
    ...new Set(
      safeCategories.filter((cat) => !MODLOADERS.includes(cat)).map((cat) => cat.toLowerCase())
    ),
  ].map(toTitleCase);

  if (processedCategories.length === 0) return null;

  return (
    <div className='mt-2 flex flex-wrap gap-2'>
      {processedCategories.map((category) => (
        <Badge key={category}>{category}</Badge>
      ))}
    </div>
  );
};

export default memo(CategoryBadges);
