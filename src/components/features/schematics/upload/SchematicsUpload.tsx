import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { storage } from '@/config/appwrite';
import { useUserStore } from '@/api/stores/userStore';
import { SchematicUploadForm } from './SchematicUploadForm';
import { SchematicPreview } from './SchematicUploadPreview';
import { generateSlug } from '../utils/generateSlug';
import { useSaveSchematics, useFetchSchematic } from '@/api/endpoints/useSchematics';
import { SchematicFormValues } from '@/types';
import SchematicUploadLoadingOverlay from '@/components/loading-overlays/SchematicUploadLoadingOverlay';

function SchematicsUpload() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataReady, setDataReady] = useState<boolean>(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isNew, setIsNew] = useState<boolean>(true);
  const { mutateAsync: saveSchematic } = useSaveSchematics();
  const { data: existingSchematic, isLoading: isLoadingExisting } = useFetchSchematic(id);

  const [formValues, setFormValues] = useState<Partial<SchematicFormValues>>({
    title: '',
    description: '',
    game_versions: [],
    create_versions: [],
    modloaders: [],
    categories: [],
    sub_categories: [],
  });

  useEffect(() => {
    if (id === undefined) {
      setIsNew(true);
      setDataReady(true);
    }
    if (existingSchematic) {
      setIsNew(false);
      setFormValues(existingSchematic);
      setImagePreviewUrls(existingSchematic.image_urls || []);
      setDataReady(true); // Définir que les données sont prêtes après mise à jour
    }
  }, [id, existingSchematic]);

  if (loading || isLoadingExisting || !dataReady) {
    return <SchematicUploadLoadingOverlay message='Loading schematic...' />;
  }

  const handleFieldChange = (field: keyof SchematicFormValues, value: unknown): void => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagePreview = (files: File[]): void => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(urls);
  };

  const onSubmit = async (data: SchematicFormValues): Promise<void> => {
    if (!user) {
      alert('You must be logged in to upload schematics');
      return;
    }

    if (!data.schematicFile && !existingSchematic?.schematic_url) {
      alert('Please upload schematic file');
      return;
    }

    setLoading(true);
    try {
      let schematicUrl = existingSchematic?.schematic_url;
      if (data.schematicFile) {
        const uploadedSchematic = await storage.createFile(
          '67b2241e0032c25c8216',
          'unique()',
          data.schematicFile
        );
        schematicUrl = storage
          .getFileDownload('67b2241e0032c25c8216', uploadedSchematic.$id)
          .toString();
      }

      const uploadedImages = await Promise.all(
        data.imageFiles.map(async (file: File) => {
          const uploadedFile = await storage.createFile('67b22481001e99d90888', 'unique()', file);
          return uploadedFile.$id;
        })
      );

      const imageUrls =
        uploadedImages.length > 0
          ? uploadedImages.map((id) =>
              storage.getFilePreview('67b22481001e99d90888', id).toString()
            )
          : existingSchematic?.image_urls || [];

      const slug = generateSlug(data.title);

      const document = await saveSchematic({
        $id: existingSchematic?.$id,
        title: data.title,
        description: data.description,
        schematic_url: schematicUrl,
        image_urls: imageUrls,
        user_id: user?.$id,
        authors: [user.name],
        game_versions: data.game_versions,
        create_versions: data.create_versions,
        modloaders: data.modloaders,
        categories: data.categories,
        sub_categories: data.sub_categories || [],
        slug,
        status: 'published',
        downloads: existingSchematic?.downloads || 0,
        likes: existingSchematic?.likes || 0,
      });

      navigate(`/schematics/${document.$id}/${slug}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-center text-3xl font-bold'>
        {id ? 'Edit Schematic' : 'Upload a Schematic'}
      </h1>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <div>
          <SchematicUploadForm
            isNew={isNew}
            initialData={formValues}
            onSubmit={onSubmit}
            onValueChange={handleFieldChange}
            onImageChange={handleImagePreview}
            existingData={existingSchematic || null}
          />
        </div>

        <div>
          <SchematicPreview
            title={formValues.title || ''}
            description={formValues.description || ''}
            imagePreviewUrls={imagePreviewUrls}
            gameVersions={formValues.game_versions || []}
            createVersions={formValues.create_versions || []}
            modloaders={formValues.modloaders || []}
            user={user}
            categories={formValues.categories || []}
            subCategories={formValues.sub_categories || []}
          />
        </div>
      </div>
    </div>
  );
}

export default SchematicsUpload;
