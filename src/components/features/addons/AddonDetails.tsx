import { Card} from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { useFetchAddon } from '@/api';
import {CurseForgeAddon, ModrinthAddon} from "@/types";
import {
    AddonDetailsFooter,
    AddonDetailsContent,
    AddonDetailsDescription,
    AddonDetailsError,
    AddonDetailsGallery,
    AddonDetailsHeader,
    AddonDetailsLoading,
} from "@/components/features/addons/addon-details";

export default function AddonDetails() {
  const { slug } = useParams();
  const { data: addon, isLoading, error } = useFetchAddon(slug);

  if (error) {
    return (
     <AddonDetailsError error={error}/>
    );
  }

  if (isLoading || !addon) {
    return (
     <AddonDetailsLoading/>
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

      {gallery.length > 0 ?
          <AddonDetailsGallery
          addon_name={addon.name}
          gallery_small={gallery}
      /> : null  }

      {/* Description Card */}

      <AddonDetailsDescription
          description={modrinthData.description || ''}
      />

      {/* Additional Information */}

      <AddonDetailsFooter authors={curseforgeData.authors}  createdAt={addon.created_at} updatedAt={addon.updated_at} licence={modrinthData?.license} addon_name={addon.name}></AddonDetailsFooter>

    </div>
  );
}
