import { Card } from '@/components/ui/card';
import { useParams } from 'react-router';
import { useFetchAddon } from '@/api';
import { CurseForgeAddon, ModrinthAddon } from '@/types';

import {
  AddonDetailsFooter,
  AddonDetailsContent,
  AddonDetailsDescription,
  AddonDetailsError,
  AddonDetailsGallery,
  AddonDetailsHeader,
  AddonDetailsLoading,
} from '@/components/features/addons/addon-details';

export default function AddonDetails() {
  const { slug } = useParams();
  const { data: addon, isLoading, error } = useFetchAddon(slug);

  if (error) {
    return <AddonDetailsError error={error} />;
  }

  if (isLoading || !addon) {
    return <AddonDetailsLoading />;
  }

  // Vérification et parsing des données Modrinth
  const modrinthData: ModrinthAddon | null = addon.modrinth_raw
    ? typeof addon.modrinth_raw === 'string'
      ? JSON.parse(addon.modrinth_raw)
      : addon.modrinth_raw
    : null;

  // Vérification et parsing des données CurseForge
  const curseforgeData: CurseForgeAddon | null = addon.curseforge_raw
    ? typeof addon.curseforge_raw === 'string'
      ? JSON.parse(addon.curseforge_raw)
      : addon.curseforge_raw
    : null;

  // Récupération sécurisée de la galerie
  const gallery = modrinthData?.gallery ?? [];

  // Sécurisation du calcul des téléchargements totaux
  const totalDownload = (modrinthData?.downloads ?? 0) + (curseforgeData?.downloadCount ?? 0);

  return (
    <div className='container mx-auto space-y-8 px-4 py-8'>
      <Card>
        {/* Header Card */}
        <AddonDetailsHeader
          title={addon.name}
          description={addon.description ?? ''}
          downloads={totalDownload}
          follows={modrinthData?.follows ?? 0}
          icon={addon.icon}
        />

        {/* Content Card */}
        <AddonDetailsContent
          versions={addon.minecraft_versions ?? []}
          loaders={addon.loaders ?? []}
          categories={addon.categories ?? []}
          slug={addon.slug}
          modrinth_raw={modrinthData}
          curseforge_raw={curseforgeData}
        />
      </Card>

      {/* Gallery Card */}
      {gallery.length > 0 && (
        <AddonDetailsGallery addon_name={addon.name} gallery_small={gallery} />
      )}

      {/* Description Card */}
      <AddonDetailsDescription description={modrinthData?.description ?? ''} />

      {/* Additional Information */}
      <AddonDetailsFooter
        authors={curseforgeData?.authors ?? []}
        createdAt={addon.created_at}
        updatedAt={addon.updated_at}
        licence={modrinthData?.license ?? ''}
        addon_name={addon.name}
        claimed_by={addon.claimed_by}
      />
    </div>
  );
}
