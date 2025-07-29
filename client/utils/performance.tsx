import React, { Suspense, lazy, ComponentType } from "react";
import Loading from "@/components/Loading";
import ErrorBoundary from "@/components/ErrorBoundary";

// Utility for lazy loading with error boundary and loading state
export const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  loadingComponent?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: P) => (
    <ErrorBoundary>
      <Suspense fallback={loadingComponent || <Loading variant="medical" text="Cargando módulo médico..." />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Preload utility for better UX
export const preloadComponent = (importFunc: () => Promise<any>) => {
  return importFunc();
};

// Performance monitoring utility
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds.`);
  } else {
    fn();
  }
};

// Hook for tracking component render performance
export const usePerformanceTracking = (componentName: string) => {
  React.useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${end - start}ms`);
      }
    };
  }, [componentName]);
};

// Debounce utility for search and input optimization
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Intersection Observer hook for lazy loading content
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// Virtualization utility for large lists
export const useVirtualization = (itemCount: number, itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    itemCount
  );
  
  const visibleItems = React.useMemo(() => {
    const items = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push(i);
    }
    return items;
  }, [startIndex, endIndex]);

  return {
    scrollTop,
    setScrollTop,
    startIndex,
    endIndex,
    visibleItems,
    totalHeight: itemCount * itemHeight,
  };
};

// Memory cleanup utility for medical data
export const useMemoryCleanup = (dependencies: any[]) => {
  React.useEffect(() => {
    return () => {
      // Cleanup any subscriptions, timers, or cached data
      if (typeof window !== 'undefined') {
        // Clear any medical data caches if needed
        // This is especially important for sensitive medical data
      }
    };
  }, dependencies);
};

export default {
  withLazyLoading,
  preloadComponent,
  measurePerformance,
  usePerformanceTracking,
  useDebounce,
  useIntersectionObserver,
  useVirtualization,
  useMemoryCleanup,
};