// src/routes/schematicRoutes.tsx
import ProtectedRoute from '@/components/utility/ProtectedRoute';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const SchematicsUploadPage = lazy(
  () => import('@/components/features/schematics/upload/SchematicsUpload')
);
const SchematicDetails = lazy(() => import('@/pages/schematics/SchematicDetails.tsx'));

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
      { path: ':id/:slug', element: <SchematicDetails /> },
    ],
  },
];
