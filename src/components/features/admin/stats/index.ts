// IMPORT OF COMPONENTS
import {
  AddonStatsDisplayScanned,
  AddonStatsDisplayValidated,
} from '@/components/features/admin/stats/AddonStats.tsx';
import { UsersStatsDisplayRegistered } from '@/components/features/admin/stats/UsersStats.tsx';
import { AddonStatsWrapper } from '@/components/features/admin/stats/AddonStatsWrapper.tsx';

// EXPORT FOR LAZY LOADING
export { AddonStatsWrapper } from '@/components/features/admin/stats/AddonStatsWrapper.tsx';

// EXPORT FOR USAGE
const AdminStats = {
  AddonStatsDisplayScanned,
  AddonStatsDisplayValidated,
  UsersStatsDisplayRegistered,
  AddonStatsWrapper,
};
export default AdminStats;
