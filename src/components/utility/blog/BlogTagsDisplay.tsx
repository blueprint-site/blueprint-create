import { useEffect, useState } from 'react';
import type { BlogTag } from '@/types';

interface BlogTagsDisplayProps {
  value?: BlogTag[];
}

const BlogTagsDisplay = ({ value }: BlogTagsDisplayProps) => {
  const [tags, setTags] = useState<BlogTag[]>([]);

  useEffect(() => {
    setTags(value || []);
  }, [value]);

  return (
    <div className='flex flex-wrap gap-2'>
      {tags.map((tag) => (
        <span key={tag.$id} className={`text-foreground rounded p-1 bg-[${tag.color}]`}>
          {tag.value}
        </span>
      ))}
    </div>
  );
};

export default BlogTagsDisplay;
