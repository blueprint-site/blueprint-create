// components/SchematicUploadForm/FormMarkdownEditor.tsx
import { Control, Path } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import MarkdownEditor from '@/components/utility/MarkdownEditor';
import { SchematicFormValues } from '@/schemas/schematic.schema.tsx';

interface FormMarkdownEditorProps {
  name: Path<SchematicFormValues>;
  control: Control<SchematicFormValues>;
  label: string;
  description: string;
  onValueChange?: (value: string) => void;
}

export function FormMarkdownEditor({ name, control, label, description, onValueChange }: FormMarkdownEditorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
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
            />
          </FormControl>
          <FormDescription className='flex justify-between'>
            <span>{description}</span>
            <span>{description?.length || 0}/500</span>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}