// src/routes/adminRoutes.tsx
import type { RouteObject } from 'react-router';

// Direct imports for all admin components (no lazy loading to eliminate Suspense animations)
import { UserManagement } from '@/components/features/admin/users/UserManagement';
import { Admin } from '@/pages';
import { EnhancedAdminDashboard } from '@/components/features/admin/EnhancedAdminDashboard';
import {
  SmartReviewQueue,
  AddonsKanban,
  ManualAddForm,
  AddAddon,
} from '@/components/features/admin/addons';
import { AdminBlogMain, BlogList } from '@/components/features/admin/blog';
import { LogsList } from '@/components/features/admin/AdminLogs';
import { BlogEditor } from '@/components/features/admin/blog';
import { BlogEditorFullScreenV2 } from '@/components/features/admin/blog/BlogEditorFullScreenV2';
import { SchematicsDisplay } from '@/components/features/admin/schematics';
import { AddonStatsWrapper } from '@/components/features/admin/stats';
import { AddFeaturedAddon } from '@/components/features/admin/addons/AddFeaturedAddon';
import FeaturedAddonsList from '@/components/features/admin/addons/FeaturedAddonsList';
import AutoAddFeaturedAddon from '@/components/features/admin/addons/AutoAddFeaturedAddon';
import { BadgeManagement } from '@/pages/admin/BadgeManagement';
import { GlobalStats } from '@/pages/admin/GlobalStats';
import { RewardRules } from '@/pages/admin/RewardRules';
import { UserAchievements } from '@/pages/admin/UserAchievements';
import { BadgeDebug } from '@/pages/admin/BadgeDebug';

export const AdminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: <Admin />,
  },
  {
    path: 'admin/blogs/editor/:id',
    element: <BlogEditor />,
  },
  {
    path: 'admin/blogs/editor-fullscreen/:id',
    element: <BlogEditorFullScreenV2 />,
  },
  {
    path: 'admin/blogs/list',
    element: <BlogList />,
  },
  {
    path: 'admin/stats',
    element: <AddonStatsWrapper />,
  },
  {
    path: 'admin/addons',
    element: <EnhancedAdminDashboard />,
  },
  {
    path: 'admin/addons/list',
    element: <EnhancedAdminDashboard />,
  },
  {
    path: 'admin/addons/review',
    element: <EnhancedAdminDashboard />,
  },
  {
    path: 'admin/addons/kanban',
    element: <EnhancedAdminDashboard />,
  },
  {
    path: 'admin/blogs',
    element: <AdminBlogMain />,
  },
  {
    path: 'admin/logs',
    element: <LogsList />,
  },
  {
    path: 'admin/addons/add',
    element: <EnhancedAdminDashboard />,
  },
  {
    path: 'admin/featured-addons/add',
    element: <AddFeaturedAddon />,
  },
  {
    path: 'admin/featured-addons/auto-add',
    element: <AutoAddFeaturedAddon />,
  },
  {
    path: 'admin/featured-addons/list',
    element: <FeaturedAddonsList />,
  },
  {
    path: 'admin/schematics/list',
    element: <SchematicsDisplay />,
  },
  {
    path: 'admin/users',
    element: <UserManagement />,
  },
  {
    path: 'admin/badges',
    element: <BadgeManagement />,
  },
  {
    path: 'admin/rewards/stats',
    element: <GlobalStats />,
  },
  {
    path: 'admin/rewards/rules',
    element: <RewardRules />,
  },
  {
    path: 'admin/rewards/achievements',
    element: <UserAchievements />,
  },
  {
    path: 'admin/rewards/debug',
    element: <BadgeDebug />,
  },
];
