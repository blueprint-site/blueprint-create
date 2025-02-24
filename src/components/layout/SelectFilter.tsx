// src/components/filters/SelectFilter.tsx
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
}

export function SelectFilter({ 
  label, 
  value, 
  onChange, 
  options,
  placeholder,
  className 
}: SelectFilterProps) {
  return (
    <div className={className}>
      <label className="text-foreground font-minecraft mb-2 block">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-foreground font-minecraft w-full rounded-lg p-2">
          <SelectValue
            className="text-foreground font-minecraft"
            placeholder={placeholder || `Select ${label}`}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(option => (
              <SelectItem
                key={option.value}
                className="text-foreground font-minecraft"
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}