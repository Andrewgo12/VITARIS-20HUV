import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  withMotion?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, withMotion = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    const inputClasses = cn(
      "flex h-10 w-full rounded-lg border-2 bg-white px-3 py-2 text-sm font-medium transition-all duration-200",
      "border-gray-200 hover:border-red-300",
      "focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-none",
      "placeholder:text-gray-400 placeholder:font-normal",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      // Enhanced shadows and effects
      "shadow-sm hover:shadow-md focus:shadow-lg",
      // Enhanced states
      props.required && !hasValue && "border-amber-300 bg-amber-50 ring-1 ring-amber-100",
      props["aria-invalid"] && "border-red-400 bg-red-50 ring-1 ring-red-100",
      hasValue && !props["aria-invalid"] && "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-100",
      // Focus glow effect
      isFocused && "shadow-red-200 ring-red-200",
      className,
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="relative group">
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {/* Simple visual indicators */}
        {props.required && !hasValue && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full shadow-sm" />
        )}

        {hasValue && !props["aria-invalid"] && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full shadow-sm" />
        )}

        {props["aria-invalid"] && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full shadow-sm" />
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
