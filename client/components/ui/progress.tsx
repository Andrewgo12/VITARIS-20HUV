import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-gradient-to-r from-primary to-primary/80 shadow-sm"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />

    {/* Shine effect */}
    <div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        width: '100%'
      }}
    />

    {/* Progress text */}
    {value !== undefined && (
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700">
        {Math.round(value)}%
      </div>
    )}
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
