// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/utility/ProtectedRoute';
import AdminPage from "@/pages/Admin.tsx";


export const AdminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: (
        <ProtectedRoute>
          <AdminPage/>
        </ProtectedRoute>
    )
  }
];