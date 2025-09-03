import { User, Download, BadgeCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AddonStatsProps {
  authors: string[];
  downloads: number;
  claimed_by?: string | null;
}

const AddonStats = ({ authors, downloads, claimed_by }: AddonStatsProps) => (
  <div className='text-foreground-muted mt-3 flex items-center justify-between text-xs'>
    <div className='flex items-center gap-0.5 border-b pb-1'>
      <User className='h-3.5' />
      <span className='truncate'>
        {authors && authors.length > 0 ? authors.join(', ') : 'Unknown'}
      </span>
      {claimed_by && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className='text-primary inline text-xs'>
                <BadgeCheck className='text-primary h-3.5' />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              The addon has been verified and it is owned by that user
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <div className='flex items-center gap-0.5 border-b pb-1'>
      <Download className='h-3.5' />
      <span className='mr-1'>{downloads.toLocaleString()}</span>
    </div>
  </div>
);

export default AddonStats;
