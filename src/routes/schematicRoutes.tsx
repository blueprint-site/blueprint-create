// src/routes/schematicRoutes.tsx
import SchematicsPageLoadingOverlay from '@/components/loading-overlays/SchematicPageLoadingOverlay';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const SchematicsList = lazy(() => import('@/pages/schematics/SchematicsList'));
const Schematic3DViewer = lazy(() => import('@/pages/schematics/3d-viewer/Schematic3DViewer'));
const SchematicsUploadPage = lazy(() => import('@/pages/schematics/SchematicsUpload'));
const SchematicDetails = lazy(() => import('@/pages/schematics/SchematicDetails'));

const Schematics3DViewerWithLoading = () => (
  <Suspense fallback={<SchematicsPageLoadingOverlay />}>
    <Schematic3DViewer />
  </Suspense>
);

export const schematicRoutes: RouteObject[] = [
  {
    path: 'schematics',
    children: [
      { index: true, element: <SchematicsList /> },
      { path: '3dviewer', element: <Schematics3DViewerWithLoading /> },
      { path: 'upload', element: <SchematicsUploadPage /> },
      { path: ':id', element: <SchematicDetails /> }
    ]
  }
];