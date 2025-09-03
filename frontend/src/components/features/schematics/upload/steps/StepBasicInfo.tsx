import React, { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
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
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from '@/components/ui/file-uploader';
import { cn } from '@/config/utils';
import {
  Upload,
  FileIcon,
  ImageIcon,
  Info,
  X,
  Check,
  ChevronDown,
  Loader2,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { toast } from '@/hooks/useToast';
import { parseNBTFile } from '@/utils/nbtParser';
import { SCHEMATIC_CATEGORIES } from '@/data/schematicsCategories';
import MarkdownEditor from '@/components/utility/MarkdownEditor';
import type { SchematicFormValues } from '@/types';

export const StepBasicInfo: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SchematicFormValues>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearchOpen, setcategorySearchOpen] = useState(false);
  const [nbtParsing, setNbtParsing] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Watch form values
  const watchedTitle = watch('title') || '';
  const watchedDescription = watch('description') || '';
  const watchedSchematicFile = watch('schematicFile');
  const watchedImageFiles = watch('imageFiles') || [];
  const watchedCategories = watch('categories') || [];

  // Handle NBT file upload and parsing
  const handleNBTFileUpload = useCallback(
    async (files: File[] | null) => {
      if (!files || files.length === 0) {
        setValue('schematicFile', undefined);
        return;
      }

      const file = files[0];
      setValue('schematicFile', file);
      setNbtParsing(true);

      try {
        const result = await parseNBTFile(file);

        if (result.success && result.data) {
          // Auto-populate dimensions from NBT
          if (result.data.dimensions) {
            setValue('width', result.data.dimensions.width);
            setValue('height', result.data.dimensions.height);
            setValue('depth', result.data.dimensions.depth);
          }

          // Auto-populate block count
          if (result.data.blockCount) {
            setValue('totalBlocks', result.data.blockCount);
          }

          // Auto-populate materials
          if (result.data.materials && result.data.materials.length > 0) {
            setValue('materials', result.data.materials.slice(0, 10)); // Top 10 materials
          }

          // Auto-detect modded blocks
          if (result.data.moddedBlocks && result.data.moddedBlocks.length > 0) {
            setValue('hasModdedBlocks', true);
            setValue(
              'requiredMods',
              result.data.moddedBlocks.map((b) => b.modId)
            );
          }

          // Auto-detect redstone
          if (result.data.hasRedstone) {
            setValue('hasRedstone', true);
          }

          // Auto-detect command blocks
          if (result.data.hasCommandBlocks) {
            setValue('hasCommandBlocks', true);
          }

          toast({
            title: 'Schematic Analyzed',
            description: `Successfully extracted data from ${file.name}`,
          });
        }
      } catch (error) {
        console.error('Failed to parse NBT file:', error);
        toast({
          title: 'Analysis Failed',
          description:
            'Could not extract data from the schematic file, but you can still upload it.',
          variant: 'destructive',
        });
      } finally {
        setNbtParsing(false);
      }
    },
    [setValue]
  );

  // Handle image file uploads
  const handleImageFileUpload = useCallback(
    (files: File[] | null) => {
      if (!files) {
        setValue('imageFiles', []);
        setImagePreviewUrls([]);
        return;
      }

      setValue('imageFiles', files);

      // Create preview URLs
      const urls = files.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls(urls);

      // Cleanup old URLs
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    },
    [setValue]
  );

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    const currentCategories = watchedCategories || [];
    const isSelected = currentCategories.includes(category);

    let newCategories;
    if (isSelected) {
      newCategories = currentCategories.filter((c) => c !== category);
    } else {
      newCategories = [...currentCategories, category];
    }

    setValue('categories', newCategories, { shouldValidate: true });
    setSelectedCategories(newCategories);
  };

  // Character count for title
  const titleCharCount = watchedTitle.length;
  const maxTitleChars = 100;

  return (
    <div className='space-y-6'>
      {/* Help Alert */}
      <Alert>
        <Info className='h-4 w-4' />
        <AlertTitle>Getting Started</AlertTitle>
        <AlertDescription>
          Upload your schematic file (.nbt), add images to showcase your creation, and provide basic
          information to help others discover your work.
        </AlertDescription>
      </Alert>

      {/* NBT File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            Schematic File
          </CardTitle>
          <CardDescription>
            Upload your schematic file in NBT format. We'll automatically extract dimensions and
            materials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader
            value={watchedSchematicFile ? [watchedSchematicFile] : []}
            onValueChange={handleNBTFileUpload}
            dropzoneOptions={{
              accept: {
                'application/octet-stream': ['.nbt', '.schematic'],
              },
              maxFiles: 1,
              maxSize: 50 * 1024 * 1024, // 50MB
            }}
            className='relative'
          >
            <FileInput className='hover:border-primary/50 border-2 border-dashed transition-colors'>
              <div className='flex flex-col items-center justify-center p-8 text-center'>
                {nbtParsing ? (
                  <>
                    <Loader2 className='text-primary mb-4 h-10 w-10 animate-spin' />
                    <p className='text-muted-foreground text-sm'>Analyzing schematic...</p>
                  </>
                ) : (
                  <>
                    <Upload className='text-muted-foreground mb-4 h-10 w-10' />
                    <p className='mb-1 text-sm font-medium'>
                      Drop your schematic file here or click to browse
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      Supports .nbt and .schematic files up to 50MB
                    </p>
                  </>
                )}
              </div>
            </FileInput>
            {watchedSchematicFile && (
              <FileUploaderContent>
                <FileUploaderItem index={0}>
                  <FileIcon className='mr-2 h-4 w-4' />
                  <span className='text-sm'>{watchedSchematicFile.name}</span>
                  <Badge variant='secondary' className='ml-auto'>
                    {(watchedSchematicFile.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                </FileUploaderItem>
              </FileUploaderContent>
            )}
          </FileUploader>
          {errors.schematicFile && (
            <p className='text-destructive mt-2 text-sm'>{errors.schematicFile.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <ImageIcon className='h-5 w-5' />
            Showcase Images
          </CardTitle>
          <CardDescription>
            Add up to 10 images to showcase your schematic. The first image will be used as the
            thumbnail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader
            value={watchedImageFiles}
            onValueChange={handleImageFileUpload}
            dropzoneOptions={{
              accept: {
                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
              },
              maxFiles: 10,
              maxSize: 10 * 1024 * 1024, // 10MB per image
            }}
          >
            <FileInput className='hover:border-primary/50 border-2 border-dashed transition-colors'>
              <div className='flex flex-col items-center justify-center p-6 text-center'>
                <ImageIcon className='text-muted-foreground mb-4 h-10 w-10' />
                <p className='mb-1 text-sm font-medium'>Drop images here or click to browse</p>
                <p className='text-muted-foreground text-xs'>
                  JPG, PNG, GIF, or WEBP up to 10MB each
                </p>
              </div>
            </FileInput>
          </FileUploader>

          {/* Image Preview Gallery */}
          {imagePreviewUrls.length > 0 && (
            <div className='mt-4'>
              <Label className='mb-2 block text-sm font-medium'>Preview</Label>
              <ScrollArea className='h-32 w-full'>
                <div className='flex gap-2'>
                  {imagePreviewUrls.map((url, index) => (
                    <div
                      key={index}
                      className={cn(
                        'group relative overflow-hidden rounded-lg border-2',
                        index === 0 ? 'border-primary' : 'border-border'
                      )}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className='h-28 w-28 object-cover'
                      />
                      {index === 0 && (
                        <Badge className='absolute top-1 left-1 text-xs' variant='default'>
                          Thumbnail
                        </Badge>
                      )}
                      <button
                        type='button'
                        onClick={() => {
                          const newFiles = watchedImageFiles.filter((_, i) => i !== index);
                          handleImageFileUpload(newFiles);
                        }}
                        className='absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100'
                      >
                        <X className='h-4 w-4 text-white drop-shadow-lg' />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          {errors.imageFiles && (
            <p className='text-destructive mt-2 text-sm'>{errors.imageFiles.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Title Input */}
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Give your schematic a descriptive and memorable title</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='relative'>
              <Input
                {...register('title')}
                placeholder='e.g., Medieval Castle with Working Drawbridge'
                maxLength={maxTitleChars}
                className={cn('pr-16', errors.title && 'border-destructive')}
              />
              <span
                className={cn(
                  'absolute top-1/2 right-3 -translate-y-1/2 text-xs',
                  titleCharCount > maxTitleChars * 0.9 ? 'text-warning' : 'text-muted-foreground'
                )}
              >
                {titleCharCount}/{maxTitleChars}
              </span>
            </div>
            {errors.title && <p className='text-destructive text-sm'>{errors.title.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Description with Markdown Editor */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5' />
            Description
          </CardTitle>
          <CardDescription>
            Describe your schematic in detail. You can use markdown for formatting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownEditor
            value={watchedDescription}
            onChange={(value) => setValue('description', value, { shouldValidate: true })}
            placeholder='Describe your creation, its features, how to use it, and any special requirements...'
            minHeight='200px'
          />
          {errors.description && (
            <p className='text-destructive mt-2 text-sm'>{errors.description.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Select one or more categories that best describe your schematic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Popover open={categorySearchOpen} onOpenChange={setcategorySearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={categorySearchOpen}
                className='w-full justify-between'
              >
                <span className='truncate'>
                  {watchedCategories.length === 0
                    ? 'Select categories...'
                    : `${watchedCategories.length} categories selected`}
                </span>
                <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0' align='start'>
              <Command>
                <CommandInput placeholder='Search categories...' />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  {SCHEMATIC_CATEGORIES.filter((cat) => cat.category !== 'All').map((category) => (
                    <CommandGroup key={category.category} heading={category.category}>
                      <CommandItem
                        onSelect={() => handleCategoryToggle(category.category)}
                        className='cursor-pointer'
                      >
                        <div
                          className={cn(
                            'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                            watchedCategories.includes(category.category)
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <Check className='h-4 w-4' />
                        </div>
                        {category.category}
                      </CommandItem>
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Selected Categories Display */}
          {watchedCategories.length > 0 && (
            <div className='mt-3 flex flex-wrap gap-2'>
              {watchedCategories.map((category) => (
                <Badge key={category} variant='secondary' className='py-1 pr-1 pl-2.5'>
                  {category}
                  <button
                    type='button'
                    onClick={() => handleCategoryToggle(category)}
                    className='hover:bg-destructive/20 ml-1.5 rounded-full p-0.5'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {errors.categories && (
            <p className='text-destructive mt-2 text-sm'>{errors.categories.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Tips Alert */}
      <Alert>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Pro Tips</AlertTitle>
        <AlertDescription className='space-y-1'>
          <p>• Use high-quality screenshots from different angles</p>
          <p>• Include both day and night shots if lighting is important</p>
          <p>• Add a clear description of any redstone or technical features</p>
          <p>• Select accurate categories to help users find your schematic</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};
