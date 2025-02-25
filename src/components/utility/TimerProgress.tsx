import { useState, useEffect } from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Slider } from "@/components/ui/slider";
import { Clock } from "lucide-react";

interface TimerProgressProps {
  startTimestamp: number;
  countdownTime: number;
  description?: string;
  icon?: React.ReactNode;
}

const TimerProgress = ({ startTimestamp, countdownTime, description, icon }: TimerProgressProps) => {
  const [timeLeft, setTimeLeft] = useState(countdownTime);
  const [progress, setProgress] = useState(100); // Start at 100% (full slider)

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      const remaining = Math.max(countdownTime - elapsed, 0);
      setTimeLeft(remaining);

      // Calculate progress as a percentage (0-100 range)
      const progress = (remaining / countdownTime) * 100;
      setProgress(progress);

      // Stop the timer when it reaches 0
      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTimestamp, countdownTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}:` : ""}${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <HoverCard>
      <HoverCardTrigger className="flex items-center gap-3 cursor-pointer">
        {icon || <Clock className="w-6 h-6 text-gray-500" />}
        <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-4 space-y-3 bg-white shadow-md rounded-md">
        <h3 className="text-sm font-semibold text-gray-700">Time Remaining</h3>
        <Slider value={[progress]} max={100} step={1} disabled className="w-full" />
        <p className="text-sm text-gray-500">{description || "This timer is counting down."}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default TimerProgress;
