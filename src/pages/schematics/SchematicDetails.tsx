import { useParams } from 'react-router-dom';
import { Download, Share, Hourglass } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import ModLoaderDisplay from '@/components/common/ModLoaderDisplay.tsx';
import VersionsDisplay from '@/components/common/VersionsDisplay.tsx';
import { useFetchSchematic, useIncrementDownloads } from '@/api/endpoints/useSchematics.tsx';
import TimerProgress from '@/components/utility/TimerProgress';
import { useEffect, useState } from 'react';
import { MultiImageViewer } from '@/components/utility/MultiImageViewer';
import { useLoggedUser } from '@/api/context/loggedUser/loggedUserContext';

const SchematicDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: schematic } = useFetchSchematic(id);
  const { mutate: incrementDownloads } = useIncrementDownloads();
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [createdAtTimestamp, setCreatedAtTimestamp] = useState<number | null>(null);
  const LoggedUser = useLoggedUser();
  const userID = LoggedUser.user ? LoggedUser.user.$id : '';

  const isUploadedByUser = userID === schematic?.user_id;
  const currentSchematicTimestamp = schematic?.$createdAt;

  useEffect(() => {
    if (currentSchematicTimestamp) {
      const timestamp = new Date(currentSchematicTimestamp).getTime();
      setCreatedAtTimestamp(timestamp);

      const expirationTime = timestamp + 60000;
      if (Date.now() > expirationTime && isUploadedByUser) {
        setIsTimerComplete(true);
      }
    }
  }, [currentSchematicTimestamp, isUploadedByUser]);

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  if (!schematic) {
    return (
      <div className='text-foreground-muted flex items-center justify-center p-8'>
        Loading...
      </div>
    );
  }

  return (
    <div className='container mx-auto mt-10'>
      <Card className='bg-surface-1'>
        <CardHeader className='text-center'>
          <div className='flex w-full justify-between'>
            <div className='flex items-center justify-start gap-4'>
              {isUploadedByUser && (
                <>
                  {createdAtTimestamp && !isTimerComplete ? (
                    <TimerProgress
                      startTimestamp={createdAtTimestamp}
                      countdownTime={60}
                      description='Processing your upload... Your schematic will be visible to everyone in about a minute'
                      icon={<Hourglass />}
                      onComplete={() => setIsTimerComplete(true)}
                    />
                  ) : (
                    <div className='flex items-center gap-3'>
                      <span className='text-success text-sm font-semibold'>
                        Your schematic is now public!
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className='flex items-center justify-end gap-4'>
              <Button variant='default' className='transition-all duration-300 hover:shadow-lg'>
                <Share className='mr-2' /> Share
              </Button>
              <Button
                onClick={() => {
                  openUrl(schematic.schematic_url);
                  incrementDownloads(schematic.$id);
                }}
                variant='success'
                className='transition-all duration-300 hover:shadow-lg'>
                <Download className='mr-2' />
                <span className='font-bold'>Download</span>
              </Button>
            </div>
          </div>

          <CardTitle>
            <h1 className='text-2xl font-bold md:text-3xl'>{schematic.title}</h1>
          </CardTitle>
          <CardDescription className='text-foreground-muted'>
            By {schematic.authors.join(', ')}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='flex flex-col items-start gap-8 md:flex-row'>
            <div className='w-full md:w-1/2'>
              <MultiImageViewer images={schematic.image_urls} />
            </div>
            <div className='w-full space-y-4 md:w-1/2'>
              <h2 className='text-xl font-semibold'>Description:</h2>
              <p className='text-foreground-muted whitespace-pre-wrap'>{schematic.description}</p>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <h3 className='mb-2 text-lg font-semibold'>Create Versions</h3>
              <VersionsDisplay versions={schematic.create_versions} />
            </div>
            <div className='space-y-4'>
              <h3 className='mb-2 text-lg font-semibold'>Minecraft Versions</h3>
              <VersionsDisplay versions={schematic.game_versions} />
              <h3 className='mb-2 text-lg font-semibold'>Modloaders</h3>
              <ModLoaderDisplay loaders={schematic.modloaders} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchematicDetails;
