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
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: readonly FilterOption[];
  readonly placeholder?: string;
  readonly className?: string;
  readonly isLoading?: boolean; // Added isLoading prop
}

export function SelectFilter({
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
  isLoading = false,
}: Readonly<SelectFilterProps>) {
  return (
    <div className={className}>
      <label className='text-foreground font-minecraft mb-2 hidden lg:block'>{label}</label>
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
                  value={option.value}
                >
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
