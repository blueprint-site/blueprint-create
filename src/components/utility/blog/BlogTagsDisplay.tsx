import { Tag } from '@/types';
import { useEffect, useState } from 'react';

interface BlogTagsDisplayProps {
  value?: Tag[];
}

const BlogTagsDisplay = ({ value }: BlogTagsDisplayProps) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setTags(value || []);
  }, [value]); // ✅ Seulement `value` en dépendance

  return (
    <div className='flex flex-wrap gap-2'>
      {tags.map((tag) => (
        <span
          key={tag.id}
          className='text-foreground rounded px-1 py-1'
          style={{ backgroundColor: tag.color }}
        >
          {tag.value}
        </span>
      ))}
    </div>
  );
};

export default BlogTagsDisplay;
