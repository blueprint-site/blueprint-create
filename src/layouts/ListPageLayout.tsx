// src/components/layout/ListPageLayout.tsx
import React from 'react';
import { cn } from '@/config/utils';
import { useThemeStore } from '@/api/stores/themeStore.tsx';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import RotatingCogwheel from '@/components/common/Cogwheel';

export function ListPageLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={cn(`flex min-h-screen w-full ${isDarkMode ? 'dark' : ''}`, className)}>
      <AppHeader />
      {children}
      <RotatingCogwheel />
    </div>
  );
}

export function ListPageSidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside className={cn('bg-background mt-16 w-64 shrink-0 p-4', className)}>{children}</aside>
  );
}

export function ListPageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isDarkMode } = useThemeStore();

  return (
    <main
      className={cn(
        'flex h-screen w-full flex-col justify-between overflow-scroll pt-16',
        className
      )}>
      <div
        className={`flex-1 p-8 ${isDarkMode ? 'bg-shadow_steel_casing' : 'bg-refined_radiance_casing'}`}>
        {children}
      </div>
      <AppFooter />
    </main>
  );
}
