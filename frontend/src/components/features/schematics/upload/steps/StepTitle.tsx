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
import { Input } from '@/components/ui/input';
import { PenTool } from 'lucide-react';
import type { SchematicFormValues } from '@/types';

export function StepTitle() {
  const { control, watch } = useFormContext<SchematicFormValues>();
  const title = watch('title') || '';

  return (
    <div className='space-y-6'>
      <div className='mb-6 text-center'>
        <PenTool className='text-primary mx-auto mb-4 h-16 w-16 opacity-20' />
        <h3 className='mb-2 text-lg font-semibold'>Give Your Creation a Name</h3>
        <p className='text-muted-foreground text-sm'>Choose a descriptive and memorable title</p>
      </div>

      <FormField
        control={control}
        name='title'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-base font-semibold'>Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder='e.g., Medieval Castle with Working Drawbridge'
                className='h-12 text-lg'
                maxLength={100}
              />
            </FormControl>
            <FormDescription className='flex justify-between'>
              <span>Make it descriptive and easy to find</span>
              <span className='text-xs'>{title.length}/100</span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='border-primary/20 from-primary/5 to-primary/10 relative mt-6 overflow-hidden rounded-xl border bg-gradient-to-br via-transparent backdrop-blur-sm'>
        <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent'></div>
        <div className='relative p-5'>
          <div className='mb-3 flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500'></div>
            <h4 className='from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-sm font-semibold text-transparent'>
              Good Title Examples
            </h4>
          </div>
          <ul className='space-y-2 text-sm'>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>"Steampunk Factory with Automated Production Line"</span>
            </li>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>"Japanese Temple Garden with Koi Pond"</span>
            </li>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>"Compact 5x5 Piston Door Design"</span>
            </li>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>"Fantasy Wizard Tower with Magic Effects"</span>
            </li>
          </ul>
        </div>
        <div className='via-primary/30 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent'></div>
      </div>
    </div>
  );
}
