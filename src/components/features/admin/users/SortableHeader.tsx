import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import type { Column } from '@tanstack/react-table';

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

// Use generic types for flexibility
export function SortableHeader<TData, TValue>({
  column,
  title,
}: SortableHeaderProps<TData, TValue>) {
  // Only show button if column can be sorted
  if (!column.getCanSort()) {
    return <span>{title}</span>;
  }

  return (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className='-ml-4' // Adjust margin as needed
    >
      {title}
      <ArrowUpDown className='ml-2 h-4 w-4' />
    </Button>
  );
}

SortableHeader.displayName = 'SortableHeader';
