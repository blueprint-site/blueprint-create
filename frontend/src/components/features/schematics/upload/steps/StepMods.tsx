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
import { Puzzle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SchematicFormValues } from '@/types';
import { CREATE_VERSIONS } from '@/data/createVersions';

const MOD_LOADERS = ['forge', 'fabric', 'neoforge', 'quilt'];

export function StepMods() {
  const { control } = useFormContext<SchematicFormValues>();

  return (
    <div className='space-y-6'>
      <div className='mb-6 text-center'>
        <Puzzle className='text-primary mx-auto mb-4 h-16 w-16 opacity-20' />
        <h3 className='mb-2 text-lg font-semibold'>Mod Compatibility</h3>
        <p className='text-muted-foreground text-sm'>Select Create Mod versions and mod loaders</p>
      </div>

      <FormField
        control={control}
        name='create_versions'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-base font-semibold'>Create Mod Versions</FormLabel>
            <FormDescription>Choose compatible Create Mod versions</FormDescription>
            <ScrollArea className='h-32 rounded-md border p-3'>
              <div className='grid grid-cols-2 gap-2'>
                {CREATE_VERSIONS.map((versionInfo) => (
                  <div key={versionInfo.version} className='flex items-center space-x-2'>
                    <Checkbox
                      checked={field.value?.includes(versionInfo.version)}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        if (checked) {
                          field.onChange([...current, versionInfo.version]);
                        } else {
                          field.onChange(current.filter((v: string) => v !== versionInfo.version));
                        }
                      }}
                    />
                    <label className='text-sm'>{versionInfo.version}</label>
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
        name='modloaders'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-base font-semibold'>Mod Loaders</FormLabel>
            <FormDescription>Select which mod loaders your schematic works with</FormDescription>
            <div className='grid grid-cols-2 gap-3'>
              {MOD_LOADERS.map((loader) => (
                <div key={loader} className='flex items-center space-x-2'>
                  <Checkbox
                    checked={field.value?.includes(loader)}
                    onCheckedChange={(checked) => {
                      const current = field.value || [];
                      if (checked) {
                        field.onChange([...current, loader]);
                      } else {
                        field.onChange(current.filter((l: string) => l !== loader));
                      }
                    }}
                  />
                  <label className='text-sm font-medium'>
                    {loader.charAt(0).toUpperCase() + loader.slice(1)}
                  </label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
