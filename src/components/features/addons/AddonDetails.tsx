// src/components/features/addons/AddonDetails.tsx
import { useParams } from 'react-router';
import { useAddonData } from '@/hooks/useAddonData';
import { useVersionProcessor, useVersionDisplay } from '../../../hooks/useCreateVersionProcessor';
import { AddonDetailsError } from '@/components/features/addons/addon-details/AddonDetailsError';
import { AddonDetailsLoading } from '@/components/features/addons/addon-details/AddonDetailsLoading';
import { AddonDataView } from '@/components/features/addons/addon-details/utils/AddonDataView';

export default function AddonDetails() {
  const { slug } = useParams();

  // Use our new integrated data hook
  const { data: addon, isLoading, error, gameVersions } = useAddonData(slug);

  // Process version information in a single step
  const versionInfo = useVersionProcessor(addon, gameVersions);

  // Get display features for the versions
  const versionDisplay = useVersionDisplay(versionInfo, addon?.loaders);

  // Handle loading and error states
  if (error) {
    return <AddonDetailsError error={error} />;
  }

  if (isLoading || !addon) {
    return <AddonDetailsLoading />;
  }

  // Extract CurseForge and Modrinth data for compatibility with existing components
  const modrinthData =
    typeof addon.modrinth_raw === 'string' ? JSON.parse(addon.modrinth_raw) : addon.modrinth_raw;

  const curseforgeData =
    typeof addon.curseforge_raw === 'string'
      ? JSON.parse(addon.curseforge_raw)
      : addon.curseforge_raw;

  // Render the addon data view with all the processed information
  return (
    <AddonDataView
      addon={addon}
      modrinthData={modrinthData}
      curseforgeData={curseforgeData}
      modrinthProject={(addon.modrinth?.project as Record<string, unknown>) || null}
      versionInfo={versionInfo}
      isLoadingVersionInfo={false}
      slug={slug}
      // Pass additional version display features
      versionDisplay={versionDisplay}
    />
  );
}
