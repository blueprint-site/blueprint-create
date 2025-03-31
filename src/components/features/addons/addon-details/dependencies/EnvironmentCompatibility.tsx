import { Badge } from '@/components/ui/badge';
import type { EnvironmentCompatibilityProps } from '@/types/addons/dependencies';

/**
 * Renders client and server compatibility information
 */
export const EnvironmentCompatibility = ({
  clientSide,
  serverSide,
}: EnvironmentCompatibilityProps) => {
  if (!clientSide && !serverSide) return null;

  return (
    <div className='grid grid-cols-2 gap-4'>
      {clientSide && (
        <div className='space-y-2'>
          <h4 className='text-muted-foreground text-xs font-medium'>Client</h4>
          <Badge variant={clientSide === 'required' ? 'default' : 'outline'}>
            {clientSide.charAt(0).toUpperCase() + clientSide.slice(1)}
          </Badge>
        </div>
      )}

      {serverSide && (
        <div className='space-y-2'>
          <h4 className='text-muted-foreground text-xs font-medium'>Server</h4>
          <Badge variant={serverSide === 'required' ? 'default' : 'outline'}>
            {serverSide.charAt(0).toUpperCase() + serverSide.slice(1)}
          </Badge>
        </div>
      )}
    </div>
  );
};
