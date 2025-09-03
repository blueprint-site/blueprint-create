// src/routes/userRoutes.tsx
import type { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';

import Profile from '@/pages/Profile';
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';

const PublicProfile = lazy(() => import('@/pages/PublicProfile').then(module => ({ default: module.PublicProfile })));

export const userRoutes: RouteObject[] = [
  { path: 'user/:username', element: <Profile /> },
  { path: 'user', element: <Profile /> },
  { 
    path: 'profile/:userId', 
    element: (
      <Suspense fallback={<LoadingOverlay />}>
        <PublicProfile />
      </Suspense>
    )
  },
];
