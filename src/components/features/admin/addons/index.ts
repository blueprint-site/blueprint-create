// IMPORTS
import { AddAddon } from '@/components/features/admin/addons/AddAddon.tsx';
import { AddonsTable } from '@/components/features/admin/addons/AddonsTable.tsx';

// EXPORT FOR LAZY LOAD
export { AddAddon } from '@/components/features/admin/addons/AddAddon';
export { AddonsTable } from '@/components/features/admin/addons/AddonsTable';

// EXPORT FOR USAGE
const AdminAddon = { AddAddon, AddonsTable };
export default AdminAddon;
