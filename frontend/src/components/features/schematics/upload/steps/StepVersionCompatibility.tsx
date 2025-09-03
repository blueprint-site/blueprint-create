import React, { useState, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/config/utils';
import {
  Package,
  Gamepad2,
  Info,
  Check,
  X,
  Layers,
  Cpu,
  CheckCircle2,
  CircleX,
  Sparkles,
} from 'lucide-react';
import { MINECRAFT_VERSIONS } from '@/data/minecraftVersions';
import { CREATE_VERSIONS, MINECRAFT_TO_CREATE_VERSIONS } from '@/data/createVersions';
import type { SchematicFormValues } from '@/types';

type ModLoader = 'forge' | 'fabric' | 'neoforge' | 'quilt';

interface VersionGroup {
  label: string;
  versions: string[];
  icon?: React.ReactNode;
  recommended?: boolean;
}

export const StepVersionCompatibility: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SchematicFormValues>();

  // Watch form values
  const watchedMinecraftVersions = watch('game_versions') || [];
  const watchedCreateVersions = watch('create_versions') || [];
  const watchedModloaders = watch('modloaders') || [];

  // State for select all
  const [selectAllMinecraft, setSelectAllMinecraft] = useState(false);
  const [selectAllCreate, setSelectAllCreate] = useState(false);

  // Group Minecraft versions by major version
  const minecraftVersionGroups = useMemo<VersionGroup[]>(() => {
    const groups: { [key: string]: string[] } = {};

    MINECRAFT_VERSIONS.filter((v) => v.value !== 'All').forEach((version) => {
      const majorVersion = version.value.substring(0, 4); // e.g., "1.20" from "1.20.1"
      if (!groups[majorVersion]) {
        groups[majorVersion] = [];
      }
      groups[majorVersion].push(version.value);
    });

    return Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0])) // Sort newest first
      .map(([major, versions]) => ({
        label: `Minecraft ${major}.x`,
        versions,
        icon: <Gamepad2 className='h-4 w-4' />,
        recommended: major === '1.20' || major === '1.21',
      }));
  }, []);

  // Get available Create versions based on selected Minecraft versions
  const availableCreateVersions = useMemo(() => {
    const createVersionSet = new Set<string>();

    watchedMinecraftVersions.forEach((mcVersion) => {
      const compatibleVersions = MINECRAFT_TO_CREATE_VERSIONS[mcVersion];
      if (compatibleVersions) {
        compatibleVersions.forEach((v) => createVersionSet.add(v));
      }
    });

    return Array.from(createVersionSet).sort((a, b) => {
      const aVersion = CREATE_VERSIONS[a];
      const bVersion = CREATE_VERSIONS[b];
      return (aVersion?.sortOrder || 999) - (bVersion?.sortOrder || 999);
    });
  }, [watchedMinecraftVersions]);

  // Get available modloaders based on selected Minecraft versions
  const availableModloaders = useMemo(() => {
    const modloaderSet = new Set<ModLoader>();

    if (watchedMinecraftVersions.length === 0) {
      // If no versions selected, show all modloaders
      return ['forge', 'fabric', 'neoforge', 'quilt'] as ModLoader[];
    }

    watchedMinecraftVersions.forEach((mcVersion) => {
      const version = MINECRAFT_VERSIONS.find((v) => v.value === mcVersion);
      if (version?.metadata.compatibility) {
        version.metadata.compatibility.forEach((loader) => {
          modloaderSet.add(loader as ModLoader);
        });
      }
    });

    return Array.from(modloaderSet);
  }, [watchedMinecraftVersions]);

  // Handle Minecraft version toggle
  const handleMinecraftVersionToggle = (version: string) => {
    const currentVersions = watchedMinecraftVersions;
    const isSelected = currentVersions.includes(version);

    let newVersions;
    if (isSelected) {
      newVersions = currentVersions.filter((v) => v !== version);
    } else {
      newVersions = [...currentVersions, version];
    }

    setValue('game_versions', newVersions, { shouldValidate: true });

    // Auto-update Create versions based on compatibility
    const newAvailableCreate = new Set<string>();
    newVersions.forEach((mcVersion) => {
      const compatibleVersions = MINECRAFT_TO_CREATE_VERSIONS[mcVersion];
      if (compatibleVersions) {
        compatibleVersions.forEach((v) => newAvailableCreate.add(v));
      }
    });

    // Remove Create versions that are no longer compatible
    const filteredCreateVersions = watchedCreateVersions.filter((cv) => newAvailableCreate.has(cv));

    if (filteredCreateVersions.length !== watchedCreateVersions.length) {
      setValue('create_versions', filteredCreateVersions);
    }
  };

  // Handle select all Minecraft versions
  const handleSelectAllMinecraft = () => {
    if (selectAllMinecraft) {
      setValue('game_versions', []);
      setSelectAllMinecraft(false);
    } else {
      const allVersions = MINECRAFT_VERSIONS.filter((v) => v.value !== 'All').map((v) => v.value);
      setValue('game_versions', allVersions, { shouldValidate: true });
      setSelectAllMinecraft(true);
    }
  };

  // Handle Create version toggle
  const handleCreateVersionToggle = (version: string) => {
    const currentVersions = watchedCreateVersions;
    const isSelected = currentVersions.includes(version);

    let newVersions;
    if (isSelected) {
      newVersions = currentVersions.filter((v) => v !== version);
    } else {
      newVersions = [...currentVersions, version];
    }

    setValue('create_versions', newVersions, { shouldValidate: true });
  };

  // Handle select all Create versions
  const handleSelectAllCreate = () => {
    if (selectAllCreate) {
      setValue('create_versions', []);
      setSelectAllCreate(false);
    } else {
      setValue('create_versions', availableCreateVersions, { shouldValidate: true });
      setSelectAllCreate(true);
    }
  };

  // Handle modloader toggle
  const handleModloaderToggle = (modloader: ModLoader) => {
    const currentModloaders = watchedModloaders;
    const isSelected = currentModloaders.includes(modloader);

    let newModloaders;
    if (isSelected) {
      newModloaders = currentModloaders.filter((m) => m !== modloader);
    } else {
      newModloaders = [...currentModloaders, modloader];
    }

    setValue('modloaders', newModloaders, { shouldValidate: true });
  };

  // Update select all state when versions change
  useEffect(() => {
    const allMinecraftVersions = MINECRAFT_VERSIONS.filter((v) => v.value !== 'All').map(
      (v) => v.value
    );
    setSelectAllMinecraft(watchedMinecraftVersions.length === allMinecraftVersions.length);
  }, [watchedMinecraftVersions]);

  useEffect(() => {
    setSelectAllCreate(
      availableCreateVersions.length > 0 &&
        watchedCreateVersions.length === availableCreateVersions.length
    );
  }, [watchedCreateVersions, availableCreateVersions]);

  // Modloader info
  const modloaderInfo: Record<ModLoader, { label: string; icon: React.ReactNode; color: string }> =
    {
      forge: {
        label: 'Forge',
        icon: <Cpu className='h-4 w-4' />,
        color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
      },
      fabric: {
        label: 'Fabric',
        icon: <Layers className='h-4 w-4' />,
        color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      },
      neoforge: {
        label: 'NeoForge',
        icon: <Cpu className='h-4 w-4' />,
        color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
      },
      quilt: {
        label: 'Quilt',
        icon: <Layers className='h-4 w-4' />,
        color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      },
    };

  return (
    <div className='space-y-6'>
      {/* Help Alert */}
      <Alert>
        <Info className='h-4 w-4' />
        <AlertTitle>Version Compatibility</AlertTitle>
        <AlertDescription>
          Select which Minecraft versions, Create Mod versions, and modloaders your schematic
          supports. This helps users find compatible content for their setup.
        </AlertDescription>
      </Alert>

      {/* Minecraft Versions */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Gamepad2 className='h-5 w-5' />
                Minecraft Versions
              </CardTitle>
              <CardDescription>
                Select all Minecraft versions this schematic is compatible with
              </CardDescription>
            </div>
            <Button
              type='button'
              variant={selectAllMinecraft ? 'default' : 'outline'}
              size='sm'
              onClick={handleSelectAllMinecraft}
              className='ml-4'
            >
              {selectAllMinecraft ? (
                <>
                  <CheckCircle2 className='mr-2 h-4 w-4' />
                  Deselect All
                </>
              ) : (
                <>
                  <Check className='mr-2 h-4 w-4' />
                  Select All
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[300px] pr-4'>
            <div className='space-y-4'>
              {minecraftVersionGroups.map((group) => (
                <div key={group.label} className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    {group.icon}
                    <Label className='text-sm font-medium'>{group.label}</Label>
                    {group.recommended && (
                      <Badge variant='default' className='text-xs'>
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <div className='grid grid-cols-2 gap-3 pl-6 sm:grid-cols-3 md:grid-cols-4'>
                    {group.versions.map((version) => {
                      const isSelected = watchedMinecraftVersions.includes(version);
                      return (
                        <div
                          key={version}
                          className={cn(
                            'flex cursor-pointer items-center space-x-2 rounded-lg border p-2 transition-colors',
                            isSelected
                              ? 'bg-primary/5 border-primary'
                              : 'hover:bg-muted/50 border-border'
                          )}
                          onClick={() => handleMinecraftVersionToggle(version)}
                        >
                          <Checkbox
                            id={`mc-${version}`}
                            checked={isSelected}
                            onCheckedChange={() => handleMinecraftVersionToggle(version)}
                            className='cursor-pointer'
                          />
                          <Label
                            htmlFor={`mc-${version}`}
                            className='cursor-pointer text-sm select-none'
                          >
                            {version}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {errors.minecraftVersions && (
            <p className='text-destructive mt-2 text-sm'>{errors.minecraftVersions.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Create Mod Versions */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Package className='h-5 w-5' />
                Create Mod Versions
              </CardTitle>
              <CardDescription>
                Select compatible Create Mod versions
                {watchedMinecraftVersions.length === 0 && (
                  <span className='text-warning mt-1 block'>
                    Select Minecraft versions first to see compatible Create versions
                  </span>
                )}
              </CardDescription>
            </div>
            {availableCreateVersions.length > 0 && (
              <Button
                type='button'
                variant={selectAllCreate ? 'default' : 'outline'}
                size='sm'
                onClick={handleSelectAllCreate}
                className='ml-4'
              >
                {selectAllCreate ? (
                  <>
                    <CheckCircle2 className='mr-2 h-4 w-4' />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Check className='mr-2 h-4 w-4' />
                    Select All
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {availableCreateVersions.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>
              <Package className='mx-auto mb-3 h-12 w-12 opacity-50' />
              <p className='text-sm'>
                No Create versions available for selected Minecraft versions
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
              {availableCreateVersions.map((version) => {
                const isSelected = watchedCreateVersions.includes(version);
                const versionInfo = CREATE_VERSIONS[version];
                const isLatest = version === '6.0';

                return (
                  <div
                    key={version}
                    className={cn(
                      'relative flex cursor-pointer items-center space-x-2 rounded-lg border p-3 transition-colors',
                      isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50 border-border'
                    )}
                    onClick={() => handleCreateVersionToggle(version)}
                  >
                    <Checkbox
                      id={`create-${version}`}
                      checked={isSelected}
                      onCheckedChange={() => handleCreateVersionToggle(version)}
                      className='cursor-pointer'
                    />
                    <Label
                      htmlFor={`create-${version}`}
                      className='flex cursor-pointer items-center gap-2 text-sm select-none'
                    >
                      Create {versionInfo?.label || version}
                      {isLatest && (
                        <Badge variant='default' className='text-xs'>
                          Latest
                        </Badge>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}
          {errors.createVersions && (
            <p className='text-destructive mt-2 text-sm'>{errors.createVersions.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Modloaders */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Cpu className='h-5 w-5' />
            Modloaders
          </CardTitle>
          <CardDescription>
            Select which modloaders this schematic supports
            {watchedMinecraftVersions.length > 0 && availableModloaders.length < 4 && (
              <span className='text-muted-foreground mt-1 block'>
                Available modloaders based on selected Minecraft versions
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {(['forge', 'fabric', 'neoforge', 'quilt'] as ModLoader[]).map((modloader) => {
              const isSelected = watchedModloaders.includes(modloader);
              const isAvailable = availableModloaders.includes(modloader);
              const info = modloaderInfo[modloader];

              return (
                <div
                  key={modloader}
                  className={cn(
                    'relative flex items-center space-x-2 rounded-lg border p-3 transition-all',
                    !isAvailable && 'cursor-not-allowed opacity-50',
                    isAvailable && 'cursor-pointer',
                    isSelected && isAvailable
                      ? cn('border', info.color)
                      : 'hover:bg-muted/50 border-border'
                  )}
                  onClick={() => isAvailable && handleModloaderToggle(modloader)}
                >
                  <Checkbox
                    id={`loader-${modloader}`}
                    checked={isSelected}
                    disabled={!isAvailable}
                    onCheckedChange={() => handleModloaderToggle(modloader)}
                    className={cn('cursor-pointer', !isAvailable && 'cursor-not-allowed')}
                  />
                  <Label
                    htmlFor={`loader-${modloader}`}
                    className={cn(
                      'flex items-center gap-2 text-sm select-none',
                      isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'
                    )}
                  >
                    {info.icon}
                    {info.label}
                  </Label>
                  {!isAvailable && <div className='bg-background/50 absolute inset-0 rounded-lg' />}
                </div>
              );
            })}
          </div>
          {errors.modloaders && (
            <p className='text-destructive mt-2 text-sm'>{errors.modloaders.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Compatibility Summary */}
      {(watchedMinecraftVersions.length > 0 ||
        watchedCreateVersions.length > 0 ||
        watchedModloaders.length > 0) && (
        <Card className='border-primary/20 bg-primary/5'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Sparkles className='h-5 w-5' />
              Compatibility Summary
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {watchedMinecraftVersions.length > 0 && (
              <div className='flex items-center gap-2'>
                <Gamepad2 className='text-muted-foreground h-4 w-4' />
                <span className='text-sm font-medium'>Minecraft:</span>
                <div className='flex flex-wrap gap-1'>
                  {watchedMinecraftVersions.slice(0, 5).map((v) => (
                    <Badge key={v} variant='secondary' className='text-xs'>
                      {v}
                    </Badge>
                  ))}
                  {watchedMinecraftVersions.length > 5 && (
                    <Badge variant='secondary' className='text-xs'>
                      +{watchedMinecraftVersions.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {watchedCreateVersions.length > 0 && (
              <div className='flex items-center gap-2'>
                <Package className='text-muted-foreground h-4 w-4' />
                <span className='text-sm font-medium'>Create Mod:</span>
                <div className='flex flex-wrap gap-1'>
                  {watchedCreateVersions.map((v) => (
                    <Badge key={v} variant='secondary' className='text-xs'>
                      {CREATE_VERSIONS[v]?.label || v}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {watchedModloaders.length > 0 && (
              <div className='flex items-center gap-2'>
                <Cpu className='text-muted-foreground h-4 w-4' />
                <span className='text-sm font-medium'>Modloaders:</span>
                <div className='flex flex-wrap gap-1'>
                  {watchedModloaders.map((loader) => (
                    <Badge
                      key={loader}
                      variant='secondary'
                      className={cn('text-xs', modloaderInfo[loader as ModLoader].color)}
                    >
                      {modloaderInfo[loader as ModLoader].label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
