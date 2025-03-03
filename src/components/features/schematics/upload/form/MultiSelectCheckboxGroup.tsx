// components/SchematicUploadForm/MultiSelectCheckboxGroup.tsx
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import {SchematicFormValues} from "@/types";

// Explicitly type allowed array fields
type ArrayField = 'gameVersions' | 'createVersions' | 'modloaders';

interface MultiSelectCheckboxGroupProps {
  name: ArrayField;
  control: Control<SchematicFormValues>;
  label: string;
  description?: string;
  options: string[];
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
        const values = field.value as string[] || []; // Type guard for array fields with fallback

        return (
          <FormItem className='flex flex-col space-y-2'>
            <FormLabel className='flex-0'>{label}</FormLabel>
            {description && <p className="text-sm text-foreground-muted">{description}</p>}

            <div className="space-y-2">
              {options.map((option) => (
                <FormItem className='flex items-center space-y-0 space-x-3' key={option}>
                  <FormControl>
                    <Checkbox
                      checked={values.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Add option if it's not already in the array
                          field.onChange([...values, option]);
                        } else {
                          // Remove option if it's in the array
                          field.onChange(values.filter(val => val !== option));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className='font-normal cursor-pointer'>{option}</FormLabel>
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