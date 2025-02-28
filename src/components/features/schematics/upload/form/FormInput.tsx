// components/SchematicUploadForm/FormInput.tsx
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SchematicFormValues } from '@/schemas/schematic.schema.tsx';

// Explicitly type allowed input fields
type InputField = 'title' | 'description';

interface FormInputProps {
  name: InputField;
  control: Control<SchematicFormValues>;
  label: string;
  description?: string;
  placeholder?: string;
}

export function FormInput({
  name,
  control,
  label,
  description,
  placeholder
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              value={field.value as string} // Safe cast since we only use this for string fields
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className='text-destructive' />
        </FormItem>
      )}
    />
  );
}