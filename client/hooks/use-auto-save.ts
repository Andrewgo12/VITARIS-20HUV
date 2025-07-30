import { useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface AutoSaveOptions {
  delay?: number; // Delay in milliseconds before saving
  storageKey: string; // LocalStorage key
  data: any; // Data to save
  enabled?: boolean; // Whether auto-save is enabled
  onSave?: (data: any) => void; // Custom save function
  onRestore?: (data: any) => void; // Custom restore function
  validateBeforeSave?: (data: any) => boolean; // Validation function
}

export function useAutoSave({
  delay = 2000,
  storageKey,
  data,
  enabled = true,
  onSave,
  onRestore,
  validateBeforeSave,
}: AutoSaveOptions) {
  const { toast } = useToast();
  const timeoutRef = useRef<number | null>(null);
  const lastSavedRef = useRef<string>("");
  const isInitialLoadRef = useRef(true);

  // Save data to localStorage
  const saveData = useCallback(
    (dataToSave: any) => {
      try {
        const serializedData = JSON.stringify(dataToSave);

        // Check if data has actually changed
        if (serializedData === lastSavedRef.current) {
          return;
        }

        // Validate before saving if validator is provided
        if (validateBeforeSave && !validateBeforeSave(dataToSave)) {
          console.warn("Auto-save skipped: data validation failed");
          return;
        }

        localStorage.setItem(storageKey, serializedData);
        localStorage.setItem(`${storageKey}_timestamp`, Date.now().toString());
        lastSavedRef.current = serializedData;

        // Call custom save function if provided
        if (onSave) {
          onSave(dataToSave);
        }

        // Show success toast
        toast({
          title: "Guardado automático",
          description: "Los datos han sido guardados automáticamente",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error saving data:", error);
        toast({
          title: "Error de guardado",
          description: "No se pudieron guardar los datos automáticamente",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
    [storageKey, validateBeforeSave, onSave, toast],
  );

  // Restore data from localStorage
  const restoreData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      const savedTimestamp = localStorage.getItem(`${storageKey}_timestamp`);

      if (savedData && savedTimestamp) {
        const parsedData = JSON.parse(savedData);
        const timestamp = parseInt(savedTimestamp);
        const age = Date.now() - timestamp;

        // Only restore if data is less than 24 hours old
        if (age < 24 * 60 * 60 * 1000) {
          if (onRestore) {
            onRestore(parsedData);
          }

          // Show restoration toast
          toast({
            title: "Datos restaurados",
            description: `Se restauraron datos guardados hace ${Math.round(age / 60000)} minutos`,
            duration: 4000,
          });

          return parsedData;
        } else {
          // Clean up old data
          clearSavedData();
        }
      }
    } catch (error) {
      console.error("Error restoring data:", error);
      toast({
        title: "Error de restauración",
        description: "No se pudieron restaurar los datos guardados",
        variant: "destructive",
        duration: 3000,
      });
    }
    return null;
  }, [storageKey, onRestore, toast]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${storageKey}_timestamp`);
      lastSavedRef.current = "";

      toast({
        title: "Datos eliminados",
        description: "Los datos guardados han sido eliminados",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }, [storageKey, toast]);

  // Get info about saved data
  const getSavedDataInfo = useCallback(() => {
    try {
      const savedTimestamp = localStorage.getItem(`${storageKey}_timestamp`);
      if (savedTimestamp) {
        const timestamp = parseInt(savedTimestamp);
        const age = Date.now() - timestamp;
        return {
          exists: true,
          timestamp,
          age,
          ageFormatted:
            age < 60000
              ? `${Math.round(age / 1000)} segundos`
              : age < 3600000
                ? `${Math.round(age / 60000)} minutos`
                : `${Math.round(age / 3600000)} horas`,
        };
      }
    } catch (error) {
      console.error("Error getting saved data info:", error);
    }
    return { exists: false };
  }, [storageKey]);

  // Auto-save effect
  useEffect(() => {
    if (!enabled || !data) return;

    // Don't save on initial load
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = window.setTimeout(() => {
      saveData(data);
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, saveData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Save immediately (manual save)
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveData(data);
  }, [data, saveData]);

  return {
    saveNow,
    restoreData,
    clearSavedData,
    getSavedDataInfo,
    isAutoSaveEnabled: enabled,
  };
}

// Additional hook for form persistence across browser sessions
export function useFormPersistence<T>(
  formKey: string,
  initialData: T,
  options?: {
    enabled?: boolean;
    autoSaveDelay?: number;
    showToasts?: boolean;
  },
) {
  const { toast } = useToast();
  const {
    enabled = true,
    autoSaveDelay = 3000,
    showToasts = true,
  } = options || {};

  const { saveNow, restoreData, clearSavedData, getSavedDataInfo } =
    useAutoSave({
      storageKey: `form_${formKey}`,
      data: initialData,
      delay: autoSaveDelay,
      enabled,
      validateBeforeSave: (data) => {
        // Basic validation - check if data is not empty
        return data && typeof data === "object" && Object.keys(data).length > 0;
      },
    });

  // Check for existing saved data on mount
  useEffect(() => {
    if (enabled) {
      const savedInfo = getSavedDataInfo();
      if (savedInfo.exists && showToasts) {
        toast({
          title: "Datos guardados encontrados",
          description: `Hay datos guardados de hace ${savedInfo.ageFormatted}. ¿Desea restaurarlos?`,
          duration: 5000,
        });
      }
    }
  }, [enabled, getSavedDataInfo, showToasts, toast]);

  return {
    saveFormNow: saveNow,
    restoreForm: restoreData,
    clearSavedForm: clearSavedData,
    getSavedFormInfo: getSavedDataInfo,
  };
}
