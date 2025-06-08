// src/routes/userRoutes.tsx
import type { RouteObject } from 'react-router';

import Profile from '@/pages/Profile';
import PublicProfile from '@/pages/PublicProfile';

export const userRoutes: RouteObject[] = [
  { path: 'user/:username', element: <PublicProfile /> },
  { path: 'user', element: <Profile /> },
];
