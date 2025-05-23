import { Download, Heart } from 'lucide-react';
import { CardHeader } from '@/components/ui/card';

interface AddonDetailsHeaderProps {
  name: string;
  description: string;
  icon: string;
  downloads: number;
  follows: number;
}

export const AddonDetailsHeader = ({
  name,
  description,
  icon,
  downloads,
  follows,
}: AddonDetailsHeaderProps) => {
  return (
    <CardHeader className='space-y-6'>
      <div className='flex items-start gap-4'>
        <img src={icon} alt={`${name} icon`} className='h-20 w-20 rounded-lg border shadow-sm' />
        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between'>
            <h1 className='mb-2 text-3xl font-bold'>{name}</h1>
          </div>
          <p className='text-muted-foreground text-md'>{description}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Download className='text-muted-foreground h-4 w-4' />
          <span className='text-muted-foreground'>{downloads.toLocaleString()} downloads</span>
        </div>
        {follows > 0 && (
          <div className='flex items-center gap-2'>
            <Heart className='text-muted-foreground h-4 w-4' />
            <span className='text-muted-foreground'>{follows.toLocaleString()} followers</span>
          </div>
        )}
      </div>
    </CardHeader>
  );
};
