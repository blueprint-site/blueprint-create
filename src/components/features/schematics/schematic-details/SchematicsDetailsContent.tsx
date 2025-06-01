import type { Schematic } from '@/types';
import { Card, CardContent } from '@/components/ui/card.tsx';
import Gallery from '@/components/ui/gallery';
import VersionsDisplay from '@/components/common/VersionsDisplay.tsx';
import ModLoaders from '../../addons/addon-card/ModLoaders';
import MarkdownDisplay from '@/components/utility/MarkdownDisplay.tsx';

export interface SchematicsDetailsContentProps {
  schematic: Schematic;
}

export const SchematicsDetailsContent = ({ schematic }: SchematicsDetailsContentProps) => {
  return (
    <Card className='mt-4'>
      <CardContent className='space-y-6 pt-2'>
        <div className='flex flex-col items-start gap-8 md:flex-row'>
          <div className='mt-2 w-full md:w-2/3'>
            <Gallery images={schematic.image_urls} />
          </div>
          <div className='flex flex-col items-start gap-4 md:w-1/3'>
            <div className='w-full space-y-4 pt-2'>
              <h2 className='text-xl font-semibold'>Description:</h2>
              <p className='text-foreground-muted'>
                <MarkdownDisplay content={schematic.description}></MarkdownDisplay>
              </p>
            </div>
            <div className='space-y-4'>
              <h3 className='mb-2 text-lg font-semibold'>Create Versions</h3>
              <VersionsDisplay versions={schematic.create_versions} variant='default' />
            </div>
            <div className='space-y-4'>
              <h3 className='mb-2 text-lg font-semibold'>Minecraft Versions</h3>
              <VersionsDisplay versions={schematic.game_versions} variant='secondary' />
              <h3 className='mb-2 text-lg font-semibold'>Modloaders</h3>
              <ModLoaders loaders={schematic.modloaders} />
            </div>
          </div>
        </div>
        {/*<div className='flex flex-col items-start gap-8 md:flex-row'>*/}
        {/*  <div className='w-full space-y-4 pt-2'>*/}
        {/*    <h2 className='text-xl font-semibold'>Description:</h2>*/}
        {/*    <p className='text-foreground-muted whitespace-pre-wrap'>*/}
        {/*      <MarkdownDisplay content={schematic.description}></MarkdownDisplay>*/}
        {/*    </p>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </CardContent>
    </Card>
  );
};
