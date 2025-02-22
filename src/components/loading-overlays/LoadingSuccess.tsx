// src/components/loading-overlays/LoadingSuccess.tsx
import LoadingCheckmark from '@/assets/loading_checkmark.png';
import { cn } from '@/config/utils.ts';

interface LoadingSuccessProps {
  message?: string;
  className?: string;
}

export function LoadingSuccess({ 
  message = "Blueprint",
  className 
}: LoadingSuccessProps) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-1",
      className
    )}>
      <h1 className="mb-6 text-4xl font-minecraft text-foreground">
        {message}
      </h1>
      <img 
        src={LoadingCheckmark}
        alt="Success checkmark" 
        className="w-48 max-w-[80vw]"
      />
    </div>
  );
}