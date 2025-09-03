import * as React from "react";

import { cn } from "@/config/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
}

function Input({
  className,
  type,
  startIcon,
  endIcon,
  ...props
}: React.ComponentProps<"input"> & InputProps) {
  const StartIcon = startIcon;
  const EndIcon = endIcon;

  return (
    <div className="w-full relative">
      {StartIcon && (
        <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
          <StartIcon size={18} className="text-muted" />
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background py-2 px-4 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          startIcon ? "pl-9" : "",
          endIcon ? "pr-9" : "",
          className
        )}
        {...props}
      />
      {EndIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <EndIcon className="text-foreground-muted" size={18} />
        </div>
      )}
    </div>
  );
}

export { Input };
