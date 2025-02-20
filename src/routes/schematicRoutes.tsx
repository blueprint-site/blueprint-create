// src/routes/schematicRoutes.tsx
import { lazy} from 'react';
import { RouteObject } from 'react-router-dom';

const SchematicsList = lazy(() => import('@/pages/schematics/SchematicsList'));
const SchematicsUploadPage = lazy(() => import('@/pages/schematics/SchematicsUpload'));
const SchematicDetails = lazy(() => import('@/pages/schematics/SchematicDetails'));


export const schematicRoutes: RouteObject[] = [
  {
    path: 'schematics',
    children: [
      { index: true, element: <SchematicsList /> },
      { path: 'upload', element: <SchematicsUploadPage /> },
      { path: ':slug', element: <SchematicDetails /> }
    ]
  }
];