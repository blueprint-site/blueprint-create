// src/components/features/addons/addon-details/versions/VersionMatrixView.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MODLOADER_OPTIONS, STANDARD_LOADER_DISPLAY, normalizeLoaderName } from '@/data/modloaders';

interface VersionMatrixViewProps {
  minecraftVersions: string[];
  isCompatible: (mcVersion: string, loader: string) => boolean;
  loaders?: string[];
}

/**
 * Component that displays a matrix of Minecraft versions and mod loaders
 * showing compatibility between them
 */
export const VersionMatrixView: React.FC<VersionMatrixViewProps> = ({
  minecraftVersions,
  isCompatible,
  loaders = [],
}) => {
  // Normalize and deduplicate loader names
  const normalizedLoaders = loaders
    .map(normalizeLoaderName)
    .filter((value, index, self) => self.indexOf(value) === index);

  // If no loaders provided, use standard loaders
  const standardLoaders =
    normalizedLoaders.length > 0
      ? normalizedLoaders
      : Object.values(STANDARD_LOADER_DISPLAY).filter((loader) =>
          MODLOADER_OPTIONS.some((opt) => opt.value.toLowerCase() === loader.toLowerCase())
        );

  return (
    <Card>
      <CardContent className='overflow-x-auto p-4'>
        <table className='min-w-full border-collapse'>
          <thead>
            <tr>
              <th className='p-2 text-left'>Minecraft</th>
              {standardLoaders.map((loader) => (
                <th key={loader} className='p-2 text-center'>
                  {loader}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {minecraftVersions.map((mcVersion) => (
              <tr key={mcVersion} className='border-t'>
                <td className='p-2 font-medium'>{mcVersion}</td>
                {standardLoaders.map((loader) => {
                  // Check compatibility
                  const compatible = isCompatible(mcVersion, loader);

                  return (
                    <td key={`${mcVersion}-${loader}`} className='p-2 text-center'>
                      {compatible ? (
                        <div
                          className='mx-auto h-4 w-4 rounded-full bg-green-500'
                          title={`Compatible with ${mcVersion} on ${loader}`}
                          aria-label={`Compatible with ${mcVersion} on ${loader}`}
                        />
                      ) : (
                        <div
                          className='mx-auto h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700'
                          title={`Not compatible with ${mcVersion} on ${loader}`}
                          aria-label={`Not compatible with ${mcVersion} on ${loader}`}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
