// src/routes/index.tsx
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { addonRoutes } from '@/routes/addonRoutes';
import { authRoutes } from '@/routes/authRoutes';
import { schematicRoutes } from '@/routes/schematicRoutes';

const Home = lazy(() => import('@/pages/Home/Home'));
const About = lazy(() => import('@/pages/About/About'));
const NoPage = lazy(() => import('@/pages/404/NoPage'));
const Layout = lazy(() => import('@/components/Layout/Layout'));
const Design = lazy(() => import('@/pages/Design/Design'));
const Stats = lazy(() => import('@/pages/Stats/Stats'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NoPage /> },
      { path: 'design', element: <Design /> },
      { path: 'stats', element: <Stats /> },
      ...addonRoutes,
      ...authRoutes,
      ...schematicRoutes
    ]
  }
];