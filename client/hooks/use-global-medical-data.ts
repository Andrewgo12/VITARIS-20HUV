import { useState, useEffect, useCallback } from "react";
import { globalDataStore, GlobalMedicalData } from "@/lib/globalDataStore";

/**
 * Hook for accessing and managing global medical data across all views
 * This ensures all views can access JSON data for fast data movements
 */
export function useGlobalMedicalData() {
  const [data, setData] = useState<GlobalMedicalData>(
    globalDataStore.getData(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = globalDataStore.subscribe(setData);
    return unsubscribe;
  }, []);

  // Record that this view has accessed the data
  const recordAccess = useCallback((viewName: string) => {
    globalDataStore.recordViewAccess(viewName);
  }, []);

  // Get data for a specific view
  const getViewData = useCallback(
    <T>(viewName: keyof GlobalMedicalData["viewData"]): T[] => {
      return globalDataStore.getViewData<T>(viewName);
    },
    [],
  );

  // Update data for a specific view
  const updateViewData = useCallback(
    <T>(viewName: keyof GlobalMedicalData["viewData"], data: T[]) => {
      setIsLoading(true);
      try {
        globalDataStore.updateViewData(viewName, data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error updating view data",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Add single item to view data
  const addToViewData = useCallback(
    <T>(viewName: keyof GlobalMedicalData["viewData"], newData: T) => {
      setIsLoading(true);
      try {
        globalDataStore.addViewData(viewName, newData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error adding to view data",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Update core medical data
  const updateCoreData = useCallback(
    <K extends keyof Omit<GlobalMedicalData, "viewData" | "metadata">>(
      dataType: K,
      data: GlobalMedicalData[K],
    ) => {
      setIsLoading(true);
      try {
        globalDataStore.updateCoreData(dataType, data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error updating core data",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Search across all data
  const searchAllData = useCallback((query: string) => {
    return globalDataStore.search(query);
  }, []);

  // Get analytics
  const getAnalytics = useCallback(() => {
    return globalDataStore.getAnalytics();
  }, []);

  // Export all data as JSON
  const exportToJSON = useCallback(() => {
    return globalDataStore.exportData();
  }, []);

  // Import data from JSON
  const importFromJSON = useCallback((jsonData: string) => {
    setIsLoading(true);
    try {
      const success = globalDataStore.importData(jsonData);
      if (success) {
        setError(null);
      } else {
        setError("Failed to import data");
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error importing data");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    setIsLoading(true);
    try {
      globalDataStore.clearAllData();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error clearing data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get view access history
  const getViewAccessHistory = useCallback(() => {
    return globalDataStore.getViewAccessData();
  }, []);

  // Utility functions for common operations
  const utils = {
    // Get patient data with all related information
    getPatientFullData: useCallback(
      (patientId: string) => {
        const patient = data.patients.find((p) => p.id === patientId);
        if (!patient) return null;

        return {
          patient,
          vitalSigns: data.vitalSigns.filter(
            (vs) => vs.patientId === patientId,
          ),
          medications: data.medications.filter(
            (m) => m.patientId === patientId,
          ),
          appointments: data.appointments.filter(
            (a) => a.patientId === patientId,
          ),
          labTests: data.labTests.filter((lt) => lt.patientId === patientId),
          telemedicineSessions: data.telemedicineSessions.filter(
            (ts) => ts.patientId === patientId,
          ),
        };
      },
      [data],
    ),

    // Get bed with patient information
    getBedWithPatient: useCallback(
      (bedId: string) => {
        const bed = data.beds.find((b) => b.id === bedId);
        if (!bed) return null;

        const patient = bed.patientId
          ? data.patients.find((p) => p.id === bed.patientId)
          : null;
        return { bed, patient };
      },
      [data],
    ),

    // Get active emergencies with patient details
    getActiveEmergenciesWithPatients: useCallback(() => {
      return data.emergencies
        .filter((e) => e.status === "active")
        .map((emergency) => ({
          emergency,
          patient: emergency.patientId
            ? data.patients.find((p) => p.id === emergency.patientId)
            : null,
        }));
    }, [data]),

    // Get upcoming appointments with patient details
    getUpcomingAppointmentsWithPatients: useCallback(() => {
      const today = new Date();
      return data.appointments
        .filter((a) => new Date(a.date) >= today && a.status === "scheduled")
        .map((appointment) => ({
          appointment,
          patient: data.patients.find((p) => p.id === appointment.patientId),
        }))
        .sort(
          (a, b) =>
            new Date(a.appointment.date).getTime() -
            new Date(b.appointment.date).getTime(),
        );
    }, [data]),

    // Get low stock items
    getLowStockItems: useCallback(() => {
      return data.inventory.filter(
        (item) => item.currentStock <= item.minimumStock,
      );
    }, [data]),

    // Get pending lab tests with patient details
    getPendingLabTestsWithPatients: useCallback(() => {
      return data.labTests
        .filter((lt) => lt.status === "ordered" || lt.status === "scheduled")
        .map((labTest) => ({
          labTest,
          patient: data.patients.find((p) => p.id === labTest.patientId),
        }));
    }, [data]),

    // Get team messages summary
    getTeamMessagesSummary: useCallback(() => {
      const unreadCount = data.messages.filter((m) => !m.read).length;
      const urgentCount = data.messages.filter(
        (m) => m.type === "urgent" && !m.read,
      ).length;
      const recentMessages = data.messages
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, 10);

      return { unreadCount, urgentCount, recentMessages };
    }, [data]),

    // Get comprehensive statistics
    getComprehensiveStats: useCallback(() => {
      return {
        patients: {
          total: data.patients.length,
          active: data.patients.filter(
            (p) => p.currentStatus.status === "active",
          ).length,
          critical: data.patients.filter(
            (p) => p.currentStatus.priority === "critical",
          ).length,
        },
        beds: {
          total: data.beds.length,
          occupied: data.beds.filter((b) => b.status === "occupied").length,
          available: data.beds.filter((b) => b.status === "available").length,
          maintenance: data.beds.filter((b) => b.status === "maintenance")
            .length,
        },
        appointments: {
          today: data.appointments.filter((a) => {
            const today = new Date().toISOString().split("T")[0];
            return a.date === today;
          }).length,
          upcoming: data.appointments.filter((a) => {
            const today = new Date();
            return new Date(a.date) > today && a.status === "scheduled";
          }).length,
        },
        emergencies: {
          active: data.emergencies.filter((e) => e.status === "active").length,
          resolved: data.emergencies.filter((e) => e.status === "resolved")
            .length,
        },
        inventory: {
          lowStock: data.inventory.filter(
            (item) => item.currentStock <= item.minimumStock,
          ).length,
          totalItems: data.inventory.length,
        },
        labs: {
          pending: data.labTests.filter(
            (lt) => lt.status === "ordered" || lt.status === "scheduled",
          ).length,
          completed: data.labTests.filter((lt) => lt.status === "completed")
            .length,
        },
        messages: {
          unread: data.messages.filter((m) => !m.read).length,
          urgent: data.messages.filter((m) => m.type === "urgent" && !m.read)
            .length,
        },
      };
    }, [data]),
  };

  return {
    // Data
    data,
    isLoading,
    error,

    // Core functions
    recordAccess,
    getViewData,
    updateViewData,
    addToViewData,
    updateCoreData,

    // Search and analytics
    searchAllData,
    getAnalytics,
    getViewAccessHistory,

    // Import/Export
    exportToJSON,
    importFromJSON,
    clearAllData,

    // Utility functions
    utils,

    // Direct access to commonly used data
    patients: data.patients,
    activePatients: data.patients.filter(
      (p) => p.currentStatus.status === "active",
    ),
    vitalSigns: data.vitalSigns,
    medications: data.medications,
    appointments: data.appointments,
    surgeries: data.surgeries,
    labTests: data.labTests,
    emergencies: data.emergencies,
    beds: data.beds,
    reports: data.reports,
    messages: data.messages,
    telemedicineSessions: data.telemedicineSessions,
    inventory: data.inventory,
    admissionRequests: data.admissionRequests,
    educationModules: data.educationModules,
  };
}

// Hook for specific view data management
export function useViewData<T>(viewName: keyof GlobalMedicalData["viewData"]) {
  const { getViewData, updateViewData, addToViewData, recordAccess } =
    useGlobalMedicalData();

  const [viewData, setViewData] = useState<T[]>(getViewData<T>(viewName));

  useEffect(() => {
    recordAccess(viewName);
    const unsubscribe = globalDataStore.subscribe((data) => {
      setViewData(getViewData<T>(viewName));
    });
    return unsubscribe;
  }, [viewName, getViewData, recordAccess]);

  const updateData = useCallback(
    (data: T[]) => {
      updateViewData(viewName, data);
    },
    [viewName, updateViewData],
  );

  const addData = useCallback(
    (data: T) => {
      addToViewData(viewName, data);
    },
    [viewName, addToViewData],
  );

  return {
    data: viewData,
    updateData,
    addData,
  };
}

// Type exports for convenience
export type { GlobalMedicalData } from "@/lib/globalDataStore";
export * from "@/lib/globalDataStore";
