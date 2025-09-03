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
import { Package } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { SchematicFormValues } from '@/types';
import { MINECRAFT_VERSIONS } from '@/data/minecraftVersions';

export function StepMinecraft() {
  const { control } = useFormContext<SchematicFormValues>();

  // Group versions by major release for better organization
  const latestVersions = MINECRAFT_VERSIONS.slice(0, 5);
  const olderVersions = MINECRAFT_VERSIONS.slice(5);

  return (
    <div className='space-y-6'>
      <div className='mb-6 text-center'>
        <Package className='text-primary mx-auto mb-4 h-16 w-16 opacity-20' />
        <h3 className='mb-2 text-lg font-semibold'>Minecraft Version Compatibility</h3>
        <p className='text-muted-foreground text-sm'>
          Which Minecraft versions does your schematic work with?
        </p>
      </div>

      <FormField
        control={control}
        name='game_versions'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-base font-semibold'>Select Compatible Versions</FormLabel>
            <FormDescription>Choose all versions your schematic works with</FormDescription>

            <div className='space-y-4'>
              <div>
                <p className='mb-2 text-sm font-medium'>Recent Versions</p>
                <div className='grid grid-cols-2 gap-2'>
                  {latestVersions.map((version) => (
                    <div key={version} className='flex items-center space-x-2'>
                      <Checkbox
                        checked={field.value?.includes(version)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          if (checked) {
                            field.onChange([...current, version]);
                          } else {
                            field.onChange(current.filter((v: string) => v !== version));
                          }
                        }}
                      />
                      <label className='text-sm font-medium'>{version}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className='mb-2 text-sm font-medium'>Older Versions</p>
                <ScrollArea className='h-32 rounded-md border p-3'>
                  <div className='grid grid-cols-2 gap-2'>
                    {olderVersions.map((version) => (
                      <div key={version} className='flex items-center space-x-2'>
                        <Checkbox
                          checked={field.value?.includes(version)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              field.onChange([...current, version]);
                            } else {
                              field.onChange(current.filter((v: string) => v !== version));
                            }
                          }}
                        />
                        <label className='text-sm'>{version}</label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />

      <div className='border-primary/20 from-primary/5 to-primary/10 relative mt-6 overflow-hidden rounded-xl border bg-gradient-to-br via-transparent backdrop-blur-sm'>
        <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent'></div>
        <div className='relative p-5'>
          <div className='mb-3 flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-500'></div>
            <h4 className='from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-sm font-semibold text-transparent'>
              Version Tips
            </h4>
          </div>
          <ul className='space-y-2 text-sm'>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>Test your schematic in each version you select</span>
            </li>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>Consider block changes between versions</span>
            </li>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>Newer versions typically have more blocks available</span>
            </li>
          </ul>
        </div>
        <div className='via-primary/30 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent'></div>
      </div>
    </div>
  );
}
