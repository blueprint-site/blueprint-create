// src/App.tsx
import '@/config/i18n';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';
import { Toaster } from '@/components/ui/toaster.tsx';
import { useUserStore } from '@/api/stores/userStore';
import { routes } from './routes';
import { Suspense, useEffect, useState } from 'react';
import 'minecraft-textures-library/src/templates/create-textures.css';
import CookieDialog from './components/utility/CookieDialog.tsx';
import { LoggedUserProvider } from './api/context/loggedUser/loggedUserContext.tsx';

// Separate the routes component to avoid hook rules violation
const AppRoutes = () => {
  // Now useRoutes is at the top level of this component
  return useRoutes(routes);
};

const App = () => {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const [envLoaded, setEnvLoaded] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const loadEnv = () => {
      const script = document.createElement('script');
      script.src = `/env.js?version=${new Date().getTime()}`; // Adds a timestamp to each request
      script.onload = () => {
        console.log('env.js loaded');
        setEnvLoaded(true);
      };
      script.onerror = () => {
        console.error('❌ Error while loading `env.js`');
      };
      document.head.appendChild(script);
    };

    loadEnv();
  }, []);

  if (!envLoaded) {
    return <LoadingOverlay />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOverlay />}>
        <LoggedUserProvider>
          <AppRoutes />
          {/* Cookie dialog displays one time on any page load */}
          <CookieDialog variant='default' />
        </LoggedUserProvider>
        <Toaster />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
