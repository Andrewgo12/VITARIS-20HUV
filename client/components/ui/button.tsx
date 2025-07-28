import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow hover:bg-primary/90 focus-visible:ring-primary/20",
        destructive:
          "bg-red-500 text-white shadow hover:bg-red-600 focus-visible:ring-red-500/20",
        outline:
          "border border-primary bg-white text-primary hover:bg-primary hover:text-white focus-visible:ring-primary/20",
        secondary:
          "bg-slate-200 text-slate-700 shadow hover:bg-slate-300 focus-visible:ring-slate-500/20",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500/20",
        link:
          "text-primary underline-offset-4 hover:underline",
        success:
          "bg-emerald-500 text-white shadow hover:bg-emerald-600 focus-visible:ring-emerald-500/20",
        warning:
          "bg-amber-500 text-white shadow hover:bg-amber-600 focus-visible:ring-amber-500/20",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-13 rounded-xl px-8 text-base font-bold",
        icon: "h-11 w-11",
        xl: "h-16 rounded-xl px-12 text-lg font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
