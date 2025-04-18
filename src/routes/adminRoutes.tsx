// src/routes/authRoutes.tsx
import type { RouteObject } from 'react-router';
import { lazy } from 'react';

import ProtectedRoute from '@/components/utility/ProtectedRoute';

// LAZY IMPORT Logs Li st
const LogsList = lazy(() =>
  import('@/components/features/admin/AdminLogs').then((m) => ({ default: m.LogsList }))
);

// LAZY IMPORT Blog List
const BlogList = lazy(() =>
  import('@/components/features/admin/blog').then((m) => ({ default: m.BlogList }))
);

// LAZY IMPORT Blog Editor
const BlogEditor = lazy(() =>
  import('@/components/features/admin/blog').then((m) => ({ default: m.BlogEditor }))
);

// LAZY IMPORT Schematics display
const SchematicsDisplay = lazy(() =>
  import('@/components/features/admin/schematics').then((m) => ({ default: m.SchematicsDisplay }))
);

// LAZY IMPORT ADMIN PAGE
const Admin = lazy(() => import('@/pages').then((mod) => ({ default: mod.Admin })));

// LAZY IMPORT AddonStatsWrapper
const AddonStatsWrapper = lazy(() =>
  import('@/components/features/admin/stats').then((m) => ({ default: m.AddonStatsWrapper }))
);
// LAZY IMPORT AddAddon
const AddAddon = lazy(() =>
  import('@/components/features/admin/addons').then((m) => ({ default: m.AddAddon }))
);

// LAZY IMPORT AddonsTable
const AddonsTable = lazy(() =>
  import('@/components/features/admin/addons').then((mod) => ({ default: mod.AddonsTable }))
);

// LAZY IMPORT AddFeaturedAddon
const AddFeaturedAddon = lazy(() =>
  import('@/components/features/admin/addons').then((mod) => ({ default: mod.AddFeaturedAddon }))
);

export const AdminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/blogs/editor/:id',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <BlogEditor />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/blogs/list',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <BlogList />
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
        <AddonsTable />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/logs',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <LogsList />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/addons/add',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AddAddon />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/addons/featured/add',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AddFeaturedAddon />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/schematics/list',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <SchematicsDisplay></SchematicsDisplay>
      </ProtectedRoute>
    ),
  },
];
