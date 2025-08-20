import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "text-slate-700",
        required:
          "text-slate-700 after:content-['*'] after:text-red-500 after:ml-1 after:font-bold",
        optional:
          "text-slate-500 after:content-['(opcional)'] after:text-slate-400 after:ml-2 after:text-xs after:font-normal",
      },
      size: {
        default: "text-sm",
        large: "text-base",
        small: "text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & {
      required?: boolean;
      optional?: boolean;
    }
>(
  (
    { className, variant, size, required, optional, children, ...props },
    ref,
  ) => {
    // Determine variant based on props
    const computedVariant = required
      ? "required"
      : optional
        ? "optional"
        : variant;

    return (
      <LabelPrimitive.Root
        ref={ref}
        className={cn(
          labelVariants({ variant: computedVariant, size }),
          "flex items-center gap-1 mb-2",
          className,
        )}
        {...props}
      >
        <span className="flex items-center gap-1">
          {children}
          {required && (
            <span className="inline-flex items-center justify-center w-1.5 h-1.5 bg-red-500 rounded-full ml-1 animate-pulse" />
          )}
        </span>
      </LabelPrimitive.Root>
    );
  },
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
