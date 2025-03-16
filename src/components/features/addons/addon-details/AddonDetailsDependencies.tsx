import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface Dependency {
  project_id: string;
  version_id?: string;
  file_name?: string;
  dependency_type: 'required' | 'optional' | 'incompatible' | 'embedded';
  name?: string;
  slug?: string;
}

export interface AddonDetailsDependenciesProps {
  dependencies?: {
    required?: Dependency[];
    optional?: Dependency[];
    incompatible?: Dependency[];
    embedded?: Dependency[];
  };
  serverSide?: string;
  clientSide?: string;
}

const DependencyTypeTooltip = ({ type }: { type: string }) => {
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

export const AddonDetailsDependencies = ({
  dependencies,
  serverSide,
  clientSide,
}: AddonDetailsDependenciesProps) => {
  // Check if we have any dependencies to display
  const hasDependencies =
    dependencies &&
    ((dependencies.required && dependencies.required.length > 0) ||
      (dependencies.optional && dependencies.optional.length > 0) ||
      (dependencies.incompatible && dependencies.incompatible.length > 0) ||
      (dependencies.embedded && dependencies.embedded.length > 0));

  // No environment or dependencies info
  if (!hasDependencies && !serverSide && !clientSide) {
    return null;
  }

  return (
    <CardContent className='py-6'>
      <h2 className='mb-6 text-xl font-semibold'>Compatibility</h2>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        {/* Environment Compatibility */}
        {(serverSide || clientSide) && (
          <div>
            <h3 className='mb-4 text-lg font-medium'>Environment</h3>
            <div className='grid grid-cols-2 gap-4'>
              {clientSide && (
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium'>Client</h4>
                  <Badge variant={clientSide === 'required' ? 'default' : 'outline'}>
                    {clientSide.charAt(0).toUpperCase() + clientSide.slice(1)}
                  </Badge>
                </div>
              )}

              {serverSide && (
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium'>Server</h4>
                  <Badge variant={serverSide === 'required' ? 'default' : 'outline'}>
                    {serverSide.charAt(0).toUpperCase() + serverSide.slice(1)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dependencies */}
        {hasDependencies && (
          <div>
            <h3 className='mb-4 text-lg font-medium'>Dependencies</h3>
            <div className='space-y-4'>
              {dependencies?.required && dependencies.required.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='flex items-center text-sm font-medium'>
                    Required <DependencyTypeTooltip type='required' />
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {dependencies.required.map((dep) => (
                      <Badge
                        key={dep.project_id}
                        variant='default'
                        className='flex items-center gap-1'
                      >
                        {dep.name || 'Unknown'}
                        {dep.slug && (
                          <a
                            href={`https://modrinth.com/mod/${dep.slug}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-white/80 hover:text-white'
                            aria-label={`View ${dep.name} on Modrinth`}
                          >
                            <ExternalLink className='h-3 w-3' />
                          </a>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {dependencies?.optional && dependencies.optional.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='flex items-center text-sm font-medium'>
                    Optional <DependencyTypeTooltip type='optional' />
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {dependencies.optional.map((dep) => (
                      <Badge
                        key={dep.project_id}
                        variant='outline'
                        className='flex items-center gap-1'
                      >
                        {dep.name || 'Unknown'}
                        {dep.slug && (
                          <a
                            href={`https://modrinth.com/mod/${dep.slug}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-muted-foreground hover:text-foreground'
                            aria-label={`View ${dep.name} on Modrinth`}
                          >
                            <ExternalLink className='h-3 w-3' />
                          </a>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {dependencies?.incompatible && dependencies.incompatible.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='flex items-center text-sm font-medium'>
                    Incompatible <DependencyTypeTooltip type='incompatible' />
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {dependencies.incompatible.map((dep) => (
                      <Badge
                        key={dep.project_id}
                        variant='destructive'
                        className='flex items-center gap-1'
                      >
                        {dep.name || 'Unknown'}
                        {dep.slug && (
                          <a
                            href={`https://modrinth.com/mod/${dep.slug}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-white/80 hover:text-white'
                            aria-label={`View ${dep.name} on Modrinth`}
                          >
                            <ExternalLink className='h-3 w-3' />
                          </a>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {dependencies?.embedded && dependencies.embedded.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='flex items-center text-sm font-medium'>
                    Embedded <DependencyTypeTooltip type='embedded' />
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {dependencies.embedded.map((dep) => (
                      <Badge
                        key={dep.project_id}
                        variant='secondary'
                        className='flex items-center gap-1'
                      >
                        {dep.name || 'Unknown'}
                        {dep.slug && (
                          <a
                            href={`https://modrinth.com/mod/${dep.slug}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-muted-foreground hover:text-foreground'
                            aria-label={`View ${dep.name} on Modrinth`}
                          >
                            <ExternalLink className='h-3 w-3' />
                          </a>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
};
