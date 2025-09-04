import React, { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/config/utils';
import {
  Ruler,
  Box,
  Clock,
  Layers,
  Package,
  Zap,
  Terminal,
  Blocks,
  Info,
  Plus,
  X,
  ChevronDown,
  Check,
  Gauge,
  Sparkles,
  AlertCircle,
  Wrench,
  Hammer,
  ChevronRight,
} from 'lucide-react';
import type { SchematicFormValues } from '@/types';

// Common Minecraft materials
const COMMON_MATERIALS = [
  // Building blocks
  'Stone',
  'Cobblestone',
  'Deepslate',
  'Stone Bricks',
  'Andesite',
  'Diorite',
  'Granite',
  'Oak Wood',
  'Spruce Wood',
  'Birch Wood',
  'Jungle Wood',
  'Acacia Wood',
  'Dark Oak Wood',
  'Oak Planks',
  'Spruce Planks',
  'Birch Planks',
  'Jungle Planks',
  'Acacia Planks',
  'Dark Oak Planks',
  'Bricks',
  'Nether Bricks',
  'Sandstone',
  'Quartz',
  'Concrete',
  'Terracotta',
  'Glass',
  'Glass Pane',
  'Iron Block',
  'Gold Block',
  'Diamond Block',

  // Natural blocks
  'Dirt',
  'Grass Block',
  'Sand',
  'Gravel',
  'Clay',
  'Moss Block',

  // Decoration blocks
  'Wool',
  'Carpet',
  'Lantern',
  'Torch',
  'Glowstone',
  'Sea Lantern',

  // Technical blocks
  'Redstone',
  'Redstone Block',
  'Piston',
  'Sticky Piston',
  'Observer',
  'Hopper',
  'Dropper',
  'Dispenser',
  'Comparator',
  'Repeater',
  'Rails',
  'Powered Rails',
];

// Popular mods for required mods selection
const POPULAR_MODS = [
  { id: 'create', name: 'Create', icon: '⚙️' },
  { id: 'flywheel', name: 'Flywheel', icon: '🎯' },
  { id: 'jei', name: 'JEI (Just Enough Items)', icon: '📦' },
  { id: 'worldedit', name: 'WorldEdit', icon: '🌍' },
  { id: 'optifine', name: 'OptiFine', icon: '👁️' },
  { id: 'sodium', name: 'Sodium', icon: '⚡' },
  { id: 'iris', name: 'Iris Shaders', icon: '🌈' },
  { id: 'litematica', name: 'Litematica', icon: '📐' },
  { id: 'schematica', name: 'Schematica', icon: '📋' },
  { id: 'chisel', name: 'Chisel', icon: '🔨' },
  { id: 'quark', name: 'Quark', icon: '✨' },
  { id: 'biomes-o-plenty', name: "Biomes O' Plenty", icon: '🌲' },
];

// Complexity levels with descriptions
const COMPLEXITY_LEVELS = [
  {
    value: 'simple',
    label: 'Simple',
    description: 'Basic structures, easy to build',
    icon: '🟢',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Some complexity, requires attention',
    icon: '🟡',
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    value: 'complex',
    label: 'Complex',
    description: 'Detailed builds, advanced techniques',
    icon: '🟠',
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    value: 'extreme',
    label: 'Extreme',
    description: 'Very challenging, expert level',
    icon: '🔴',
    color: 'text-red-600 dark:text-red-400',
  },
];

export const StepTechnicalDetails: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SchematicFormValues>();
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [modsOpen, setModsOpen] = useState(false);
  const [customMaterial, setCustomMaterial] = useState('');
  const [customMod, setCustomMod] = useState('');

  // Watch form values
  const watchedMaterialsObject = watch('materials') || {};
  const watchedMaterials = watchedMaterialsObject.primary || [];
  const watchedRequiredMods = watch('requiredMods') || [];
  const watchedWidth = watch('width');
  const watchedHeight = watch('height');
  const watchedDepth = watch('depth');
  const watchedTotalBlocks = watch('totalBlocks');
  const watchedComplexityLevel = watch('complexityLevel');
  const watchedEstimatedBuildTime = watch('estimatedBuildTime');
  const watchedHasRedstone = watch('hasRedstone') || false;
  const watchedHasCommandBlocks = watch('hasCommandBlocks') || false;
  const watchedHasModdedBlocks = watch('hasModdedBlocks') || false;

  // Handle material selection
  const handleMaterialToggle = (material: string) => {
    const currentMaterials = watchedMaterials;
    const isSelected = currentMaterials.includes(material);

    let newMaterials;
    if (isSelected) {
      newMaterials = currentMaterials.filter((m) => m !== material);
    } else {
      newMaterials = [...currentMaterials, material];
    }

    setValue('materials', {
      ...watchedMaterialsObject,
      primary: newMaterials,
    });
  };

  // Add custom material
  const handleAddCustomMaterial = () => {
    if (customMaterial && !watchedMaterials.includes(customMaterial)) {
      setValue('materials', {
        ...watchedMaterialsObject,
        primary: [...watchedMaterials, customMaterial],
      });
      setCustomMaterial('');
    }
  };

  // Handle required mod selection
  const handleModToggle = (mod: string) => {
    const currentMods = watchedRequiredMods;
    const isSelected = currentMods.includes(mod);

    let newMods;
    if (isSelected) {
      newMods = currentMods.filter((m) => m !== mod);
    } else {
      newMods = [...currentMods, mod];
    }

    setValue('requiredMods', newMods);
  };

  // Add custom mod
  const handleAddCustomMod = () => {
    if (customMod && !watchedRequiredMods.includes(customMod)) {
      setValue('requiredMods', [...watchedRequiredMods, customMod]);
      setCustomMod('');
    }
  };

  // Calculate total volume
  const totalVolume =
    watchedWidth && watchedHeight && watchedDepth
      ? watchedWidth * watchedHeight * watchedDepth
      : null;

  // Estimate complexity based on dimensions and features
  const suggestedComplexity = useCallback(() => {
    if (!watchedTotalBlocks) return null;

    const hasAdvancedFeatures =
      watchedHasRedstone || watchedHasCommandBlocks || watchedHasModdedBlocks;

    if (watchedTotalBlocks < 1000 && !hasAdvancedFeatures) return 'simple';
    if (watchedTotalBlocks < 5000 || (watchedTotalBlocks < 10000 && !hasAdvancedFeatures))
      return 'moderate';
    if (watchedTotalBlocks < 20000 || hasAdvancedFeatures) return 'complex';
    return 'extreme';
  }, [watchedTotalBlocks, watchedHasRedstone, watchedHasCommandBlocks, watchedHasModdedBlocks]);

  return (
    <div className='space-y-6'>
      {/* Help Alert */}
      <Alert>
        <Info className='h-4 w-4' />
        <AlertTitle>Technical Specifications</AlertTitle>
        <AlertDescription>
          Provide technical details about your schematic. This helps users understand the
          requirements and complexity before downloading.
        </AlertDescription>
      </Alert>

      {/* Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Ruler className='h-5 w-5' />
            Dimensions
          </CardTitle>
          <CardDescription>Specify the size of your schematic in blocks</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <Label htmlFor='width' className='flex items-center gap-2'>
                Width <span className='text-muted-foreground text-xs'>(X axis)</span>
              </Label>
              <Input
                id='width'
                type='number'
                placeholder='e.g., 50'
                {...register('width', { valueAsNumber: true })}
                className={cn(errors.width && 'border-destructive')}
              />
              {errors.width && <p className='text-destructive text-sm'>{errors.width.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='height' className='flex items-center gap-2'>
                Height <span className='text-muted-foreground text-xs'>(Y axis)</span>
              </Label>
              <Input
                id='height'
                type='number'
                placeholder='e.g., 30'
                {...register('height', { valueAsNumber: true })}
                className={cn(errors.height && 'border-destructive')}
              />
              {errors.height && <p className='text-destructive text-sm'>{errors.height.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='depth' className='flex items-center gap-2'>
                Depth <span className='text-muted-foreground text-xs'>(Z axis)</span>
              </Label>
              <Input
                id='depth'
                type='number'
                placeholder='e.g., 40'
                {...register('depth', { valueAsNumber: true })}
                className={cn(errors.depth && 'border-destructive')}
              />
              {errors.depth && <p className='text-destructive text-sm'>{errors.depth.message}</p>}
            </div>
          </div>

          {totalVolume && (
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <Box className='h-4 w-4' />
              <span>Total volume: {totalVolume.toLocaleString()} blocks³</span>
            </div>
          )}

          <Separator />

          <div className='space-y-2'>
            <Label htmlFor='totalBlocks' className='flex items-center gap-2'>
              <Blocks className='h-4 w-4' />
              Total Block Count
            </Label>
            <Input
              id='totalBlocks'
              type='number'
              placeholder='e.g., 15000'
              {...register('totalBlocks', { valueAsNumber: true })}
              className={cn(errors.totalBlocks && 'border-destructive')}
            />
            <p className='text-muted-foreground text-xs'>
              The total number of blocks used in the schematic
            </p>
            {errors.totalBlocks && (
              <p className='text-destructive text-sm'>{errors.totalBlocks.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Materials */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Layers className='h-5 w-5' />
            Primary Materials
          </CardTitle>
          <CardDescription>List the main materials used in this schematic</CardDescription>
        </CardHeader>
        <CardContent>
          <Popover open={materialsOpen} onOpenChange={setMaterialsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={materialsOpen}
                className='w-full justify-between'
              >
                <span className='truncate'>
                  {watchedMaterials.length === 0
                    ? 'Select materials...'
                    : `${watchedMaterials.length} materials selected`}
                </span>
                <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0' align='start'>
              <Command>
                <div className='flex items-center border-b px-3'>
                  <CommandInput placeholder='Search materials...' className='border-0' />
                </div>
                <CommandList>
                  <CommandEmpty>
                    <div className='p-4 text-center text-sm'>
                      <p className='mb-2'>No material found.</p>
                      <div className='flex items-center gap-2'>
                        <Input
                          value={customMaterial}
                          onChange={(e) => setCustomMaterial(e.target.value)}
                          placeholder='Add custom material'
                          className='flex-1'
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomMaterial();
                            }
                          }}
                        />
                        <Button
                          size='sm'
                          onClick={handleAddCustomMaterial}
                          disabled={!customMaterial}
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CommandEmpty>
                  <CommandGroup heading='Common Materials'>
                    {COMMON_MATERIALS.map((material) => (
                      <CommandItem
                        key={material}
                        onSelect={() => handleMaterialToggle(material)}
                        className='cursor-pointer'
                      >
                        <div
                          className={cn(
                            'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                            watchedMaterials.includes(material)
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <Check className='h-4 w-4' />
                        </div>
                        {material}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {watchedMaterials.filter((m) => !COMMON_MATERIALS.includes(m)).length > 0 && (
                    <CommandGroup heading='Custom Materials'>
                      {watchedMaterials
                        .filter((m) => !COMMON_MATERIALS.includes(m))
                        .map((material) => (
                          <CommandItem
                            key={material}
                            onSelect={() => handleMaterialToggle(material)}
                            className='cursor-pointer'
                          >
                            <div
                              className={cn(
                                'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                'bg-primary text-primary-foreground'
                              )}
                            >
                              <Check className='h-4 w-4' />
                            </div>
                            {material}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Selected Materials Display */}
          {watchedMaterials.length > 0 && (
            <ScrollArea className='mt-3 h-24 w-full'>
              <div className='flex flex-wrap gap-2'>
                {watchedMaterials.map((material) => (
                  <Badge key={material} variant='secondary' className='py-1 pr-1 pl-2.5'>
                    {material}
                    <button
                      type='button'
                      onClick={() => handleMaterialToggle(material)}
                      className='hover:bg-destructive/20 ml-1.5 rounded-full p-0.5'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Complexity & Build Time */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Gauge className='h-5 w-5' />
            Complexity & Build Time
          </CardTitle>
          <CardDescription>
            Help users understand the difficulty and time investment
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='complexity'>Complexity Level</Label>
            <Select
              value={watchedComplexityLevel}
              onValueChange={(value) => setValue('complexityLevel', value as any)}
            >
              <SelectTrigger id='complexity'>
                <SelectValue placeholder='Select complexity level' />
              </SelectTrigger>
              <SelectContent>
                {COMPLEXITY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className='flex items-center gap-2'>
                      <span>{level.icon}</span>
                      <span className={level.color}>{level.label}</span>
                      <span className='text-muted-foreground text-xs'>- {level.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {suggestedComplexity() && suggestedComplexity() !== watchedComplexityLevel && (
              <p className='text-muted-foreground flex items-center gap-1 text-xs'>
                <Sparkles className='h-3 w-3' />
                Suggested based on size and features: {suggestedComplexity()}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='buildTime' className='flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              Estimated Build Time (hours)
            </Label>
            <Input
              id='buildTime'
              type='number'
              step='0.5'
              placeholder='e.g., 2.5'
              {...register('estimatedBuildTime', { valueAsNumber: true })}
              className={cn(errors.estimatedBuildTime && 'border-destructive')}
            />
            <p className='text-muted-foreground text-xs'>
              Approximate time for an average player to build this schematic
            </p>
            {errors.estimatedBuildTime && (
              <p className='text-destructive text-sm'>{errors.estimatedBuildTime.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Wrench className='h-5 w-5' />
            Technical Features
          </CardTitle>
          <CardDescription>Specify any special features or requirements</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div className='flex items-center gap-3'>
                <Zap className='h-5 w-5 text-red-500' />
                <div>
                  <Label htmlFor='redstone' className='cursor-pointer text-base'>
                    Contains Redstone
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    This build includes redstone circuits or mechanisms
                  </p>
                </div>
              </div>
              <Switch
                id='redstone'
                checked={watchedHasRedstone}
                onCheckedChange={(checked) => setValue('hasRedstone', checked)}
              />
            </div>

            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div className='flex items-center gap-3'>
                <Terminal className='h-5 w-5 text-purple-500' />
                <div>
                  <Label htmlFor='commandBlocks' className='cursor-pointer text-base'>
                    Uses Command Blocks
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    This build requires command blocks to function
                  </p>
                </div>
              </div>
              <Switch
                id='commandBlocks'
                checked={watchedHasCommandBlocks}
                onCheckedChange={(checked) => setValue('hasCommandBlocks', checked)}
              />
            </div>

            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div className='flex items-center gap-3'>
                <Package className='h-5 w-5 text-blue-500' />
                <div>
                  <Label htmlFor='moddedBlocks' className='cursor-pointer text-base'>
                    Contains Modded Blocks
                  </Label>
                  <p className='text-muted-foreground text-xs'>This build uses blocks from mods</p>
                </div>
              </div>
              <Switch
                id='moddedBlocks'
                checked={watchedHasModdedBlocks}
                onCheckedChange={(checked) => setValue('hasModdedBlocks', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Mods (shown if modded blocks is enabled) */}
      {watchedHasModdedBlocks && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Package className='h-5 w-5' />
              Required Mods
            </CardTitle>
            <CardDescription>Specify which mods are required to use this schematic</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover open={modsOpen} onOpenChange={setModsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={modsOpen}
                  className='w-full justify-between'
                >
                  <span className='truncate'>
                    {watchedRequiredMods.length === 0
                      ? 'Select required mods...'
                      : `${watchedRequiredMods.length} mods required`}
                  </span>
                  <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0' align='start'>
                <Command>
                  <div className='flex items-center border-b px-3'>
                    <CommandInput placeholder='Search mods...' className='border-0' />
                  </div>
                  <CommandList>
                    <CommandEmpty>
                      <div className='p-4 text-center text-sm'>
                        <p className='mb-2'>No mod found.</p>
                        <div className='flex items-center gap-2'>
                          <Input
                            value={customMod}
                            onChange={(e) => setCustomMod(e.target.value)}
                            placeholder='Add custom mod'
                            className='flex-1'
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomMod();
                              }
                            }}
                          />
                          <Button size='sm' onClick={handleAddCustomMod} disabled={!customMod}>
                            <Plus className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </CommandEmpty>
                    <CommandGroup heading='Popular Mods'>
                      {POPULAR_MODS.map((mod) => (
                        <CommandItem
                          key={mod.id}
                          onSelect={() => handleModToggle(mod.name)}
                          className='cursor-pointer'
                        >
                          <div
                            className={cn(
                              'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                              watchedRequiredMods.includes(mod.name)
                                ? 'bg-primary text-primary-foreground'
                                : 'opacity-50 [&_svg]:invisible'
                            )}
                          >
                            <Check className='h-4 w-4' />
                          </div>
                          <span className='mr-2'>{mod.icon}</span>
                          {mod.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {watchedRequiredMods.filter((m) => !POPULAR_MODS.find((pm) => pm.name === m))
                      .length > 0 && (
                      <CommandGroup heading='Custom Mods'>
                        {watchedRequiredMods
                          .filter((m) => !POPULAR_MODS.find((pm) => pm.name === m))
                          .map((mod) => (
                            <CommandItem
                              key={mod}
                              onSelect={() => handleModToggle(mod)}
                              className='cursor-pointer'
                            >
                              <div
                                className={cn(
                                  'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                  'bg-primary text-primary-foreground'
                                )}
                              >
                                <Check className='h-4 w-4' />
                              </div>
                              {mod}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected Mods Display */}
            {watchedRequiredMods.length > 0 && (
              <ScrollArea className='mt-3 h-24 w-full'>
                <div className='flex flex-wrap gap-2'>
                  {watchedRequiredMods.map((mod) => {
                    const modInfo = POPULAR_MODS.find((m) => m.name === mod);
                    return (
                      <Badge key={mod} variant='secondary' className='py-1 pr-1 pl-2.5'>
                        {modInfo && <span className='mr-1'>{modInfo.icon}</span>}
                        {mod}
                        <button
                          type='button'
                          onClick={() => handleModToggle(mod)}
                          className='hover:bg-destructive/20 ml-1.5 rounded-full p-0.5'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {/* Additional Tips */}
      <Alert>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Tips for Technical Details</AlertTitle>
        <AlertDescription className='space-y-1'>
          <p>• Accurate dimensions help users plan space requirements</p>
          <p>• List primary materials to help with resource gathering</p>
          <p>• Be honest about complexity to set proper expectations</p>
          <p>• Include all required mods to avoid compatibility issues</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};
