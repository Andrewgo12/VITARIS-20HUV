import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Breakpoint system based on Tailwind CSS
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Hook to get current screen size
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
    breakpoint: Breakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    breakpoint: 'lg',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    function updateScreenSize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let breakpoint: Breakpoint = 'sm';
      if (width >= BREAKPOINTS['2xl']) breakpoint = '2xl';
      else if (width >= BREAKPOINTS.xl) breakpoint = 'xl';
      else if (width >= BREAKPOINTS.lg) breakpoint = 'lg';
      else if (width >= BREAKPOINTS.md) breakpoint = 'md';
      else breakpoint = 'sm';

      setScreenSize({
        width,
        height,
        breakpoint,
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg,
      });
    }

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
}

// Responsive container component
export function ResponsiveContainer({ 
  children, 
  className, 
  maxWidth = 'xl',
  padding = true 
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      padding && 'px-4 sm:px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  );
}

// Responsive grid component
export function ResponsiveGrid({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  className 
}: {
  children: React.ReactNode;
  cols?: Partial<Record<Breakpoint, number>>;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const colClasses = Object.entries(cols)
    .map(([breakpoint, count]) => {
      if (breakpoint === 'sm') return `grid-cols-${count}`;
      return `${breakpoint}:grid-cols-${count}`;
    })
    .join(' ');

  return (
    <div className={cn(
      'grid',
      colClasses,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive card component
export function ResponsiveCard({ 
  children, 
  className,
  variant = 'default',
  padding = 'md' 
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
  padding?: 'sm' | 'md' | 'lg';
}) {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    glass: 'bg-white/95 backdrop-blur-lg border border-white/20 shadow-xl',
    solid: 'bg-white shadow-lg border-0',
  };

  return (
    <div className={cn(
      'rounded-xl transition-all duration-200',
      variantClasses[variant],
      paddingClasses[padding],
      'hover:shadow-lg',
      className
    )}>
      {children}
    </div>
  );
}

// Responsive text component
export function ResponsiveText({ 
  children, 
  size = 'base',
  weight = 'normal',
  color = 'default',
  className 
}: {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorClasses = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    primary: 'text-primary',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
  };

  return (
    <span className={cn(
      sizeClasses[size],
      weightClasses[weight],
      colorClasses[color],
      className
    )}>
      {children}
    </span>
  );
}

// Responsive button component
export function ResponsiveButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props 
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm sm:px-4 sm:py-2',
    md: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base',
    lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
  };

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Responsive spacing utilities
export const spacing = {
  xs: 'space-y-2 sm:space-y-3',
  sm: 'space-y-3 sm:space-y-4',
  md: 'space-y-4 sm:space-y-6',
  lg: 'space-y-6 sm:space-y-8',
  xl: 'space-y-8 sm:space-y-12',
};

// Responsive padding utilities
export const padding = {
  xs: 'p-2 sm:p-3',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-12',
};

// Responsive margin utilities
export const margin = {
  xs: 'm-2 sm:m-3',
  sm: 'm-3 sm:m-4',
  md: 'm-4 sm:m-6',
  lg: 'm-6 sm:m-8',
  xl: 'm-8 sm:m-12',
};

// Mobile-first media query helper
export function mediaQuery(breakpoint: Breakpoint, styles: string): string {
  if (breakpoint === 'sm') return styles;
  return `${breakpoint}:${styles}`;
}

// Responsive visibility utilities
export const visibility = {
  hideOnMobile: 'hidden md:block',
  hideOnTablet: 'block md:hidden lg:block',
  hideOnDesktop: 'block lg:hidden',
  showOnMobile: 'block md:hidden',
  showOnTablet: 'hidden md:block lg:hidden',
  showOnDesktop: 'hidden lg:block',
};

// Responsive flex utilities
export const flex = {
  responsive: 'flex flex-col sm:flex-row',
  reverseResponsive: 'flex flex-col-reverse sm:flex-row',
  mobileStack: 'flex flex-col md:flex-row',
  tabletStack: 'flex flex-col lg:flex-row',
};

// Responsive width utilities
export const width = {
  full: 'w-full',
  auto: 'w-auto',
  responsive: 'w-full sm:w-auto',
  mobileFullTabletAuto: 'w-full md:w-auto',
  mobileFullDesktopAuto: 'w-full lg:w-auto',
};

// Helper to determine if content should be stacked on mobile
export function shouldStack(breakpoint: Breakpoint = 'md'): boolean {
  const { isMobile } = useScreenSize();
  return breakpoint === 'md' ? isMobile : breakpoint === 'lg' ? isMobile || useScreenSize().isTablet : false;
}

// Helper to get appropriate column count based on screen size
export function getResponsiveColumns(items: any[], maxCols = { sm: 1, md: 2, lg: 3, xl: 4 }): number {
  const { breakpoint } = useScreenSize();
  return maxCols[breakpoint] || maxCols.sm || 1;
}

// Component for adaptive font scaling
export function AdaptiveText({ 
  children, 
  baseSize = 16,
  scaleRatio = 1.2,
  className 
}: {
  children: React.ReactNode;
  baseSize?: number;
  scaleRatio?: number;
  className?: string;
}) {
  const { isMobile, isTablet } = useScreenSize();
  
  let fontSize = baseSize;
  if (isMobile) fontSize = baseSize * 0.9;
  else if (isTablet) fontSize = baseSize * 1.0;
  else fontSize = baseSize * scaleRatio;

  return (
    <span 
      className={className} 
      style={{ fontSize: `${fontSize}px` }}
    >
      {children}
    </span>
  );
}

// Hook for responsive actions
export function useResponsiveActions() {
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  return {
    isMobile,
    isTablet,
    isDesktop,
    getOptimalItemsPerRow: (maxItems: number) => {
      if (isMobile) return Math.min(1, maxItems);
      if (isTablet) return Math.min(2, maxItems);
      return Math.min(4, maxItems);
    },
    getOptimalModalWidth: () => {
      if (isMobile) return 'w-full mx-4';
      if (isTablet) return 'w-11/12 max-w-2xl';
      return 'w-full max-w-4xl';
    },
    getOptimalTableView: () => {
      return isMobile ? 'cards' : 'table';
    },
  };
}

export default {
  useScreenSize,
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveText,
  ResponsiveButton,
  spacing,
  padding,
  margin,
  visibility,
  flex,
  width,
  shouldStack,
  getResponsiveColumns,
  AdaptiveText,
  useResponsiveActions,
};
