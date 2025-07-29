import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  withMotion?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: "easeOut",
      type: "spring",
      bounce: 0.1
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, withMotion = true, ...props }, ref) => {
    const cardClasses = cn(
      "rounded-3xl border-0 bg-white text-black shadow-2xl backdrop-blur-sm overflow-hidden relative group",
      // Enhanced styling with subtle gradients
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:to-gray-50/30 before:pointer-events-none before:z-0",
      // Hover effects
      "hover:shadow-3xl transition-all duration-300",
      // Medical professional styling
      "border-l-4 border-l-red-500",
      className,
    );

    if (withMotion) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-3 p-8 pb-6 relative z-10",
      // Enhanced header with subtle styling
      "border-b border-gray-100 bg-gradient-to-r from-transparent to-gray-50/50",
      className,
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-tight tracking-tight text-black",
      // Enhanced typography with icon support
      "flex items-center gap-3 group-hover:text-red-600 transition-colors duration-300",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-gray-600 leading-relaxed font-medium",
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-8 pt-6 relative z-10",
      // Enhanced spacing and layout
      "space-y-6",
      className,
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between p-8 pt-0 relative z-10",
      // Enhanced footer with modern styling
      "border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-transparent",
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
