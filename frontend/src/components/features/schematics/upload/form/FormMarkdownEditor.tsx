// components/SchematicUploadForm/FormMarkdownEditor.tsx
import type { Control, Path } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import MarkdownEditor from '@/components/utility/MarkdownEditor';
import type { SchematicFormValues } from '@/types';

interface FormMarkdownEditorProps {
  name: Path<SchematicFormValues>;
  control: Control<SchematicFormValues>;
  label: string;
  description: string;
  placeholder?: string;
  minLength?: number;
  onValueChange?: (value: string) => void;
}

export function FormMarkdownEditor({
  name,
  control,
  label,
  description,
  placeholder,
  minLength,
  onValueChange,
}: FormMarkdownEditorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MarkdownEditor
              value={field.value as string}
              onChange={(value) => {
                field.onChange(value);
                onValueChange?.(value);
              }}
              showCodeBlocks={false}
              showImages={false}
              showTables={false}
              showFrontmatter={false}
              showSandpack={false}
              showDiffSource={false}
              showThematicBreak={false}
              showLists={false}
              showUndoRedo={false}
              placeholder={placeholder || description}
              className={fieldState.error ? 'border-red-500' : ''}
            />
          </FormControl>
          {minLength && (!field.value || (field.value as string).length < minLength) && (
            <p className='mt-1 text-sm text-red-500'>
              Description must be at least {minLength} characters
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
