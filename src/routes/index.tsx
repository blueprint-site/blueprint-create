// src/routes/index.tsx
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { addonRoutes } from '@/routes/addonRoutes';
import { authRoutes } from '@/routes/authRoutes';
import { schematicRoutes } from '@/routes/schematicRoutes';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const NoPage = lazy(() => import('@/pages/NotFound'));
const Layout = lazy(() => import('@/components/Layout/Layout'));
const Design = lazy(() => import('@/pages/Design'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'design', element: <Design /> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy', element: <Privacy /> },
      ...addonRoutes,
      ...authRoutes,
      ...schematicRoutes,
      { path: '*', element: <NoPage /> },
    ]
  }
];