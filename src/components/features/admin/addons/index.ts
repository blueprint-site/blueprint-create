// IMPORTS
import { AddAddon } from '@/components/features/admin/addons/AddAddon.tsx';
import { AddonsTable } from '@/components/features/admin/addons/AddonsTable.tsx';
import { AddFeaturedAddon } from '@/components/features/admin/addons/AddFeaturedAddon.tsx';
// EXPORT FOR LAZY LOAD
export { AddAddon } from '@/components/features/admin/addons/AddAddon';
export { AddonsTable } from '@/components/features/admin/addons/AddonsTable';
export { AddFeaturedAddon } from '@/components/features/admin/addons/AddFeaturedAddon';

// EXPORT FOR USAGE
const AdminAddon = { AddAddon, AddonsTable, AddFeaturedAddon };
export default AdminAddon;
