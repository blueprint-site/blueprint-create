// src/routes/authRoutes.tsx
import ProtectedRoute from '@/components/utility/ProtectedRoute';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const LoginPage = lazy(() => import('@/pages/Login/Login'));
const RegisterPage = lazy(() => import('@/pages/Register/Register'));
const UserPage = lazy(() => import('@/pages/User/UserPage'));
const UserSettings = lazy(() => import('@/pages/User/UserSettings'));

export const authRoutes: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'user/:username', element: <UserPage /> },
  { path: 'user', element: <UserPage /> },
  {
    path: 'usersettings',
    element: (
      <ProtectedRoute>
        <UserSettings />
      </ProtectedRoute>
    )
  }
];