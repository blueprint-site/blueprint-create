import React from 'react';
import { useFeatureFlagsStore } from '@/api/stores/featureFlagsStore';
import type { FeatureFlagKey } from '@/types';

interface FeatureFlagProps {
  featureKey: FeatureFlagKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ featureKey, children, fallback = null }) => {
  const { flags, isLoading, isEnabled } = useFeatureFlagsStore();

  if (isLoading && Object.keys(flags).length === 0) {
    return <p>Loading feature...</p>;
  }

  return isEnabled(featureKey) ? <>{children}</> : <>{fallback}</>;
};

export default FeatureFlag;
