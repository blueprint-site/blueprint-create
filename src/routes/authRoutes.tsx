// src/routes/authRoutes.tsx
import ProtectedRoute from '@/components/utility/ProtectedRoute';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const AuthPage = lazy(() => import('@/pages/Auth'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));

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