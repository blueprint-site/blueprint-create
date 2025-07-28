// IMPORTS
import { AddAddon } from '@/components/features/admin/addons/AddAddon.tsx';
import { AddonsTable } from '@/components/features/admin/addons/AddonsTable.tsx';
import { OptimizedAddonsTable } from '@/components/features/admin/addons/OptimizedAddonsTable.tsx';
import { AdminAddonsMain } from '@/components/features/admin/addons/AdminAddonsMain.tsx';
import { FeaturedAddonsTable } from '@/components/features/admin/addons/FeaturesAddonsTable.tsx';

// EXPORT FOR LAZY LOAD
export { AddAddon };
export { AddonsTable };
export { OptimizedAddonsTable };
export { AdminAddonsMain };
export { FeaturedAddonsTable };

// EXPORT FOR USAGE
const AdminAddon = {
  AddAddon,
  AddonsTable,
  OptimizedAddonsTable,
  AdminAddonsMain,
  FeaturedAddonsTable,
};
export default AdminAddon;
