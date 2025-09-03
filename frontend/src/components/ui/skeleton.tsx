import { cn } from "@/config/utils.ts"
import React from "react";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-1/60 dark:bg-surface-1/70", className)}
      {...props}
    />
  )
}

export { Skeleton }
