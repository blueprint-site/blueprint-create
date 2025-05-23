// src/components/layout/HeroLayout.tsx
import React from 'react';
import { cn } from '@/config/utils';
import { useThemeStore } from '@/api/stores/themeStore';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import RotatingCogwheel from '@/components/common/Cogwheel';

export function HeroLayout({
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
        `flex min-h-screen w-full flex-col overflow-scroll ${isDarkMode ? 'dark' : ''}`,
        className
      )}
    >
      <AppHeader />
      {children}
      <RotatingCogwheel />
    </div>
  );
}

export function HeroHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mt-16 h-64', className)}>{children}</div>;
}

export function HeroContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isDarkMode } = useThemeStore();

  return (
    <main className={cn('flex h-100 w-full flex-col justify-between', className)}>
      <div
        className={`flex-1 ${isDarkMode ? 'bg-shadow_steel_casing' : 'bg-refined_radiance_casing'}`}
      >
        <div className='container mx-auto px-2 md:p-8'>{children}</div>
      </div>
      <AppFooter />
    </main>
  );
}
