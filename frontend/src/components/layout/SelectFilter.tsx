// src/components/filters/SelectFilter.tsx
import {
  Select,
  SelectContent,
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
        <SelectTrigger className='font-minecraft [&_[data-placeholder]]:text-foreground-muted text-[color:var(--sidebar-foreground)]'>
          <SelectValue
            className='text-foreground font-minecraft'
            placeholder={placeholder || `Select ${label}`}
          />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className='font-minecraft p-2'>Loading...</div>
          ) : (
            options.map((option) => (
              <SelectItem
                key={option.value}
                className='font-minecraft cursor-pointer'
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
