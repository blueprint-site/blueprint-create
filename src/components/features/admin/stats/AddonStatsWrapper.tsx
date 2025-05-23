// src/components/features/admin/stats/AddonStatsWrapper.tsx
import { AddonStatsDisplayScanned, AddonStatsDisplayValidated } from './AddonStats';
import { UsersStatsDisplayRegistered } from './UsersStats';

export const AddonStatsWrapper = () => {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <AddonStatsDisplayScanned />
      <AddonStatsDisplayValidated />
      <UsersStatsDisplayRegistered />
    </div>
  );
};
