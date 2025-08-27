import * as React from 'react';
import { Feather, Map, Puzzle, SquareTerminal, Star } from 'lucide-react';

import { NavMain } from '@/components/layout/AdminPanel/NavMain.tsx';
import { NavUser } from '@/components/layout/AdminPanel/NavUser.tsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar.tsx';
import { useLocation } from 'react-router';
import { useUserStore } from '@/api/stores/userStore.ts';
import logo from '@/assets/logo.webp';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '');
  const user = useUserStore((state) => state.user);
  const preferences = useUserStore((state) => state.preferences);

  const data = {
    user: {
      name: user?.name || 'Guest',
      email: user?.email || 'Guest',
      avatar: preferences?.avatar || 'Guest',
    },

    navMain: [
      {
        title: 'Dashboard',
        url: '/admin',
        icon: SquareTerminal,
        isActive: pathSegments[0] === 'admin' && pathSegments[1] === undefined,
        items: [
          {
            title: 'Admin',
            url: '/admin',
            isActive: pathSegments[0] === 'admin' && pathSegments[1] === undefined,
          },
        ],
      },
      {
        title: 'Addons',
        url: '/admin/addons',
        icon: Puzzle,
        isActive: pathSegments[1] === 'addons',
        items: [
          { title: 'List', url: '/admin/addons/list' },
          { title: 'Add', url: '/admin/addons/add' },
        ],
      },
      {
        title: 'Featured Addons',
        url: '/admin/featured-addons',
        icon: Star,
        isActive: pathSegments[1] === 'featured-addons',
        items: [
          { title: 'List/Remove', url: '/admin/featured-addons/list' },
          { title: 'Add', url: '/admin/featured-addons/add' },
          { title: 'Auto Add', url: '/admin/featured-addons/auto-add' },
        ],
      },
      {
        title: 'Blogs',
        url: '/admin/blogs',
        icon: Feather,
        isActive: pathSegments[1] === 'blogs',
        items: [
          { title: 'List', url: '/admin/blogs/list' },
          { title: 'Add', url: '/admin/blogs/editor/new' },
        ],
      },
      {
        title: 'Schematics',
        url: '/admin/schematics',
        icon: Map,
        isActive: pathSegments[1] === 'schematics',
        items: [{ title: 'List', url: '/admin/schematics/list' }],
      },
      {
        title: 'User',
        url: '/admin/users',
        icon: Map,
        isActive: pathSegments[1] === 'users',
        items: [{ title: 'List', url: '/admin/users' }],
      },
    ],
  };

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <div className={'justify-bettew flex flex-row items-center gap-1'}>
          <div>
            <img height={64} width={64} src={logo} alt={'logo'} />
          </div>
          <div>
            <b>Blueprint</b>
            <p>Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <a
          href='/'
          className='bg-blueprint w-full justify-center rounded-md p-2 text-center text-black'
        >
          Go back to site
        </a>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
