import { useParams } from 'react-router-dom';
import { Download, Share } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import ModLoaderDisplay from '@/components/common/ModLoaderDisplay.tsx';
import VersionsDisplay from '@/components/common/VersionsDisplay.tsx';
import { useFetchSchematic } from '@/api/endpoints/useSchematics.tsx';
import { useIncrementDownloads } from '@/api/endpoints/useSchematics.tsx';
import TimerProgress from '@/components/utility/TimerProgress';
import { Hourglass } from 'lucide-react';

const SchematicDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: schematic } = useFetchSchematic(id);
  const { mutate: incrementDownloads } = useIncrementDownloads();

  // Retrieve uploadedSchematics as an array from localStorage
  const uploadedSchematics: string[] = JSON.parse(
    localStorage.getItem('uploadedSchematics') || '[]'
  );
  // Parse the current schematic timestamp from uploadedSchematics
  const currentSchematicTimestamp = uploadedSchematics
    .find((entry) => entry.startsWith(`${schematic?.$id}/`))
    ?.split(':')[1];

  // Check if the current schematic ID exists in uploadedSchematics
  const isUploadedByUser = uploadedSchematics.some((entry) =>
    entry.startsWith(`${schematic?.$id}/`)
  );

  // Check if the timestamp is older than 60 seconds
  const isTimerExpired = currentSchematicTimestamp
    ? Date.now() - Number(currentSchematicTimestamp) > 60000
    : false;

  const openUrl = (url: string) => {
    window.open(url, '_');
  };

  if (!schematic) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto mt-10'>
      <Card className='bg-surface-1'>
        <CardHeader className='text-center'>
          <div className='flex w-full justify-between'>
            <div className='flex items-center gap-4 justify-start'>
              {!isTimerExpired && isUploadedByUser && (
                <TimerProgress
                  startTimestamp={Number(currentSchematicTimestamp)}
                  countdownTime={60}
                  description='Processing your upload... Your schematic will be visible to everyone in about a minute'
                  icon={<Hourglass />}
                />
              )}
            </div>
            <div className='flex items-center gap-4 justify-end'>
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

          {isUploadedByUser && (
            <div>
              <p className='mt-2 text-sm text-green-500'>You uploaded this schematic.</p>
            </div>
          )}
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='flex flex-col items-start gap-8 md:flex-row'>
            <div className='w-full md:w-1/2'>
              <img
                src={schematic.image_url}
                alt={schematic.title}
                className='h-auto w-full rounded-lg object-cover shadow-md'
              />
            </div>
            <div className='w-full space-y-4 md:w-1/2'>
              <h2 className='text-xl font-semibold'>Description:</h2>
              <p className='text-foreground-muted whitespace-pre-wrap'>{schematic.description}</p>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <div>
                <h3 className='mb-2 text-lg font-semibold'>Categories</h3>
              </div>
              <div>
                <h3 className='mb-2 text-lg font-semibold'>Create Versions</h3>
                <VersionsDisplay versions={schematic.create_versions} />
              </div>
            </div>
            <div className='space-y-4'>
              <div>
                <h3 className='mb-2 text-lg font-semibold'>Minecraft Versions</h3>
                <VersionsDisplay versions={schematic.game_versions} />
              </div>
              <div>
                <h3 className='mb-2 text-lg font-semibold'>Modloaders</h3>
                <ModLoaderDisplay loaders={schematic.modloaders} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchematicDetails;
