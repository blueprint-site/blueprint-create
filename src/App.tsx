// src/App.tsx
import { LoadingOverlay } from '@/components/LoadingOverlays/LoadingOverlay';
import Updater from '@/components/utility/Updater';
import '@/config/i18n';
import { routes } from '@/routes/index';
import { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOverlay />}>
        <Updater />
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;