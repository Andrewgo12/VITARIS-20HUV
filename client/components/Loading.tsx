import React from "react";
import { Loader2, Heart, Activity } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingProps {
  variant?: "default" | "medical" | "minimal" | "skeleton";
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = "default",
  size = "md",
  text = "Cargando...",
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
    : "flex items-center justify-center p-8";

  if (variant === "skeleton") {
    return (
      <div className={containerClasses}>
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-3/4 mb-3" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={containerClasses}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      </div>
    );
  }

  if (variant === "medical") {
    return (
      <div className={containerClasses}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Heart
              className={`${sizeClasses[size]} text-medical-red animate-pulse`}
            />
            <Activity
              className={`${sizeClasses[size]} text-medical-blue animate-ping absolute inset-0`}
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-medical-blue">{text}</p>
            <p className="text-sm text-muted-foreground">
              Sistema médico Vital Red
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      </div>
    </div>
  );
};

// Skeleton específicos para diferentes tipos de contenido
export const PatientCardSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </CardContent>
  </Card>
);

export const MedicalTableSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-12 w-full" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/6" />
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-64 w-full" />
    </CardContent>
  </Card>
);

export default Loading;
