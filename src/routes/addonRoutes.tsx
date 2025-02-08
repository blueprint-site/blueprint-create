// src/routes/addonRoutes.tsx
import { RouteObject } from 'react-router-dom';
import ListPage from '@/pages/addons/AddonListPage'
import DetailPage from '@/pages/addons/AddonDetailsPage'
import RandomAddon from "@/components/features/addons/RandomAddon";


export const addonRoutes: RouteObject[] = [
  {
    path: 'addons',
    children: [
      { index: true, element: <ListPage /> },
      { path: 'random', element: <RandomAddon /> },
      { path: ':slug', element: <DetailPage /> }
    ]
  }
];