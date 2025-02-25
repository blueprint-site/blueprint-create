import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import { useLoggedUser } from '@/api/context/loggedUser/loggedUserContext.tsx';
import { useNavigate } from 'react-router-dom';
import SchematicUploadLoadingOverlay from '@/components/loading-overlays/SchematicUploadLoadingOverlay';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import { handleSchematicUpload } from './utils/uploadUtils';
import { generateSlug } from './utils/generateSlug';

function SchematicsUpload() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedSchematic, setUploadedSchematic] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [gameVersions, setGameVersions] = useState<string[]>([]);
  const [createVersions] = useState<string[]>(['0.5', '0.4']);
  const [loaders, setLoaders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('Buildings');
  const [subCategory, setSubCategory] = useState<string>('Houses');
  const [showFinalMessage, setShowFinalMessage] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [documentId, setDocumentId] = useState<string>('');
  const LoggedUser = useLoggedUser();

  useEffect(() => {
    setSlug(generateSlug(title));
  }, [title]);

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

  const validateAndUpload = async () => {
    if (
      !uploadedSchematic ||
      !uploadedImage ||
      !title ||
      !description ||
      !category ||
      !subCategory ||
      gameVersions.length === 0 ||
      createVersions.length === 0 ||
      loaders.length === 0
    ) {
      alert('Please fill all fields before submitting.');
      return;
    }
    setLoading(true);
    const document = await handleSchematicUpload(
      uploadedSchematic,
      uploadedImage,
      title,
      description,
      LoggedUser,
      slug,
      category,
      subCategory,
      gameVersions,
      createVersions,
      loaders
    );
    if (document) {
      setDocumentId(document.$id);
      setShowFinalMessage(true);
    }
    setLoading(false);
  };

  if (loading && !showFinalMessage) {
    return <SchematicUploadLoadingOverlay />;
  }

  if (showFinalMessage) {
    navigate(`/schematics/${documentId}/${slug}`);
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
            <Step1
              uploadedSchematic={uploadedSchematic}
              setUploadedSchematic={setUploadedSchematic}
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
            />
          )}

          {step === 2 && (
            <Step2
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              category={category}
              setCategory={setCategory}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
            />
          )}

          {step === 3 && (
            <Step3
              gameVersions={gameVersions}
              setGameVersions={setGameVersions}
              loaders={loaders}
              setLoaders={setLoaders}
            />
          )}

          {step === 4 && (
            <Step4
              uploadedImageUrl={uploadedImageUrl}
              title={title}
              description={description}
              gameVersions={gameVersions}
              createVersions={createVersions}
              loaders={loaders}
            />
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