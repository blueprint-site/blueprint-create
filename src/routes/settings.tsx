import ProtectedRoute from '@/components/utility/ProtectedRoute';
import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { Navigate } from 'react-router';

const SettingsPage = lazy(() => import('@/pages/Settings'));

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to='profile' replace />,
      },
      {
        path: ':section',
        element: <SettingsPage key={location.pathname} />,
      },
    ],
  },
];
