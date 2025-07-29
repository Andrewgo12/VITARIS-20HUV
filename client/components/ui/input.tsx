import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  withMotion?: boolean;
}

const inputVariants = {
  focus: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  blur: {
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

const indicatorVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 30 
    }
  }
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, withMotion = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    const inputClasses = cn(
      "flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-sm font-medium transition-all duration-300",
      "border-gray-200 hover:border-red-300",
      "focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none",
      "placeholder:text-gray-400 placeholder:font-normal",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      // Enhanced shadows and effects
      "shadow-lg hover:shadow-xl focus:shadow-2xl",
      // Enhanced states
      props.required && !hasValue && "border-amber-300 bg-amber-50 ring-2 ring-amber-100",
      props["aria-invalid"] && "border-red-400 bg-red-50 ring-2 ring-red-100",
      hasValue && !props["aria-invalid"] && "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100",
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
        {withMotion ? (
          <motion.input
            type={type}
            className={inputClasses}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            variants={inputVariants}
            animate={isFocused ? "focus" : "blur"}
            {...props}
          />
        ) : (
          <input
            type={type}
            className={inputClasses}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
        )}

        {/* Enhanced visual indicators */}
        <AnimatePresence>
          {props.required && !hasValue && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full shadow-lg"
              variants={indicatorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasValue && !props["aria-invalid"] && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full shadow-lg"
              variants={indicatorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {props["aria-invalid"] && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full shadow-lg"
              variants={indicatorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />
          )}
        </AnimatePresence>

        {/* Focus ring effect */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-red-400 pointer-events-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.3, scale: 1.02 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
