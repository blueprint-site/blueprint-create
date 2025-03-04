import { Card, CardContent} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'react-router-dom';
import { useFetchAddon } from '@/api';
import {CurseForgeAddon, ModrinthAddon} from "@/types";
import {
    AddonDetailFooter,
    AddonDetailsContent,
    AddonDetailsDescription,
    AddonDetailsGallery,
    AddonDetailsHeader
} from "@/components/features/addons/addon-details";

export default function AddonDetails() {
  const { slug } = useParams();
  const { data: addon, isLoading, error } = useFetchAddon(slug);

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card className='bg-destructive/10 border-destructive'>
          <CardContent className='p-6'>
            <p className='text-destructive'>{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !addon) {
    return (
      <div className='container mx-auto space-y-6 px-4 py-8'>
        <div className='flex gap-4'>
          <Skeleton className='h-16 w-16 rounded-lg' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-8 w-1/3' />
            <Skeleton className='h-4 w-2/3' />
          </div>
        </div>
        <Skeleton className='h-96 w-full' />
        <Skeleton className='h-48 w-full' />
      </div>
    );
  }

  const modrinthData =
    typeof addon.modrinth_raw === 'string'
        ? JSON.parse(addon.modrinth_raw) as ModrinthAddon
        : addon.modrinth_raw as ModrinthAddon;

  const curseforgeData =
    typeof addon.curseforge_raw === 'string'
      ? JSON.parse(addon.curseforge_raw) as CurseForgeAddon
      : addon.curseforge_raw as CurseForgeAddon;

  const gallery = modrinthData?.gallery ?? [];
  const totalDownload = modrinthData?.downloads | 0 + curseforgeData?.downloadCount | 0
  return (
    <div className='container mx-auto space-y-8 px-4 py-8'>
      <Card>
        {/* Header Card */}

      <AddonDetailsHeader
          title={addon.name}
          description={addon.description}
          downloads={totalDownload}
          follows={modrinthData?.follows || 0}
          icon={addon.icon}
      />

        {/* Content Card */}

      <AddonDetailsContent
          versions={addon.minecraft_versions || []}
          loaders={addon.loaders || []}
          categories={addon.categories || []}
          slug={addon.slug}
          modrinth_raw={modrinthData}
          curseforge_raw={curseforgeData}
      />

      </Card>

      {/* Gallery Card */}

      {gallery ?
          <AddonDetailsGallery
          addon_name={addon.name}
          gallery_small={gallery}
      /> : null  }

      {/* Description Card */}

      <AddonDetailsDescription
          description={modrinthData.description || ''}
      />

      {/* Additional Information */}

      <AddonDetailFooter authors={curseforgeData.authors}  createdAt={addon.created_at} updatedAt={addon.updated_at} licence={modrinthData?.license} addon_name={addon.name}></AddonDetailFooter>

    </div>
  );
}
