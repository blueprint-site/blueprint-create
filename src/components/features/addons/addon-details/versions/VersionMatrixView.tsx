// src/components/features/addons/addon-details/versions/VersionMatrixView.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MODLOADER_OPTIONS } from '@/data/modloaders';

interface VersionMatrixViewProps {
  filteredMinecraftVersions: string[];
  isCompatible: (mcVersion: string, loader: string) => boolean;
}

export const VersionMatrixView: React.FC<VersionMatrixViewProps> = ({
  filteredMinecraftVersions,
  isCompatible,
}) => {
  // Always use standard modloaders for the matrix view
  const standardModloaders = MODLOADER_OPTIONS.filter((opt) => opt.value !== 'all').map(
    (opt) => opt.value
  );

  return (
    <Card>
      <CardContent className='overflow-x-auto p-4'>
        <table className='min-w-full border-collapse'>
          <thead>
            <tr>
              <th className='p-2 text-left'>Minecraft</th>
              {standardModloaders.map((loader) => (
                <th key={loader} className='p-2 text-center'>
                  {loader.charAt(0).toUpperCase() + loader.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMinecraftVersions.map((mcVersion) => (
              <tr key={mcVersion} className='border-t'>
                <td className='p-2 font-medium'>{mcVersion}</td>
                {standardModloaders.map((loader) => (
                  <td key={`${mcVersion}-${loader}`} className='p-2 text-center'>
                    {isCompatible(mcVersion, loader) ? (
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
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
