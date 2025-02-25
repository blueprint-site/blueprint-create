import { useState, useEffect, useRef, useMemo } from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface TimerProgressProps {
  startTimestamp: number;
  countdownTime: number;
  description?: string;
  icon?: React.ReactNode;
  onComplete?: () => void; // Callback for when the timer completes
}

const TimerProgress = ({ startTimestamp, countdownTime, description, icon, onComplete }: TimerProgressProps) => {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(countdownTime - Math.floor((Date.now() - startTimestamp) / 1000), 0));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Call onComplete when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && onComplete) {
      onComplete(); // Call onComplete after the render phase
    }
  }, [timeLeft, onComplete]);

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft((prevTime) => {
        const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
        const remaining = Math.max(countdownTime - elapsed, 0);
        return prevTime !== remaining ? remaining : prevTime;
      });
    };

    intervalRef.current = setInterval(updateTimer, 1000);
    updateTimer(); // Update immediately

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTimestamp, countdownTime]);

  const progress = useMemo(() => (timeLeft / countdownTime) * 100, [timeLeft, countdownTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hours, minutes, secs]
      .filter((val, index) => val > 0 || index > 0) // Skip leading 0 hours
      .map((val) => val.toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <HoverCard>
      <HoverCardTrigger className="flex items-center gap-3 cursor-pointer">
        {icon || <Clock className="w-6 h-6 text-gray-500" />}
        <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
        <pre className="font-minecraft text-xs">Indexing your schematic...</pre>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 space-y-2">
        <div className="text-sm">Time Remaining</div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm">{description || "This timer is counting down."}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default TimerProgress;