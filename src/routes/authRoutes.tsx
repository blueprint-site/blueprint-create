// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';

import ProtectedRoute from '@/components/utility/ProtectedRoute';
import AuthPage from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

export const authRoutes: RouteObject[] = [
  { path: 'user/:username', element: <Profile /> },
  { path: 'user', element: <Profile /> },
  { path: 'login', element: <AuthPage /> },
  {
    path: 'settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    )
  }
];