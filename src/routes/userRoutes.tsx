// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router';

import Profile from '@/pages/Profile';

export const userRoutes: RouteObject[] = [
  { path: 'user/:username', element: <Profile /> },
  { path: 'user', element: <Profile /> },
];
