import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import Footer from './Footer';
export default function BaseLayout() {
  return (
    <div className='bg-background text-foreground min-h-screen w-full flex flex-col'>
      <AppHeader />
      <div className='flex-1 mx-auto w-full max-w-300'>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
