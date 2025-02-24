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
const SchematicDetails = () => {
  const { id } = useParams();
  console.log('id', id);
  const { data: schematicData } = useFetchSchematic(id);
  console.log('schematicData', schematicData);
  const { mutate: incrementDownloads } = useIncrementDownloads();

  const openUrl = (url: string) => {
    window.open(url, '_');
  };

  if (!schematicData) {
    return (
      <div className='text-foreground-muted flex items-center justify-center p-8'>Loading...</div>
    );
  }

  return (
    <div className='container mx-auto mt-10'>
      <Card className='bg-surface-1'>
        <CardHeader className='text-center'>
          <div className='flex items-center justify-end gap-4'>
            <Button variant='default' className='transition-all duration-300 hover:shadow-lg'>
              <Share className='mr-2' /> Share
            </Button>
            <Button
              onClick={() => {
                openUrl(schematicData.schematic_url);
                incrementDownloads(schematicData.$id);
              }}
              variant='success'
              className='transition-all duration-300 hover:shadow-lg'
            >
              <Download className='mr-2' />
              <span className='font-bold'>Download</span>
            </Button>
          </div>
          <CardTitle>
            <h1 className='text-2xl font-bold md:text-3xl'>{schematicData.title}</h1>
          </CardTitle>
          <CardDescription className='text-foreground-muted'>
            By {schematicData.authors}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='flex flex-col items-start gap-8 md:flex-row'>
            <div className='w-full md:w-1/2'>
              <img
                src={schematicData.image_url}
                alt={schematicData.title}
                className='h-auto w-full rounded-lg object-cover shadow-md'
              />
            </div>
            <div className='w-full space-y-4 md:w-1/2'>
              <h2 className='text-xl font-semibold'>Description:</h2>
              <p className='text-foreground-muted whitespace-pre-wrap'>
                {schematicData.description}
              </p>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <div>
                <h3 className='mb-2 text-lg font-semibold'>Categories</h3>
              </div>
              <div>
                <h3 className='mb-2 text-lg font-semibold'>Create Versions</h3>
                <VersionsDisplay versions={schematicData.create_versions} />
              </div>
            </div>
            <div className='space-y-4'>
              <div>
                <h3 className='mb-2 text-lg font-semibold'>Minecraft Versions</h3>
                <VersionsDisplay versions={schematicData.game_versions} />
              </div>
              <div>
                <h3 className='mb-2 text-lg font-semibold'>Modloaders</h3>
                <ModLoaderDisplay loaders={schematicData.modloaders} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div id='TOREMOVETHHEYSUCKS' className='h-50'></div>
    </div>
  );
};

export default SchematicDetails;
