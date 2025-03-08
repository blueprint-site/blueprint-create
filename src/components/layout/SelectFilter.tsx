// src/components/filters/SelectFilter.tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterOption {
  value: string;
  label: string;
}

interface SelectFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
  isLoading?: boolean; // Added isLoading prop
}

export function SelectFilter({
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
  isLoading = false, // Default value for isLoading
}: SelectFilterProps) {
  return (
    <div className={className}>
      <label className='text-foreground font-minecraft mb-2 md:block hidden'>{label}</label>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger className='border-foreground font-minecraft w-full cursor-pointer rounded-lg p-2'>
          <SelectValue
            className='text-foreground font-minecraft'
            placeholder={placeholder || `Select ${label}`}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {isLoading ? (
              <div className='text-foreground font-minecraft p-2'>Loading...</div>
            ) : (
              options.map((option) => (
                <SelectItem
                  key={option.value}
                  className='text-foreground font-minecraft cursor-pointer'
                  value={option.value}>
                  {option.label}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
