// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/utility/ProtectedRoute';
import AdminPage from "@/pages/Admin";
import AdminBlogEditor from "@/components/features/admin/blog/components/AdminBlogEditor.tsx";


export const AdminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: (
        <ProtectedRoute>
          <AdminPage/>
        </ProtectedRoute>
    )
  },
    {
        path: 'admin/blog-editor/:id',
        element: (
            <ProtectedRoute>
                <AdminBlogEditor />
            </ProtectedRoute>
        )
    }
];