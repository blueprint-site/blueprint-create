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
import type { Schematic, SchematicFormValues } from '@/types'; // From canonical types
import { schematicFormSchema } from '@/schemas/schematic.schema';
import { MODLOADER_OPTIONS, CREATE_VERSIONS, MINECRAFT_VERSIONS } from '@/data';
import { storage } from '@/config/appwrite.ts';
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
