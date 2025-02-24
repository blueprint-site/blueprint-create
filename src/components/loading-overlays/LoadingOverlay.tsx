// src/components/loading-overlays/LoadingOverlay.tsx
import LoadingGif from '@/assets/loading.gif';
import { cn } from '@/config/utils.ts';

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message = 'Blueprint', className }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xs',
        className
      )}
    >
      <h1 className='font-minecraft mb-6 text-4xl text-white/80'>{message}</h1>
      <img src={LoadingGif} alt='Loading animation' className='w-64 max-w-[80vw]' />
    </div>
  );
}
