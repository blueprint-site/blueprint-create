import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FileUploadField } from './form/FileUploadField';
import { FormMarkdownEditor } from './form/FormMarkdownEditor';
import { MultiSelectCheckboxGroup } from './form/MultiSelectCheckboxGroup';
import { FormInput } from './form/FormInput';
import { CategorySelectors } from './form/CategorySelectors';
import { Schematic, SchematicFormValues } from '@/types';
import { schematicFormSchema } from '@/schemas/schematic.schema.tsx';
import { MODLOADER_OPTIONS, CREATE_VERSIONS, MINECRAFT_VERSIONS } from '@/data';

interface SchematicUploadFormProps {
  onSubmit: (data: SchematicFormValues) => Promise<void>;
  onValueChange?: (field: keyof SchematicFormValues, value: unknown) => void;
  onImageChange?: (files: File[]) => void;
  initialData?: Partial<SchematicFormValues>;
  isNew?: boolean;
  existingData?: Schematic | null;
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
  const minecraftVersions = MINECRAFT_VERSIONS;
  const createVersions = CREATE_VERSIONS;
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
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...form.getValues(), // Garde les valeurs actuelles
        ...initialData, // Applique les valeurs initiales
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

  const handleFormSubmit = form.handleSubmit(async (data) => {
    try {
      console.log('Submitting form:', data);
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schematic Information</CardTitle>
        <CardDescription>
          Fill out the details about your schematic to share with the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FileUploadField
                name='schematicFile'
                control={form.control}
                label='Schematic File (.nbt)'
                accept={{ 'application/octet-stream': ['.nbt'] }}
                maxFiles={1}
                value={schematicFilePreview ? [schematicFilePreview] : []}
                onValueChange={(files) => {
                  const file = files?.[0] ?? null;
                  setSchematicFilePreview(file);
                  form.setValue('schematicFile', file as File);
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
            <div>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {existingData?.image_urls.map((imageUrl, index) => {
                  return <img key={index} src={imageUrl} alt={imageUrl} />;
                })}
              </div>
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
