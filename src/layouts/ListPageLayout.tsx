// src/components/layout/ListPageLayout.tsx
import React from 'react';
import { cn } from '@/config/utils';

export function ListPageLayout({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full", className)}>
      {children}
    </div>
  );
}

export function ListPageSidebar({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside className={cn("w-64 p-4 shrink-0", className)}>
      {children}
    </aside>
  );
}

export function ListPageContent({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("flex-1 p-8", className)}>
      {children}
    </main>
  );
}