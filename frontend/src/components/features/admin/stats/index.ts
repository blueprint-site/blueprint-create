// src/components/features/admin/stats/index.ts

import { AddonStatsDisplayScanned, AddonStatsDisplayValidated } from './AddonStats';
import { UsersStatsDisplayRegistered } from './UsersStats';
import { AddonStatsWrapper } from './AddonStatsWrapper';

// Create and export the combined object
const AdminStats = {
  AddonStatsDisplayScanned,
  AddonStatsDisplayValidated,
  UsersStatsDisplayRegistered,
  AddonStatsWrapper,
};

// Individual named exports for specific component access
export { AddonStatsDisplayScanned, AddonStatsDisplayValidated } from './AddonStats';
export { UsersStatsDisplayRegistered } from './UsersStats';
export { AddonStatsWrapper } from './AddonStatsWrapper';

// Default export of the combined object
export default AdminStats;
