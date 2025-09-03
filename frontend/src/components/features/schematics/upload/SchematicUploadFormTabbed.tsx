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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Loader2,
  Sparkles,
  CheckCircle,
  Upload,
  FileText,
  Package,
  Settings,
  Check,
  Layers,
  Clock,
  Gauge,
  AlertCircle,
} from 'lucide-react';
import { FileUploadField } from './form/FileUploadField';
import { FormMarkdownEditor } from './form/FormMarkdownEditor';
import { MultiSelectCheckboxGroup } from './form/MultiSelectCheckboxGroup';
import { FormInput } from './form/FormInput';
import { CategorySelectors } from './form/CategorySelectors';
import { CompactMaterialSelector } from './form/CompactMaterialSelector';
import { CompactModSelector } from './form/CompactModSelector';
import type { Schematic, SchematicFormValues } from '@/types';
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
    const fileMetadata = await storage.getFile(bucketId, fileId);
    const fileName = fileMetadata.name || defaultName;
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
  const matchDownload = url.match(/buckets\/([^/]+)\/files\/([^/]+)\/download/);
  if (matchDownload) {
    return { bucketId: matchDownload[1], fileId: matchDownload[2], type: 'download' };
  }
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
  const [activeTab, setActiveTab] = useState('basic');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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

  // Load existing files
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
            form.setValue('schematicFile', schematicFile);
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

        const validImageFiles = imageFiles.filter((file) => file !== null) as File[];
        setImageFilePreviews((prev) => {
          const newImageFiles = validImageFiles.filter(
            (newFile) => !prev.some((file) => file.name === newFile.name)
          );
          const updatedPreviews = [...prev, ...newImageFiles];
          form.setValue('imageFiles', updatedPreviews);
          return updatedPreviews;
        });
      }
    }

    fetchExistingFiles();
  }, [existingData, form]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...form.getValues(),
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
      let metadata = await parseNBTWithFunction(file);

      if (!metadata) {
        console.log('Server-side parsing failed, trying client-side...');
        metadata = await parseNBTFile(file);
      }

      if (metadata) {
        setSchematicMetadata(metadata);

        // Process detected blocks
        const totalBlocks = metadata.dimensions.blockCount || 1;
        const processedBlocks = metadata.blocks
          .map((block) => ({
            name: block.name,
            count: block.count,
            percentage: (block.count / totalBlocks) * 100,
          }))
          .sort((a, b) => b.count - a.count);

        setDetectedBlocks(processedBlocks);

        // Auto-populate form fields
        form.setValue('dimensions', {
          width: metadata.dimensions.width,
          height: metadata.dimensions.height,
          depth: metadata.dimensions.depth,
          blockCount: metadata.dimensions.blockCount,
        });

        const primaryMaterials =
          Array.isArray(metadata.materials.primary) && metadata.materials.primary.length > 0
            ? metadata.materials.primary.map((mat) =>
                typeof mat === 'object' ? mat.displayName || mat.name : mat
              )
            : metadata.materials.primary || [];

        form.setValue('materials', {
          primary: Array.isArray(primaryMaterials)
            ? primaryMaterials.filter((m) => typeof m === 'string')
            : [],
          hasModded: metadata.materials.hasModded,
        });

        form.setValue('complexity', {
          level: metadata.complexity.level,
          buildTime: metadata.complexity.estimatedBuildTime,
        });

        const requiredMods =
          Array.isArray(metadata.requirements.mods) && metadata.requirements.mods.length > 0
            ? metadata.requirements.mods.map((mod) => (typeof mod === 'object' ? mod.name : mod))
            : metadata.requirements.mods || [];

        form.setValue('requirements', {
          mods: Array.isArray(requiredMods)
            ? requiredMods.filter((m) => typeof m === 'string')
            : [],
          modsDetected: Array.isArray(requiredMods)
            ? requiredMods.filter((m) => typeof m === 'string')
            : [],
          hasRedstone: metadata.requirements.hasRedstone,
          hasCommandBlocks: metadata.requirements.hasCommandBlocks,
        });

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

  const handleFormSubmit = form.handleSubmit(
    async (data) => {
      try {
        console.log('Form submission started with data:', data);
        setValidationErrors([]); // Clear any previous validation errors
        await onSubmit(data);
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error uploading schematic: ' + (error as Error).message);
      }
    },
    (errors) => {
      console.error('Form validation errors:', errors);

      // Create a user-friendly error message
      const errorMessages: string[] = [];

      if (errors.title) {
        errorMessages.push(`Title: ${errors.title.message}`);
      }
      if (errors.description) {
        errorMessages.push(`Description: ${errors.description.message}`);
      }
      if (errors.schematicFile) {
        errorMessages.push(`Schematic File: ${errors.schematicFile.message}`);
      }
      if (errors.categories) {
        errorMessages.push(`Categories: ${errors.categories.message}`);
      }
      if (errors.game_versions) {
        errorMessages.push(`Game Versions: ${errors.game_versions.message}`);
      }

      // Set validation errors to show in UI
      setValidationErrors(
        errorMessages.length > 0
          ? errorMessages
          : ['Please check all required fields are filled correctly']
      );

      // Determine which tab contains the first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        // Map field names to tabs
        if (['title', 'description'].includes(firstErrorField)) {
          setActiveTab('basic');
        } else if (['schematicFile', 'imageFiles'].includes(firstErrorField)) {
          setActiveTab('files');
        } else if (
          [
            'game_versions',
            'create_versions',
            'modloaders',
            'categories',
            'sub_categories',
          ].includes(firstErrorField)
        ) {
          setActiveTab('versions');
        } else if (firstErrorField.startsWith('materials')) {
          setActiveTab('materials');
        } else if (
          firstErrorField.startsWith('dimensions') ||
          firstErrorField.startsWith('complexity') ||
          firstErrorField.startsWith('requirements')
        ) {
          setActiveTab('advanced');
        }

        // Scroll to the error after tab change
        setTimeout(() => {
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  );

  // Check if minimum required fields are filled
  const watchedFields = form.watch();
  const isFormValid = !!(
    watchedFields.title &&
    watchedFields.description &&
    (watchedFields.schematicFile || existingData?.schematic_url) &&
    watchedFields.categories?.[0] &&
    watchedFields.game_versions?.length > 0
  );

  // Get tab completion status
  const getTabStatus = (tab: string) => {
    switch (tab) {
      case 'basic':
        return !!(
          watchedFields.title &&
          watchedFields.description &&
          watchedFields.categories?.[0]
        );
      case 'files':
        return !!(watchedFields.schematicFile || existingData?.schematic_url);
      case 'compatibility':
        return !!(
          watchedFields.game_versions?.length > 0 && watchedFields.create_versions?.length > 0
        );
      case 'materials':
        return true; // Optional tab
      case 'advanced':
        return true; // Optional tab
      default:
        return false;
    }
  };

  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>{isNew ? 'Upload a Schematic' : 'Edit Schematic'}</CardTitle>
            <CardDescription>
              Fill out the details about your schematic to share with the community
            </CardDescription>
          </div>
          <Button
            type='submit'
            form='schematic-form'
            disabled={!isFormValid}
            size='lg'
            className='gap-2'
          >
            <Upload className='h-4 w-4' />
            {isNew ? 'Upload Schematic' : 'Update Schematic'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id='schematic-form' onSubmit={handleFormSubmit}>
            {/* Validation Errors Alert */}
            {validationErrors.length > 0 && (
              <Alert variant='destructive' className='mb-6'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Validation Errors</AlertTitle>
                <AlertDescription>
                  <ul className='mt-2 list-inside list-disc space-y-1'>
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* NBT Analysis Alert */}
            {(isParsingNBT || schematicMetadata) && (
              <div className='mb-6'>
                {isParsingNBT && (
                  <Alert>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <AlertTitle>Analyzing Schematic</AlertTitle>
                    <AlertDescription>
                      Scanning NBT file to extract block information and dimensions...
                    </AlertDescription>
                  </Alert>
                )}

                {schematicMetadata && !isParsingNBT && (
                  <Alert>
                    <CheckCircle className='h-4 w-4 text-green-500' />
                    <AlertTitle>Schematic Analysis Complete</AlertTitle>
                    <AlertDescription className='mt-2 space-y-2'>
                      <div className='grid grid-cols-2 gap-2 text-sm md:grid-cols-4'>
                        <div>
                          <strong>Dimensions:</strong> {schematicMetadata.dimensions.width} ×{' '}
                          {schematicMetadata.dimensions.height} ×{' '}
                          {schematicMetadata.dimensions.depth}
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
                          <strong>Complexity:</strong>{' '}
                          <span className='capitalize'>{schematicMetadata.complexity.level}</span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                setValidationErrors([]); // Clear errors when changing tabs
              }}
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-5'>
                <TabsTrigger value='basic' className='gap-1'>
                  <FileText className='h-4 w-4' />
                  <span className='hidden sm:inline'>Basic</span>
                  {getTabStatus('basic') && <Check className='ml-1 h-3 w-3 text-green-500' />}
                </TabsTrigger>
                <TabsTrigger value='files' className='gap-1'>
                  <Upload className='h-4 w-4' />
                  <span className='hidden sm:inline'>Files</span>
                  {getTabStatus('files') && <Check className='ml-1 h-3 w-3 text-green-500' />}
                </TabsTrigger>
                <TabsTrigger value='compatibility' className='gap-1'>
                  <Settings className='h-4 w-4' />
                  <span className='hidden sm:inline'>Versions</span>
                  {getTabStatus('compatibility') && (
                    <Check className='ml-1 h-3 w-3 text-green-500' />
                  )}
                </TabsTrigger>
                <TabsTrigger value='materials' className='gap-1'>
                  <Package className='h-4 w-4' />
                  <span className='hidden sm:inline'>Materials</span>
                  {detectedBlocks.length > 0 && (
                    <Badge variant='secondary' className='ml-1 h-4 px-1 text-[10px]'>
                      {detectedBlocks.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value='advanced' className='gap-1'>
                  <Sparkles className='h-4 w-4' />
                  <span className='hidden sm:inline'>Advanced</span>
                  {schematicMetadata && (
                    <Badge variant='secondary' className='ml-1 h-4 px-1 text-[10px]'>
                      Auto
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value='basic' className='mt-6 space-y-6'>
                <FormInput
                  name='title'
                  control={form.control}
                  label='Title'
                  placeholder='My Amazing Contraption'
                  description='Give your schematic a descriptive title'
                />

                <FormMarkdownEditor
                  name='description'
                  control={form.control}
                  label='Description'
                  description='Describe how your contraption works and what it does. Markdown is supported.'
                  onValueChange={(value) => onValueChange?.('description', value)}
                />

                <CategorySelectors control={form.control} form={form} />
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value='files' className='mt-6 space-y-6'>
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
              </TabsContent>

              {/* Compatibility Tab */}
              <TabsContent value='compatibility' className='mt-6 space-y-6'>
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
              </TabsContent>

              {/* Materials & Requirements Tab */}
              <TabsContent value='materials' className='mt-6 space-y-6'>
                <CompactMaterialSelector control={form.control} detectedBlocks={detectedBlocks} />

                <div className='border-t pt-6'>
                  <CompactModSelector
                    control={form.control}
                    detectedMods={form.watch('requirements.modsDetected') || []}
                  />
                </div>

                <div className='space-y-3 border-t pt-4'>
                  <h3 className='text-sm font-medium'>Special Features</h3>
                  <div className='space-y-3'>
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
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value='advanced' className='mt-6 space-y-6'>
                {/* Dimensions */}
                <div>
                  <div className='mb-4 flex items-center gap-2'>
                    <Layers className='text-muted-foreground h-5 w-5' />
                    <h3 className='text-lg font-semibold'>Dimensions</h3>
                    {schematicMetadata && (
                      <Badge variant='secondary' className='gap-1'>
                        <Sparkles className='h-3 w-3' />
                        Auto-detected
                      </Badge>
                    )}
                  </div>
                  <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                    <FormField
                      control={form.control}
                      name='dimensions.width'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width (blocks)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='32'
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
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
                              placeholder='64'
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
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
                              placeholder='32'
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
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
                          <FormLabel>Total Blocks</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='5000'
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Complexity */}
                <div>
                  <div className='mb-4 flex items-center gap-2'>
                    <Gauge className='text-muted-foreground h-5 w-5' />
                    <h3 className='text-lg font-semibold'>Complexity</h3>
                    {schematicMetadata?.complexity && (
                      <Badge variant='secondary' className='gap-1'>
                        <CheckCircle className='h-3 w-3' />
                        Auto-calculated
                      </Badge>
                    )}
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                                Complex - Advanced skills required
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
                            <div className='relative'>
                              <Clock className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                              <Input
                                type='number'
                                placeholder='30'
                                className='pl-10'
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value ? parseInt(e.target.value) : undefined
                                  )
                                }
                                value={field.value || ''}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Approximate time for an experienced player
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
