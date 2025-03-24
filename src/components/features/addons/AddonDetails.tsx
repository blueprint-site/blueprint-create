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

  const error = errorAddon || errorModrinth || errorVersions || errorDependencies;

  if (error) return <AddonDetailsError error={error} />;

  const isLoading =
    isLoadingAddon || isLoadingModrinth || isLoadingVersions || isLoadingDependencies;

  if (isLoading || !addon || !modrinthProject || !versions || !dependencies) {
    return <AddonDetailsLoading />;
  }
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
