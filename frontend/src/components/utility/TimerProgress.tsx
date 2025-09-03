import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface TimerProgressProps {
  startTimestamp: number;
  countdownTime: number;
  description?: string;
  icon?: React.ReactNode;
  onComplete?: () => void;
}

const TimerProgress = ({
  startTimestamp,
  countdownTime,
  description,
  icon,
  onComplete,
}: TimerProgressProps) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(countdownTime - Math.floor((Date.now() - startTimestamp) / 1000), 0)
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timeLeft === 0 && onComplete) {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  useEffect(() => {
    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      setTimeLeft(Math.max(countdownTime - elapsed, 0));
    };

    intervalRef.current = setInterval(updateTimer, 1000);
    updateTimer();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTimestamp, countdownTime]);

  const progress = useMemo(() => (timeLeft / countdownTime) * 100, [timeLeft, countdownTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <HoverCard>
      <HoverCardTrigger className='flex cursor-pointer items-center gap-3'>
        {icon || <Clock className='h-6 w-6 text-gray-500' />}
        <span className='text-lg font-semibold'>{formatTime(timeLeft)}</span>
      </HoverCardTrigger>
      <HoverCardContent className='w-64 space-y-2' align='center' sideOffset={5}>
        <div className='text-sm'>Time Remaining</div>
        <Progress value={progress} className='w-full' />
        <p className='text-sm'>{description ?? 'This timer is counting down.'}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default TimerProgress;
