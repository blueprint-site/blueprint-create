import type { RouteObject } from 'react-router-dom';

import Home from '../pages/Home/Home';
import BaseLayout from '@/layouts/BaseLayout';
import AddonsPage from '@/pages/Addons/AddonsPage';
import LoginPage from '@/pages/Auth/Login/LoginPage';
// import AdminPage from "@/pages/Admin/AdminPage";
// import ProtectedRoute from "@/components/ProtectedRoute";

// TODO: Implement admin page
export const routes: RouteObject[] = [
  {
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/addons',
        element: <AddonsPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      // {
      //     path: "/admin",
      //     element: (
      //         <ProtectedRoute requiredRole="admin">
      //             <AdminPage />
      //         </ProtectedRoute>
      //     ),
      // },
    ],
  },
];
