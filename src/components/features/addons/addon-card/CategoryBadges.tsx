import { Badge } from '@/components/ui/badge.tsx';
import { memo } from 'react';

const MODLOADERS = ['forge', 'fabric', 'neoforge', 'quilt'];

const toTitleCase = (str: string) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface AddonCategoriesProps {
  categories: string[];
}

const CategoryBadges = memo(({ categories }: AddonCategoriesProps) => {
  const processedCategories = [
    ...new Set(
      categories.filter((cat) => !MODLOADERS.includes(cat)).map((cat) => cat.toLowerCase())
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
});

export default CategoryBadges;
