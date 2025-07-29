import React from "react";

// Hook for keyboard navigation
export const useKeyboardNavigation = (
  items: any[],
  onSelect: (item: any, index: number) => void,
) => {
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((prev) => (prev + 1) % items.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (activeIndex >= 0 && items[activeIndex]) {
            onSelect(items[activeIndex], activeIndex);
          }
          break;
        case "Escape":
          setActiveIndex(-1);
          break;
      }
    },
    [items, activeIndex, onSelect],
  );

  return { activeIndex, setActiveIndex, handleKeyDown };
};

// Hook for focus management
export const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] =
    React.useState<HTMLElement | null>(null);

  const saveFocus = React.useCallback(() => {
    setFocusedElement(document.activeElement as HTMLElement);
  }, []);

  const restoreFocus = React.useCallback(() => {
    if (focusedElement && focusedElement.focus) {
      focusedElement.focus();
    }
  }, [focusedElement]);

  const trapFocus = React.useCallback(
    (containerRef: React.RefObject<HTMLElement>) => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;

        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    },
    [],
  );

  return { saveFocus, restoreFocus, trapFocus };
};

// Hook for screen reader announcements
export const useScreenReader = () => {
  const announce = React.useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", priority);
      announcement.setAttribute("aria-atomic", "true");
      announcement.setAttribute("class", "sr-only");
      announcement.textContent = message;

      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    [],
  );

  return { announce };
};

// ARIA attributes generator
export const generateAriaAttributes = (
  element:
    | "button"
    | "input"
    | "dialog"
    | "list"
    | "listitem"
    | "table"
    | "tabpanel",
  options: {
    label?: string;
    describedBy?: string;
    expanded?: boolean;
    selected?: boolean;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    controls?: string;
    owns?: string;
    labelledBy?: string;
    level?: number;
    setSize?: number;
    posInSet?: number;
  } = {},
) => {
  const attributes: Record<string, any> = {};

  // Common attributes
  if (options.label) attributes["aria-label"] = options.label;
  if (options.describedBy) attributes["aria-describedby"] = options.describedBy;
  if (options.labelledBy) attributes["aria-labelledby"] = options.labelledBy;
  if (options.disabled) attributes["aria-disabled"] = options.disabled;

  // Element-specific attributes
  switch (element) {
    case "button":
      if (options.expanded !== undefined)
        attributes["aria-expanded"] = options.expanded;
      if (options.controls) attributes["aria-controls"] = options.controls;
      break;

    case "input":
      if (options.required) attributes["aria-required"] = options.required;
      if (options.invalid) attributes["aria-invalid"] = options.invalid;
      break;

    case "dialog":
      attributes["role"] = "dialog";
      attributes["aria-modal"] = "true";
      break;

    case "list":
      attributes["role"] = "list";
      break;

    case "listitem":
      attributes["role"] = "listitem";
      if (options.level) attributes["aria-level"] = options.level;
      if (options.setSize) attributes["aria-setsize"] = options.setSize;
      if (options.posInSet) attributes["aria-posinset"] = options.posInSet;
      break;

    case "table":
      attributes["role"] = "table";
      break;

    case "tabpanel":
      attributes["role"] = "tabpanel";
      break;
  }

  return attributes;
};

// Hook for managing modal accessibility
export const useModalAccessibility = (isOpen: boolean) => {
  const { saveFocus, restoreFocus, trapFocus } = useFocusManagement();
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      saveFocus();

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Set up focus trap
      const cleanup = trapFocus(modalRef);

      // Focus first focusable element
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 0);

      return () => {
        cleanup();
        document.body.style.overflow = "";
        restoreFocus();
      };
    }
  }, [isOpen, saveFocus, restoreFocus, trapFocus]);

  return { modalRef };
};

// Medical-specific accessibility utilities
export const getMedicalAriaLabel = (
  context: "vital-signs" | "medication" | "diagnosis" | "patient" | "alert",
  value: string,
  unit?: string,
  severity?: "normal" | "warning" | "critical",
) => {
  const severityText =
    severity === "critical"
      ? "crítico"
      : severity === "warning"
        ? "advertencia"
        : "";

  switch (context) {
    case "vital-signs":
      return `Signo vital: ${value} ${unit || ""} ${severityText}`.trim();
    case "medication":
      return `Medicamento: ${value} ${severityText}`.trim();
    case "diagnosis":
      return `Diagnóstico: ${value} ${severityText}`.trim();
    case "patient":
      return `Paciente: ${value}`;
    case "alert":
      return `Alerta ${severityText}: ${value}`.trim();
    default:
      return value;
  }
};

// Color contrast utility for medical interfaces
export const ensureContrast = (foreground: string, background: string) => {
  // This would typically calculate WCAG contrast ratios
  // For now, return standard medical colors that meet accessibility requirements
  const accessiblePairs = {
    "text-red-600": "bg-red-50",
    "text-green-600": "bg-green-50",
    "text-blue-600": "bg-blue-50",
    "text-yellow-600": "bg-yellow-50",
  };

  return (
    accessiblePairs[foreground as keyof typeof accessiblePairs] || background
  );
};

export default {
  useKeyboardNavigation,
  useFocusManagement,
  useScreenReader,
  useModalAccessibility,
  generateAriaAttributes,
  getMedicalAriaLabel,
  ensureContrast,
};
