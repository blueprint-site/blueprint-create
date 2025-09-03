import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import CategoryBadges from './CategoryBadges';
import VersionBadges from './VersionBadges';
import AddonStats from './AddonStats';
import ModPageLinks from './ModPageLinks';
import ModLoaders from './ModLoaders';

import type { AddonWithParsedFields } from '@/types/addons/addon-details';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AddonListItemProps {
  addon: AddonWithParsedFields;
}

const AddonCard = ({ addon }: AddonListItemProps) => {
  const navigate = useNavigate();
  const [availableOn, setAvailableOn] = useState<string[]>([]);

  useEffect(() => {
    const platforms: string[] = [];

    if (addon.curseforge_raw) {
      platforms.push('curseforge');
    }
    if (addon.modrinth_raw) {
      platforms.push('modrinth');
    }

    setAvailableOn(platforms);
  }, [addon.curseforge_raw, addon.modrinth_raw]);

  // Get display name with fallbacks
  const getDisplayName = (addon: AddonWithParsedFields): string => {
    // First, try the direct name field
    if (addon.name) return addon.name;

    // Try to extract name from modrinth_raw if it's a parsed object
    if (
      addon.modrinth_raw_parsed &&
      typeof addon.modrinth_raw_parsed === 'object' &&
      'title' in addon.modrinth_raw_parsed
    ) {
      return addon.modrinth_raw_parsed.title;
    }

    // Try to extract name from curseforge_raw if it's a parsed object
    if (
      addon.curseforge_raw_parsed &&
      typeof addon.curseforge_raw_parsed === 'object' &&
      'name' in addon.curseforge_raw_parsed
    ) {
      return addon.curseforge_raw_parsed.name;
    }

    // Try to parse raw JSON strings to get the name
    if (typeof addon.modrinth_raw === 'string') {
      try {
        const parsed = JSON.parse(addon.modrinth_raw);
        if (parsed.title) return parsed.title;
      } catch {
        // Ignore parsing errors
      }
    }

    if (typeof addon.curseforge_raw === 'string') {
      try {
        const parsed = JSON.parse(addon.curseforge_raw);
        if (parsed.name) return parsed.name;
      } catch {
        // Ignore parsing errors
      }
    }

    // Last resort: convert slug to readable name
    return addon.slug
      ? addon.slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : 'Unknown Addon';
  };

  const navigateToAddon = () => {
    navigate(`/addons/${addon.slug}`);
  };

  // Format the addon data for display - temporary debugging feature
  const formatAddonData = (addon: AddonWithParsedFields) => {
    const debugInfo = {
      basicInfo: {
        name: addon.name || 'MISSING',
        displayName: getDisplayName(addon),
        slug: addon.slug,
        authors: addon.authors,
      },
      rawDataInfo: {
        curseforge_raw_type: typeof addon.curseforge_raw,
        curseforge_raw_length:
          typeof addon.curseforge_raw === 'string'
            ? addon.curseforge_raw.length
            : addon.curseforge_raw
              ? 'object'
              : 'null',
        curseforge_raw_preview:
          typeof addon.curseforge_raw === 'string'
            ? addon.curseforge_raw.substring(0, 100) + '...'
            : addon.curseforge_raw
              ? 'Object present'
              : 'null',
        modrinth_raw_type: typeof addon.modrinth_raw,
        modrinth_raw_length:
          typeof addon.modrinth_raw === 'string'
            ? addon.modrinth_raw.length
            : addon.modrinth_raw
              ? 'object'
              : 'null',
        modrinth_raw_preview:
          typeof addon.modrinth_raw === 'string'
            ? addon.modrinth_raw.substring(0, 100) + '...'
            : addon.modrinth_raw
              ? 'Object present'
              : 'null',
      },
      fullData: addon,
    };

    return JSON.stringify(debugInfo, null, 2);
  };

  // Process loaders data - handle both string and array formats
  const processLoaders = (loaders: string[] | string | null | undefined): string[] => {
    if (!loaders) return [];

    // If it's already an array, return it
    if (Array.isArray(loaders)) return loaders;

    // If it's a string, split by comma and trim whitespace
    if (typeof loaders === 'string') {
      return loaders
        .split(',')
        .map((loader) => loader.trim())
        .filter((loader) => loader.length > 0);
    }

    return [];
  };

  // Process categories data - handle both string and array formats
  const processCategories = (categories: string[] | string | null | undefined): string[] => {
    if (!categories) return [];

    // If it's already an array, return it
    if (Array.isArray(categories)) return categories;

    // If it's a string, split by comma and trim whitespace
    if (typeof categories === 'string') {
      return categories
        .split(',')
        .map((category) => category.trim())
        .filter((category) => category.length > 0);
    }

    return [];
  };

  // Process minecraft versions data - handle both string and array formats
  const processMinecraftVersions = (versions: string[] | string | null): string[] => {
    if (!versions) return [];

    // If it's already an array, return it
    if (Array.isArray(versions)) return versions;

    // If it's a string, split by comma and trim whitespace
    if (typeof versions === 'string') {
      return versions
        .split(',')
        .map((version) => version.trim())
        .filter((version) => version.length > 0);
    }

    return [];
  };

  // Sprawdzanie czy debug jest włączony w localStorage
  const isDebug = typeof window !== 'undefined' && window.localStorage.getItem('debug') === 'true';

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip open={isDebug ? undefined : false}>
        <TooltipTrigger asChild>
          <Card className='flex h-full flex-col overflow-hidden hover:shadow-xs'>
            <CardHeader
              className='relative flex cursor-pointer flex-row gap-3'
              onClick={navigateToAddon}
            >
              <img
                src={addon.icon || '/assets/wrench.webp'}
                alt={getDisplayName(addon)}
                loading='lazy'
                className='h-12 w-12 object-cover'
              />
              <h3 className='truncate text-sm font-medium'>{getDisplayName(addon)}</h3>
            </CardHeader>

            <CardContent className='flex flex-1 flex-col gap-3'>
              <div className='flex-1'>
                <p className='text-foreground-muted text-xs'>{addon.description}</p>

                <div className='mt-2 flex gap-2'>
                  <ModLoaders loaders={processLoaders(addon.loaders)} />
                </div>

                <CategoryBadges categories={processCategories(addon.categories)} />
                <VersionBadges versions={processMinecraftVersions(addon.minecraft_versions)} />
              </div>

              <AddonStats
                authors={addon.authors}
                downloads={addon.downloads}
                claimed_by={addon.claimed_by}
              />

              <ModPageLinks
                slug={addon.slug}
                curseforge={availableOn.includes('curseforge')}
                modrinth={availableOn.includes('modrinth')}
              />
            </CardContent>
          </Card>
        </TooltipTrigger>
        {isDebug && (
          <TooltipContent
            side='right'
            className='bg-surface-2 max-h-96 max-w-lg overflow-auto border p-4'
          >
            <div className='text-xs'>
              <div className='mb-2 font-semibold'>Raw Addon Data (Debug):</div>
              <pre className='font-mono text-xs whitespace-pre-wrap'>{formatAddonData(addon)}</pre>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(AddonCard);
