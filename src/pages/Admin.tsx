import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/config/utils.ts';
import { BarChart, LayoutDashboard, Users, Package, FileText, Files } from 'lucide-react';
import AdminAddonsTable from '@/components/features/admin/addons/AdminAddonsTable';
import AddonStatsWrapper from '@/components/features/admin/stats/AddonStatsWrapper';
import AdminUsersDisplay from '@/components/features/admin/users/AdminUsersDisplay';
import AdminBlogDisplay from '@/components/features/admin/blog/components/AdminBlogDisplay.tsx';
import AdminSchematicsDisplay from '@/components/features/admin/schematics/AdminSchematicsDisplay';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const navigate = useNavigate();
  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <div className='flex w-64 flex-col space-y-4 p-4 text-white'>
        <h2 className='text-xl font-bold'>Admin Panel</h2>
        <div className='flex flex-col space-y-2'>
          <div
            className={cn(
              'flex cursor-pointer items-center space-x-2 rounded p-2',
              activePage === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-800'
            )}
            onClick={() => setActivePage('dashboard')}
          >
            <LayoutDashboard className='h-5 w-5' />
            <span>Dashboard</span>
          </div>
          <div
            className={cn(
              'flex cursor-pointer items-center space-x-2 rounded p-2',
              activePage === 'blog' ? 'bg-gray-700' : 'hover:bg-gray-800'
            )}
            onClick={() => setActivePage('blog')}
          >
            <Files className='h-5 w-5' />
            <span>Blog</span>
          </div>
          <div
            className={cn(
              'flex cursor-pointer items-center space-x-2 rounded p-2',
              activePage === 'users' ? 'bg-gray-700' : 'hover:bg-gray-800'
            )}
            onClick={() => setActivePage('users')}
          >
            <Users className='h-5 w-5' />
            <span>Users</span>
          </div>
          <div
            className={cn(
              'flex cursor-pointer items-center space-x-2 rounded p-2',
              activePage === 'stats' ? 'bg-gray-700' : 'hover:bg-gray-800'
            )}
            onClick={() => setActivePage('stats')}
          >
            <BarChart className='h-5 w-5' />
            <span>Stats</span>
          </div>
          <div
            className={cn(
              'flex cursor-pointer items-center space-x-2 rounded p-2',
              activePage === 'addons' ? 'bg-gray-700' : 'hover:bg-gray-800'
            )}
            onClick={() => setActivePage('addons')}
          >
            <Package className='h-5 w-5' />
            <span>Addons</span>
          </div>
          <div
            className={cn(
              'flex cursor-pointer items-center space-x-2 rounded p-2',
              activePage === 'schematics' ? 'bg-gray-700' : 'hover:bg-gray-800'
            )}
            onClick={() => setActivePage('schematics')}
          >
            <FileText className='h-5 w-5' />
            <span>Schematics</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-6'>
        {activePage === 'dashboard' && (
          <Card className='border border-gray-200 shadow-lg dark:border-gray-700'>
            <CardContent className='p-6'>
              <h3 className='text-xl font-bold'>Welcome to the Dashboard</h3>
              <p>Here you can see an overview of your application.</p>
            </CardContent>
          </Card>
        )}

        {activePage === 'users' && <AdminUsersDisplay></AdminUsersDisplay>}

        {activePage === 'stats' && <AddonStatsWrapper />}

        {activePage === 'addons' && (
          <div>
            <AdminAddonsTable />
          </div>
        )}
        {activePage === 'blog' && (
          <>
            <Button
              className={'float-end'}
              variant='default'
              onClick={() => navigate('blog-editor/new')}
            >
              <Files /> New Article
            </Button>

            <h3 className='text-xl font-bold'>Blog Management</h3>

            <AdminBlogDisplay />
          </>
        )}
        {activePage === 'schematics' && (
          <>
            <h3 className='text-xl font-bold'>Schematics</h3>
            <p>Manage and generate schematics for your application.</p>
            <AdminSchematicsDisplay />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
