import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import MarkdownDisplay from '@/components/utility/MarkdownDisplay';
import type { User, SchematicFormValues } from '@/types';
import Gallery from '@/components/ui/gallery';
import ModLoaders from '../../addons/addon-card/ModLoaders';
import { Blocks, Clock, Cpu, Layers, Package, Gauge, Sparkles, Zap, Terminal } from 'lucide-react';

interface SchematicPreviewProps {
  title: string;
  description: string;
  imagePreviewUrls: string[];
  gameVersions: string[];
  createVersions: string[];
  modloaders: string[];
  user: User | null;
  categories: string[];
  subCategories: string[];
  dimensions?: SchematicFormValues['dimensions'];
  materials?: SchematicFormValues['materials'];
  complexity?: SchematicFormValues['complexity'];
  requirements?: SchematicFormValues['requirements'];
}

export function SchematicPreview({
  title,
  description,
  imagePreviewUrls,
  gameVersions,
  createVersions,
  modloaders,
  user,
  categories,
  subCategories,
  dimensions,
  materials,
  complexity,
  requirements,
}: Readonly<SchematicPreviewProps>) {
  const getComplexityColor = (level?: string) => {
    switch (level) {
      case 'simple':
        return 'text-green-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'complex':
        return 'text-orange-500';
      case 'extreme':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getComplexityBadgeVariant = (
    level?: string
  ): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (level) {
      case 'simple':
        return 'secondary';
      case 'moderate':
        return 'default';
      case 'complex':
        return 'outline';
      case 'extreme':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getComplexityProgress = (level?: string) => {
    switch (level) {
      case 'simple':
        return 25;
      case 'moderate':
        return 50;
      case 'complex':
        return 75;
      case 'extreme':
        return 100;
      default:
        return 0;
    }
  };

  const formatBuildTime = (minutes?: number) => {
    if (!minutes) return 'Unknown';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };
  return (
    <Card className='sticky top-20'>
      <CardHeader className='border-b'>
        <CardTitle className='flex items-start justify-between'>Preview</CardTitle>
        <CardDescription className='text-foreground-muted'>
          This is how your schematic will appear to others
        </CardDescription>
      </CardHeader>
      <CardHeader className='text-center'>
        <CardTitle>
          <h1 className='text-2xl font-bold md:text-3xl'>{title || 'Schematic Title'}</h1>
        </CardTitle>
        <CardDescription className='text-foreground-muted'>
          By {user?.name ?? 'Anonymous'}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='flex flex-col items-start gap-8 md:flex-row'>
          <div className='w-full md:w-full'>
            {/* Use the Gallery component */}
            <Gallery images={imagePreviewUrls} />
          </div>
        </div>

        {/* Dimensions and Stats Section */}
        {dimensions?.blockCount && dimensions.blockCount > 0 && (
          <Card className='border-primary/20 bg-primary/5'>
            <CardContent className='pt-6'>
              <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Layers className='text-primary h-4 w-4' />
                    <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                      Dimensions
                    </p>
                  </div>
                  <p className='text-lg font-bold'>
                    {dimensions.width}×{dimensions.height}×{dimensions.depth}
                  </p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Blocks className='text-primary h-4 w-4' />
                    <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                      Total Blocks
                    </p>
                  </div>
                  <p className='text-lg font-bold'>{dimensions.blockCount.toLocaleString()}</p>
                </div>

                {complexity?.level && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Gauge className={`h-4 w-4 ${getComplexityColor(complexity.level)}`} />
                      <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                        Complexity
                      </p>
                    </div>
                    <Badge
                      variant={getComplexityBadgeVariant(complexity.level)}
                      className='capitalize'
                    >
                      {complexity.level}
                    </Badge>
                  </div>
                )}

                {complexity?.buildTime && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Clock className='text-primary h-4 w-4' />
                      <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                        Est. Build Time
                      </p>
                    </div>
                    <p className='text-lg font-bold'>{formatBuildTime(complexity.buildTime)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complexity Progress Bar */}
        {complexity?.level && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Difficulty Level</span>
              <span
                className={`text-sm font-medium capitalize ${getComplexityColor(complexity.level)}`}
              >
                {complexity.level}
              </span>
            </div>
            <Progress value={getComplexityProgress(complexity.level)} className='h-2' />
          </div>
        )}

        <Separator />

        <div>
          <h2 className='mb-2 text-xl font-semibold'>Description:</h2>
          <div className='prose text-foreground-muted whitespace-pre-wrap'>
            {description ? (
              <MarkdownDisplay content={description} />
            ) : (
              <p className='text-foreground-muted'>Schematic description will appear here</p>
            )}
          </div>
        </div>

        {/* Materials and Requirements Section */}
        {((materials?.primary && materials.primary.length > 0) ||
          (materials?.mainBuilding && materials.mainBuilding.length > 0) ||
          (requirements?.mods && requirements.mods.length > 0)) && (
          <>
            <Separator />

            <div className='space-y-6'>
              {/* Materials Card */}
              {((materials?.primary?.length ?? 0) > 0 ||
                (materials?.mainBuilding?.length ?? 0) > 0) && (
                <Card className='border-dashed'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <Package className='h-4 w-4' />
                      Building Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* Primary Materials */}
                    {(materials?.primary?.length ?? 0) > 0 && (
                      <div>
                        <p className='text-muted-foreground mb-2 text-sm font-medium'>
                          Primary Blocks
                        </p>
                        <div className='flex flex-wrap gap-1.5'>
                          {materials?.primary?.slice(0, 10).map((material, index) => (
                            <Badge key={index} variant='secondary' className='text-xs'>
                              {material}
                            </Badge>
                          ))}
                          {(materials?.primary?.length ?? 0) > 10 && (
                            <Badge variant='outline' className='text-xs'>
                              +{(materials?.primary?.length ?? 0) - 10} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Main Building Materials */}
                    {materials?.mainBuilding &&
                      materials.mainBuilding.length > 0 &&
                      materials.primary &&
                      materials.mainBuilding.length !== materials.primary.length && (
                        <div>
                          <p className='text-muted-foreground mb-2 text-sm font-medium'>
                            Most Used
                          </p>
                          <div className='flex flex-wrap gap-1.5'>
                            {materials.mainBuilding.slice(0, 5).map((material, index) => (
                              <Badge key={index} variant='outline' className='text-xs'>
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              )}

              {/* Requirements Card */}
              {((requirements?.mods && requirements.mods.length > 0) ||
                requirements?.hasRedstone ||
                requirements?.hasCommandBlocks ||
                materials?.hasModded) && (
                <Card className='border-dashed'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <Cpu className='h-4 w-4' />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* Required Mods */}
                    {(requirements?.mods?.length ?? 0) > 0 && (
                      <div>
                        <p className='text-muted-foreground mb-2 text-sm font-medium'>
                          Required Mods
                        </p>
                        <div className='flex flex-wrap gap-1.5'>
                          {requirements?.mods?.map((mod, index) => (
                            <Badge key={index} variant='default' className='text-xs'>
                              {mod}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Special Requirements */}
                    {(requirements?.hasRedstone ||
                      requirements?.hasCommandBlocks ||
                      materials?.hasModded) && (
                      <div>
                        <p className='text-muted-foreground mb-2 text-sm font-medium'>
                          Special Features
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {requirements?.hasRedstone && (
                            <Badge variant='outline' className='gap-1'>
                              <Zap className='h-3 w-3' />
                              Redstone Circuits
                            </Badge>
                          )}
                          {requirements?.hasCommandBlocks && (
                            <Badge variant='outline' className='gap-1'>
                              <Terminal className='h-3 w-3' />
                              Command Blocks
                            </Badge>
                          )}
                          {materials?.hasModded && (
                            <Badge variant='outline' className='gap-1'>
                              <Sparkles className='h-3 w-3' />
                              Modded Content
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Detected Mods (if different from required) */}
                    {requirements?.modsDetected &&
                      requirements.modsDetected.length > 0 &&
                      requirements.mods &&
                      requirements.modsDetected.length !== requirements.mods.length && (
                        <div>
                          <p className='text-muted-foreground mb-2 text-sm font-medium'>
                            Auto-Detected Mods
                          </p>
                          <div className='flex flex-wrap gap-1.5'>
                            {requirements.modsDetected.map((mod, index) => (
                              <Badge key={index} variant='secondary' className='text-xs opacity-75'>
                                {mod}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        <Separator />

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div>
              <h3 className='mb-2 text-lg font-semibold'>Categories</h3>
              <div className='flex flex-wrap gap-2'>
                {categories.map((category) => (
                  <Badge key={category} variant='outline'>
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className='mb-2 text-lg font-semibold'>Subcategory</h3>
              <div className='flex flex-wrap gap-2'>
                {subCategories.map((subcategory) => (
                  <Badge key={subcategory} variant='outline'>
                    {subcategory}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div>
              <h3 className='mb-2 text-lg font-semibold'>Create Versions</h3>
              <div className='flex flex-wrap gap-2'>
                {createVersions && createVersions.length > 0 ? (
                  createVersions.map((version) => (
                    <Badge key={version} variant='createVersion'>
                      {version}
                    </Badge>
                  ))
                ) : (
                  <p className='text-foreground-muted text-sm'>No versions selected</p>
                )}
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <h3 className='mb-2 text-lg font-semibold'>Minecraft Versions</h3>
              <div className='flex flex-wrap gap-2'>
                {gameVersions && gameVersions.length > 0 ? (
                  gameVersions.map((version) => (
                    <Badge key={version} variant='mcVersion'>
                      {version}
                    </Badge>
                  ))
                ) : (
                  <p className='text-foreground-muted text-sm'>No versions selected</p>
                )}
              </div>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-semibold'>Modloaders</h3>
              {modloaders && modloaders.length > 0 ? (
                <ModLoaders loaders={modloaders} />
              ) : (
                <p className='text-foreground-muted text-sm'>No modloaders selected</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
