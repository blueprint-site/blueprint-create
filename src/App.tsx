// Keep your current App.tsx as is
import '@/config/i18n';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';
import { Toaster } from '@/components/ui/toaster.tsx';
import { useUserStore } from '@/api/stores/userStore';
import { routes } from './routes';
import { Suspense, useEffect, useState } from 'react';
import 'minecraft-textures-library/src/templates/create-textures.css';
import CookieDialog from './components/utility/CookieDialog.tsx';

const AppRoutes = () => {
  return useRoutes(routes);
};

const App = () => {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const [envLoaded, setEnvLoaded] = useState(false);

  // Fetch user data after component mounts
  useEffect(() => {
    if (envLoaded) {
      fetchUser().catch((error) => {
        console.error('Failed to fetch user data:', error);
      });
    }
  }, [fetchUser, envLoaded]);

  useEffect(() => {
    const loadEnv = () => {
      const script = document.createElement('script');
      script.src = `/env.js?version=${new Date().getTime()}`;
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
        <>
          <AppRoutes />
          <CookieDialog variant='default' />
        </>
        <Toaster />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
