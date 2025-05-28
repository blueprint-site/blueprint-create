// src/routes/index.tsx
import type { ComponentType } from 'react';
import React, { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

import { authRoutes } from '@/routes/authRoutes';
import { settingsRoutes } from '@/routes/settings';
import { AdminRoutes } from '@/routes/adminRoutes';
import { blogRoutes } from '@/routes/blogRoutes';
import { userRoutes } from '@/routes/userRoutes';

import Home from '@/pages/Home';
import BaseLayout from '@/layouts/BaseLayout';
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';
import { gameRoutes } from '@/routes/gamesRoutes.tsx';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';

const BlogList = lazy(() => import('@/pages/blog/Blog'));
const SchematicsList = lazy(() => import('@/pages/schematics/SchematicsList'));
const SchematicDetails = lazy(() => import('@/pages/schematics/SchematicDetailsPage'));
const SchematicsUploadPage = lazy(
  () => import('@/components/features/schematics/upload/SchematicsUpload')
);
const AddonsList = lazy(() => import('@/pages/addons/AddonListPage'));
const AddonDetails = lazy(() => import('@/pages/addons/AddonDetailsPage'));
const About = lazy(() => import('@/pages/About'));
const Design = lazy(() => import('@/pages/Design'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminPanelLayout = lazy(() => import('@/layouts/AdminPanelLayout'));
const Changelogs = lazy(() => import('@/pages/Changelogs'));
const ChangelogsEditor = lazy(
  () => import('@/components/features/changelogs/ChangelogsEditor.tsx')
);

/**
 * Creates a protected route with proper typing
 */
// src/routes/index.tsx
function createProtectedRoute(
  Component: React.LazyExoticComponent<ComponentType<unknown>> | ComponentType<unknown>,
  additionalProps: Partial<Omit<RouteObject, 'element' | 'errorElement' | 'index'>> = {}
): RouteObject {
  const baseRoute: RouteObject = {
    element: (
      <Suspense fallback={<LoadingOverlay />}>
        <Component />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
    index: undefined,
  };

  // Merge with additional props, ensuring proper typing
  return { ...baseRoute, ...additionalProps };
}

export const routes: RouteObject[] = [
  {
    element: <BaseLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'addons/:slug',
        ...createProtectedRoute(AddonDetails),
      },
      {
        path: 'schematics/upload',
        ...createProtectedRoute(SchematicsUploadPage),
      },
      {
        path: 'schematics/edit/:id',
        ...createProtectedRoute(SchematicsUploadPage),
      },
      {
        path: 'schematics/:id/:slug',
        element: <SchematicDetails />,
      },
      {
        path: 'design',
        ...createProtectedRoute(Design),
      },
      {
        path: 'terms',
        ...createProtectedRoute(Terms),
      },
      {
        path: 'privacy',
        ...createProtectedRoute(Privacy),
      },
      {
        path: 'changelogs',
        ...createProtectedRoute(Changelogs),
      },
      {
        path: 'changelogs/editor',
        ...createProtectedRoute(ChangelogsEditor),
      },
      ...authRoutes,
      ...settingsRoutes,
      ...blogRoutes,
      ...userRoutes,
      ...gameRoutes,
      {
        path: '*',
        ...createProtectedRoute(NotFound),
      },
    ],
  },
  {
    path: 'about',
    ...createProtectedRoute(About),
  },
  {
    path: 'addons',
    ...createProtectedRoute(AddonsList),
  },
  {
    path: 'schematics',
    ...createProtectedRoute(SchematicsList),
  },
  {
    path: 'blog',
    ...createProtectedRoute(BlogList),
  },
  {
    element: <AdminPanelLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [...AdminRoutes],
  },
];
