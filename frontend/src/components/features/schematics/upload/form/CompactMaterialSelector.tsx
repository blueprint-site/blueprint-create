import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Package, X, Plus, Search, Sparkles, Hash, CheckCircle2 } from 'lucide-react';
import type { SchematicFormValues } from '@/types';

interface CompactMaterialSelectorProps {
  control: Control<SchematicFormValues>;
  detectedBlocks?: Array<{
    name: string;
    count: number;
    percentage?: number;
  }>;
}

export function CompactMaterialSelector({ control, detectedBlocks }: CompactMaterialSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customMaterial, setCustomMaterial] = useState('');

  // Watch the current materials
  const watchedMaterials =
    useWatch({
      control,
      name: 'materials.primary',
    }) || [];

  // Filter detected blocks based on search
  const filteredBlocks =
    detectedBlocks?.filter((block) =>
      block.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Get top materials from detected blocks
  const topMaterials = detectedBlocks?.slice(0, 10) || [];

  // Format block name for display
  const formatBlockName = (name: string) => {
    // Remove minecraft: prefix and format
    return name
      .replace('minecraft:', '')
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get color based on percentage
  const getBlockColor = (percentage?: number) => {
    if (!percentage) return '';
    if (percentage > 10) return 'bg-primary/20 border-primary/40';
    if (percentage > 5) return 'bg-secondary/20 border-secondary/40';
    if (percentage > 1) return 'bg-muted/50 border-muted';
    return '';
  };

  return (
    <div className='space-y-4'>
      <FormField
        control={control}
        name='materials.primary'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='flex items-center gap-2'>
              <Package className='h-4 w-4' />
              Primary Materials
              {detectedBlocks && detectedBlocks.length > 0 && (
                <Badge variant='secondary' className='gap-1 text-xs'>
                  <Sparkles className='h-3 w-3' />
                  {detectedBlocks.length} blocks detected
                </Badge>
              )}
            </FormLabel>

            {/* Selected Materials Display */}
            <div className='bg-background flex min-h-[40px] flex-wrap gap-2 rounded-lg border p-3'>
              {watchedMaterials.length === 0 ? (
                <span className='text-muted-foreground text-sm'>
                  No materials selected - click blocks below to add
                </span>
              ) : (
                watchedMaterials.map((material) => (
                  <Badge key={material} variant='secondary' className='gap-1 pr-1'>
                    {formatBlockName(material)}
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='h-4 w-4 p-0 hover:bg-transparent'
                      onClick={() => {
                        const newMaterials = watchedMaterials.filter((m) => m !== material);
                        field.onChange(newMaterials);
                      }}
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  </Badge>
                ))
              )}
            </div>

            {/* Detected Blocks Palette */}
            {detectedBlocks && detectedBlocks.length > 0 && (
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <FormDescription>Click blocks to add them as primary materials</FormDescription>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type='button' variant='outline' size='sm'>
                        <Search className='mr-1 h-3 w-3' />
                        View All ({detectedBlocks.length})
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-96' align='end'>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
                          <Search className='text-muted-foreground h-4 w-4' />
                          <Input
                            placeholder='Search blocks...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='h-8'
                          />
                        </div>

                        <ScrollArea className='h-72'>
                          <div className='grid grid-cols-2 gap-2 pr-4'>
                            {filteredBlocks.map((block) => {
                              const isSelected = watchedMaterials.includes(block.name);
                              return (
                                <Button
                                  key={block.name}
                                  type='button'
                                  variant={isSelected ? 'default' : 'outline'}
                                  size='sm'
                                  className={`justify-between text-xs ${!isSelected && getBlockColor(block.percentage)}`}
                                  onClick={() => {
                                    if (isSelected) {
                                      field.onChange(
                                        watchedMaterials.filter((m) => m !== block.name)
                                      );
                                    } else {
                                      field.onChange([...watchedMaterials, block.name]);
                                    }
                                  }}
                                >
                                  <span className='mr-1 truncate'>
                                    {formatBlockName(block.name)}
                                  </span>
                                  <Badge variant='secondary' className='px-1 text-[10px]'>
                                    {block.count}
                                  </Badge>
                                </Button>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Top Materials Quick Select */}
                <div className='bg-muted/30 space-y-2 rounded-lg p-3'>
                  <div className='text-muted-foreground flex items-center gap-1 text-xs font-medium'>
                    <Hash className='h-3 w-3' />
                    Most Used Blocks
                  </div>
                  <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                    {topMaterials.map((block) => {
                      const isSelected = watchedMaterials.includes(block.name);
                      const percentage =
                        block.percentage || (block.count / (detectedBlocks[0]?.count || 1)) * 100;

                      return (
                        <Button
                          key={block.name}
                          type='button'
                          variant={isSelected ? 'default' : 'outline'}
                          size='sm'
                          className={`h-auto justify-between px-2 py-2 text-xs ${!isSelected && getBlockColor(percentage)}`}
                          onClick={() => {
                            if (isSelected) {
                              field.onChange(watchedMaterials.filter((m) => m !== block.name));
                            } else {
                              field.onChange([...watchedMaterials, block.name]);
                            }
                          }}
                        >
                          <div className='flex w-full flex-col items-start'>
                            <span className='w-full truncate text-left font-medium'>
                              {formatBlockName(block.name)}
                            </span>
                            <div className='text-muted-foreground flex items-center gap-1 text-[10px]'>
                              <span>{block.count} blocks</span>
                              {percentage > 0 && <span>({percentage.toFixed(1)}%)</span>}
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className='ml-1 h-3 w-3 shrink-0' />}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Material Input */}
            <div className='flex gap-2'>
              <Input
                placeholder='Add custom material...'
                value={customMaterial}
                onChange={(e) => setCustomMaterial(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customMaterial.trim()) {
                    e.preventDefault();
                    const material = customMaterial.trim().toLowerCase();
                    if (!watchedMaterials.includes(material)) {
                      field.onChange([...watchedMaterials, material]);
                    }
                    setCustomMaterial('');
                  }
                }}
                className='flex-1'
              />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => {
                  if (customMaterial.trim()) {
                    const material = customMaterial.trim().toLowerCase();
                    if (!watchedMaterials.includes(material)) {
                      field.onChange([...watchedMaterials, material]);
                    }
                    setCustomMaterial('');
                  }
                }}
                disabled={!customMaterial.trim()}
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
