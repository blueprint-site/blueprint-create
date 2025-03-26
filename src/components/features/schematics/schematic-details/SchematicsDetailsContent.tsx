import { Schematic } from '@/types';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { MultiImageViewer } from '@/components/utility/MultiImageViewer.tsx';
import VersionsDisplay from '@/components/common/VersionsDisplay.tsx';
import ModLoaders from '../../addons/addon-card/ModLoaders';

export interface SchematicsDetailsContentProps {
  schematic: Schematic;
}

export const SchematicsDetailsContent = ({ schematic }: SchematicsDetailsContentProps) => {
  return (
    <Card className={'mt-4'}>
      <CardContent className='space-y-6'>
        <div className='flex flex-col items-start gap-8 md:flex-row'>
          <div className='mt-2 w-full md:w-1/2'>
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
            <ModLoaders loaders={schematic.modloaders} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
