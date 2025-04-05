import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { baseTagSchema, type TagFormValues } from '@/schemas/tag.schema';

// Generic tag interface that works with both BlogTag and SchematicTag
interface TagType {
  $id: string;
  value: string;
  color: string;
}

interface TagSelectorProps<T extends TagType> {
  readonly tags: T[];
  readonly selectedTags?: T[];
  readonly isLoading?: boolean;
  readonly onCreate: (data: TagFormValues) => Promise<T>;
  readonly onDelete: (id: string) => Promise<void>;
  readonly onChange?: (selectedTags: T[]) => void;
  readonly className?: string;
}

export default function TagSelector<T extends TagType>({
  tags = [],
  selectedTags: initialSelectedTags = [],
  isLoading = false,
  onCreate,
  onDelete,
  onChange,
  className,
}: TagSelectorProps<T>) {
  const [selectedTags, setSelectedTags] = useState<T[]>(initialSelectedTags);

  // Use react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TagFormValues>({
    resolver: zodResolver(baseTagSchema),
    defaultValues: {
      value: '',
      color: '#3498db',
    },
  });

  const tagColor = watch('color');

  useEffect(() => {
    setSelectedTags(initialSelectedTags);
  }, [initialSelectedTags]);

  async function handleCreateTag(data: TagFormValues) {
    try {
      const newTag = await onCreate(data);
      toggleTagSelection(newTag);
      reset();
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  }

  async function handleDeleteTag(id: string, e?: React.MouseEvent) {
    e?.stopPropagation();

    try {
      await onDelete(id);

      // Remove from selected tags if present
      setSelectedTags((prev) => {
        const updatedTags = prev.filter((tag) => tag.$id !== id);
        onChange?.(updatedTags);
        return updatedTags;
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  }

  function toggleTagSelection(tag: T) {
    setSelectedTags((prev) => {
      const exists = prev.find((t) => t.$id === tag.$id);
      const updatedTags = exists ? prev.filter((t) => t.$id !== tag.$id) : [...prev, tag];

      onChange?.(updatedTags);
      return updatedTags;
    });
  }

  return (
    <div className={className}>
      <div className='flex flex-row gap-4'>
        <div className='flex-1'>
          <Select
            onValueChange={(value: string) => {
              const tag = tags.find((t) => t.value === value);
              if (tag) toggleTagSelection(tag);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className='cursor-pointer'>
              <SelectValue placeholder={isLoading ? 'Loading tags...' : 'Select tags'} />
            </SelectTrigger>
            <SelectContent className='bg-surface-1'>
              {tags.map((tag) => (
                <SelectItem key={tag.$id} value={tag.value} className='cursor-pointer'>
                  <div className='flex w-full items-center justify-between'>
                    <div className='flex items-center'>
                      <div
                        className='mr-2 h-3 w-3 rounded-full'
                        style={{ backgroundColor: tag.color }}
                      />
                      <span>{tag.value}</span>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={(e) => handleDeleteTag(tag.$id, e)}
                      className='ml-2 h-auto p-1'
                    >
                      ❌
                    </Button>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSubmit(handleCreateTag)} className='flex flex-row gap-2'>
          <div>
            <Input {...register('value')} placeholder='New tag name' className='w-36' />
            {errors.value && (
              <p className='text-destructive mt-1 text-xs'>{errors.value.message}</p>
            )}
          </div>

          <div>
            <Popover>
              <PopoverTrigger
                className='h-10 w-10 rounded border'
                style={{ backgroundColor: tagColor }}
              />
              <PopoverContent className='p-2'>
                <HexColorPicker color={tagColor} onChange={(color) => setValue('color', color)} />
              </PopoverContent>
            </Popover>
            {errors.color && (
              <p className='text-destructive mt-1 text-xs'>{errors.color.message}</p>
            )}
          </div>

          <Button type='submit' className='cursor-pointer' disabled={isSubmitting}>
            <PlusIcon size={16} />
          </Button>
        </form>
      </div>

      {selectedTags.length > 0 && (
        <>
          <h3 className='mt-3 mb-1 text-sm'>Selected Tags:</h3>
          <div className='flex flex-wrap gap-2'>
            {selectedTags.map((tag) => (
              <span
                key={tag.$id}
                className='cursor-pointer rounded px-2 py-1 text-sm'
                style={{
                  backgroundColor: tag.color,
                  color: getBestTextColor(tag.color),
                }}
                onClick={() => toggleTagSelection(tag)}
              >
                {tag.value}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to determine best text color
function getBestTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
  const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
  const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
