import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

export const FilterTag = ({ label, onRemove }: FilterTagProps) => {
  return (
    <Badge
      variant='secondary'
      className='hover:bg-secondary/80 py-1 pr-1 pl-2 text-xs font-medium transition-colors'
    >
      <span className='mr-1'>{label}</span>
      <button
        onClick={onRemove}
        className='hover:bg-background/20 ml-1 rounded-sm p-0.5 transition-colors'
        aria-label={`Remove ${label} filter`}
      >
        <X className='h-3 w-3' />
      </button>
    </Badge>
  );
};
