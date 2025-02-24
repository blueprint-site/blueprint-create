import {
  AddonStatsDisplayScanned,
  AddonStatsDisplayValidated,
} from '@/components/features/admin/stats/AddonStats';
import { UsersStatsDisplayRegistered } from '@/components/features/admin/stats/UsersStats';

const AddonStatsWrapper = () => {
  return (
    <div className='mt-4 flex flex-wrap gap-4'>
      <AddonStatsDisplayScanned />
      <AddonStatsDisplayValidated />
      <UsersStatsDisplayRegistered />
    </div>
  );
};
export default AddonStatsWrapper;
