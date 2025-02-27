// src/routes/addonRoutes.tsx
import { RouteObject } from 'react-router-dom';
import ListPage from '@/pages/addons/AddonListPage';
import DetailPage from '@/pages/addons/AddonDetailsPage';

export const addonRoutes: RouteObject[] = [
  {
    path: 'addons',
    children: [
      { index: true, element: <ListPage /> },
      { path: ':slug', element: <DetailPage /> },
    ],
  },
];
