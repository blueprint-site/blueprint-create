// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/utility/ProtectedRoute';
import AdminPage from '@/pages/Admin';
import AdminBlogEditor from '@/components/features/admin/blog/components/AdminBlogEditor.tsx';
import AddonStatsWrapper from '@/components/features/admin/stats/AddonStatsWrapper.tsx';
import AdminAddonsTable from '@/components/features/admin/addons/AdminAddonsTable.tsx';
import { AdminLogsList } from '@/components/features/admin/logs';
import { AdminAddAddon } from '@/components/features/admin/addons';
import AdminBlogList from '@/components/features/admin/blog/components/AdminBlogList.tsx';
import AdminSchematicsDisplay from '@/components/features/admin/schematics/AdminSchematicsDisplay.tsx';

export const AdminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/blogs/editor/:id',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AdminBlogEditor />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/blogs/list',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AdminBlogList />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/stats',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AddonStatsWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/addons/list',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AdminAddonsTable></AdminAddonsTable>
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/logs',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AdminLogsList></AdminLogsList>
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/addons/add',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AdminAddAddon></AdminAddAddon>
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/schematics/list',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AdminSchematicsDisplay></AdminSchematicsDisplay>
      </ProtectedRoute>
    ),
  },
];
