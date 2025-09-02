import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { storage } from '@/config/appwrite';
import { STORAGE_BUCKETS } from '@/config/storage';
import { useUserStore } from '@/api/stores/userStore';
import { SchematicUploadForm } from './SchematicUploadFormTabbed';
import { SchematicPreview } from './SchematicUploadPreview';
import { generateSlug } from '../utils/generateSlug';
import { useSaveSchematics, useFetchSchematic } from '@/api/appwrite/useSchematics';
import type { SchematicFormValues } from '@/types';
import SchematicUploadLoadingOverlay from '@/components/loading-overlays/SchematicUploadLoadingOverlay';
import { compressImageToWebP, calculateCompressionStats } from '@/utils/imageCompression';
import { formatEcoToast, getCompressionLoadingMessage } from '@/utils/ecoFacts';
import { toast } from 'sonner';
import { Leaf } from 'lucide-react';

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
    dimensions: undefined,
    materials: undefined,
    complexity: undefined,
    requirements: undefined,
  });

  useEffect(() => {
    if (id === undefined) {
      setIsNew(true);
      setDataReady(true);
    } else if (!isLoadingExisting) {
      // If we have an ID and loading is done
      if (existingSchematic) {
        // Check if user owns this schematic
        if (existingSchematic.user_id !== user?.$id) {
          alert("You don't have permission to edit this schematic");
          navigate('/profile');
          return;
        }
        setIsNew(false);
        setFormValues(existingSchematic);
        setImagePreviewUrls(existingSchematic.image_urls || []);
        setDataReady(true);
      } else {
        // Schematic not found
        alert('Schematic not found');
        navigate('/profile');
      }
    }
  }, [id, existingSchematic, isLoadingExisting, user?.$id, navigate]);

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
    console.log('onSubmit called with data:', data);

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
      // Upload schematic NBT file
      let schematicUrl = existingSchematic?.schematic_url;
      if (data.schematicFile) {
        toast.info('Uploading schematic file...');
        const uploadedSchematic = await storage.createFile(
          STORAGE_BUCKETS.SCHEMATICS_NBT,
          'unique()',
          data.schematicFile
        );
        schematicUrl = storage
          .getFileDownload(STORAGE_BUCKETS.SCHEMATICS_NBT, uploadedSchematic.$id)
          .toString();
      }

      // Compress and upload preview images
      toast.info(getCompressionLoadingMessage());
      
      let totalOriginalSize = 0;
      let totalCompressedSize = 0;
      
      const uploadedImages = await Promise.all(
        data.imageFiles.map(async (file: File) => {
          try {
            // Compress image to WebP with balanced quality
            const originalSize = file.size;
            totalOriginalSize += originalSize;
            
            const compressedFile = await compressImageToWebP(
              file, 
              85, // Quality: 85 for good balance between quality and size
              1920, // Max width
              1080  // Max height
            );
            
            totalCompressedSize += compressedFile.size;
            
            // Calculate and log compression stats
            const stats = calculateCompressionStats(originalSize, compressedFile.size);
            console.log(`Image compressed: ${stats.originalSize} → ${stats.compressedSize} (saved ${stats.compressionRatio})`);
            
            // Upload compressed file
            const uploadedFile = await storage.createFile(
              STORAGE_BUCKETS.SCHEMATICS_PREVIEWS,
              'unique()',
              compressedFile
            );
            return uploadedFile.$id;
          } catch (compressionError) {
            console.warn('Compression failed, uploading original:', compressionError);
            // Track original size even if compression fails
            totalCompressedSize += file.size;
            // Fallback to original if compression fails
            const uploadedFile = await storage.createFile(
              STORAGE_BUCKETS.SCHEMATICS_PREVIEWS,
              'unique()',
              file
            );
            return uploadedFile.$id;
          }
        })
      );

      if (uploadedImages.length > 0 && totalCompressedSize > 0) {
        // Show eco-friendly message if we compressed images
        const ecoMessage = formatEcoToast(
          totalOriginalSize,
          totalCompressedSize,
          uploadedImages.length
        );
        toast.success(ecoMessage.title, {
          description: ecoMessage.description,
          duration: 8000,
          icon: <Leaf className="text-green-500" />
        });
      } else if (uploadedImages.length > 0) {
        toast.success(`${uploadedImages.length} images uploaded successfully`);
      }

      const imageUrls =
        uploadedImages.length > 0
          ? uploadedImages.map((id) =>
              storage.getFilePreview(STORAGE_BUCKETS.SCHEMATICS_PREVIEWS, id).toString()
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
        subcategories: data.sub_categories || [], // Duplicate for Meilisearch compatibility
        slug,
        status: 'published',
        downloads: existingSchematic?.downloads || 0,
        likes: existingSchematic?.likes || 0,
        // New fields for advanced filtering - using flat structure for Appwrite
        dimensions_width: data.dimensions?.width || existingSchematic?.dimensions_width || 0,
        dimensions_height: data.dimensions?.height || existingSchematic?.dimensions_height || 0,
        dimensions_depth: data.dimensions?.depth || existingSchematic?.dimensions_depth || 0,
        dimensions_blockCount:
          data.dimensions?.blockCount || existingSchematic?.dimensions_blockCount || 0,
        materials_primary: (data.materials?.primary && data.materials.primary.length > 0
          ? typeof data.materials.primary[0] === 'string'
            ? data.materials.primary
            : (data.materials.primary as (string | { name: string })[]).map((m) =>
                typeof m === 'string' ? m : m.name
              )
          : existingSchematic?.materials_primary || []) as string[],
        materials_hasModded:
          data.materials?.hasModded || existingSchematic?.materials_hasModded || false,
        complexity_level:
          data.complexity?.level || existingSchematic?.complexity_level || 'moderate',
        complexity_buildTime:
          data.complexity?.buildTime || existingSchematic?.complexity_buildTime || 30,
        requirements_mods: (data.requirements?.mods && data.requirements.mods.length > 0
          ? typeof data.requirements.mods[0] === 'string'
            ? data.requirements.mods
            : (data.requirements.mods as (string | { name: string })[]).map((m) =>
                typeof m === 'string' ? m : m.name
              )
          : existingSchematic?.requirements_mods || []) as string[],
        requirements_minecraftVersion:
          data.game_versions?.[0] || existingSchematic?.requirements_minecraftVersion || '',
        requirements_hasRedstone:
          data.requirements?.hasRedstone || existingSchematic?.requirements_hasRedstone || false,
        requirements_hasCommandBlocks:
          data.requirements?.hasCommandBlocks ||
          existingSchematic?.requirements_hasCommandBlocks ||
          false,
        isValid: true,
        featured: existingSchematic?.featured || false,
        rating: existingSchematic?.rating || 0,
        uploadDate: existingSchematic?.uploadDate || new Date().toISOString(),
      });

      navigate(`/schematics/${document.$id}/${slug}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to upload schematic: ' + (error as Error).message);
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
            dimensions={formValues.dimensions}
            materials={formValues.materials}
            complexity={formValues.complexity}
            requirements={formValues.requirements}
          />
        </div>
      </div>
    </div>
  );
}

export default SchematicsUpload;
