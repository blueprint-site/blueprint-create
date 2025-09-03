import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import MarkdownEditor from '@/components/utility/MarkdownEditor';
import { FileText } from 'lucide-react';
import type { SchematicFormValues } from '@/types';

export function StepDescription() {
  const { control, setValue, watch } = useFormContext<SchematicFormValues>();
  const description = watch('description') || '';

  return (
    <div className='space-y-6'>
      <div className='mb-6 text-center'>
        <FileText className='text-primary mx-auto mb-4 h-16 w-16 opacity-20' />
        <h3 className='mb-2 text-lg font-semibold'>Describe Your Creation</h3>
        <p className='text-muted-foreground text-sm'>Tell others what makes your build special</p>
      </div>

      <FormField
        control={control}
        name='description'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-base font-semibold'>Description</FormLabel>
            <FormControl>
              <div className='rounded-lg border'>
                <MarkdownEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder='Describe your creation, its features, how to use it, and any special requirements...'
                  className='min-h-[250px]'
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='border-primary/20 from-primary/5 to-primary/10 relative mt-6 overflow-hidden rounded-xl border bg-gradient-to-br via-transparent backdrop-blur-sm'>
        <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent'></div>
        <div className='relative p-5'>
          <div className='mb-3 flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500'></div>
            <h4 className='from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-sm font-semibold text-transparent'>
              What to Include
            </h4>
          </div>
          <ul className='space-y-2 text-sm'>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>Main features and functionality</span>
            </li>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>Any redstone or technical mechanisms</span>
            </li>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>Required resources or setup instructions</span>
            </li>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>Inspiration or backstory</span>
            </li>
          </ul>
        </div>
        <div className='via-primary/30 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent'></div>
      </div>
    </div>
  );
}
