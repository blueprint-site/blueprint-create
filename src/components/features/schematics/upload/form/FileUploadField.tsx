// components/SchematicUploadForm/FileUploadField.tsx
import { Control } from 'react-hook-form';
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from '@/components/ui/file-uploader';
import { CloudUpload, Paperclip } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {SchematicFormValues} from "@/types";


// Explicitly type allowed file fields
type FileField = 'schematicFile' | 'imageFiles';

interface FileUploadFieldProps {
  name: FileField;
  control: Control<SchematicFormValues>;
  label: string;
  description?: string;
  accept: Record<string, string[]>;
  maxFiles: number;
  value: File[];
  onValueChange: (files: File[] | null) => void;
}

export function FileUploadField({
  name,
  control,
  label,
  description,
  accept,
  maxFiles,
  value,
  onValueChange,
}: FileUploadFieldProps) {
  const fileTypes = Object.values(accept)
    .flat()
    .map((ext) => ext.replace('.', '').toUpperCase())
    .join(', ');

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className='flex flex-col space-y-2'>
          <FormLabel className='flex-0'>{label}</FormLabel>
          <FormControl>
            <FileUploader
              value={value}
              onValueChange={(files) => onValueChange(files ?? [])}
              dropzoneOptions={{ accept, maxFiles }}
              className='bg-background rounded-lg p-2'
            >
              <FileInput className='outline-1 outline-foreground outline-dashed'>
                <div className='flex w-full flex-col items-center justify-center p-8'>
                  <CloudUpload className='text-foreground-muted h-10 w-10' />
                  <p className='text-foreground-muted mb-1 text-sm'>
                    <span className='font-semibold'>Click to upload</span>
                    &nbsp;or drag and drop
                  </p>
                  <p className='text-foreground-muted text-xs'>{fileTypes} files only</p>
                </div>
              </FileInput>
              <FileUploaderContent>
                {value.map((file, index) => (
                  <FileUploaderItem key={index} index={index}>
                    <Paperclip className='h-4 w-4 stroke-current' />
                    <span>{file.name}</span>
                  </FileUploaderItem>
                ))}
              </FileUploaderContent>
            </FileUploader>
          </FormControl>
          {description && <FormDescription className='flex-0'>{description}</FormDescription>}
          <FormMessage className='flex-0' />
        </FormItem>
      )}
    />
  );
}
