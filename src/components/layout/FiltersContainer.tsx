// src/components/filters/FiltersContainer.tsx
import React from 'react';

interface FiltersContainerProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function FiltersContainer({ children, title, className }: FiltersContainerProps) {
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className='text-foreground font-minecraft mb-4 font-semibold md:text-xl'>{title}</div>
      )}
      <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:block lg:space-y-4'>
        {children}
      </div>
    </div>
  );
}
