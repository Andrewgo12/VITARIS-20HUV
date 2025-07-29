import React from "react";
import {
  Loader2,
  Heart,
  Activity,
  Stethoscope,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LoadingStateProps {
  variant?: "spinner" | "skeleton" | "medical" | "progress" | "pulse";
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  progress?: number;
  overlay?: boolean;
  className?: string;
}

// Medical-themed loading animations
const MedicalLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="relative">
        <Heart className="w-8 h-8 text-red-500 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-red-200 animate-spin border-t-red-500"></div>
      </div>
      <div className="relative">
        <Activity className="w-8 h-8 text-blue-500 animate-bounce" />
      </div>
      <div className="relative">
        <Stethoscope
          className="w-8 h-8 text-green-500 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>
    </div>
  );
};

// Skeleton loading for content
const SkeletonLoader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const heights = {
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
  };

  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        <div className={`bg-gray-200 rounded ${heights[size]} w-3/4`}></div>
        <div className={`bg-gray-200 rounded ${heights[size]} w-1/2`}></div>
        <div className={`bg-gray-200 rounded ${heights[size]} w-2/3`}></div>
      </div>
    </div>
  );
};

// Progress loading with steps
const ProgressLoader = ({
  progress = 0,
  message,
}: {
  progress?: number;
  message?: string;
}) => {
  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {message || "Cargando..."}
        </span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Iniciando</span>
        <span>Procesando</span>
        <span>Completando</span>
      </div>
    </div>
  );
};

// Pulse animation for live data
const PulseLoader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`${sizes[size]} bg-blue-500 rounded-full animate-pulse`}
      ></div>
      <div
        className={`${sizes[size]} bg-green-500 rounded-full animate-pulse`}
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className={`${sizes[size]} bg-red-500 rounded-full animate-pulse`}
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  );
};

export default function LoadingState({
  variant = "spinner",
  size = "md",
  message = "Cargando...",
  progress = 0,
  overlay = false,
  className = "",
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const renderLoader = () => {
    switch (variant) {
      case "medical":
        return (
          <div className="flex flex-col items-center space-y-4">
            <MedicalLoader />
            <p className="text-sm text-gray-600 text-center max-w-sm">
              {message}
            </p>
          </div>
        );

      case "skeleton":
        return <SkeletonLoader size={size} />;

      case "progress":
        return <ProgressLoader progress={progress} message={message} />;

      case "pulse":
        return (
          <div className="flex flex-col items-center space-y-3">
            <PulseLoader size={size} />
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        );

      default: // spinner
        return (
          <div className="flex flex-col items-center space-y-3">
            <Loader2
              className={`${sizeClasses[size]} animate-spin text-blue-500`}
            />
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        );
    }
  };

  if (overlay) {
    return (
      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}
      >
        <Card className="p-6 max-w-sm mx-4">
          <CardContent className="pt-0">{renderLoader()}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      {renderLoader()}
    </div>
  );
}

// Specialized loading states for different contexts
export function PageLoadingState({
  message = "Cargando página...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <LoadingState variant="medical" message={message} size="lg" />
    </div>
  );
}

export function DataLoadingState({
  message = "Cargando datos...",
}: {
  message?: string;
}) {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingState variant="spinner" message={message} size="md" />
    </div>
  );
}

export function FormLoadingState({
  message = "Guardando...",
}: {
  message?: string;
}) {
  return (
    <div className="flex items-center justify-center py-4">
      <LoadingState variant="pulse" message={message} size="sm" />
    </div>
  );
}

export function ModalLoadingState({
  message = "Procesando...",
  progress,
}: {
  message?: string;
  progress?: number;
}) {
  return (
    <LoadingState
      variant={progress !== undefined ? "progress" : "medical"}
      message={message}
      progress={progress}
      overlay
    />
  );
}

// Hook for managing loading states
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [loadingMessage, setLoadingMessage] = React.useState("Cargando...");
  const [progress, setProgress] = React.useState(0);

  const startLoading = (message?: string) => {
    setIsLoading(true);
    setProgress(0);
    if (message) setLoadingMessage(message);
  };

  const updateProgress = (value: number, message?: string) => {
    setProgress(value);
    if (message) setLoadingMessage(message);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setProgress(0);
  };

  const withLoading = async <T,>(
    asyncFn: () => Promise<T>,
    message?: string,
  ): Promise<T> => {
    startLoading(message);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    loadingMessage,
    progress,
    startLoading,
    updateProgress,
    stopLoading,
    withLoading,
  };
}

// Higher-order component for loading states
export function withLoadingState<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent: React.ComponentType<{
    message?: string;
  }> = DataLoadingState,
) {
  return function LoadingWrapper(
    props: P & { loading?: boolean; loadingMessage?: string },
  ) {
    const { loading, loadingMessage, ...componentProps } = props;

    if (loading) {
      return <LoadingComponent message={loadingMessage} />;
    }

    return <Component {...(componentProps as P)} />;
  };
}
