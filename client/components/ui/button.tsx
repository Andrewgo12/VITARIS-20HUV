import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary focus-visible:ring-primary/20 active:scale-95",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 focus-visible:ring-red-500/20 active:scale-95",
        outline:
          "border-2 border-primary bg-white text-primary shadow-sm hover:bg-primary hover:text-white hover:shadow-lg focus-visible:ring-primary/20 active:scale-95",
        secondary:
          "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 shadow-sm hover:shadow-md hover:from-slate-200 hover:to-slate-300 focus-visible:ring-slate-500/20 active:scale-95",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500/20",
        link:
          "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        success:
          "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 focus-visible:ring-emerald-500/20 active:scale-95",
        warning:
          "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 focus-visible:ring-amber-500/20 active:scale-95",
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
