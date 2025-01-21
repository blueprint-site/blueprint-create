// src/routes/schematicRoutes.tsx
import SchematicsPageLoadingOverlay from '@/components/LoadingOverlays/SchematicPageLoadingOverlay';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const SchematicsPage = lazy(() => import('@/pages/Schematics/Schematics'));
const Schematic3DViewer = lazy(() => import('@/pages/Schematics/Schematic3DViewer/Schematic3DViewer'));
const SchematicsUploadPage = lazy(() => import('@/pages/Schematics/SchematicsUpload/SchematicsUpload'));
const SchematicExpanded = lazy(() => import('@/components/SchematicExpanded'));

const Schematics3DViewerWithLoading = () => (
  <Suspense fallback={<SchematicsPageLoadingOverlay />}>
    <Schematic3DViewer />
  </Suspense>
);

export const schematicRoutes: RouteObject[] = [
  {
    path: 'schematics',
    children: [
      { index: true, element: <SchematicsPage /> },
      { path: '3dviewer', element: <Schematics3DViewerWithLoading /> },
      { path: 'upload', element: <SchematicsUploadPage /> },
      { path: ':id', element: <SchematicExpanded /> }
    ]
  }
];