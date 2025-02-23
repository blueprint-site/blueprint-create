// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';

import ProtectedRoute from '@/components/utility/ProtectedRoute';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

export const userRoutes: RouteObject[] = [
  { path: 'user/:username', element: <Profile /> },
  { path: 'user', element: <Profile /> },
  {
    path: 'settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
];
