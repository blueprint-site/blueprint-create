// src/routes/addonRoutes.tsx
import { RouteObject } from 'react-router-dom';

import AddonDetails from '@/components/Addons/AddonDetails';
import RandomAddon from '@/components/Addons/RandomAddon';
import Addons from '@/pages/Addons';

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