import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Info, CheckCircle, Upload, Sparkles } from 'lucide-react';
import { FileUploadField } from './form/FileUploadField';
import { FormMarkdownEditor } from './form/FormMarkdownEditor';
import { MultiSelectCheckboxGroup } from './form/MultiSelectCheckboxGroup';
import { FormInput } from './form/FormInput';
import { CategorySelectors } from './form/CategorySelectors';
import { CompactMaterialSelector } from './form/CompactMaterialSelector';
import { CompactModSelector } from './form/CompactModSelector';
import type { Schematic, SchematicFormValues } from '@/types'; // From canonical types
import { schematicFormSchema } from '@/schemas/schematic.schema';
import { MODLOADER_OPTIONS, CREATE_VERSIONS, MINECRAFT_VERSIONS } from '@/data';
import { storage } from '@/config/appwrite.ts';
import { parseNBTFile, type SchematicMetadata } from '@/utils/nbtParser';
import { parseNBTWithFunction } from '@/api/appwrite/useNBTParser';
import { toast } from 'sonner';
interface SchematicUploadFormProps {
  onSubmit: (data: SchematicFormValues) => Promise<void>;
  onValueChange?: (field: keyof SchematicFormValues, value: unknown) => void;
  onImageChange?: (files: File[]) => void;
  initialData?: Partial<SchematicFormValues>;
  isNew?: boolean;
  existingData?: Schematic | null;
}
async function fetchFileFromAppwrite(
  bucketId: string,
  fileId: string,
  defaultName: string,
  type: string
) {
  try {
    // Récupérer les métadonnées du fichier
    const fileMetadata = await storage.getFile(bucketId, fileId);
    const fileName = fileMetadata.name || defaultName;

    // Télécharger le fichier depuis son URL
    const fileUrl = storage.getFileDownload(bucketId, fileId);
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    return new File([blob], fileName, { type });
  } catch (error) {
    console.error(`Failed to fetch file ${fileId} from Appwrite:`, error);
    return null;
  }
}
function extractFileInfo(url: string) {
  // Vérifier si l'URL est un fichier de téléchargement
  const matchDownload = url.match(/buckets\/([^/]+)\/files\/([^/]+)\/download/);
  if (matchDownload) {
    return { bucketId: matchDownload[1], fileId: matchDownload[2], type: 'download' };
  }

  // Vérifier si l'URL est une prévisualisation d'image
  const matchPreview = url.match(/buckets\/([^/]+)\/files\/([^/]+)\/preview/);
  if (matchPreview) {
    return { bucketId: matchPreview[1], fileId: matchPreview[2], type: 'preview' };
  }

  return null;
}
export function SchematicUploadForm({
  onSubmit,
  onValueChange,
  onImageChange,
  initialData,
  existingData,
  isNew,
}: SchematicUploadFormProps) {
  const [schematicFilePreview, setSchematicFilePreview] = useState<File | null>(null);
  const [imageFilePreviews, setImageFilePreviews] = useState<File[]>([]);
  const [schematicMetadata, setSchematicMetadata] = useState<SchematicMetadata | null>(null);
  const [isParsingNBT, setIsParsingNBT] = useState(false);
  const [detectedBlocks, setDetectedBlocks] = useState<
    Array<{
      name: string;
      count: number;
      percentage?: number;
    }>
  >([]);

  const minecraftVersions = MINECRAFT_VERSIONS;
  const createVersions = Object.values(CREATE_VERSIONS).map((version) => ({
    value: version.value,
    label: version.label,
  }));
  const modloaders = MODLOADER_OPTIONS;
  const form = useForm<SchematicFormValues>({
    resolver: zodResolver(schematicFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      game_versions: initialData?.game_versions || [],
      create_versions: initialData?.create_versions || [],
      modloaders: initialData?.modloaders || [],
      schematicFile: undefined,
      imageFiles: [],
      categories: initialData?.categories || [''],
      sub_categories: initialData?.sub_categories || [''],
      // Advanced fields
      dimensions: initialData?.dimensions || {
        width: undefined,
        height: undefined,
        depth: undefined,
        blockCount: undefined,
      },
      materials: initialData?.materials || {
        primary: [],
        mainBuilding: [],
        hasModded: false,
      },
      complexity: initialData?.complexity || {
        level: undefined,
        buildTime: undefined,
      },
      requirements: initialData?.requirements || {
        mods: [],
        modsDetected: [],
        hasRedstone: false,
        hasCommandBlocks: false,
      },
    },
    mode: 'onChange',
  });
  useEffect(() => {
    async function fetchExistingFiles() {
      if (existingData?.schematic_url) {
        const fileInfo = extractFileInfo(existingData.schematic_url);
        if (fileInfo) {
          const schematicFile = await fetchFileFromAppwrite(
            fileInfo.bucketId,
            fileInfo.fileId,
            'existing-schematic.nbt',
            'application/octet-stream'
          );
          if (schematicFile) {
            setSchematicFilePreview(schematicFile);
            form.setValue('schematicFile', schematicFile); // Mise à jour du formulaire
          }
        }
      }

      if (existingData?.image_urls) {
        const imageFiles = await Promise.all(
          existingData.image_urls.map(async (url) => {
            const fileInfo = extractFileInfo(url);
            if (fileInfo) {
              const imageFile = await fetchFileFromAppwrite(
                fileInfo.bucketId,
                fileInfo.fileId,
                '',
                'image/jpeg'
              );
              if (imageFile) {
                return imageFile;
              }
            }
            return null;
          })
        );

        // Filtrer les fichiers valides
        const validImageFiles = imageFiles.filter((file) => file !== null) as File[];

        // Ajouter les nouveaux fichiers sans créer une boucle infinie
        setImageFilePreviews((prev) => {
          const newImageFiles = validImageFiles.filter(
            (newFile) => !prev.some((file) => file.name === newFile.name)
          );
          const updatedPreviews = [...prev, ...newImageFiles];
          form.setValue('imageFiles', updatedPreviews); // Mettre à jour les valeurs du formulaire
          return updatedPreviews;
        });
      }
    }

    fetchExistingFiles();
  }, [existingData, form]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...form.getValues(), // Garde les valeurs actuelles
        ...initialData,
      });
    }
  }, [initialData, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (onValueChange) {
        Object.entries(value).forEach(([field, val]) => {
          onValueChange(field as keyof SchematicFormValues, val);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onValueChange]);

  const handleNBTFileUpload = async (file: File) => {
    setIsParsingNBT(true);
    try {
      // Try server-side parsing first (Appwrite function)
      let metadata = await parseNBTWithFunction(file);

      // Fallback to client-side parsing if server-side fails
      if (!metadata) {
        console.log('Server-side parsing failed, trying client-side...');
        metadata = await parseNBTFile(file);
      }

      if (metadata) {
        setSchematicMetadata(metadata);

        // Process detected blocks for the material selector
        const totalBlocks = metadata.dimensions.blockCount || 1;
        const processedBlocks = metadata.blocks
          .map((block) => ({
            name: block.name,
            count: block.count,
            percentage: (block.count / totalBlocks) * 100,
          }))
          .sort((a, b) => b.count - a.count);

        setDetectedBlocks(processedBlocks);

        // Auto-populate form fields with extracted data
        // Dimensions - as object
        form.setValue('dimensions', {
          width: metadata.dimensions.width,
          height: metadata.dimensions.height,
          depth: metadata.dimensions.depth,
          blockCount: metadata.dimensions.blockCount,
        });

        // Also set individual fields for backward compatibility
        form.setValue('width', metadata.dimensions.width);
        form.setValue('height', metadata.dimensions.height);
        form.setValue('depth', metadata.dimensions.depth);
        form.setValue('totalBlocks', metadata.dimensions.blockCount);

        // Handle both old and new data formats for materials
        const primaryMaterials =
          Array.isArray(metadata.materials.primary) && metadata.materials.primary.length > 0
            ? metadata.materials.primary.map((mat) =>
                typeof mat === 'object' ? mat.displayName || mat.name : mat
              )
            : metadata.materials.primary || [];

        // Extract main building materials from mostUsed blocks if available
        const mainBuildingMaterials = metadata.materials.mostUsed
          ? metadata.materials.mostUsed.map((block) => block.name.toLowerCase())
          : primaryMaterials;

        // Materials - as object with primary and mainBuilding arrays
        const allMaterials = [
          ...new Set([
            ...primaryMaterials.filter((m) => typeof m === 'string'),
            ...mainBuildingMaterials
              .filter((m) => typeof m === 'string' || typeof m?.name === 'string')
              .map((m) => (typeof m === 'string' ? m : m.name)),
          ]),
        ];
        form.setValue('materials', {
          primary: allMaterials,
          mainBuilding: mainBuildingMaterials
            .filter((m) => typeof m === 'string' || typeof m?.name === 'string')
            .map((m) => (typeof m === 'string' ? m : m.name)),
          hasModded: metadata.materials.hasModded || false,
        });
        form.setValue('hasModdedBlocks', metadata.materials.hasModded || false);

        // Complexity - as object
        form.setValue('complexity', {
          level: metadata.complexity.level,
          buildTime: metadata.complexity.estimatedBuildTime,
        });

        // Handle enhanced mod requirements format
        const requiredMods =
          Array.isArray(metadata.requirements.mods) && metadata.requirements.mods.length > 0
            ? metadata.requirements.mods.map((mod) => (typeof mod === 'object' ? mod.name : mod))
            : metadata.requirements.mods || [];

        // Requirements - as object
        form.setValue('requirements', {
          mods: Array.isArray(requiredMods)
            ? requiredMods.filter((m) => typeof m === 'string')
            : [],
          hasRedstone: metadata.requirements.hasRedstone || false,
          hasCommandBlocks: metadata.requirements.hasCommandBlocks || false,
        });

        // Show success toast with summary
        if (metadata.dimensions.blockCount > 0) {
          const modCount = requiredMods?.length || 0;
          const blockTypeCount = metadata.blockStats?.total || metadata.blocks.length;

          toast.success('Schematic analyzed successfully!', {
            description: `${metadata.dimensions.blockCount.toLocaleString()} blocks, ${blockTypeCount} types${modCount > 0 ? `, ${modCount} mods required` : ', vanilla only'}`,
          });
        } else {
          toast.warning('Basic file validation complete', {
            description: 'Full analysis may require server-side processing for compressed files',
          });
        }

        // Log detailed information for debugging
        console.log('Schematic metadata extracted:', metadata);
      } else {
        toast.error('Failed to parse NBT file', {
          description: 'The file might be corrupted or in an unsupported format',
        });
      }
    } catch (error) {
      console.error('Error parsing NBT file:', error);
      toast.error('Error analyzing schematic', {
        description: 'An error occurred while processing the file',
      });
    } finally {
      setIsParsingNBT(false);
    }
  };

  const handleFormSubmit = form.handleSubmit(async (data) => {
    try {
      console.log('Submitting form:', data);
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  // Check if minimum required fields are filled
  const watchedFields = form.watch();
  const isFormValid = !!(
    watchedFields.title &&
    watchedFields.description &&
    (watchedFields.schematicFile || existingData?.schematic_url) &&
    watchedFields.categories?.length > 0 &&
    watchedFields.game_versions?.length > 0
  );

  // Get tab completion status
  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Schematic Information</CardTitle>
            <CardDescription>
              Fill out the details about your schematic to share with the community
            </CardDescription>
          </div>
          <Button type='submit' form='schematic-form' disabled={!isFormValid} className='gap-2'>
            <Upload className='h-4 w-4' />
            {isNew ? 'Upload Schematic' : 'Update Schematic'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id='schematic-form' onSubmit={handleFormSubmit} className='space-y-6'>
            {/* NBT Parsing Status */}
            {isParsingNBT && (
              <Alert>
                <Loader2 className='h-4 w-4 animate-spin' />
                <AlertTitle>Analyzing Schematic</AlertTitle>
                <AlertDescription>
                  Scanning NBT file to extract block information and dimensions...
                </AlertDescription>
              </Alert>
            )}

            {/* Display extracted metadata */}
            {schematicMetadata && !isParsingNBT && (
              <Alert>
                <Info className='h-4 w-4' />
                <AlertTitle>Schematic Analysis Complete</AlertTitle>
                <AlertDescription className='mt-2 space-y-2'>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div>
                      <strong>Dimensions:</strong> {schematicMetadata.dimensions.width} ×{' '}
                      {schematicMetadata.dimensions.height} × {schematicMetadata.dimensions.depth}
                    </div>
                    <div>
                      <strong>Total Blocks:</strong>{' '}
                      {schematicMetadata.dimensions.blockCount.toLocaleString()}
                    </div>
                    <div>
                      <strong>Block Types:</strong>{' '}
                      {schematicMetadata.blockStats?.total || schematicMetadata.blocks.length}
                    </div>
                    <div>
                      <strong>Complexity:</strong> {schematicMetadata.complexity.level}
                    </div>
                    {schematicMetadata.blockStats && (
                      <div>
                        <strong>Vanilla/Modded:</strong> {schematicMetadata.blockStats.vanilla}/
                        {schematicMetadata.blockStats.modded}
                      </div>
                    )}
                    {schematicMetadata.complexity.estimatedBuildTime && (
                      <div>
                        <strong>Build Time:</strong> ~
                        {schematicMetadata.complexity.estimatedBuildTime} min
                      </div>
                    )}
                    {schematicMetadata.requirements.mods &&
                      schematicMetadata.requirements.mods.length > 0 && (
                        <div className='col-span-2'>
                          <strong>Required Mods:</strong>{' '}
                          {Array.isArray(schematicMetadata.requirements.mods)
                            ? schematicMetadata.requirements.mods
                                .map((mod) => (typeof mod === 'object' ? mod.name : mod))
                                .join(', ')
                            : ''}
                        </div>
                      )}
                    {schematicMetadata.materials.primary &&
                      schematicMetadata.materials.primary.length > 0 && (
                        <div className='col-span-2'>
                          <strong>Primary Materials:</strong>{' '}
                          {Array.isArray(schematicMetadata.materials.primary)
                            ? schematicMetadata.materials.primary
                                .map((mat) =>
                                  typeof mat === 'object' ? mat.displayName || mat.name : mat
                                )
                                .join(', ')
                            : ''}
                        </div>
                      )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FileUploadField
                name='schematicFile'
                control={form.control}
                label='Schematic File (.nbt)'
                accept={{ 'application/octet-stream': ['.nbt'] }}
                maxFiles={1}
                value={schematicFilePreview ? [schematicFilePreview] : []}
                onValueChange={async (files) => {
                  const file = files?.[0] ?? null;
                  setSchematicFilePreview(file);
                  form.setValue('schematicFile', file as File);

                  // Parse NBT file when uploaded
                  if (file) {
                    await handleNBTFileUpload(file);
                  }
                }}
              />

              <FileUploadField
                name='imageFiles'
                control={form.control}
                label='Preview Images'
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                maxFiles={5}
                value={imageFilePreviews}
                onValueChange={(files) => {
                  const validFiles = files ?? [];
                  setImageFilePreviews(validFiles);
                  form.setValue('imageFiles', validFiles);
                  onImageChange?.(validFiles);
                }}
              />
            </div>
            <FormInput
              name='title'
              control={form.control}
              label='Title'
              placeholder='Super Cool Contraption'
            />

            <FormMarkdownEditor
              name='description'
              control={form.control}
              label='Description'
              description='Describe how your contraption works and what it does'
              onValueChange={(value) => onValueChange?.('description', value)}
            />

            <CategorySelectors control={form.control} form={form} />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <MultiSelectCheckboxGroup
                name='game_versions'
                control={form.control}
                label='Minecraft Versions'
                description='Select compatible Minecraft versions'
                options={minecraftVersions}
              />

              <MultiSelectCheckboxGroup
                name='create_versions'
                control={form.control}
                label='Create Mod Versions'
                description='Select compatible Create versions'
                options={createVersions}
              />

              <MultiSelectCheckboxGroup
                name='modloaders'
                control={form.control}
                label='Modloaders'
                description='Select compatible modloaders'
                options={modloaders}
              />
            </div>

            {/* Compact Material and Mod Selectors */}
            <div className='space-y-6'>
              {/* Materials Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Building Materials</CardTitle>
                  <CardDescription>
                    Select the primary materials used in this schematic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CompactMaterialSelector control={form.control} detectedBlocks={detectedBlocks} />
                </CardContent>
              </Card>

              {/* Requirements Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Mod Requirements</CardTitle>
                  <CardDescription>
                    Specify which mods are needed to use this schematic
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <CompactModSelector
                    control={form.control}
                    detectedMods={
                      schematicMetadata?.requirements?.mods
                        ? Array.isArray(schematicMetadata.requirements.mods)
                          ? schematicMetadata.requirements.mods.map((mod) =>
                              typeof mod === 'string' ? mod : mod.name
                            )
                          : []
                        : []
                    }
                  />

                  {/* Special Requirements Checkboxes */}
                  <div className='space-y-3 border-t pt-4'>
                    <FormField
                      control={form.control}
                      name='requirements.hasRedstone'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className='space-y-1 leading-none'>
                            <FormLabel>Contains Redstone Circuits</FormLabel>
                            <FormDescription>
                              Check if this schematic includes redstone contraptions
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='requirements.hasCommandBlocks'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className='space-y-1 leading-none'>
                            <FormLabel>Contains Command Blocks</FormLabel>
                            <FormDescription>
                              Check if this schematic uses command blocks
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='materials.hasModded'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className='space-y-1 leading-none'>
                            <FormLabel>Contains Modded Blocks</FormLabel>
                            <FormDescription>
                              Check if this schematic includes blocks from mods
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dimensions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    Dimensions
                    {schematicMetadata && (
                      <Badge variant='secondary' className='gap-1'>
                        <Sparkles className='h-3 w-3' />
                        Auto-detected
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {schematicMetadata
                      ? 'Dimensions automatically detected from your NBT file'
                      : 'Specify the size of your schematic (optional)'}
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='dimensions.width'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width (blocks)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 32'
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                            }
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='dimensions.height'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (blocks)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 64'
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                            }
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='dimensions.depth'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depth (blocks)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 32'
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                            }
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='dimensions.blockCount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Block Count</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 5000'
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                            }
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Complexity Card */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    Complexity
                    {schematicMetadata?.complexity && (
                      <Badge variant='secondary' className='gap-1'>
                        <CheckCircle className='h-3 w-3' />
                        Auto-calculated
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {schematicMetadata?.complexity
                      ? 'Complexity automatically calculated based on NBT analysis'
                      : 'Help users understand the difficulty of building this schematic'}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='complexity.level'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complexity Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select complexity level' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='simple'>Simple - Easy to build</SelectItem>
                            <SelectItem value='moderate'>
                              Moderate - Some experience needed
                            </SelectItem>
                            <SelectItem value='complex'>
                              Complex - Advanced building skills required
                            </SelectItem>
                            <SelectItem value='extreme'>Extreme - Expert level only</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='complexity.buildTime'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Build Time (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g., 30'
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                            }
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Approximate time for an experienced player to build
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <Button
              type='button' // Important : éviter de soumettre le formulaire par défaut
              onClick={() => {
                // Vérifier que form.handleSubmit est bien appelé
                form.handleSubmit(async (data) => {
                  console.log('Form data submitted:', data);
                  try {
                    await onSubmit(data);
                  } catch (error) {
                    console.error('Error submitting form:', error);
                  }
                })();
              }}
              className='w-full'
            >
              {isNew ? 'Upload Schematic' : 'Update Schematic'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
