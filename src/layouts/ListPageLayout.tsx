// src/components/layout/ListPageLayout.tsx
import React from 'react';
import { cn } from '@/config/utils';
import { useThemeStore } from '@/api/stores/themeStore';
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
    <div
      className={cn(
        `flex min-h-screen w-full flex-col md:flex-row ${isDarkMode ? 'dark' : ''}`,
        className
      )}
    >
      <AppHeader fullWidth />
      {children}
      <RotatingCogwheel />
    </div>
  );
}

export function ListPageFilters({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('bg-surface-1 mt-16 w-full shrink-0 p-4 md:w-64', className)}>
      {children}
    </div>
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
        'flex h-screen w-full flex-col justify-between overflow-scroll md:pt-16',
        className
      )}
    >
      <div
        className={`flex-1 p-8 ${isDarkMode ? 'bg-shadow_steel_casing' : 'bg-refined_radiance_casing'}`}
      >
        {children}
      </div>
      <AppFooter />
    </main>
  );
}
