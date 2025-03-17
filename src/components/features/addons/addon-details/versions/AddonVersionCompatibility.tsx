// src/components/features/addons/addon-details/versions/AddonVersionCompatibility.tsx

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VersionSummaryView } from './VersionSummaryView';
import { VersionMatrixView } from './VersionMatrixView';
import { VersionDetailedView } from './VersionListView';
import { VersionLoadingView } from './VersionLoadingView';
import { VersionDisplay } from '@/types/addons/addon-details';

// Type definitions
export interface AddonVersion {
  id: string;
  name: string;
  version_number: string;
  game_versions: string[];
  loaders: string[];
  dependencies?: Array<{
    project_id: string;
    version_id?: string;
    name?: string;
    slug?: string;
    dependency_type: 'required' | 'optional' | 'incompatible' | 'embedded';
  }>;
  date_published: string;
  is_featured?: boolean;
}

export interface AddonVersionCompatibilityProps {
  versions?: AddonVersion[];
  minecraftVersions: string[];
  loaders: string[];
  createVersions?: string[];
  className?: string;
  isLoading?: boolean;
  versionDisplayData?: VersionDisplay;
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
}) => {
  const [view, setView] = useState<'summary' | 'matrix' | 'detailed'>('summary');

  // Use passed-in version display data or default to empty values
  const {
    filteredMinecraftVersions = minecraftVersions,
    uniqueLoaders = loaders,
    uniqueCreateVersions = createVersions,
    sortedVersions = versions,
    featuredVersion = versions[0],
    isCompatible = () => false,
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
