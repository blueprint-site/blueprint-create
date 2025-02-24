import { User, Download } from 'lucide-react';

interface AddonStatsProps {
  author: string;
  downloads: number;
}

export const AddonStats = ({ author, downloads }: AddonStatsProps) => (
  <div className='text-foreground-muted mt-3 flex items-center justify-between text-xs'>
    <div className='flex items-center gap-1.5 border-b px-2 pb-1'>
      <User className='h-3.5 w-3.5' />
      <span className='truncate'>{author}</span>
    </div>
    <div className='flex items-center gap-1.5 border-b px-2 pb-1'>
      <Download className='h-3.5 w-3.5' />
      <span>{downloads.toLocaleString()}</span>
    </div>
  </div>
);
