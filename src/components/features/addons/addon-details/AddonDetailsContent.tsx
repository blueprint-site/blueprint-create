import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';

import ModLoaderDisplay from '@/components/common/ModLoaderDisplay';
import CategoryBadges from '@/components/features/addons/addon-card/CategoryBadges';
import { ExternalLinks } from '@/components/features/addons/addon-card/ExternalLinks';
import { EnvironmentCompatibility } from './dependencies/EnvironmentCompatibility';
import { DependencySection } from './dependencies/DependencySection';

import { Dependencies } from '@/types/addons/dependencies';

export interface AddonDetailsParams {
  versions: string[];
  loaders: string[];
  categories: string[];
  slug: string;
  availableOn: string[];
  dependencies?: Dependencies;
  clientSide?: string;
  serverSide?: string;
}

export const AddonDetailsContent = ({
  versions = [],
  loaders = [],
  categories = [],
  slug = '',
  availableOn = [],
  dependencies,
  clientSide,
  serverSide,
}: AddonDetailsParams) => {
  // Check if we have any dependencies to display
  const hasDependencies =
    dependencies &&
    ((dependencies.required && dependencies.required.length > 0) ||
      (dependencies.optional && dependencies.optional.length > 0) ||
      (dependencies.incompatible && dependencies.incompatible.length > 0) ||
      (dependencies.embedded && dependencies.embedded.length > 0));

  // Check if we have environment info
  const hasEnvironmentInfo = clientSide ?? serverSide;

  return (
    <CardContent className='py-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='space-y-6'>
          <div>
            <h3 className='mb-3 text-sm font-semibold'>Minecraft Versions</h3>
            <div className='flex flex-wrap gap-2'>
              {versions?.map((version) => (
                <Badge key={version} variant='outline'>
                  {version}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className='mb-3 text-sm font-semibold'>Mod Loaders</h3>
            <ModLoaderDisplay loaders={loaders} />
          </div>

          <div>
            <h3 className='mb-3 text-sm font-semibold'>Categories</h3>
            <CategoryBadges categories={categories} />
          </div>

          {/* Environment Compatibility */}
          {hasEnvironmentInfo && (
            <div>
              <h3 className='mb-3 text-sm font-semibold'>Environment</h3>
              <EnvironmentCompatibility serverSide={serverSide} clientSide={clientSide} />
            </div>
          )}
        </div>

        <div className='space-y-6'>
          {/* Dependencies */}
          {hasDependencies && (
            <div>
              <h3 className='mb-3 text-sm font-semibold'>Dependencies</h3>
              <div className='space-y-4'>
                {dependencies?.required && (
                  <DependencySection
                    title='Required'
                    type='required'
                    dependencies={dependencies.required}
                  />
                )}

                {dependencies?.optional && (
                  <DependencySection
                    title='Optional'
                    type='optional'
                    dependencies={dependencies.optional}
                  />
                )}

                {dependencies?.incompatible && (
                  <DependencySection
                    title='Incompatible'
                    type='incompatible'
                    dependencies={dependencies.incompatible}
                  />
                )}

                {dependencies?.embedded && (
                  <DependencySection
                    title='Embedded'
                    type='embedded'
                    dependencies={dependencies.embedded}
                  />
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className='mb-3 text-sm font-semibold'>Available On</h3>
            <ExternalLinks
              slug={slug}
              curseforge={availableOn.includes('curseforge')}
              modrinth={availableOn.includes('modrinth')}
            />
          </div>
        </div>
      </div>
    </CardContent>
  );
};
