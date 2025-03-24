import { User, Download } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface AddonStatsProps {
  author: string;
  downloads: number;
  claimed_by: string | null | undefined;
}

export const AddonStats = ({ author, downloads, claimed_by }: AddonStatsProps) => (
  <div className='text-foreground-muted mt-3 flex items-center justify-between text-xs'>
    <div className='flex items-center gap-1.5 border-b px-2 pb-1'>
      <User className='h-3.5 w-3.5' />
      <span className='truncate'>{author}</span>
      {claimed_by && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className='text-primary inline text-xs'>
                <BadgeCheck className='h-3.5 w-3.5 text-black opacity-65' />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              The addon has been verified and it is owned by that user
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <div className='flex items-center gap-1.5 border-b px-2 pb-1'>
      <Download className='h-3.5 w-3.5' />
      <span>{downloads.toLocaleString()}</span>
    </div>
  </div>
);
