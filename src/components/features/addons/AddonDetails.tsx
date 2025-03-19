// src/components/features/addons/AddonDetails.tsx
import { useParams } from 'react-router';
import { AddonDetailsError } from '@/components/features/addons/addon-details/AddonDetailsError';
import { AddonDetailsLoading } from '@/components/features/addons/addon-details/AddonDetailsLoading';
import { AddonDetailsView } from './addon-details/AddonDetailsView';
import {
  useFetchAddonBySlug,
  useFetchModrinthProject,
  useFetchModrinthVersions,
  useFetchModrinthDependencies,
} from '@/api';
import { IntegratedAddonData } from '@/types/addons/addon-details';
import { getAddonCreateVersionsFromVersions } from '@/utils/createCompatibility';

export default function AddonDetails() {
  const { slug } = useParams<{ slug: string }>();

  const { data: addon, isLoading: isLoadingAddon, error: errorAddon } = useFetchAddonBySlug(slug);

  const {
    data: modrinthProject,
    isLoading: isLoadingModrinth,
    error: errorModrinth,
  } = useFetchModrinthProject(slug);

  const {
    data: versions,
    isLoading: isLoadingVersions,
    error: errorVersions,
  } = useFetchModrinthVersions(slug);

  const {
    data: dependencies,
    isLoading: isLoadingDependencies,
    error: errorDependencies,
  } = useFetchModrinthDependencies(slug);

  const versionMap = versions?.map((version) => {
    return {
      id: version.id,
      project_id: version.project_id,
      version_number: version.version_number,
    };
  });
  console.log(versionMap);
  // Combine potential errors
  const error = errorAddon || errorModrinth || errorVersions || errorDependencies;

  if (error) {
    return <AddonDetailsError error={error} />;
  }

  const isLoading =
    isLoadingAddon || isLoadingModrinth || isLoadingVersions || isLoadingDependencies;

  // Check for loading and data existence
  if (isLoading || !addon || !modrinthProject || !versions || !dependencies) {
    return <AddonDetailsLoading />;
  }

  // Parse JSON data safely
  const curseforgeObject = addon.curseforge_raw ? JSON.parse(addon.curseforge_raw) : null;
  console.log(curseforgeObject);
  const modrinthObject = addon.modrinth_raw ? JSON.parse(addon.modrinth_raw) : null;

  // Extract Create versions from the addon versions
  const createVersions = getAddonCreateVersionsFromVersions(versions);
  console.log('Detected Create versions:', createVersions);

  // Build the integrated data object with proper types
  const data: IntegratedAddonData = {
    ...addon,
    curseforgeObject,
    modrinthObject,
    modrinth: {
      ...modrinthProject,
      versions: versions,
      dependencies: dependencies.projects || [],
    },
  };

  return <AddonDetailsView addon={data} createVersions={createVersions} />;
}
