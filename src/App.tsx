// src/App.tsx
import {LoadingOverlay} from '@/components/loading-overlays/LoadingOverlay';
import '@/config/i18n';
import {routes} from '@/routes';
import {Suspense} from 'react';
import {BrowserRouter, useRoutes} from 'react-router-dom';
import {LoggedUserProvider} from "@/context/users/loggedUserContext";
import {Toaster} from "@/components/ui/toaster.tsx";


const AppRoutes = () => {
    return useRoutes(routes);
};

const App = () => {

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