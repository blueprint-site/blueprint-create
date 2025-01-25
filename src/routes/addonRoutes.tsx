// src/routes/addonRoutes.tsx
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Addons = lazy(() => import('@/pages/Addons'));
const RandomAddon = lazy(() => import('@/components/RandomAddon'));
const AddonDetails = lazy(() => import('@/components/Addons/AddonDetails'));

export const addonRoutes: RouteObject[] = [
  {
    path: 'addons',
    children: [
      { index: true, element: <Addons /> },
      { path: 'random', element: <RandomAddon /> },
      { path: ':slug', element: <AddonDetails /> }
    ]
  }
];