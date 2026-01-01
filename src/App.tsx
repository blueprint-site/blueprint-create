import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from '@/routes/index';
import { ThemeProvider } from './components/theme-provider';
import ThemeSwitch from '@/components/ThemeSwitch';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeedInsights } from "@vercel/speed-insights/react";

const queryClient = new QueryClient();

// TODO: CHANGE THE LIGHT TO DARK WHEN I FIX DARK MODE

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='light'>
          <RouterProvider router={createBrowserRouter(routes)} />
          <ThemeSwitch />
          <Toaster />
          <SpeedInsights />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
export default App;
