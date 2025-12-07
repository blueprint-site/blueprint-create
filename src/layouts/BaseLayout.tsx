import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
export default function BaseLayout() {
  return (
    <div className='bg-background text-foreground min-h-screen w-full'>
      <AppHeader />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
