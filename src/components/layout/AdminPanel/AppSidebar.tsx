import * as React from 'react';
import { Bot, Settings2, SquareTerminal } from 'lucide-react';

import { NavMain } from '@/components/layout/AdminPanel/NavMain.tsx';
import { NavUser } from '@/components/layout/AdminPanel/NavUser.tsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar.tsx';
import { useUserStore } from '@/api/stores/userStore.ts';
import logo from '@/assets/logo.webp';
import { useLocation } from 'react-router';
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '');
  console.log(pathSegments[1]);
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
        title: 'Modules',
        url: '#',
        icon: Bot,
        isActive:
          pathSegments[1] === 'addons' ||
          pathSegments[1] === 'schematics' ||
          pathSegments[1] === 'blogs',
        items: [
          { title: 'Addons', url: '/admin/addons/list', isActive: pathSegments[1] === 'addons' },
          {
            title: 'Schematics',
            url: '/admin/schematics/list',
            isActive: pathSegments[1] === 'schematics',
          },
          { title: 'Blog', url: '/admin/blogs', isActive: pathSegments[1] === 'blogs' },
        ],
      },
      {
        title: 'Settings',
        url: '#',
        icon: Settings2,
        isActive: pathSegments[1] === 'settings',
        items: [
          { title: 'General', url: '#' },
          { title: 'Team', url: '#' },
          { title: 'Billing', url: '#' },
          { title: 'Limits', url: '#' },
        ],
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
