// src/routes/index.tsx
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import { addonRoutes } from '@/routes/addonRoutes';
import { authRoutes } from '@/routes/authRoutes';
import { schematicRoutes } from '@/routes/schematicRoutes';
import { settingsRoutes } from '@/routes/settings';
import { AdminRoutes } from '@/routes/adminRoutes';
import { blogRoutes } from '@/routes/blogRoutes';
import { userRoutes } from '@/routes/userRoutes';

import Home from '@/pages/Home';
import BaseLayout from '@/layouts/pages/BaseLayout.tsx';
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';

const About = lazy(() => import('@/pages/About'));
const Design = lazy(() => import('@/pages/Design'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminPanelLayout = lazy(
  () => import('@/layouts/pages/AdminPanelLayout.tsx')
);
const Changelogs = lazy(() => import('@/pages/Changelogs'));
const ChangelogsEditor = lazy(
  () => import('@/components/features/changelogs/ChangelogsEditor.tsx')
);
export const routes: RouteObject[] = [
  {
    element: <BaseLayout />,
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
        path: 'about',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: 'design',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Design />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Terms />
          </Suspense>
        ),
      },
      {
        path: 'privacy',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Privacy />
          </Suspense>
        ),
      },
      {
        path: 'changelogs',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Changelogs />
          </Suspense>
        ),
      },
      {
        path: 'changelogs/editor',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <ChangelogsEditor />
          </Suspense>
        ),
      },
      ...authRoutes,
      ...settingsRoutes,
      ...blogRoutes,
      ...addonRoutes,
      ...schematicRoutes,
      ...userRoutes,
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <AdminPanelLayout />,
    children: [...AdminRoutes],
  },
];
