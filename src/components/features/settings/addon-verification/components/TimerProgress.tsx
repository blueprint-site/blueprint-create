import { useEffect, useState, ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';

interface TimerProgressProps {
  startTimestamp: number;
  countdownTime: number; // in seconds
  description: string;
  icon?: ReactNode;
}

/**
 * A countdown timer with a progress bar
 */
export default function TimerProgress({
  startTimestamp,
  countdownTime,
  description,
  icon,
}: TimerProgressProps) {
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(countdownTime);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedTime = (Date.now() - startTimestamp) / 1000;
      const remaining = Math.max(0, countdownTime - elapsedTime);
      const currentProgress = Math.min(100, (elapsedTime / countdownTime) * 100);

      setRemainingTime(remaining);
      setProgress(currentProgress);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTimestamp, countdownTime]);

  // Format the remaining time nicely
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className='w-full space-y-2'>
      <div className='flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>{description}</p>
        <div className='flex items-center space-x-2'>
          {icon && <span>{icon}</span>}
          <span className='text-sm font-medium'>{formatTime(remainingTime)}</span>
        </div>
      </div>
      <Progress value={progress} className='h-2 w-full' />
    </div>
  );
}
