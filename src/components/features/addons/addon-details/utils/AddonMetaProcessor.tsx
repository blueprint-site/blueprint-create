import { ReactNode, useMemo } from 'react';
import { Bug, Globe } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { AddonMetaData, AddonMetaProcessorProps, ExternalLink } from '@/types/addons/addon-details';
import { ModrinthGalleryImage } from '@/api/endpoints/useModrinth';

/**
 * Processes addon metadata from various sources
 */
export const AddonMetaProcessor = ({
  modrinthData,
  curseforgeData,
  modrinthProject,
  children,
}: AddonMetaProcessorProps) => {
  const metaData = useMemo(() => {
    // Get gallery safely
    const gallery = modrinthData?.gallery ?? [];
    const gallerySmall: Array<string | ModrinthGalleryImage> = Array.isArray(gallery)
      ? gallery
      : [];

    // If we have the modrinth full project data, use its gallery for HD images
    const galleryHD: string[] | undefined =
      modrinthProject?.gallery && Array.isArray(modrinthProject.gallery)
        ? modrinthProject.gallery.map(
            (item: { raw_url?: string; url?: string }) => item.raw_url ?? item.url ?? ''
          )
        : undefined;

    // Calculate total downloads
    const totalDownload = (modrinthData?.downloads ?? 0) + (curseforgeData?.downloadCount ?? 0);

    // Get dependency information (only available in the full project data)
    const dependencies = modrinthProject?.dependencies ?? null;

    // Get donation links
    const donationLinks = Array.isArray(modrinthProject?.donation_urls)
      ? modrinthProject?.donation_urls
      : [];

    // Get environment compatibility
    const clientSide =
      modrinthData?.client_side ?? (modrinthProject?.client_side as string | undefined);
    const serverSide =
      modrinthData?.server_side ?? (modrinthProject?.server_side as string | undefined);

    // Get the full body content (for rich description)
    const bodyContent = modrinthProject?.body as string | undefined;

    // Setup links for footer
    const links = curseforgeData?.links ?? {};

    // Extract link URLs with type safety
    const sourceUrl =
      typeof links === 'object' && links !== null && 'sourceUrl' in links
        ? (links.sourceUrl as string)
        : undefined;

    const issuesUrl =
      typeof links === 'object' && links !== null && 'issuesUrl' in links
        ? (links.issuesUrl as string)
        : undefined;

    const websiteUrl =
      typeof links === 'object' && links !== null && 'websiteUrl' in links
        ? (links.websiteUrl as string)
        : undefined;

    const createLink = (icon: ReactNode, label: string, url?: string) => {
      return url ? { icon, label, url, id: label.toLowerCase().replace(/\s+/g, '-') } : null;
    };

    const externalLinks = [
      createLink(<SiGithub className='h-4 w-4' />, 'Source Code', sourceUrl ?? ''),
      createLink(<Bug className='h-4 w-4' />, 'Issue Tracker', issuesUrl ?? ''),
      createLink(<Globe className='h-4 w-4' />, 'Website', websiteUrl),
    ].filter((link): link is ExternalLink => link !== null);

    // Available platforms
    const availableOn: string[] = [];
    if (curseforgeData) availableOn.push('curseforge');
    if (modrinthData) availableOn.push('modrinth');

    return {
      gallerySmall,
      galleryHD,
      totalDownload,
      dependencies,
      donationLinks,
      clientSide,
      serverSide,
      bodyContent,
      externalLinks,
      availableOn,
    } as AddonMetaData;
  }, [modrinthData, curseforgeData, modrinthProject]);

  return children(metaData);
};
