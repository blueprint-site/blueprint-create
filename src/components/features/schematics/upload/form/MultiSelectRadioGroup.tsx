// components/SchematicUploadForm/MultiSelectRadioGroup.tsx
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SchematicFormValues } from '@/schemas/schematic.schema.tsx';

// Explicitly type allowed array fields
type ArrayField = 'gameVersions' | 'createVersions' | 'modloaders';

interface MultiSelectRadioGroupProps {
  name: ArrayField;
  control: Control<SchematicFormValues>;
  label: string;
  description: string;
  options: string[];
}

export function MultiSelectRadioGroup({
  name,
  control,
  label,
  options,
}: MultiSelectRadioGroupProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const values = field.value as string[]; // Type guard for array fields
        return (
          <FormItem className='flex flex-col space-y-2'>
            <FormLabel className='flex-0'>{label}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  const currentValues = values || [];
                  const updatedValues = currentValues.includes(value)
                    ? currentValues.filter((v) => v !== value)
                    : [...currentValues, value];
                  field.onChange(updatedValues);
                }}
                className='flex flex-col space-y-1'>
                {options.map((option) => (
                  <FormItem className='flex items-center space-y-0 space-x-3' key={option}>
                    <FormControl>
                      <RadioGroupItem value={option} checked={values?.includes(option)} />
                    </FormControl>
                    <FormLabel className='font-normal'>{option}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
