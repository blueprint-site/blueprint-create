import type { PlatformSelectionProps } from '../types';
import { SiModrinth, SiCurseforge } from '@icons-pack/react-simple-icons';
import { Card, CardContent } from '@/components/ui/card';
import { DialogHeader } from '@/components/ui/dialog';
import { DialogTitle, DialogDescription } from '@radix-ui/react-dialog';

export default function PlatformSelectionStep({
  selectPlatform,
  next,
}: Readonly<PlatformSelectionProps>) {
  const handleCardClick = (platform: 'modrinth' | 'curseforge') => (e: React.MouseEvent) => {
    e.preventDefault();
    selectPlatform(platform);
    next();
  };

  const handleKeyDown = (platform: 'modrinth' | 'curseforge') => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectPlatform(platform);
      next();
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Select a platform</DialogTitle>
        <DialogDescription className='text-muted-foreground text-sm'>
          Choose where your addon is published
        </DialogDescription>
      </DialogHeader>

      <div className='mt-4 grid grid-cols-2 gap-4'>
        <Card
          tabIndex={0}
          className='group cursor-pointer overflow-hidden border-2 transition-all hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none'
          onClick={handleCardClick('modrinth')}
          onKeyDown={handleKeyDown('modrinth')}
          onMouseDown={(e) => e.preventDefault()} // This is the key fix!
        >
          <div className='h-1.5 bg-green-600 transition-colors group-hover:bg-green-700 group-focus:bg-green-700' />
          <CardContent className='flex flex-col items-center justify-center p-5 text-center'>
            <SiModrinth size={48} className='mt-2 mb-4 text-green-600' />
            <h4 className='mb-1 font-medium'>Modrinth</h4>
            <p className='text-muted-foreground text-xs'>Verify addons published on Modrinth</p>
          </CardContent>
        </Card>

        <Card
          tabIndex={0}
          className='group cursor-pointer overflow-hidden border-2 transition-all hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
          onClick={handleCardClick('curseforge')}
          onKeyDown={handleKeyDown('curseforge')}
          onMouseDown={(e) => e.preventDefault()} // This is the key fix!
        >
          <div className='h-1.5 bg-orange-600 transition-colors group-hover:bg-orange-700 group-focus:bg-orange-700' />
          <CardContent className='flex flex-col items-center justify-center p-5 text-center'>
            <SiCurseforge size={48} className='mt-2 mb-4 text-orange-600' />
            <h4 className='mb-1 font-medium'>CurseForge</h4>
            <p className='text-muted-foreground text-xs'>Verify addons published on CurseForge</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
