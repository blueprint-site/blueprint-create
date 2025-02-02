// src/App.tsx
import { LoadingOverlay } from '@/components/LoadingOverlays/LoadingOverlay';
import '@/config/i18n';
import { routes } from '@/routes/index';
import { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { useEffect } from "react";
import {useAppStore} from "@/stores/useAppStore.ts";
import {LoggedUserProvider} from "@/context/users/logedUserContext.tsx";


const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App = () => {
    const { loadAppData } = useAppStore();
    useEffect(() => {
        // Charger les données dès le démarrage de l'application
        loadAppData().then();
    }, [loadAppData]);
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOverlay />}>
          <LoggedUserProvider>
              <AppRoutes />
          </LoggedUserProvider>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;