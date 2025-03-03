import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FileUploadField } from './form/FileUploadField';
import { FormMarkdownEditor } from './form/FormMarkdownEditor';
import { MultiSelectCheckboxGroup } from './form/MultiSelectCheckboxGroup';
import { FormInput } from './form/FormInput';
import { CategorySelectors } from './form/CategorySelectors';
import {SchematicFormValues} from "@/types";
import {schematicFormSchema} from "@/schemas/schematic.schema.tsx";

interface SchematicUploadFormProps {
  onSubmit: (data: SchematicFormValues) => Promise<void>;
  options: {
    minecraftVersions: string[];
    createVersionOptions: string[];
    modloaderOptions: string[];
  };
  onValueChange?: (field: keyof SchematicFormValues, value: unknown) => void;
  onImageChange?: (files: File[]) => void;
}

export function SchematicUploadForm({
  onSubmit,
  options,
  onValueChange,
  onImageChange,
}: SchematicUploadFormProps) {
  const [schematicFilePreview, setSchematicFilePreview] = useState<File | null>(null);
  const [imageFilePreviews, setImageFilePreviews] = useState<File[]>([]);

  const form = useForm<SchematicFormValues>({
    resolver: zodResolver(schematicFormSchema),
    defaultValues: {
      title: '',
      description: '',
      gameVersions: [],
      createVersions: [],
      modloaders: [],
      schematicFile: undefined,
      imageFiles: [],
      // Updated to use arrays instead of single strings
      categories: [''],
      subCategories: [''],
    },
    mode: 'onChange',
  });

  React.useEffect(() => {
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
    console.log('Submitting form:', data);
    try {
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
                name='gameVersions'
                control={form.control}
                label='Minecraft Versions'
                description='Select compatible Minecraft versions'
                options={options.minecraftVersions}
              />

              <MultiSelectCheckboxGroup
                name='createVersions'
                control={form.control}
                label='Create Mod Versions'
                description='Select compatible Create versions'
                options={options.createVersionOptions}
              />

              <MultiSelectCheckboxGroup
                name='modloaders'
                control={form.control}
                label='Modloaders'
                description='Select compatible modloaders'
                options={options.modloaderOptions}
              />
            </div>

            <Button type='submit' className='w-full'>
              Upload Schematic
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
