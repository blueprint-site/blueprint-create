import * as React from 'react';
import { BookOpen, Bot, Map, Settings2, SquareTerminal } from 'lucide-react';

import { NavMain } from '@/components/layout/AdminPanel/nav-main.tsx';
import { NavUser } from '@/components/layout/AdminPanel/nav-user.tsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar.tsx';
import { useLoggedUser } from '@/api/context/loggedUser/loggedUserContext.tsx';
import logo from '@/assets/logo.webp';
import { useLocation } from 'react-router-dom';
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '');
  console.log(pathSegments[1]);
  const { user, preferences } = useLoggedUser(); // Déplacer ici l'appel du hook
  // Données de navigation et utilisateur
  const data = {
    user: {
      name: user?.name || 'Guest', // Ajout de fallback au cas où LoggedUser est undefined
      email: user?.email || 'Guest',
      avatar: preferences?.avatar || 'Guest',
    },

    navMain: [
      {
        title: 'Dashboard',
        url: '/admin',
        icon: SquareTerminal,
        isActive: pathSegments[1] === undefined,
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
