import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input.tsx';
import { CardContent } from '@/components/ui/card.tsx';
import React from 'react';

interface SchematicSearchCardProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SchematicSearchCard = ({
  searchQuery,
  onSearchChange,
}: SchematicSearchCardProps) => {
  return (
    <CardContent>
      <Input
        type='text'
        value={searchQuery}
        onChange={onSearchChange}
        placeholder='Search schematics...'
        startIcon={Search}
        className='font-minecraft mb-4 w-full rounded-lg border p-2'
      />
    </CardContent>
  );
};

export default SchematicSearchCard;
