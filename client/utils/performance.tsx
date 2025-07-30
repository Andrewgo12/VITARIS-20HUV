import { useMemo, useCallback, lazy, Suspense, memo } from "react";
import { Loader2 } from "lucide-react";

// Optimized loading component
export function OptimizedLoader({
  size = "md",
  message,
}: {
  size?: "sm" | "md" | "lg";
  message?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {message && (
        <span className="text-sm text-muted-foreground">{message}</span>
      )}
    </div>
  );
}

// Lazy loading wrapper with error boundary
export function LazyComponent({
  children,
  fallback,
  error,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  error?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback || <OptimizedLoader message="Cargando..." />}>
      {children}
    </Suspense>
  );
}

// Optimized image component with lazy loading
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  placeholder = "/placeholder.svg",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  placeholder?: string;
}) {
  return (
    <img
      src={src || placeholder}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      {...props}
      onError={(e) => {
        (e.target as HTMLImageElement).src = placeholder;
      }}
    />
  );
});

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Debounced search hook
export function useDebouncedSearch(
  searchFn: (query: string) => void,
  delay = 300,
) {
  const debouncedSearch = useCallback(debounce(searchFn, delay), [
    searchFn,
    delay,
  ]);

  return debouncedSearch;
}

// Memoized list component
export const MemoizedList = memo(function MemoizedList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
}) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
});

// Optimized card component without animations
export const FastCard = memo(function FastCard({
  children,
  className,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "glass" | "border";
}) {
  const variantClasses = {
    default: "bg-white shadow-sm border border-gray-200",
    glass: "bg-white/95 backdrop-blur-sm border border-white/20 shadow-md",
    border: "bg-white border-2 border-gray-300",
  };

  return (
    <div
      className={`rounded-lg p-4 ${variantClasses[variant]} ${onClick ? "cursor-pointer hover:shadow-md" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

// Simple button without animations
export const FastButton = memo(function FastButton({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
});

// Simple modal without complex animations
export const FastModal = memo(function FastModal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
        />
        <div
          className={`relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 ${className}`}
        >
          {title && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
});

// Performance monitoring hook
export function usePerformanceMonitor() {
  const measure = useCallback((name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
  }, []);

  const measureAsync = useCallback(
    async (name: string, fn: () => Promise<void>) => {
      const start = performance.now();
      await fn();
      const end = performance.now();
      console.log(`${name}: ${end - start}ms`);
    },
    [],
  );

  return { measure, measureAsync };
}

// Search utility functions
export function searchItems<T>(
  items: T[],
  query: string,
  searchFields: (keyof T)[],
): T[] {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return String(value).toLowerCase().includes(lowerQuery);
    }),
  );
}

export function filterItems<T>(
  items: T[],
  filters: Partial<Record<keyof T, any>>,
): T[] {
  const filterEntries = Object.entries(filters).filter(
    ([_, value]) => value !== undefined && value !== "",
  );
  if (filterEntries.length === 0) return items;

  return items.filter((item) =>
    filterEntries.every(([key, value]) => {
      const itemValue = item[key as keyof T];
      if (typeof value === "string" && typeof itemValue === "string") {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      return itemValue === value;
    }),
  );
}

export function searchAndFilter<T>(
  items: T[],
  query: string,
  searchFields: (keyof T)[],
  filters: Partial<Record<keyof T, any>>,
): T[] {
  let result = items;

  // Apply search first
  if (query.trim()) {
    result = searchItems(result, query, searchFields);
  }

  // Apply filters
  result = filterItems(result, filters);

  return result;
}

// Memory optimization utilities
export const memoryUtils = {
  // Clear unused data from memory
  clearCache: () => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes("old") || name.includes("temp")) {
            caches.delete(name);
          }
        });
      });
    }
  },

  // Optimize images for memory
  optimizeImageMemory: (maxWidth = 1200, quality = 0.8) => {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (img.naturalWidth > maxWidth) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const ratio = maxWidth / img.naturalWidth;
          canvas.width = maxWidth;
          canvas.height = img.naturalHeight * ratio;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = canvas.toDataURL("image/jpeg", quality);
        }
      }
    });
  },
};

export default {
  OptimizedLoader,
  LazyComponent,
  OptimizedImage,
  useDebouncedSearch,
  MemoizedList,
  FastCard,
  FastButton,
  FastModal,
  usePerformanceMonitor,
  searchItems,
  filterItems,
  searchAndFilter,
  memoryUtils,
};
