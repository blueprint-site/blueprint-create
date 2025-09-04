import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from '@/components/ui/file-uploader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { FileText, Info, Upload, Loader2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/useToast';
import { parseNBTWithFunction } from '@/api/appwrite/useNBTParser';
import type { SchematicFormValues } from '@/types';

export function StepFile() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SchematicFormValues>();
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    dimensions?: { width: number; height: number; depth: number };
    blockCount?: number;
    materialCount?: number;
  } | null>(null);
  const schematicFile = watch('schematicFile');

  const handleFileUpload = useCallback(
    async (files: File[] | null) => {
      if (!files || files.length === 0) {
        setValue('schematicFile', undefined);
        setValue('files', []);
        setParseSuccess(false);
        setExtractedData(null);
        return;
      }

      const file = files[0];
      setValue('schematicFile', file);
      setValue('files', files);

      // Start parsing the NBT file
      setIsParsing(true);
      setParseSuccess(false);
      setExtractedData(null);

      try {
        const metadata = await parseNBTWithFunction(file);

        if (metadata) {
          let extractedInfo: typeof extractedData = {};

          // Extract dimensions
          if (metadata.dimensions) {
            setValue('dimensions', {
              width: metadata.dimensions.width,
              height: metadata.dimensions.height,
              depth: metadata.dimensions.depth,
              blockCount: metadata.dimensions.blockCount,
            });

            // Also set individual fields for backward compatibility with TechnicalDetails step
            setValue('width', metadata.dimensions.width);
            setValue('height', metadata.dimensions.height);
            setValue('depth', metadata.dimensions.depth);
            setValue('totalBlocks', metadata.dimensions.blockCount);

            extractedInfo.dimensions = metadata.dimensions;
            extractedInfo.blockCount = metadata.dimensions.blockCount;
          }

          // Extract materials (from primary or mostUsed)
          if (metadata.materials) {
            const materialsList = [];

            // Try to get materials from primary array
            if (Array.isArray(metadata.materials.primary)) {
              metadata.materials.primary.forEach((mat) => {
                const materialName = typeof mat === 'object' ? mat.displayName || mat.name : mat;
                if (materialName && typeof materialName === 'string') {
                  materialsList.push(materialName);
                }
              });
            }

            // Add most used blocks if available
            if (metadata.materials.mostUsed) {
              metadata.materials.mostUsed.slice(0, 10).forEach((block) => {
                if (!materialsList.includes(block.name)) {
                  materialsList.push(block.name);
                }
              });
            }

            if (materialsList.length > 0) {
              setValue('materials', {
                primary: materialsList,
                hasModded: metadata.materials.hasModded || false,
              });
              extractedInfo.materialCount = materialsList.length;
            }

            // Set modded blocks flag
            if (metadata.materials.hasModded) {
              setValue('hasModdedBlocks', true);
            }
          }

          // Extract complexity
          if (metadata.complexity) {
            setValue('complexity', {
              level: metadata.complexity.level,
              buildTime: metadata.complexity.estimatedBuildTime,
            });
          }

          // Extract requirements
          if (metadata.requirements) {
            const modsList = Array.isArray(metadata.requirements.mods)
              ? metadata.requirements.mods
                  .map((mod) => (typeof mod === 'object' ? mod.name : mod))
                  .filter((name) => name && typeof name === 'string')
              : [];

            setValue('requirements', {
              mods: modsList,
              hasRedstone: metadata.requirements.hasRedstone || false,
              hasCommandBlocks: metadata.requirements.hasCommandBlocks || false,
            });

            // Also set individual flags for backward compatibility
            if (metadata.requirements.hasRedstone) {
              setValue('hasRedstone', true);
            }
            if (metadata.requirements.hasCommandBlocks) {
              setValue('hasCommandBlocks', true);
            }
          }

          setExtractedData(extractedInfo);
          setParseSuccess(true);
          toast({
            title: 'Schematic Analyzed',
            description: `Successfully extracted metadata from ${file.name}`,
          });
        } else {
          toast({
            title: 'Analysis Warning',
            description:
              'Could not extract metadata from the schematic, but you can still upload it.',
            variant: 'default',
          });
        }
      } catch (error) {
        console.error('NBT parsing error:', error);
        toast({
          title: 'Analysis Failed',
          description: 'Unable to analyze the schematic file, but upload will continue.',
          variant: 'destructive',
        });
      } finally {
        setIsParsing(false);
      }
    },
    [setValue]
  );

  return (
    <div className='space-y-6'>
      <Alert className='bg-primary/10 border-primary/20'>
        <Info className='h-4 w-4' />
        <AlertTitle>Upload Your Schematic</AlertTitle>
        <AlertDescription>
          Select your .nbt or .schematic file. We'll automatically extract dimensions and materials
          from it.
        </AlertDescription>
      </Alert>

      <FormField
        control={control}
        name='schematicFile'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='flex items-center gap-2 text-base font-semibold'>
              <FileText className='h-5 w-5' />
              Schematic File
            </FormLabel>
            <FormControl>
              <FileUploader
                value={schematicFile ? [schematicFile] : []}
                onValueChange={handleFileUpload}
                dropzoneOptions={{
                  accept: {
                    'application/octet-stream': ['.nbt', '.schematic'],
                  },
                  maxFiles: 1,
                  maxSize: 50 * 1024 * 1024,
                }}
                disabled={isParsing}
              >
                <FileInput className='border-2 border-dashed'>
                  <div className='flex flex-col items-center justify-center p-8'>
                    {isParsing ? (
                      <>
                        <Loader2 className='text-primary mb-4 h-10 w-10 animate-spin' />
                        <p className='mb-1 text-sm font-medium'>Analyzing schematic...</p>
                        <p className='text-muted-foreground text-xs'>
                          Extracting dimensions, materials, and metadata
                        </p>
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
                {schematicFile && (
                  <FileUploaderContent>
                    <FileUploaderItem index={0}>
                      <div className='flex flex-1 items-center'>
                        <FileText className='mr-2 h-4 w-4' />
                        <span className='text-sm'>{schematicFile.name}</span>
                        {parseSuccess && <CheckCircle className='ml-2 h-4 w-4 text-green-500' />}
                      </div>
                      <Badge variant='secondary' className='ml-auto'>
                        {(schematicFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </FileUploaderItem>
                  </FileUploaderContent>
                )}
              </FileUploader>
            </FormControl>
            {errors.schematicFile && (
              <p className='text-destructive mt-2 text-sm'>{errors.schematicFile.message}</p>
            )}
          </FormItem>
        )}
      />

      {/* Show extracted data after successful parsing */}
      {parseSuccess && extractedData && (
        <Alert className='border-green-500/20 bg-green-500/10'>
          <CheckCircle className='h-4 w-4 text-green-500' />
          <AlertTitle>Metadata Extracted Successfully</AlertTitle>
          <AlertDescription>
            <div className='mt-2 space-y-1 text-sm'>
              {extractedData.dimensions && (
                <p>
                  <strong>Dimensions:</strong> {extractedData.dimensions.width} ×{' '}
                  {extractedData.dimensions.height} × {extractedData.dimensions.depth} blocks
                </p>
              )}
              {extractedData.blockCount && (
                <p>
                  <strong>Total Blocks:</strong> {extractedData.blockCount.toLocaleString()}
                </p>
              )}
              {extractedData.materialCount && (
                <p>
                  <strong>Materials Found:</strong> {extractedData.materialCount} different types
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
