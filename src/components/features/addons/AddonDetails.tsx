// src/components/features/addons/AddonDetails.tsx
import { useParams } from 'react-router';
import { useAddonDetails } from '@/hooks/useAddonDetails';
import { AddonDetailsError } from '@/components/features/addons/addon-details/AddonDetailsError';
import { AddonDetailsLoading } from '@/components/features/addons/addon-details/AddonDetailsLoading';
import { AddonDetailsView } from './addon-details/AddonDetailsView';

export default function AddonDetails() {
  const { slug } = useParams();

  // Use our new unified hook for addon details
  const {
    data: processedData,
    isLoading: isLoadingProcessed,
    error: processedError,
  } = useAddonDetails(slug);

  // Handle errors
  if (processedError) {
    return <AddonDetailsError error={processedError} />;
  }

  // Handle loading state
  if (isLoadingProcessed || !processedData) {
    return <AddonDetailsLoading />;
  }

  // Render using the new data structure
  return <AddonDetailsView data={processedData} />;
}
