// src/components/features/addons/AddonDetails.tsx
import { useParams } from 'react-router';

import AddonDetailsError from './addon-details/AddonDetailsError';
import AddonDetailsLoading from './addon-details/AddonDetailsLoading';
import AddonDetailsView from './addon-details/AddonDetailsView';

import { useFetchAddonBySlug } from '@/api';
import {
  useFetchModrinthProject,
  useFetchModrinthVersions,
  useFetchModrinthDependencies,
} from '@/api/external/useModrinth';
import type { IntegratedAddonData, CurseForgeRawObject, ModrinthRawObject } from '@/types';
import { getAddonCreateVersionsFromVersions } from '@/utils/createCompatibility';

export default function AddonDetails() {
  const { slug } = useParams<{ slug: string }>();

  // Always call hooks in the same order - move hooks before early returns
  const {
    data: addon,
    isLoading: isLoadingAddon,
    error: errorAddon,
  } = useFetchAddonBySlug(slug || '');

  const { data: modrinthProject, isLoading: isLoadingModrinth } = useFetchModrinthProject(
    slug || ''
  );

  const { data: versions } = useFetchModrinthVersions(slug || '');

  const { data: dependencies } = useFetchModrinthDependencies(slug || '');

  // Validate slug parameter after hooks
  if (!slug) {
    return <AddonDetailsError error={new Error('No addon slug provided in URL')} />;
  }

  // Prioritize critical errors - addon data is most important
  const criticalError = errorAddon;
  if (criticalError) {
    return <AddonDetailsError error={criticalError} />;
  }

  // Check for required data more intelligently
  const hasRequiredData = addon && modrinthProject;
  const isLoadingCriticalData = isLoadingAddon || isLoadingModrinth;

  if (isLoadingCriticalData || !hasRequiredData) {
    return <AddonDetailsLoading />;
  }

  // Safely parse JSON objects with error handling
  function parseJsonSafely<T>(jsonData: string | object | null): T | null {
    if (!jsonData) return null;
    if (typeof jsonData === 'object') return jsonData as T;
    if (typeof jsonData !== 'string') return null;

    try {
      return JSON.parse(jsonData) as T;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return null;
    }
  }

  const curseforgeObject = parseJsonSafely<CurseForgeRawObject>(addon.curseforge_raw);
  const modrinthObject = parseJsonSafely<ModrinthRawObject>(addon.modrinth_raw);

  // Handle optional data gracefully
  const createVersions = versions ? getAddonCreateVersionsFromVersions(versions) : [];

  // Build integrated data object with proper types
  const data: IntegratedAddonData = {
    ...addon,
    curseforgeObject: curseforgeObject || undefined,
    modrinthObject: modrinthObject || undefined,
    modrinth: {
      ...modrinthProject,
      versions: versions || null,
      dependencies: dependencies?.projects || [],
    },
  };

  return <AddonDetailsView addon={data} createVersions={createVersions} />;
}
