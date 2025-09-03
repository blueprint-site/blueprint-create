import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Tag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SchematicFormValues } from '@/types';

// Define categories inline for now - these would ideally come from a constants file or API
const SCHEMATIC_CATEGORIES = [
  'Buildings',
  'Farms',
  'Redstone',
  'Decoration',
  'Transportation',
  'Storage',
  'Utility',
  'Military',
  'Industrial',
  'Magic',
];

const SCHEMATIC_SUB_CATEGORIES = [
  'Compact',
  'Automatic',
  'Semi-Automatic',
  'Manual',
  'Aesthetic',
  'Functional',
  'Survival-Friendly',
  'Creative-Only',
  'Modded',
];

export function StepCategories() {
  const { control } = useFormContext<SchematicFormValues>();

  const categoryOptions = SCHEMATIC_CATEGORIES.map((cat) => ({ label: cat, value: cat }));
  const subCategoryOptions = SCHEMATIC_SUB_CATEGORIES.map((sub) => ({ label: sub, value: sub }));

  return (
    <div className='space-y-6'>
      <div className='mb-6 text-center'>
        <Tag className='text-primary mx-auto mb-4 h-16 w-16 opacity-20' />
        <h3 className='mb-2 text-lg font-semibold'>Categorize Your Build</h3>
        <p className='text-muted-foreground text-sm'>Help others discover your creation</p>
      </div>

      <FormField
        control={control}
        name='categories'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-base font-semibold'>Main Categories</FormLabel>
            <FormDescription>
              Choose one or more categories that best describe your build
            </FormDescription>
            <ScrollArea className='h-32 rounded-md border p-3'>
              <div className='space-y-2'>
                {SCHEMATIC_CATEGORIES.map((category) => (
                  <div key={category} className='flex items-center space-x-2'>
                    <Checkbox
                      checked={field.value?.includes(category)}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        if (checked) {
                          field.onChange([...current, category]);
                        } else {
                          field.onChange(current.filter((c: string) => c !== category));
                        }
                      }}
                    />
                    <label className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='sub_categories'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-base font-semibold'>Sub-Categories</FormLabel>
            <FormDescription>Add more specific tags to refine the categorization</FormDescription>
            <ScrollArea className='h-32 rounded-md border p-3'>
              <div className='space-y-2'>
                {SCHEMATIC_SUB_CATEGORIES.map((subCategory) => (
                  <div key={subCategory} className='flex items-center space-x-2'>
                    <Checkbox
                      checked={field.value?.includes(subCategory)}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        if (checked) {
                          field.onChange([...current, subCategory]);
                        } else {
                          field.onChange(current.filter((s: string) => s !== subCategory));
                        }
                      }}
                    />
                    <label className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                      {subCategory}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
