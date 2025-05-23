// src/routes/index.tsx
import type { ComponentType } from 'react';
import React, { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

import { authRoutes } from '@/routes/authRoutes';
import { schematicRoutes } from '@/routes/schematicRoutes';
import { settingsRoutes } from '@/routes/settings';
import { AdminRoutes } from '@/routes/adminRoutes';
import { blogRoutes } from '@/routes/blogRoutes';
import { userRoutes } from '@/routes/userRoutes';

import Home from '@/pages/Home';
import BaseLayout from '@/layouts/BaseLayout';
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';
import { gameRoutes } from '@/routes/gamesRoutes.tsx';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';

const BlogPage = lazy(() => import('@/pages/blog/BlogDetails'));
const SchematicsList = lazy(() => import('@/pages/schematics/SchematicsList'));
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
      ...schematicRoutes,
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
    ...createProtectedRoute(BlogPage),
  },
  {
    element: <AdminPanelLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [...AdminRoutes],
  },
];
