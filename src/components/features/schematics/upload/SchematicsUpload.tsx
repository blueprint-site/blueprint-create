import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases, storage } from '@/config/appwrite';
import { useLoggedUser } from '@/api/context/loggedUser/loggedUserContext';
import { LoadingSpinner } from '@/components/loading-overlays/LoadingSpinner';
import { LoadingSuccess } from '@/components/loading-overlays/LoadingSuccess';
import { SchematicUploadForm } from './SchematicUploadForm';
import { type SchematicFormValues } from '@/schemas/schematic.schema.tsx';
import { SchematicPreview } from './SchematicUploadPreview';

function SchematicsUpload() {
  const navigate = useNavigate();
  const loggedUser = useLoggedUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]); // Updated for multiple images
  const [formValues, setFormValues] = useState<Partial<SchematicFormValues>>({
    title: '',
    description: '',
    gameVersions: [],
    createVersions: [],
    modloaders: [],
  });

  // Define available options
  const options = {
    minecraftVersions: [
      '1.19.1',
      '1.19.2',
      '1.20',
      '1.20.1',
      '1.20.2',
      '1.20.3',
      '1.20.4',
      '1.21',
      '1.21.1',
      '1.21.2',
    ],
    createVersionOptions: ['0.5', '0.4'],
    modloaderOptions: ['fabric', 'forge', 'quilt'],
  };

  // Form submission
  const onSubmit = async (data: SchematicFormValues) => {
    if (!loggedUser.user) {
      alert('You must be logged in to upload schematics');
      return;
    }

    if (!data.schematicFile) {
      alert('Please upload schematic file');
      return;
    }

    if (!data.imageFiles || data.imageFiles.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      // Upload schematic file
      const uploadedSchematic = await storage.createFile(
        '67b2241e0032c25c8216',
        'unique()',
        data.schematicFile
      );

      // Upload multiple image files
      const uploadedImages = await Promise.all(
        data.imageFiles.map(async (file) => {
          const uploadedFile = await storage.createFile(
            '67b22481001e99d90888',
            'unique()',
            file
          );
          return uploadedFile.$id;
        })
      );

      // Get file URLs
      const schematicUrl = storage.getFileDownload('67b2241e0032c25c8216', uploadedSchematic.$id);
      const imageUrls = uploadedImages.map((id) =>
        storage.getFilePreview('67b22481001e99d90888', id)
      );

      // Create database entry
      const document = await databases.createDocument(
        '67b1dc430020b4fb23e3',
        '67b2310d00356b0cb53c',
        'unique()',
        {
          title: data.title,
          description: data.description,
          schematic_url: schematicUrl,
          image_urls: imageUrls, // Updated to store multiple image URLs
          user_id: loggedUser.user.$id,
          authors: [loggedUser.user.name],
          game_versions: data.gameVersions,
          create_versions: data.createVersions,
          modloaders: data.modloaders,
          slug: data.title.toLowerCase().replace(/\s+/g, '-'),
        }
      );

      console.log('Schematic uploaded successfully:', document);
      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        navigate('/schematics');
      }, 2000);
    } catch (error) {
      console.error('Error uploading schematic:', error);
      alert('Failed to upload schematic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update form values for preview
  const handleFieldChange = (field: keyof SchematicFormValues, value: unknown) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle multiple image previews
  const handleImagePreview = (files: File[]) => {
    const readers = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return reader;
    });

    Promise.all(
      readers.map(
        (reader) =>
          new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
          })
      )
    ).then((urls) => setImagePreviewUrls(urls));
  };

  // Show loading or success states
  if (loading) {
    return (
      <div className="loading">
        <LoadingSpinner />
        <h1>Your schematic is being uploaded!</h1>
      </div>
    );
  }

  if (success) {
    return (
      <div className="final-message">
        <LoadingSuccess />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Upload a Schematic</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div>
          <SchematicUploadForm
            onSubmit={onSubmit}
            options={options}
            onValueChange={handleFieldChange}
            onImageChange={handleImagePreview}
          />
        </div>

        {/* Preview Section */}
        <div>
          <SchematicPreview
            title={formValues.title || ''}
            description={formValues.description || ''}
            imagePreviewUrls={imagePreviewUrls} // Updated to pass multiple image URLs
            gameVersions={formValues.gameVersions || []}
            createVersions={formValues.createVersions || []}
            modloaders={formValues.modloaders || []}
            user={loggedUser.user}
          />
        </div>
      </div>
    </div>
  );
}

export default SchematicsUpload;