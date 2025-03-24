import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DependencyTooltipProps } from '@/types/addons/dependencies';

/**
 * Renders a tooltip explaining what each dependency type means
 */
export const DependencyTooltip = ({ type }: DependencyTooltipProps) => {
  const tooltipContent =
    {
      required: 'This mod is required for the addon to function properly.',
      optional: 'This mod is recommended but not required.',
      incompatible: 'This mod is known to cause issues when used with this addon.',
      embedded: 'This mod is included within the addon package.',
    }[type] || 'Dependency information';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className='text-muted-foreground ml-1 inline h-3.5 w-3.5 cursor-help' />
        </TooltipTrigger>
        <TooltipContent side='top'>
          <p className='max-w-xs text-xs'>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
