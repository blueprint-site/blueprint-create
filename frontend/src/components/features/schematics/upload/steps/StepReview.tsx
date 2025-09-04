import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/config/utils';
import {
  CheckCircle2,
  AlertCircle,
  Edit,
  FileText,
  Image,
  Package,
  Gamepad2,
  Cpu,
  Ruler,
  Clock,
  Layers,
  Zap,
  Terminal,
  Blocks,
  ChevronRight,
  Upload,
  X,
  Check,
  Info,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { MINECRAFT_VERSIONS } from '@/data/minecraftVersions';
import { CREATE_VERSIONS } from '@/data/createVersions';
import type { SchematicFormValues } from '@/types';

interface StepReviewProps {
  onEditStep?: (stepIndex: number) => void;
}

export const StepReview: React.FC<StepReviewProps> = ({ onEditStep }) => {
  const {
    watch,
    formState: { errors },
  } = useFormContext<SchematicFormValues>();

  // Watch all form values
  const formData = watch();

  // Check if each section is complete
  const isSectionComplete = (section: 'basic' | 'versions' | 'technical') => {
    switch (section) {
      case 'basic':
        return !!(
          formData.schematicFile &&
          formData.imageFiles?.length > 0 &&
          formData.title &&
          formData.description &&
          formData.categories?.length > 0
        );
      case 'versions':
        return !!(
          formData.game_versions?.length > 0 &&
          formData.create_versions?.length > 0 &&
          formData.modloaders?.length > 0
        );
      case 'technical':
        // Technical details are optional, so always return true if basic fields are present
        return true;
      default:
        return false;
    }
  };

  const allSectionsComplete = isSectionComplete('basic') && isSectionComplete('versions');

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  // Get complexity level info
  const getComplexityInfo = (level?: string) => {
    const complexityMap = {
      simple: { label: 'Simple', icon: '🟢', color: 'text-green-600 dark:text-green-400' },
      moderate: { label: 'Moderate', icon: '🟡', color: 'text-yellow-600 dark:text-yellow-400' },
      complex: { label: 'Complex', icon: '🟠', color: 'text-orange-600 dark:text-orange-400' },
      extreme: { label: 'Extreme', icon: '🔴', color: 'text-red-600 dark:text-red-400' },
    };
    return complexityMap[level as keyof typeof complexityMap] || null;
  };

  // Get modloader display info
  const getModloaderInfo = (modloader: string) => {
    const modloaderMap = {
      forge: { label: 'Forge', color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400' },
      fabric: { label: 'Fabric', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
      neoforge: {
        label: 'NeoForge',
        color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      },
      quilt: { label: 'Quilt', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
    };
    return modloaderMap[modloader as keyof typeof modloaderMap] || { label: modloader, color: '' };
  };

  return (
    <div className='space-y-6'>
      {/* Status Alert */}
      {allSectionsComplete ? (
        <Alert className='border-green-500/50 bg-green-500/10'>
          <CheckCircle2 className='h-4 w-4 text-green-600' />
          <AlertTitle>Ready to Upload!</AlertTitle>
          <AlertDescription>
            All required information has been provided. Review your schematic details below before
            submitting.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className='border-warning/50 bg-warning/10'>
          <AlertTriangle className='text-warning h-4 w-4' />
          <AlertTitle>Missing Required Information</AlertTitle>
          <AlertDescription>
            Some required fields are missing. Please complete all sections before submitting.
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information Section */}
      <Card className={cn('relative', !isSectionComplete('basic') && 'border-warning/50')}>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              <CardTitle>Basic Information</CardTitle>
              {isSectionComplete('basic') ? (
                <CheckCircle2 className='h-5 w-5 text-green-600' />
              ) : (
                <AlertCircle className='text-warning h-5 w-5' />
              )}
            </div>
            {onEditStep && (
              <Button type='button' variant='ghost' size='sm' onClick={() => onEditStep(0)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Schematic File */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <FileText className='text-muted-foreground h-4 w-4' />
              Schematic File
            </div>
            {formData.schematicFile ? (
              <div className='flex items-center gap-2 pl-6'>
                <Badge variant='secondary'>{formData.schematicFile.name}</Badge>
                <span className='text-muted-foreground text-xs'>
                  {formatFileSize(formData.schematicFile.size)}
                </span>
              </div>
            ) : (
              <p className='text-destructive pl-6 text-sm'>No file uploaded</p>
            )}
          </div>

          {/* Images */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Image className='text-muted-foreground h-4 w-4' />
              Images
            </div>
            {formData.imageFiles && formData.imageFiles.length > 0 ? (
              <div className='pl-6'>
                <p className='text-muted-foreground text-sm'>
                  {formData.imageFiles.length} image{formData.imageFiles.length > 1 ? 's' : ''}{' '}
                  uploaded
                </p>
                <ScrollArea className='mt-2 h-20 w-full'>
                  <div className='flex gap-2'>
                    {formData.imageFiles.map((file, index) => {
                      const imageUrl = file instanceof File ? URL.createObjectURL(file) : '';
                      return (
                        <div key={index} className='group relative'>
                          <div className='bg-muted flex h-16 w-16 items-center justify-center overflow-hidden rounded border'>
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={`Preview ${index + 1}`}
                                className='h-full w-full object-cover'
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <Image
                              className={`text-muted-foreground h-8 w-8 ${imageUrl ? 'hidden' : ''}`}
                            />
                          </div>
                          {index === 0 && (
                            <Badge className='absolute -top-1 -right-1 text-xs' variant='default'>
                              Thumb
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <p className='text-destructive pl-6 text-sm'>No images uploaded</p>
            )}
          </div>

          {/* Title */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Sparkles className='text-muted-foreground h-4 w-4' />
              Title
            </div>
            {formData.title ? (
              <p className='pl-6 text-sm'>{formData.title}</p>
            ) : (
              <p className='text-destructive pl-6 text-sm'>No title provided</p>
            )}
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Info className='text-muted-foreground h-4 w-4' />
              Description
            </div>
            {formData.description ? (
              <p className='text-muted-foreground line-clamp-2 pl-6 text-sm'>
                {formData.description}
              </p>
            ) : (
              <p className='text-destructive pl-6 text-sm'>No description provided</p>
            )}
          </div>

          {/* Categories */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Layers className='text-muted-foreground h-4 w-4' />
              Categories
            </div>
            {formData.categories && formData.categories.length > 0 ? (
              <div className='flex flex-wrap gap-1 pl-6'>
                {formData.categories.map((cat) => (
                  <Badge key={cat} variant='secondary' className='text-xs'>
                    {cat}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-destructive pl-6 text-sm'>No categories selected</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Version Compatibility Section */}
      <Card className={cn('relative', !isSectionComplete('versions') && 'border-warning/50')}>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Package className='h-5 w-5' />
              <CardTitle>Version Compatibility</CardTitle>
              {isSectionComplete('versions') ? (
                <CheckCircle2 className='h-5 w-5 text-green-600' />
              ) : (
                <AlertCircle className='text-warning h-5 w-5' />
              )}
            </div>
            {onEditStep && (
              <Button type='button' variant='ghost' size='sm' onClick={() => onEditStep(1)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Minecraft Versions */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Gamepad2 className='text-muted-foreground h-4 w-4' />
              Minecraft Versions
            </div>
            {formData.game_versions && formData.game_versions.length > 0 ? (
              <div className='flex flex-wrap gap-1 pl-6'>
                {formData.game_versions.slice(0, 8).map((v) => (
                  <Badge key={v} variant='secondary' className='text-xs'>
                    {v}
                  </Badge>
                ))}
                {formData.game_versions.length > 8 && (
                  <Badge variant='secondary' className='text-xs'>
                    +{formData.game_versions.length - 8} more
                  </Badge>
                )}
              </div>
            ) : (
              <p className='text-destructive pl-6 text-sm'>No versions selected</p>
            )}
          </div>

          {/* Create Versions */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Package className='text-muted-foreground h-4 w-4' />
              Create Mod Versions
            </div>
            {formData.create_versions && formData.create_versions.length > 0 ? (
              <div className='flex flex-wrap gap-1 pl-6'>
                {formData.create_versions.map((v) => (
                  <Badge key={v} variant='secondary' className='text-xs'>
                    Create {CREATE_VERSIONS[v]?.label || v}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-destructive pl-6 text-sm'>No versions selected</p>
            )}
          </div>

          {/* Modloaders */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Cpu className='text-muted-foreground h-4 w-4' />
              Modloaders
            </div>
            {formData.modloaders && formData.modloaders.length > 0 ? (
              <div className='flex flex-wrap gap-1 pl-6'>
                {formData.modloaders.map((loader) => {
                  const info = getModloaderInfo(loader);
                  return (
                    <Badge key={loader} variant='secondary' className={cn('text-xs', info.color)}>
                      {info.label}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className='text-destructive pl-6 text-sm'>No modloaders selected</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Technical Details Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Ruler className='h-5 w-5' />
              <CardTitle>Technical Details</CardTitle>
              <Badge variant='secondary' className='text-xs'>
                Optional
              </Badge>
            </div>
            {onEditStep && (
              <Button type='button' variant='ghost' size='sm' onClick={() => onEditStep(2)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type='single' collapsible className='w-full'>
            {/* Dimensions */}
            {(formData.width || formData.height || formData.depth || formData.totalBlocks) && (
              <AccordionItem value='dimensions'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Ruler className='h-4 w-4' />
                    Dimensions & Size
                  </div>
                </AccordionTrigger>
                <AccordionContent className='space-y-2 pl-6'>
                  {(formData.width || formData.height || formData.depth) && (
                    <div className='flex items-center gap-4 text-sm'>
                      {formData.width && <span>Width: {formData.width}</span>}
                      {formData.height && <span>Height: {formData.height}</span>}
                      {formData.depth && <span>Depth: {formData.depth}</span>}
                    </div>
                  )}
                  {formData.totalBlocks && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Blocks className='h-3 w-3' />
                      <span>{formData.totalBlocks.toLocaleString()} blocks</span>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Materials */}
            {formData.materials && formData.materials.length > 0 && (
              <AccordionItem value='materials'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Layers className='h-4 w-4' />
                    Materials ({formData.materials.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='flex flex-wrap gap-1 pl-6'>
                    {formData.materials.map((material) => (
                      <Badge key={material} variant='outline' className='text-xs'>
                        {material}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Complexity & Time */}
            {(formData.complexityLevel || formData.estimatedBuildTime) && (
              <AccordionItem value='complexity'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    Complexity & Build Time
                  </div>
                </AccordionTrigger>
                <AccordionContent className='space-y-2 pl-6'>
                  {formData.complexityLevel && (
                    <div className='flex items-center gap-2 text-sm'>
                      {(() => {
                        const info = getComplexityInfo(formData.complexityLevel);
                        return info ? (
                          <>
                            <span>{info.icon}</span>
                            <span className={info.color}>{info.label}</span>
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}
                  {formData.estimatedBuildTime && (
                    <div className='text-sm'>
                      Estimated build time: {formData.estimatedBuildTime} hour
                      {formData.estimatedBuildTime !== 1 ? 's' : ''}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Technical Features */}
            {(formData.hasRedstone || formData.hasCommandBlocks || formData.hasModdedBlocks) && (
              <AccordionItem value='features'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Zap className='h-4 w-4' />
                    Technical Features
                  </div>
                </AccordionTrigger>
                <AccordionContent className='space-y-2 pl-6'>
                  {formData.hasRedstone && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Zap className='h-3 w-3 text-red-500' />
                      <span>Contains Redstone</span>
                    </div>
                  )}
                  {formData.hasCommandBlocks && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Terminal className='h-3 w-3 text-purple-500' />
                      <span>Uses Command Blocks</span>
                    </div>
                  )}
                  {formData.hasModdedBlocks && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Package className='h-3 w-3 text-blue-500' />
                      <span>Contains Modded Blocks</span>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Required Mods */}
            {formData.requiredMods && formData.requiredMods.length > 0 && (
              <AccordionItem value='mods'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Package className='h-4 w-4' />
                    Required Mods ({formData.requiredMods.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='flex flex-wrap gap-1 pl-6'>
                    {formData.requiredMods.map((mod) => (
                      <Badge key={mod} variant='outline' className='text-xs'>
                        {mod}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {/* No technical details message */}
          {!formData.width &&
            !formData.height &&
            !formData.depth &&
            !formData.totalBlocks &&
            (!formData.materials || formData.materials.length === 0) &&
            !formData.complexityLevel &&
            !formData.estimatedBuildTime &&
            !formData.hasRedstone &&
            !formData.hasCommandBlocks &&
            !formData.hasModdedBlocks &&
            (!formData.requiredMods || formData.requiredMods.length === 0) && (
              <p className='text-muted-foreground py-4 text-center text-sm'>
                No technical details provided
              </p>
            )}
        </CardContent>
      </Card>

      {/* Final Checklist */}
      <Card className='border-primary/20 bg-primary/5'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5' />
            Pre-Upload Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-center gap-3'>
            {formData.schematicFile ? (
              <Check className='h-4 w-4 text-green-600' />
            ) : (
              <X className='text-destructive h-4 w-4' />
            )}
            <span className='text-sm'>Schematic file uploaded (.nbt format)</span>
          </div>

          <div className='flex items-center gap-3'>
            {formData.imageFiles && formData.imageFiles.length > 0 ? (
              <Check className='h-4 w-4 text-green-600' />
            ) : (
              <X className='text-destructive h-4 w-4' />
            )}
            <span className='text-sm'>At least one preview image added</span>
          </div>

          <div className='flex items-center gap-3'>
            {formData.title && formData.description ? (
              <Check className='h-4 w-4 text-green-600' />
            ) : (
              <X className='text-destructive h-4 w-4' />
            )}
            <span className='text-sm'>Title and description provided</span>
          </div>

          <div className='flex items-center gap-3'>
            {formData.categories && formData.categories.length > 0 ? (
              <Check className='h-4 w-4 text-green-600' />
            ) : (
              <X className='text-destructive h-4 w-4' />
            )}
            <span className='text-sm'>Categories selected</span>
          </div>

          <div className='flex items-center gap-3'>
            {isSectionComplete('versions') ? (
              <Check className='h-4 w-4 text-green-600' />
            ) : (
              <X className='text-destructive h-4 w-4' />
            )}
            <span className='text-sm'>Version compatibility specified</span>
          </div>

          <Separator />

          {allSectionsComplete ? (
            <Alert className='border-green-500/50 bg-green-500/10'>
              <Upload className='h-4 w-4' />
              <AlertTitle>Ready to Upload</AlertTitle>
              <AlertDescription>
                Your schematic is ready to be uploaded. Click the upload button below to submit.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className='border-warning/50 bg-warning/10'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Incomplete Submission</AlertTitle>
              <AlertDescription>
                Please complete all required fields before uploading. Use the edit buttons above to
                go back to any section.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
