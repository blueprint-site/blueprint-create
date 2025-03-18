// src/components/features/addons/addon-details/versions/AddonVersionCompatibility.tsx

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VersionSummaryView } from './VersionSummaryView';
import { VersionMatrixView } from './VersionMatrixView';
import { VersionDetailedView } from './VersionListView';
import { VersionLoadingView } from './VersionLoadingView';
import { VersionDisplay, AddonVersion } from '@/types/addons/addon-details';

// Props using the new data structure
export interface AddonVersionCompatibilityProps {
  versions?: AddonVersion[];
  minecraftVersions: string[];
  loaders: string[];
  createVersions?: string[];
  className?: string;
  isLoading?: boolean;
  versionDisplayData?: VersionDisplay;
  // Direct compatibility object from ProcessedAddonData
  compatibility?: {
    isCompatible: (mcVersion: string, loader: string) => boolean;
  };
}

/**
 * Enhanced version compatibility display component
 * Shows compatibility information in multiple views:
 * - Summary: Simple badges for quick overview
 * - Matrix: Visual matrix of version compatibility
 * - Detailed: Per-version details including specific Create mod compatibility
 */
export const AddonVersionCompatibility: React.FC<AddonVersionCompatibilityProps> = ({
  versions = [],
  minecraftVersions = [],
  loaders = [],
  createVersions = [],
  className,
  isLoading = false,
  versionDisplayData,
  compatibility,
}) => {
  const [view, setView] = useState<'summary' | 'matrix' | 'detailed'>('summary');

  // Prioritize direct compatibility if provided, otherwise use versionDisplayData
  // This provides a migration path from old to new data structure
  const {
    filteredMinecraftVersions = minecraftVersions,
    uniqueLoaders = loaders,
    uniqueCreateVersions = createVersions,
    sortedVersions = versions,
    featuredVersion = versions[0],
    isCompatible = compatibility?.isCompatible || (() => false),
  } = versionDisplayData || {};

  return (
    <div className={className}>
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as 'summary' | 'matrix' | 'detailed')}
        className='w-full'
      >
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Compatibility</h3>
          <TabsList>
            <TabsTrigger value='summary'>Summary</TabsTrigger>
            <TabsTrigger value='matrix'>Matrix</TabsTrigger>
            <TabsTrigger value='detailed'>Detailed</TabsTrigger>
          </TabsList>
        </div>

        {isLoading ? (
          <VersionLoadingView />
        ) : (
          <>
            {/* Summary View */}
            <TabsContent value='summary' className='mt-0'>
              <VersionSummaryView
                filteredMinecraftVersions={filteredMinecraftVersions}
                uniqueLoaders={uniqueLoaders}
                uniqueCreateVersions={uniqueCreateVersions}
                featuredVersion={featuredVersion}
              />
            </TabsContent>

            {/* Matrix View */}
            <TabsContent value='matrix' className='mt-0'>
              <VersionMatrixView
                filteredMinecraftVersions={filteredMinecraftVersions}
                isCompatible={isCompatible}
              />
            </TabsContent>

            {/* Detailed View */}
            <TabsContent value='detailed' className='mt-0'>
              <VersionDetailedView sortedVersions={sortedVersions} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};
