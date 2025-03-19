// src/components/features/addons/addon-details/versions/AddonVersionCompatibility.tsx

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddonVersion } from '@/types/addons/addon-details';
import { normalizeLoaderName } from '@/data/modloaders';
import {
  MatrixTabContent,
  SummaryTabContent,
  TabsLoading,
  VersionsTabContent,
} from '@/components/features/addons/addon-details/versions';

// Props using the new data structure
export interface AddonVersionCompatibilityProps {
  versions?: AddonVersion[];
  minecraftVersions: string[];
  loaders: string[];
  createVersions?: string[];
  className?: string;
  isLoading?: boolean;
  compatibility?: {
    isCompatible: (mcVersion: string, loader: string) => boolean;
  };
}

/**
 * Enhanced version compatibility display component
 * Shows compatibility information in multiple views:
 * - Summary: Simple badges for quick overview
 * - Matrix: Visual matrix of version compatibility
 * - Versions: Per-version details including specific Create mod compatibility
 */
export const AddonVersionCompatibility: React.FC<AddonVersionCompatibilityProps> = ({
  versions = [],
  minecraftVersions = [],
  loaders = [],
  createVersions = [],
  className,
  isLoading = false,
  compatibility,
}) => {
  const [view, setView] = useState<'summary' | 'matrix' | 'versions'>('summary');

  // Create a compatibility check function
  const checkCompatibility = (mcVersion: string, loader: string): boolean => {
    if (!versions || versions.length === 0) return false;

    // Normalize loader name for case-insensitive comparison
    const normalizedLoader = loader.toLowerCase();

    // Check if any version supports this combination
    return versions.some((version) => {
      return (
        version.game_versions.includes(mcVersion) &&
        version.loaders.some((l) => l.toLowerCase() === normalizedLoader)
      );
    });
  };

  // Normalize and deduplicate loader names
  const normalizedLoaders = loaders
    .map(normalizeLoaderName)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Use the provided compatibility function or our local one
  const isCompatible = compatibility?.isCompatible || checkCompatibility;

  return (
    <div className={className}>
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as 'summary' | 'matrix' | 'versions')}
        className='w-full'
      >
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Compatibility</h3>
          <TabsList>
            <TabsTrigger value='summary'>Summary</TabsTrigger>
            <TabsTrigger value='matrix'>Matrix</TabsTrigger>
            <TabsTrigger value='versions'>Versions</TabsTrigger>
          </TabsList>
        </div>

        {isLoading ? (
          <TabsLoading />
        ) : (
          <>
            {/* Summary */}
            <TabsContent value='summary' className='mt-0'>
              <SummaryTabContent
                minecraftVersions={minecraftVersions}
                uniqueLoaders={normalizedLoaders}
                createVersions={createVersions}
                featuredVersion={versions[0]}
              />
            </TabsContent>

            {/* Matrix */}
            <TabsContent value='matrix' className='mt-0'>
              <MatrixTabContent
                minecraftVersions={minecraftVersions}
                loaders={normalizedLoaders}
                isCompatible={isCompatible}
              />
            </TabsContent>

            {/* Versions */}
            <TabsContent value='versions' className='mt-0'>
              <VersionsTabContent sortedVersions={versions} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};
