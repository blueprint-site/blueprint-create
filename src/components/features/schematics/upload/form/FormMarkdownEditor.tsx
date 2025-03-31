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
  onValueChange?: (value: string) => void;
}

export function FormMarkdownEditor({
  name,
  control,
  label,
  description,
  onValueChange,
}: FormMarkdownEditorProps) {
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
              placeholder={description}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
