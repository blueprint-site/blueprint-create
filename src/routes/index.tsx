import type { RouteObject } from 'react-router-dom';

import Home from '../pages/Home/Home';
import BaseLayout from '@/layouts/BaseLayout';
import AddonsPage from '@/pages/Addons/AddonsPage';
import LoginPage from '@/pages/Auth/Login/LoginPage';
import AdminPage from '@/pages/Admin/AdminPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthManagerPage from '@/pages/Auth/AuthManager/AuthManagerPage';
import ExpandedAddonPage from '@/pages/Addons/ExpandedAddon/ExpandedAddonPage';
import AdminReviewAddons from '@/pages/Admin/AdminReviewAddons';
import AdminFeaturedAddons from '@/pages/Admin/AdminFeaturedAddons';

export const routes: RouteObject[] = [
  {
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '*',
        element: <Home />,
      },
      {
        path: '/addons',
        element: <AddonsPage />,
      },
      {
        path: '/addons/:slug',
        element: <ExpandedAddonPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/auth',
        element: <AuthManagerPage />,
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole='admin'>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/review',
        element: (
          <ProtectedRoute requiredRole='admin'>
            <AdminReviewAddons />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/featured',
        element: (
          <ProtectedRoute requiredRole='admin'>
            <AdminFeaturedAddons />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
