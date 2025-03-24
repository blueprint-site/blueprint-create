// components/SchematicUploadForm/MultiSelectCheckboxGroup.tsx
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { SchematicFormValues } from '@/types';

// Explicitly type allowed array fields
type ArrayField = 'game_versions' | 'create_versions' | 'modloaders';

// Define the SelectOption interface
interface SelectOption {
  value: string;
  label: string;
  metadata?: Record<string, unknown>;
}

interface MultiSelectCheckboxGroupProps {
  name: ArrayField;
  control: Control<SchematicFormValues>;
  label: string;
  description?: string;
  options: readonly SelectOption[];
}

export function MultiSelectCheckboxGroup({
  name,
  control,
  label,
  description,
  options,
}: MultiSelectCheckboxGroupProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const values = (field.value as string[]) || []; // Type guard for array fields with fallback
        return (
          <FormItem className='flex flex-col space-y-2'>
            <FormLabel className='flex-0'>{label}</FormLabel>
            {description && <p className='text-foreground-muted text-sm'>{description}</p>}

            <div className='space-y-2'>
              {options.map((option) => (
                <FormItem className='flex items-center space-y-0 space-x-3' key={option.value}>
                  <FormControl>
                    <Checkbox
                      checked={values.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...values, option.value]);
                        } else {
                          field.onChange(values.filter((val) => val !== option.value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className='cursor-pointer font-normal'>{option.label}</FormLabel>
                </FormItem>
              ))}
            </div>

            <FormMessage className='flex-0' />
          </FormItem>
        );
      }}
    />
  );
}
