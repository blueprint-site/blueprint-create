import { useState } from 'react';
import { useNavigate } from 'react-router';
import { storage } from '@/config/appwrite';
import { useUserStore } from '@/api/stores/userStore';
import { SchematicUploadForm } from './SchematicUploadForm';
import { SchematicPreview } from './SchematicUploadPreview';
import { generateSlug } from '../utils/generateSlug';
import { useSaveSchematics } from '@/api/endpoints/useSchematics';
import { SchematicFormValues } from '@/types';
import SchematicUploadLoadingOverlay from '@/components/loading-overlays/SchematicUploadLoadingOverlay';

function SchematicsUpload() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const { mutateAsync: saveSchematic } = useSaveSchematics();

  const [formValues, setFormValues] = useState<Partial<SchematicFormValues>>({
    title: '',
    description: '',
    gameVersions: [],
    createVersions: [],
    modloaders: [],
    categories: [],
    subCategories: [],
  });

  if (loading) {
    return <SchematicUploadLoadingOverlay message='Uploading Schematic...' />;
  }

  // Handle field changes
  const handleFieldChange = (field: keyof SchematicFormValues, value: unknown): void => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image preview
  const handleImagePreview = (files: File[]): void => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(urls);
  };

  // Form submission
  const onSubmit = async (data: SchematicFormValues): Promise<void> => {
    if (!user) {
      alert('You must be logged in to upload schematics');
      return;
    }

    if (!data.schematicFile) {
      alert('Please upload schematic file');
      return;
    }

    setLoading(true);
    try {
      // Upload schematic file
      const uploadedSchematic = await storage.createFile('67b2241e0032c25c8216', 'unique()', data.schematicFile);

      // Upload multiple image files
      const uploadedImages = await Promise.all(
        data.imageFiles.map(async (file: File) => {
          const uploadedFile = await storage.createFile('67b22481001e99d90888', 'unique()', file);
          return uploadedFile.$id;
        })
      );

      // Get file URLs
      const schematicUrl = storage.getFileDownload('67b2241e0032c25c8216', uploadedSchematic.$id).toString();
      const imageUrls = uploadedImages.map((id) => storage.getFilePreview('67b22481001e99d90888', id).toString());

      const slug = generateSlug(data.title);

      // Use the mutation to save to database
      const document = await saveSchematic({
        title: data.title,
        description: data.description,
        schematic_url: schematicUrl,
        image_urls: imageUrls,
        user_id: user?.$id,
        authors: [user.name],
        game_versions: data.gameVersions,
        create_versions: data.createVersions,
        modloaders: data.modloaders,
        categories: data.categories,
        sub_categories: data.subCategories ? data.subCategories : [],
        slug,
        status: 'published',
        downloads: 0,
        likes: 0,
      });

      navigate(`/schematics/${document.$id}/${slug}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SchematicUploadLoadingOverlay message='Uploading schematic...' />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-center text-3xl font-bold'>Upload a Schematic</h1>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Form Section */}
        <div>
          <SchematicUploadForm
            onSubmit={onSubmit}
            onValueChange={handleFieldChange}
            onImageChange={handleImagePreview}
          />
        </div>

        {/* Preview Section */}
        <div>
          <SchematicPreview
            title={formValues.title || ''}
            description={formValues.description || ''}
            imagePreviewUrls={imagePreviewUrls}
            gameVersions={formValues.gameVersions || []}
            createVersions={formValues.createVersions || []}
            modloaders={formValues.modloaders || []}
            user={user}
            categories={formValues.categories || []}
            subCategories={formValues.subCategories || []}
          />
        </div>
      </div>
    </div>
  );
}

export default SchematicsUpload;
