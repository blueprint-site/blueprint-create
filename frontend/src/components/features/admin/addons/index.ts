// IMPORTS
import { AddAddon } from '@/components/features/admin/addons/AddAddon.tsx';
import { AddonsTable } from '@/components/features/admin/addons/AddonsTable.tsx';
import { OptimizedAddonsTable } from '@/components/features/admin/addons/OptimizedAddonsTable.tsx';
import { OptimizedAddonsTableV2 } from '@/components/features/admin/addons/OptimizedAddonsTableV2.tsx';
import { OptimizedAddonsTableV3 } from '@/components/features/admin/addons/OptimizedAddonsTableV3.tsx';
import { AdminAddonsMain } from '@/components/features/admin/addons/AdminAddonsMain.tsx';
import { FeaturedAddonsTable } from '@/components/features/admin/addons/FeaturesAddonsTable.tsx';

// EXPORT FOR LAZY LOAD
export { AddAddon };
export { AddonsTable };
export { OptimizedAddonsTable };
export { OptimizedAddonsTableV2 };
export { OptimizedAddonsTableV3 };
export { AdminAddonsMain };
export { FeaturedAddonsTable };

// EXPORT FOR USAGE
const AdminAddon = {
  AddAddon,
  AddonsTable,
  OptimizedAddonsTable,
  OptimizedAddonsTableV2,
  OptimizedAddonsTableV3,
  AdminAddonsMain,
  FeaturedAddonsTable,
};
export default AdminAddon;
