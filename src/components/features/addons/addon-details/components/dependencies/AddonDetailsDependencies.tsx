import { CardContent } from '@/components/ui/card';
import { EnvironmentCompatibility } from './EnvironmentCompatibility';
import { DependencySection } from './DependencySection';
import { AddonDetailsDependenciesProps } from '@/types/addons/dependencies';

/**
 * Main component that displays addon dependencies and environment compatibility
 */
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
          <EnvironmentCompatibility serverSide={serverSide} clientSide={clientSide} />
        )}

        {/* Dependencies */}
        {hasDependencies && (
          <div>
            <h3 className='mb-4 text-lg font-medium'>Dependencies</h3>
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
      </div>
    </CardContent>
  );
};
