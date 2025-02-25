import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { CloudUpload, Paperclip } from 'lucide-react';
import { schematicFormSchema, type SchematicFormValues } from '@/schemas/schematic.schema.tsx';

// UI Components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import MarkdownEditor from '@/components/utility/MarkdownEditor';



interface SchematicUploadFormProps {
  onSubmit: (data: SchematicFormValues) => Promise<void>;
  options: {
    minecraftVersions: string[];
    createVersionOptions: string[];
    modloaderOptions: string[];
  };
}

interface SchematicUploadFormProps {
  onSubmit: (data: SchematicFormValues) => Promise<void>;
  options: {
    minecraftVersions: string[];
    createVersionOptions: string[];
    modloaderOptions: string[];
  };
  onValueChange?: (field: keyof SchematicFormValues, value: unknown) => void;
  onImageChange?: (file: File) => void;
}

export function SchematicUploadForm({
  onSubmit,
  options,
  onValueChange,
  onImageChange
}: SchematicUploadFormProps) {
  const [schematicFilePreview, setSchematicFilePreview] = useState<File | null>(null);
  const [imageFilePreview, setImageFilePreview] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  // Form setup
  const form = useForm<SchematicFormValues>({
    resolver: zodResolver(schematicFormSchema),
    defaultValues: {
      title: '',
      description: '',
      gameVersions: [],
      createVersions: [],
      modloaders: [],
    },
    mode: 'onChange',
  });

  // Subscribe to form changes for real-time updates
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      if (onValueChange) {
        // Only update specific fields for real-time preview
        if (value.title !== undefined) onValueChange('title', value.title);
        if (value.gameVersions !== undefined) onValueChange('gameVersions', value.gameVersions);
        if (value.createVersions !== undefined) onValueChange('createVersions', value.createVersions);
        if (value.modloaders !== undefined) onValueChange('modloaders', value.modloaders);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onValueChange]);

  // Handle file uploads
  const handleSchematicFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSchematicFilePreview(file);
      form.setValue('schematicFile', file);
      if (onValueChange) {
        onValueChange('schematicFile', file);
      }
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFilePreview(file);
      form.setValue('imageFile', file);
      if (onValueChange) {
        onValueChange('imageFile', file);
      }
      if (onImageChange) {
        onImageChange(file);
      }
    }
  };

  const handleFormSubmit = form.handleSubmit(onSubmit);

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
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Schematic File Upload */}
              <FormField
                control={form.control}
                name="schematicFile"
                render={() => (
                  <FormItem>
                    <FormLabel>Schematic File (.nbt)</FormLabel>
                    <FormControl>
                      <div className="bg-background relative rounded-lg p-2">
                        <div className="outline-1 outline-slate-500 outline-dashed">
                          <div className="flex w-full flex-col items-center justify-center p-8">
                            <CloudUpload className="text-foreground-muted h-10 w-10" />
                            <p className="text-foreground-muted mb-1 text-sm">
                              <span className="font-semibold">Click to upload</span>
                              &nbsp; or drag and drop
                            </p>
                            <p className="text-foreground-muted text-xs">NBT files only</p>
                            <Input
                              type="file"
                              accept=".nbt"
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              onChange={handleSchematicFileChange}
                            />
                          </div>
                        </div>
                        {schematicFilePreview && (
                          <div className="bg-surface-1 mt-2 flex items-center gap-2 rounded p-2">
                            <Paperclip className="h-4 w-4" />
                            <span>{schematicFilePreview.name}</span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>Select a .nbt schematic file to upload</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="imageFile"
                render={() => (
                  <FormItem>
                    <FormLabel>Preview Image</FormLabel>
                    <FormControl>
                      <div className="bg-background relative rounded-lg p-2">
                        <div className="outline-1 outline-slate-500 outline-dashed">
                          <div className="flex w-full flex-col items-center justify-center p-8">
                            <CloudUpload className="text-foreground-muted h-10 w-10" />
                            <p className="text-foreground-muted mb-1 text-sm">
                              <span className="font-semibold">Click to upload</span>
                              &nbsp; or drag and drop
                            </p>
                            <p className="text-foreground-muted text-xs">PNG, JPG or WEBP</p>
                            <Input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              onChange={handleImageFileChange}
                            />
                          </div>
                        </div>
                        {imageFilePreview && (
                          <div className="bg-surface-1 mt-2 flex items-center gap-2 rounded p-2">
                            <Paperclip className="h-4 w-4" />
                            <span>{imageFilePreview.name}</span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>Upload an image of your schematic</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Super Cool Contraption" {...field} />
                  </FormControl>
                  <FormDescription>A descriptive name for your schematic</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                                          <MarkdownEditor
                      value={description}
                      onChange={(value) => {
                        setDescription(value);

                        // Update the field value
                        field.onChange(value);

                        // Force React Hook Form to update
                        form.setValue('description', value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });

                        // Explicitly notify parent component for real-time preview
                        if (onValueChange) {
                          onValueChange('description', value);
                        }
                      }}
                      showCodeBlocks={false}
                      showImages={false}
                      showTables={false}
                      showFrontmatter={false}
                      showSandpack={false}
                      showDiffSource={false}
                      showThematicBreak={false}
                      showLists={false}
                      showUndoRedo={false}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe how your contraption works and what it does
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Game Versions */}
              <FormField
                control={form.control}
                name="gameVersions"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Minecraft Versions</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          const currentValues = field.value || [];
                          const updatedValues = currentValues.includes(value)
                            ? currentValues.filter((v) => v !== value)
                            : [...currentValues, value];
                          field.onChange(updatedValues);
                        }}
                        className="flex flex-col space-y-1">
                        {options.minecraftVersions.map((version) => (
                          <FormItem
                            className="flex items-center space-y-0 space-x-3"
                            key={version}>
                            <FormControl>
                              <RadioGroupItem
                                value={version}
                                checked={field.value?.includes(version)}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{version}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>Select compatible Minecraft versions</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Create Versions */}
              <FormField
                control={form.control}
                name="createVersions"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Create Mod Versions</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          const currentValues = field.value || [];
                          const updatedValues = currentValues.includes(value)
                            ? currentValues.filter((v) => v !== value)
                            : [...currentValues, value];
                          field.onChange(updatedValues);
                        }}
                        className="flex flex-col space-y-1">
                        {options.createVersionOptions.map((version) => (
                          <FormItem
                            className="flex items-center space-y-0 space-x-3"
                            key={version}>
                            <FormControl>
                              <RadioGroupItem
                                value={version}
                                checked={field.value?.includes(version)}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{version}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>Select compatible Create versions</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Modloaders */}
              <FormField
                control={form.control}
                name="modloaders"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Modloaders</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          const currentValues = field.value || [];
                          const updatedValues = currentValues.includes(value)
                            ? currentValues.filter((v) => v !== value)
                            : [...currentValues, value];
                          field.onChange(updatedValues);
                        }}
                        className="flex flex-col space-y-1">
                        {options.modloaderOptions.map((loader) => (
                          <FormItem
                            className="flex items-center space-y-0 space-x-3"
                            key={loader}>
                            <FormControl>
                              <RadioGroupItem
                                value={loader}
                                checked={field.value?.includes(loader)}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{loader}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>Select compatible modloaders</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Upload Schematic
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}