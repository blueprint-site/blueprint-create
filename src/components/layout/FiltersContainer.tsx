// src/components/filters/FiltersContainer.tsx
import React from 'react';

interface FiltersContainerProps {
  readonly children: React.ReactNode;
  readonly title?: string;
  readonly className?: string;
}

export function FiltersContainer({ children, title, className }: Readonly<FiltersContainerProps>) {
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
