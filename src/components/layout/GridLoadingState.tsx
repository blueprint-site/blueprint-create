// src/components/layout/GridLoadingState.tsx
import { LoadingSpinner } from '@/components/loading-overlays/LoadingSpinner';

interface GridLoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function GridLoadingState({ 
  size = 'lg',
  message = "Loading items..."
}: GridLoadingStateProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <LoadingSpinner size={size} />
      {message && <p className="text-foreground-muted">{message}</p>}
    </div>
  );
}