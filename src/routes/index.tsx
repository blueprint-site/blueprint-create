// src/routes/index.tsx
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { addonRoutes } from '@/routes/addonRoutes';
import { authRoutes } from '@/routes/authRoutes';
import { schematicRoutes } from '@/routes/schematicRoutes';
import { settingsRoutes } from '@/routes/settings';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const NoPage = lazy(() => import('@/pages/NotFound'));
const Design = lazy(() => import('@/pages/Design'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));

const BaseLayout = lazy(() => import('@/layouts/BaseLayout'));
const SidebarLayout = lazy(() => import('@/layouts/SidebarLayout'));
const SchematicLayout = lazy(() => import('@/layouts/3DViewerLayout'));


export const routes: RouteObject[] = [
  {
    element: <BaseLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'design', element: <Design /> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy', element: <Privacy /> },
      ...authRoutes,
      ...settingsRoutes,
      { path: '*', element: <NoPage /> },
    ]
  },
  {
    element: <SidebarLayout />,
    children: [
      ...addonRoutes
    ]
  },
  {
    element: <SchematicLayout />,
    children: [
      ...schematicRoutes
    ]
  },
];