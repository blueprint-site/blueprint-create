import { useEffect, useState } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Create a store to hold subscribers
type Subscriber = () => void;
const subscribers = new Set<Subscriber>();

let currentBreakpoint: Breakpoint = 'lg';

// Initialize and set up listeners
if (typeof window !== 'undefined') {
  const updateBreakpoint = () => {
    const width = window.innerWidth;
    let newBreakpoint: Breakpoint;

    if (width < breakpoints.sm) newBreakpoint = 'xs';
    else if (width < breakpoints.md) newBreakpoint = 'sm';
    else if (width < breakpoints.lg) newBreakpoint = 'md';
    else if (width < breakpoints.xl) newBreakpoint = 'lg';
    else if (width < breakpoints['2xl']) newBreakpoint = 'xl';
    else newBreakpoint = '2xl';

    if (newBreakpoint !== currentBreakpoint) {
      currentBreakpoint = newBreakpoint;
      // Notify all subscribers
      subscribers.forEach((subscriber) => subscriber());
    }
  };

  // Initial setup
  updateBreakpoint();

  // Add resize listener
  window.addEventListener('resize', updateBreakpoint);
}

// Hook to subscribe to breakpoint changes
const useBreakpointValue = () => {
  const [value, setValue] = useState(currentBreakpoint);

  useEffect(() => {
    const updateValue = () => setValue(currentBreakpoint);
    subscribers.add(updateValue);
    return () => {
      subscribers.delete(updateValue);
    };
  }, []);

  return value;
};

// Helper functions that use the reactive hook
export const useBreakpoint = () => {
  const value = useBreakpointValue();

  const isAbove = (size: Breakpoint): boolean => {
    const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpointOrder.indexOf(value);
    const targetIndex = breakpointOrder.indexOf(size);
    return currentIndex >= targetIndex;
  };

  const isBelow = (size: Breakpoint): boolean => {
    const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpointOrder.indexOf(value);
    const targetIndex = breakpointOrder.indexOf(size);
    return currentIndex < targetIndex;
  };

  return {
    breakpoint: value,
    isAbove,
    isBelow,
    isMobile: isBelow('md'),
    isTablet: value === 'md',
    isDesktop: isAbove('lg'),
  };
};

// Re-export individual hooks for convenience
export const useIsMobile = () => useBreakpoint().isMobile;
export const useIsTablet = () => useBreakpoint().isTablet;
export const useIsDesktop = () => useBreakpoint().isDesktop;
export const useCurrentBreakpoint = () => useBreakpoint().breakpoint;
