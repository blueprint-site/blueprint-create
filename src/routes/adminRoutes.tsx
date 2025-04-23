// src/routes/adminRoutes.tsx
import type { RouteObject } from 'react-router';
import type { ComponentType } from 'react';
import React, { lazy, Suspense } from 'react';

import ProtectedRoute from '@/components/utility/ProtectedRoute';
import { UserManagement } from '@/components/features/admin/users/UserManagement';
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';

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
const FeaturedAddonsList = lazy(() =>
  import('@/components/features/admin/addons/FeaturedAddonsList').then((mod) => ({
    default: mod.default,
  }))
);

// LAZY IMPORT AutoAddFeaturedAddon
const AutoAddFeaturedAddon = lazy(() =>
  import('@/components/features/admin/addons/AutoAddFeaturedAddon').then((mod) => ({
    default: mod.default,
  }))
);
/**
 * Creates a protected admin route with consistent error handling and loading states
 */
function createAdminRoute(
  Component: React.LazyExoticComponent<ComponentType<unknown>> | ComponentType<unknown>,
  role: string = 'admin'
): RouteObject {
  return {
    element: (
      <ProtectedRoute requiredRole={role}>
        <Suspense fallback={<LoadingOverlay />}>
          {typeof Component === 'function' ? <Component /> : Component}
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  };
}

export const AdminRoutes: RouteObject[] = [
  {
    path: 'admin',
    ...createAdminRoute(Admin),
  },
  {
    path: 'admin/blogs/editor/:id',
    ...createAdminRoute(BlogEditor),
  },
  {
    path: 'admin/blogs/list',
    ...createAdminRoute(BlogList),
  },
  {
    path: 'admin/stats',
    ...createAdminRoute(AddonStatsWrapper),
  },
  {
    path: 'admin/addons/list',
    ...createAdminRoute(AddonsTable),
  },
  {
    path: 'admin/logs',
    ...createAdminRoute(LogsList),
  },
  {
    path: 'admin/addons/add',
    ...createAdminRoute(AddAddon),
  },
  {
    path: 'admin/featured-addons/add',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AddFeaturedAddon />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/featured-addons/auto-add',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <AutoAddFeaturedAddon />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/featured-addons/list',
    element: (
      <ProtectedRoute requiredRole={'admin'}>
        <FeaturedAddonsList />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin/schematics/list',
    ...createAdminRoute(SchematicsDisplay),
  },
  {
    path: 'admin/users',
    ...createAdminRoute(UserManagement),
  },
];
