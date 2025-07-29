import React from "react";
import { useMediaQuery } from "@/hooks/use-mobile";

// Responsive breakpoints following Tailwind CSS
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Hook for responsive behavior
export const useResponsive = () => {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md})`);
  const isTablet = useMediaQuery(`(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`);
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isLargeScreen = useMediaQuery(`(min-width: ${breakpoints.xl})`);

  return {
    isMobile,
    isTablet, 
    isDesktop,
    isLargeScreen,
    // Utility functions
    showMobileLayout: isMobile,
    showTabletLayout: isTablet,
    showDesktopLayout: isDesktop,
    columnsForGrid: isMobile ? 1 : isTablet ? 2 : isDesktop ? 3 : 4,
    cardsPerRow: isMobile ? 1 : isTablet ? 2 : 3,
  };
};

// Medical dashboard specific responsive utilities
export const useMedicalResponsive = () => {
  const responsive = useResponsive();
  
  return {
    ...responsive,
    // Medical specific layouts
    vitalsColumns: responsive.isMobile ? 1 : responsive.isTablet ? 2 : 4,
    chartHeight: responsive.isMobile ? 200 : responsive.isTablet ? 300 : 400,
    tablePageSize: responsive.isMobile ? 5 : responsive.isTablet ? 10 : 15,
    modalWidth: responsive.isMobile ? "95%" : responsive.isTablet ? "80%" : "60%",
    sidebarCollapsed: responsive.isMobile,
    toolbarVertical: responsive.isMobile,
  };
};

// Responsive grid utility
export const getResponsiveGrid = (items: number) => {
  if (items <= 1) return "grid-cols-1";
  if (items <= 2) return "grid-cols-1 md:grid-cols-2";
  if (items <= 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  if (items <= 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";
};

// Responsive text sizes for medical content
export const getResponsiveTextSize = (context: "title" | "subtitle" | "body" | "caption") => {
  switch (context) {
    case "title":
      return "text-xl md:text-2xl lg:text-3xl";
    case "subtitle":
      return "text-lg md:text-xl lg:text-2xl";
    case "body":
      return "text-sm md:text-base lg:text-lg";
    case "caption":
      return "text-xs md:text-sm";
    default:
      return "text-base";
  }
};

// Responsive spacing utilities
export const getResponsiveSpacing = (size: "xs" | "sm" | "md" | "lg" | "xl") => {
  const spacingMap = {
    xs: "p-2 md:p-3 lg:p-4",
    sm: "p-3 md:p-4 lg:p-6",
    md: "p-4 md:p-6 lg:p-8", 
    lg: "p-6 md:p-8 lg:p-12",
    xl: "p-8 md:p-12 lg:p-16"
  };
  return spacingMap[size];
};

// Medical card responsive layouts
export const getMedicalCardLayout = (type: "patient" | "vital" | "medication" | "alert") => {
  const baseClasses = "rounded-lg border transition-all duration-200";
  
  const layouts = {
    patient: `${baseClasses} p-3 md:p-4 lg:p-6 hover:shadow-md`,
    vital: `${baseClasses} p-2 md:p-3 lg:p-4 text-center`,
    medication: `${baseClasses} p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4`,
    alert: `${baseClasses} p-3 md:p-4 border-l-4 border-red-500`
  };
  
  return layouts[type];
};

// Responsive table configuration
export const getResponsiveTableConfig = () => {
  const { isMobile, isTablet } = useResponsive();
  
  return {
    showPagination: !isMobile,
    pageSize: isMobile ? 5 : isTablet ? 10 : 15,
    showSearch: !isMobile,
    showFilters: !isMobile,
    stackedLayout: isMobile,
    hiddenColumns: isMobile ? ["details", "actions"] : isTablet ? ["details"] : [],
    compactMode: isMobile,
  };
};

// Responsive navigation utilities
export const getResponsiveNavigation = () => {
  const { isMobile, isTablet } = useResponsive();
  
  return {
    showSidebar: !isMobile,
    showBottomNav: isMobile,
    collapsedSidebar: isTablet,
    showBreadcrumbs: !isMobile,
    hamburgerMenu: isMobile,
    tabletMenu: isTablet,
  };
};

// Medical dashboard responsive layout
export const getMedicalDashboardLayout = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  if (isMobile) {
    return {
      layout: "single-column",
      vitalsGrid: "grid-cols-2",
      chartsGrid: "grid-cols-1", 
      alertsPosition: "top",
      toolbarPosition: "bottom",
      sidebarMode: "overlay"
    };
  }
  
  if (isTablet) {
    return {
      layout: "two-column",
      vitalsGrid: "grid-cols-2",
      chartsGrid: "grid-cols-1 lg:grid-cols-2",
      alertsPosition: "sidebar",
      toolbarPosition: "top",
      sidebarMode: "collapsed"
    };
  }
  
  return {
    layout: "multi-column",
    vitalsGrid: "grid-cols-4",
    chartsGrid: "grid-cols-2 lg:grid-cols-3",
    alertsPosition: "sidebar",
    toolbarPosition: "top", 
    sidebarMode: "expanded"
  };
};

// Responsive image sizes for medical content
export const getResponsiveImageSize = (context: "avatar" | "thumbnail" | "preview" | "full") => {
  const { isMobile } = useResponsive();
  
  const sizes = {
    avatar: isMobile ? "w-8 h-8" : "w-10 h-10 md:w-12 md:h-12",
    thumbnail: isMobile ? "w-16 h-16" : "w-20 h-20 md:w-24 md:h-24",
    preview: isMobile ? "w-32 h-32" : "w-40 h-40 md:w-48 md:h-48",
    full: "w-full h-auto"
  };
  
  return sizes[context];
};

export default {
  useResponsive,
  useMedicalResponsive,
  getResponsiveGrid,
  getResponsiveTextSize,
  getResponsiveSpacing,
  getMedicalCardLayout,
  getResponsiveTableConfig,
  getResponsiveNavigation,
  getMedicalDashboardLayout,
  getResponsiveImageSize,
  breakpoints,
};
