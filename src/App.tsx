import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from '@/routes/index';
import { ThemeProvider } from './components/theme-provider';
import ThemeSwitch from '@/components/ThemeSwitch';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeedInsights } from "@vercel/speed-insights/next"

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='dark'>
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
