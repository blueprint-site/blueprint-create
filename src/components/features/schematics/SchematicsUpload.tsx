import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Label } from '@/components/ui/label.tsx';
import { LoadingSpinner } from '@/components/loading-overlays/LoadingSpinner.tsx';
import { LoadingSuccess } from '@/components/loading-overlays/LoadingSuccess.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useLoggedUser } from '@/api/context/loggedUser/loggedUserContext.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { databases, storage } from '@/config/appwrite.ts';
import { LoggedUserContextType } from '@/types';
import { redirect } from 'react-router-dom';

function SchematicsUpload() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedSchematic, setUploadedSchematic] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [gameVersions, setGameVersions] = useState<string[]>([]);
  const [createVersions, setCreateVersions] = useState<string[]>([]);
  const [loaders, setLoaders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFinalMessage, setShowFinalMessage] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>();
  const [slug, setSlug] = useState<string>('');
  // Function to generate a slug from the title using regex
  const generateSlug = (text: string) => {
    return text
      .toLowerCase() // Convert to lowercase
      .trim() // Remove whitespace from both ends
      .replace(/[^a-z0-9-\s]/g, '') // Remove special characters except dashes and spaces
      .replace(/\s+/g, '-'); // Replace spaces with dashes
  };

  // Automatically update the slug when the title changes
  useEffect(() => {
    setSlug(generateSlug(title));
  }, [title]);
  const minecraftVersions = [
    // 1.19.x
    '1.19.1',
    '1.19.2',

    // 1.20.x
    '1.20',
    '1.20.1',
    '1.20.2',
    '1.20.3',
    '1.20.4',

    // 1.21.x
    '1.21',
    '1.21.1',
    '1.21.2',
  ];
  const LoggedUser = useLoggedUser();

  // Navigation entre les étapes
  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setProgress(progress + 25);
    }
  };
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 25);
    }
  };

  // Vérification des champs requis avant validation finale
  const validateAndUpload = () => {
    if (
      !uploadedSchematic ||
      !uploadedImage ||
      !title ||
      !description ||
      gameVersions.length === 0 ||
      createVersions.length === 0 ||
      loaders.length === 0
    ) {
      console.log(
        uploadedSchematic,
        uploadedImage,
        title,
        description,
        gameVersions,
        createVersions,
        loaders
      );
      alert('Veuillez remplir tous les champs avant de soumettre.');
      return;
    }
    setLoading(true);
    handleSchematicUpload(uploadedSchematic, uploadedImage, title, description, LoggedUser);
    setTimeout(() => {
      setShowFinalMessage(true);
    }, 3000);
  };
  async function handleSchematicUpload(
    file: File,
    image: File,
    title: string,
    description: string,
    userdata: LoggedUserContextType
  ) {
    try {
      // Upload file to Appwrite storage
      const uploadedFile = await storage.createFile('67b2241e0032c25c8216', 'unique()', file);

      // Upload image to Appwrite storage
      const uploadedImage = await storage.createFile('67b22481001e99d90888', 'unique()', image);
      const fileUrl = storage.getFileDownload('67b2241e0032c25c8216', uploadedFile.$id);
      const imageUrl = storage.getFilePreview('67b22481001e99d90888', uploadedImage.$id);

      const data = {
        title: title,
        description: description,
        schematic_url: fileUrl,
        image_url: imageUrl,
        slug: slug,
        user_id: userdata.user?.$id,
        authors: [userdata.user?.$id],
        game_versions: gameVersions,
        create_versions: createVersions,
        modloaders: loaders,
      };
      // Insert metadata into Appwrite database
      const document = await databases.createDocument(
        '67b1dc430020b4fb23e3',
        '67b2310d00356b0cb53c',
        'unique()',
        data
      );

      console.log('Blueprint uploaded successfully:', document);
    } catch (error) {
      console.error('Error uploading blueprint:', error);
    }
  }

  // Affichage du message de fin
  if (loading && !showFinalMessage) {
    return (
      <div className='loading'>
        <LoadingSpinner />
        <h1>Your schematic is being uploaded!</h1>
      </div>
    );
  }
  if (showFinalMessage) {
    setTimeout(() => {
      redirect('/schematics');
    }, 2000);
    return (
      <div className='final-message'>
        <LoadingSuccess />
      </div>
    );
  }

  return (
    <div className='container'>
      <Card className='mt-8'>
        <CardHeader>
          <CardTitle className='text-center'>Let's upload a schematic</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className='mb-4' />

          {step === 1 && (
            <div className='container mx-auto p-4'>
              <div className='flex flex-col items-center space-y-6'>
                <div className='w-full max-w-lg'>
                  <h2 className='text-center text-2xl font-semibold'>
                    Upload your schematic (.nbt)
                  </h2>
                  <Input
                    type='file'
                    accept='.nbt'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedSchematic(file);
                      } else {
                        setUploadedSchematic(null);
                      }
                    }}
                    className='w-full rounded-lg border border-gray-300 px-4 py-2'
                  />
                  {uploadedSchematic && (
                    <div className='file-preview mt-2 text-center'>
                      <p className='text-gray-600'>{uploadedSchematic.name}</p>
                    </div>
                  )}
                </div>

                <div className='w-full max-w-lg'>
                  <h2 className='text-center text-2xl font-semibold'>Upload an image</h2>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedImage(file);
                        setUploadedImageUrl(URL.createObjectURL(file));
                      }
                    }}
                    className='w-full rounded-lg border border-gray-300 px-4 py-2'
                  />
                  {uploadedImageUrl ? (
                    <div className='image-preview mt-4 text-center'>
                      <img
                        src={uploadedImageUrl}
                        alt='Uploaded preview'
                        className='h-auto max-w-full rounded-lg shadow-md'
                      />
                    </div>
                  ) : (
                    <div className='image-preview-placeholder mt-4 text-center'>
                      <p className='text-gray-500'>No image selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <h2 className='text-center'>Title & Description</h2>
              <Input
                type='text'
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='mb-2 w-full border p-2'
              />
              <Textarea
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full border p-2'
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className='text-center'>Game Versions</h2>
              <ToggleGroup
                variant='outline'
                type='multiple'
                value={gameVersions}
                onValueChange={setGameVersions}
                className='grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'
              >
                {minecraftVersions.map((version, index) => (
                  <ToggleGroupItem
                    key={index}
                    value={version}
                    className='flex items-center space-x-2'
                  >
                    <Label>{version}</Label>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <h3 className='mt-4'>Create Mod Versions</h3>
              <ToggleGroup
                variant='outline'
                type='multiple'
                value={createVersions}
                onValueChange={setCreateVersions}
                className='grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'
              >
                {['0.5', '0.4'].map((version, index) => (
                  <ToggleGroupItem
                    key={index}
                    value={version}
                    className='flex items-center space-x-2'
                  >
                    <Label>{version}</Label>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <h3 className='mt-4'>Select Loaders</h3>
              <ToggleGroup
                variant='outline'
                type='multiple'
                value={loaders}
                onValueChange={setLoaders}
                className='grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'
              >
                {['fabric', 'forge', 'quilt'].map((loader, index) => (
                  <ToggleGroupItem
                    key={index}
                    value={loader}
                    className='flex items-center space-x-2'
                  >
                    <Label>{loader}</Label>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className='text-center'>Confirm and Upload</h2>
              <div className='flex items-center justify-center'>
                <img
                  src={uploadedImageUrl}
                  alt='Preview'
                  className='mt-2 h-32 w-1/4 items-center object-cover'
                />
              </div>
              <p>
                <strong>Title:</strong> {title}
              </p>
              <p>
                <strong>Description:</strong> {description}
              </p>
              <p>
                <strong>Game Versions:</strong> {gameVersions.join(', ')}
              </p>
              <p>
                <strong>Create Versions:</strong> {createVersions.join(', ')}
              </p>
              <p>
                <strong>Loaders:</strong> {loaders.join(', ')}
              </p>
            </>
          )}
        </CardContent>

        <CardFooter className='flex justify-end gap-2'>
          {step > 1 && <Button onClick={prevStep}>Back</Button>}
          {step < 4 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={validateAndUpload}>Upload</Button>
          )}
        </CardFooter>
      </Card>
      <div id='TOREMOVETHHEYSUCKS' className='h-100'></div>
    </div>
  );
}

export default SchematicsUpload;
