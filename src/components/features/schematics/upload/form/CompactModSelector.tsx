import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Cpu, X, Plus, Sparkles, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import type { SchematicFormValues } from '@/types';

interface CompactModSelectorProps {
  control: Control<SchematicFormValues>;
  detectedMods?: string[];
  suggestedMods?: string[];
}

const POPULAR_MODS = [
  { name: 'Create', description: 'Contraptions & Automation' },
  { name: 'Create: Steam n Rails', description: 'Trains & Railways' },
  { name: 'Create: Stuff & Additions', description: 'Additional blocks' },
  { name: 'Create: Crafts & Additions', description: 'Electric power' },
  { name: 'Create: Deco', description: 'Decorative blocks' },
  { name: 'Supplementaries', description: 'Decoration & QoL' },
  { name: 'Quark', description: 'Vanilla+ improvements' },
  { name: 'Farmers Delight', description: 'Cooking & farming' },
  { name: 'Decorative Blocks', description: 'Building blocks' },
  { name: 'Chipped', description: 'Block variants' },
];

export function CompactModSelector({
  control,
  detectedMods = [],
  suggestedMods: _suggestedMods = [],
}: CompactModSelectorProps) {
  const [customMod, setCustomMod] = useState('');
  const [showAllMods, setShowAllMods] = useState(false);

  // Watch the current mods
  const watchedMods =
    useWatch({
      control,
      name: 'requirements.mods',
    }) || [];

  const watchedDetectedMods =
    useWatch({
      control,
      name: 'requirements.modsDetected',
    }) || [];

  // Combine detected and suggested mods
  const allDetectedMods = [...new Set([...detectedMods, ...watchedDetectedMods])];
  const hasAutoDetection = allDetectedMods.length > 0;

  // Categorize mods
  const categorizedMods = {
    required: watchedMods,
    detected: allDetectedMods.filter((mod) => !watchedMods.includes(mod)),
    popular: POPULAR_MODS.filter(
      (mod) => !watchedMods.includes(mod.name) && !allDetectedMods.includes(mod.name)
    ),
  };

  const visiblePopularMods = showAllMods
    ? categorizedMods.popular
    : categorizedMods.popular.slice(0, 6);

  return (
    <div className='space-y-4'>
      <FormField
        control={control}
        name='requirements.mods'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='flex items-center gap-2'>
              <Cpu className='h-4 w-4' />
              Required Mods
              {hasAutoDetection && (
                <Badge variant='secondary' className='gap-1 text-xs'>
                  <Sparkles className='h-3 w-3' />
                  {allDetectedMods.length} auto-detected
                </Badge>
              )}
            </FormLabel>

            {/* Selected Mods Display */}
            <div className='bg-background flex min-h-[40px] flex-wrap gap-2 rounded-lg border p-3'>
              {watchedMods.length === 0 ? (
                <span className='text-muted-foreground text-sm'>
                  No mods required - vanilla schematic
                </span>
              ) : (
                watchedMods.map((mod) => {
                  const isDetected = allDetectedMods.includes(mod);
                  return (
                    <Badge
                      key={mod}
                      variant={isDetected ? 'default' : 'secondary'}
                      className='gap-1 pr-1'
                    >
                      {isDetected && <CheckCircle2 className='h-3 w-3' />}
                      {mod}
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='ml-1 h-4 w-4 p-0 hover:bg-transparent'
                        onClick={() => {
                          const newMods = watchedMods.filter((m) => m !== mod);
                          field.onChange(newMods);
                        }}
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </Badge>
                  );
                })
              )}
            </div>

            {/* Auto-detected Mods Alert */}
            {categorizedMods.detected.length > 0 && (
              <Alert className='border-primary/20 bg-primary/5'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription className='space-y-2'>
                  <div className='text-sm font-medium'>
                    Detected mods not yet added to requirements:
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {categorizedMods.detected.map((mod) => (
                      <Button
                        key={mod}
                        type='button'
                        variant='outline'
                        size='sm'
                        className='h-7 gap-1 text-xs'
                        onClick={() => {
                          field.onChange([...watchedMods, mod]);
                        }}
                      >
                        <Plus className='h-3 w-3' />
                        Add {mod}
                      </Button>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Popular Mods Grid */}
            <div className='space-y-3'>
              <FormDescription className='flex items-center gap-1'>
                <Info className='h-3 w-3' />
                Click to add popular Create-compatible mods
              </FormDescription>

              <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                {visiblePopularMods.map((mod) => {
                  const isSelected = watchedMods.includes(mod.name);

                  return (
                    <Button
                      key={mod.name}
                      type='button'
                      variant={isSelected ? 'default' : 'outline'}
                      size='sm'
                      className='h-auto justify-start px-3 py-2'
                      onClick={() => {
                        if (isSelected) {
                          field.onChange(watchedMods.filter((m) => m !== mod.name));
                        } else {
                          field.onChange([...watchedMods, mod.name]);
                        }
                      }}
                    >
                      <div className='flex flex-col items-start text-left'>
                        <span className='text-xs font-medium'>{mod.name}</span>
                        <span className='text-muted-foreground text-[10px]'>{mod.description}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {categorizedMods.popular.length > 6 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-7 w-full text-xs'
                  onClick={() => setShowAllMods(!showAllMods)}
                >
                  {showAllMods ? 'Show Less' : `Show ${categorizedMods.popular.length - 6} More`}
                </Button>
              )}
            </div>

            {/* Custom Mod Input */}
            <div className='flex gap-2'>
              <Input
                placeholder='Add custom mod name...'
                value={customMod}
                onChange={(e) => setCustomMod(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customMod.trim()) {
                    e.preventDefault();
                    const mod = customMod.trim();
                    if (!watchedMods.includes(mod)) {
                      field.onChange([...watchedMods, mod]);
                    }
                    setCustomMod('');
                  }
                }}
                className='flex-1'
              />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => {
                  if (customMod.trim()) {
                    const mod = customMod.trim();
                    if (!watchedMods.includes(mod)) {
                      field.onChange([...watchedMods, mod]);
                    }
                    setCustomMod('');
                  }
                }}
                disabled={!customMod.trim()}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
