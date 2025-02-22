import { cn } from "@/config/utils.ts"
import React from "react";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/20 dark:bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
