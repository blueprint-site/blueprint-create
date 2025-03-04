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
    <div className={`w-full ${className}`}>
      {title && (
        <div className="text-foreground font-minecraft mb-4 md:text-xl font-semibold">
          {title}
        </div>
      )}
      <div className="grid md:block md:space-y-4 gap-4 grid-cols-1 sm:grid-cols-2 w-full">
        {children}
      </div>
    </div>
  );
}