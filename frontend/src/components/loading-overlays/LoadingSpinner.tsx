import LoadingGif from '@/assets/loading.gif';
import { cn } from '@/config/utils.ts';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
} as const;

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', sizeClasses[size], className)}>
      <img src={LoadingGif} alt='Loading spinner' className='h-full w-full' />
    </div>
  );
}
