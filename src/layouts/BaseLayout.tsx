import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import Footer from './Footer';
export default function BaseLayout() {
  return (
    <div className='bg-background text-foreground min-h-screen w-full flex flex-col'>
      <AppHeader />
      <div className='flex-1 mb-10'>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
