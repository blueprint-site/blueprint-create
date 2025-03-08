// src/components/filters/SearchFilter.tsx
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchFilter({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SearchFilterProps) {
  return (
    <div className={`flex flex-col justify-baseline align-baseline ${className}`}>
      <Input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        startIcon={Search}
        className='font-minecraft w-full'
      />
    </div>
  );
}
