// src/App.tsx
import {LoadingOverlay} from '@/components/loading-overlays/LoadingOverlay';
import '@/config/i18n';
import {routes} from '@/routes';
import {Suspense, useEffect} from 'react';
import {BrowserRouter, useRoutes} from 'react-router-dom';
import {useAppStore} from "@/stores/useAppStore.ts";
import {LoggedUserProvider} from "@/context/users/logedUserContext";
import {useSupabaseListener} from "@/hooks/supabaseListener.ts";
import {Toaster} from "@/components/ui/toaster.tsx";


const AppRoutes = () => {
    return useRoutes(routes);
};

const App = () => {
    const { loadAppData } = useAppStore();
    useSupabaseListener();
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
      <Toaster/>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;