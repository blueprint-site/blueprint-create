// IMPORTS OF COMPONENTS
import { BlogEditor } from '@/components/features/admin/blog/AdminBlogEditor.tsx';
import { BlogList } from '@/components/features/admin/blog/AdminBlogList.tsx';
import { AdminBlogMain } from '@/components/features/admin/blog/AdminBlogMain.tsx';
// EXPORT FOR LAZY LOAD
export { BlogEditor } from '@/components/features/admin/blog/AdminBlogEditor.tsx';
export { BlogList } from '@/components/features/admin/blog/AdminBlogList.tsx';
export { AdminBlogMain } from '@/components/features/admin/blog/AdminBlogMain.tsx';

// EXPORT FOR USAGE
const AdminBlog = { BlogEditor, BlogList, AdminBlogMain };
export default AdminBlog;
