// src/components/filters/FiltersContainer.tsx
import React from 'react';

interface FiltersContainerProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function FiltersContainer({
  children,
  title,
  className
}: FiltersContainerProps) {
  return (
    <div className={className}>
      {title && (
        <div className="text-foreground font-minecraft mb-4 text-xl font-semibold">
          {title}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}