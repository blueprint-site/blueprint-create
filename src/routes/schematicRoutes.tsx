// src/routes/schematicRoutes.tsx
import ProtectedRoute from '@/components/utility/ProtectedRoute';
import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const SchematicsUploadPage = lazy(
  () => import('@/components/features/schematics/upload/SchematicsUpload')
);
const SchematicDetails = lazy(() => import('@/pages/schematics/SchematicDetailsPage.tsx'));

export const schematicRoutes: RouteObject[] = [
  {
    path: 'schematics',
    children: [
      {
        path: 'upload',
        element: (
          <ProtectedRoute>
            <SchematicsUploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <ProtectedRoute>
            <SchematicsUploadPage />
          </ProtectedRoute>
        ),
      },
      { path: ':id/:slug', element: <SchematicDetails /> },
    ],
  },
];
