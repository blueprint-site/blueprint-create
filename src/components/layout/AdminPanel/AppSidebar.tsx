import * as React from 'react';
import { BookOpen, Bot, Map, Settings2, SquareTerminal } from 'lucide-react';

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
        isActive:
          pathSegments[1] === undefined ||
          pathSegments[1] === 'stats' ||
          pathSegments[1] === 'logs',
        items: [
          { title: 'Stats', url: '/admin/stats' },
          { title: 'Logs', url: '/admin/logs' },
        ],
      },
      {
        title: 'Addons',
        url: '#',
        icon: Bot,
        isActive: pathSegments[1] === 'addons',
        items: [
          { title: 'List', url: '/admin/addons/list' },
          { title: 'Add', url: '/admin/addons/add' },
          { title: 'Featured Addons', url: '/admin/addons/featured/list' },
          { title: 'Add Featured', url: '/admin/addons/featured/add' },
          { title: 'Auto Add Featured', url: '/admin/addons/featured/auto-add' },
        ],
      },
      {
        title: 'Blogs',
        url: '#',
        icon: Bot,
        isActive: pathSegments[1] === 'blogs',
        items: [
          { title: 'List', url: '/admin/blogs/list' },
          { title: 'Add', url: '/admin/blogs/editor/new' },
        ],
      },
      {
        title: 'Schematics',
        url: '#',
        icon: Map,
        isActive: pathSegments[1] === 'schematics',
        items: [{ title: 'List', url: '/admin/schematics/list' }],
      },
      {
        title: 'Documentation',
        url: '#',
        icon: BookOpen,
        isActive: pathSegments[1] === 'documentation',
        items: [
          { title: 'Introduction', url: '#' },
          { title: 'Get Started', url: '#' },
          { title: 'Tutorials', url: '#' },
          { title: 'Changelog', url: '#' },
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
