import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { FileUploader, FileInput } from '@/components/ui/file-uploader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Image, Camera, Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import type { SchematicFormValues } from '@/types';

export function StepImages() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SchematicFormValues>();
  const imageFiles = watch('imageFiles') || [];
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleImageFileUpload = useCallback(
    (files: File[] | null) => {
      if (!files) {
        setValue('imageFiles', []);
        setImagePreviewUrls([]);
        return;
      }

      setValue('imageFiles', files);
      const urls = files.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls(urls);
    },
    [setValue]
  );

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  return (
    <div className='space-y-6'>
      <Alert className='bg-primary/10 border-primary/20'>
        <Camera className='h-4 w-4' />
        <AlertTitle>Showcase Your Creation</AlertTitle>
        <AlertDescription>
          Add up to 5 screenshots from different angles. The first image will be used as the
          thumbnail.
        </AlertDescription>
      </Alert>

      <FormField
        control={control}
        name='imageFiles'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='flex items-center gap-2 text-base font-semibold'>
              <Image className='h-5 w-5' />
              Screenshots
            </FormLabel>
            <FormControl>
              <FileUploader
                value={imageFiles}
                onValueChange={handleImageFileUpload}
                dropzoneOptions={{
                  accept: {
                    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
                  },
                  maxFiles: 5,
                  maxSize: 10 * 1024 * 1024,
                }}
              >
                <FileInput className='min-h-[300px] border-2 border-dashed'>
                  {imagePreviewUrls.length === 0 ? (
                    <div className='flex flex-col items-center justify-center p-8'>
                      <Image className='text-muted-foreground mb-4 h-10 w-10' />
                      <p className='mb-1 text-sm font-medium'>
                        Drop images here or click to browse
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        JPG, PNG, GIF, or WEBP up to 10MB each
                      </p>
                    </div>
                  ) : (
                    <div className='p-4'>
                      <div className='grid grid-cols-3 gap-3'>
                        {imagePreviewUrls.map((url, index) => (
                          <div
                            key={index}
                            className='group relative aspect-video overflow-hidden rounded-md border'
                          >
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className='h-full w-full object-cover'
                            />
                            {index === 0 && (
                              <div className='bg-primary text-primary-foreground absolute top-1 left-1 rounded px-2 py-1 text-xs'>
                                Thumbnail
                              </div>
                            )}
                            <button
                              type='button'
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const newFiles = imageFiles.filter((_, i) => i !== index);
                                handleImageFileUpload(newFiles);
                              }}
                              className='bg-destructive text-destructive-foreground absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100'
                            >
                              <X className='h-3 w-3' />
                            </button>
                          </div>
                        ))}
                        {imageFiles.length < 5 && (
                          <div className='border-muted-foreground/50 hover:border-primary/50 flex aspect-video items-center justify-center rounded-md border-2 border-dashed transition-colors'>
                            <div className='text-center'>
                              <Upload className='text-muted-foreground mx-auto mb-2 h-6 w-6' />
                              <p className='text-muted-foreground text-xs'>Add more</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </FileInput>
              </FileUploader>
            </FormControl>
            {errors.imageFiles && (
              <p className='text-destructive mt-2 text-sm'>{errors.imageFiles.message}</p>
            )}
          </FormItem>
        )}
      />

      <div className='border-primary/20 from-primary/5 to-primary/10 relative mt-6 overflow-hidden rounded-xl border bg-gradient-to-br via-transparent backdrop-blur-sm'>
        <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent'></div>
        <div className='relative p-5'>
          <div className='mb-3 flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500'></div>
            <h4 className='from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-sm font-semibold text-transparent'>
              Pro Tips
            </h4>
          </div>
          <ul className='space-y-2 text-sm'>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>Include both day and night shots if lighting is important</span>
            </li>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>Show different angles and perspectives</span>
            </li>
            <li className='text-foreground/80 hover:text-foreground flex items-start gap-2 transition-colors'>
              <div className='bg-primary/60 mt-2 h-1 w-1 flex-shrink-0 rounded-full'></div>
              <span>Highlight special features or mechanisms</span>
            </li>
          </ul>
        </div>
        <div className='via-primary/30 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent'></div>
      </div>
    </div>
  );
}
