import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-md",
  {
    variants: {
      variant: {
        default:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500/20",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/20",
        outline:
          "border-2 border-red-500 bg-white text-red-600 hover:bg-red-500 hover:text-white focus-visible:ring-red-500/20",
        secondary:
          "bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-500/20",
        ghost:
          "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500/20 shadow-none",
        link: "text-red-600 underline-offset-4 hover:underline shadow-none",
        success:
          "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500/20",
        warning:
          "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-bold",
        icon: "h-10 w-10",
        xl: "h-14 rounded-2xl px-8 text-lg font-bold",
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
  withMotion?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, withMotion = false, ...props }, ref) => {
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
