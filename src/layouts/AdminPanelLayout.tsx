import { Outlet } from 'react-router-dom';
import NavBar from '@/components/layout/AppHeader';

const Layout = () => {
  return (
    <div className='bg-background text-foreground flex h-screen w-full flex-col'>
      <NavBar />
      <main className='flex flex-1 flex-col overflow-hidden'>
        <div className='flex w-full flex-1 flex-col px-4 pt-[64px]'>
          <Outlet />
        </div>
      </main>
      <div className='text-center'>Blueprint Admin Panel made with 🫀</div>
    </div>
  );
};

export default Layout;
