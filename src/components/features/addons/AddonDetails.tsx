// src/components/features/addons/AddonDetails.tsx
import { useParams } from 'react-router';

import AddonDetailsError from './addon-details/AddonDetailsError';
import AddonDetailsLoading from './addon-details/AddonDetailsLoading';
import AddonDetailsView from './addon-details/AddonDetailsView';

import {
  useFetchAddonBySlug,
  useFetchModrinthProject,
  useFetchModrinthVersions,
  useFetchModrinthDependencies,
} from '@/api';

import type { IntegratedAddonData } from '@/types';
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

  const error = errorAddon || errorModrinth || errorVersions || errorDependencies;

  if (error) return <AddonDetailsError error={error} />;

  const isLoading =
    isLoadingAddon || isLoadingModrinth || isLoadingVersions || isLoadingDependencies;

  if (isLoading || !addon || !modrinthProject || !versions || !dependencies) {
    return <AddonDetailsLoading />;
  }

  const curseforgeObject = addon.curseforge_raw ? JSON.parse(addon.curseforge_raw) : null;
  const modrinthObject = addon.modrinth_raw ? JSON.parse(addon.modrinth_raw) : null;
  const createVersions = getAddonCreateVersionsFromVersions(versions);

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
