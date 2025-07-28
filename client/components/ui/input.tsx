import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-lg border-2 bg-white px-4 py-3 text-sm font-medium transition-all duration-200",
            "border-slate-200 hover:border-primary/30",
            "focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none",
            "placeholder:text-slate-400 placeholder:font-normal",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            // Professional medical styling
            "shadow-sm",
            // Required field styling
            props.required && !hasValue && "border-amber-200 bg-amber-50/30",
            // Error state
            props["aria-invalid"] &&
              "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/10",
            // Success state
            hasValue &&
              !props["aria-invalid"] &&
              "border-emerald-200 bg-emerald-50/20",
            className,
          )}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
          }}
          {...props}
        />

        {/* Required field indicator */}
        {props.required && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
