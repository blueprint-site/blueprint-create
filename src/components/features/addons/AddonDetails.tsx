import { Card } from '@/components/ui/card';
import { useParams } from 'react-router';
import { useFetchAddon, useModrinthProject } from '@/api';
import { CurseForgeAddon, ModrinthAddon } from '@/types';

import {
  AddonDetailsHeader,
  AddonDetailsContent,
  AddonDetailsDescription,
  AddonDetailsError,
  AddonDetailsGallery,
  AddonDetailsFooter,
  AddonDetailsLoading,
} from '@/components/features/addons/addon-details';
import { Separator } from '@/components/ui/separator';
import { ReactNode } from 'react';
import { Bug, Globe } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

export default function AddonDetails() {
  const { slug } = useParams();
  const { data: addon, isLoading, error } = useFetchAddon(slug);

  // Parse Modrinth data
  let modrinthData: ModrinthAddon | null = null;
  if (addon?.modrinth_raw) {
    if (typeof addon.modrinth_raw === 'string') {
      modrinthData = JSON.parse(addon.modrinth_raw);
    } else {
      modrinthData = addon.modrinth_raw;
    }
  }

  // Fetch full Modrinth project data for HD gallery
  const { data: modrinthProject, isLoading: isLoadingModrinth } = useModrinthProject(
    modrinthData?.project_id
  );

  if (error) {
    return <AddonDetailsError error={error} />;
  }

  if (isLoading || !addon) {
    return <AddonDetailsLoading />;
  }

  // Parse CurseForge data
  let curseforgeData: CurseForgeAddon | null = null;
  if (addon.curseforge_raw) {
    if (typeof addon.curseforge_raw === 'string') {
      curseforgeData = JSON.parse(addon.curseforge_raw);
    } else {
      curseforgeData = addon.curseforge_raw;
    }
  }

  // Get gallery safely
  const gallerySmall = modrinthData?.gallery ?? [];

  // If we have the modrinth full project data, use its gallery for HD images
  const galleryHD: string[] | undefined =
    !isLoadingModrinth && modrinthProject?.gallery
      ? modrinthProject.gallery.map(
          (item: { raw_url: string; url: string }) => item.raw_url || item.url
        )
      : undefined;

  // Calculate total downloads
  const totalDownload = (modrinthData?.downloads ?? 0) + (curseforgeData?.downloadCount ?? 0);

  // Setup links for footer
  const { sourceUrl, issuesUrl, websiteUrl } = curseforgeData?.links || {};

  const createLink = (icon: ReactNode, label: string, url?: string) => {
    return url ? { icon, label, url, id: label.toLowerCase().replace(/\s+/g, '-') } : null;
  };

  const externalLinks = [
    createLink(<SiGithub className='h-4 w-4' />, 'Source Code', sourceUrl ?? ''),
    createLink(<Bug className='h-4 w-4' />, 'Issue Tracker', issuesUrl ?? ''),
    createLink(<Globe className='h-4 w-4' />, 'Website', websiteUrl),
  ].filter(
    (link): link is { icon: ReactNode; label: string; url: string; id: string } => link !== null
  );

  // Available platforms
  const availableOn = [];
  if (curseforgeData) availableOn.push('curseforge');
  if (modrinthData) availableOn.push('modrinth');

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='overflow-hidden'>
        {/* Header */}
        <AddonDetailsHeader
          title={addon.name}
          description={addon.description ?? ''}
          downloads={totalDownload}
          follows={modrinthData?.follows ?? 0}
          icon={addon.icon}
          slug={slug ?? ''}
        />

        <Separator className='mx-6' />

        {/* Content/Metadata */}
        <AddonDetailsContent
          versions={addon.minecraft_versions ?? []}
          loaders={addon.loaders ?? []}
          categories={addon.categories ?? []}
          slug={addon.slug}
          availableOn={availableOn}
        />

        {/* Gallery */}
        {gallerySmall.length > 0 && (
          <>
            <Separator className='mx-6' />
            <AddonDetailsGallery
              addon_name={addon.name}
              gallery_small={gallerySmall}
              gallery_hd={galleryHD}
            />
          </>
        )}

        {/* Description */}
        <Separator className='mx-6' />
        <AddonDetailsDescription description={modrinthData?.description ?? ''} />

        {/* Footer */}
        <Separator className='mx-6' />
        <AddonDetailsFooter
          authors={curseforgeData?.authors ?? []}
          createdAt={addon.created_at}
          updatedAt={addon.updated_at}
          licence={modrinthData?.license ?? ''}
          addon_name={addon.name}
          externalLinks={externalLinks}
        />
      </Card>
    </div>
  );
}
