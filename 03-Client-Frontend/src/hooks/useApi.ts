/**
 * API Hook for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { apiService, type ApiResponse } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

export const useApi = <T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage,
    errorMessage,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      const response = await apiFunction(...args);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return null;
      }

      if (response.success && response.data !== undefined) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });

        // Show success toast
        if (showSuccessToast) {
          toast({
            title: 'Éxito',
            description: successMessage || 'Operación completada exitosamente',
          });
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(response.data);
        }

        return response.data;
      } else {
        const error = response.error || 'Error desconocido';
        
        setState({
          data: null,
          loading: false,
          error,
          success: false,
        });

        // Show error toast
        if (showErrorToast) {
          toast({
            title: 'Error',
            description: errorMessage || error,
            variant: 'destructive',
          });
        }

        // Call error callback
        if (onError) {
          onError(error);
        }

        return null;
      }
    } catch (error) {
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return null;
      }

      const errorMsg = error instanceof Error ? error.message : 'Error de conexión';
      
      setState({
        data: null,
        loading: false,
        error: errorMsg,
        success: false,
      });

      // Show error toast
      if (showErrorToast) {
        toast({
          title: 'Error',
          description: errorMessage || errorMsg,
          variant: 'destructive',
        });
      }

      // Call error callback
      if (onError) {
        onError(errorMsg);
      }

      return null;
    }
  }, [apiFunction, showSuccessToast, showErrorToast, successMessage, errorMessage, onSuccess, onError]);

  const reset = useCallback(() => {
    // Cancel ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({
      ...prev,
      data,
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
};

// Specialized hooks for common API operations

export const useMedicalCases = () => {
  return useApi(apiService.getMedicalCases.bind(apiService), {
    showErrorToast: true,
    errorMessage: 'Error al cargar los casos médicos',
  });
};

export const useMedicalCase = () => {
  return useApi(apiService.getMedicalCase.bind(apiService), {
    showErrorToast: true,
    errorMessage: 'Error al cargar el caso médico',
  });
};

export const useUpdateMedicalCase = () => {
  return useApi(apiService.updateMedicalCase.bind(apiService), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Caso médico actualizado exitosamente',
    errorMessage: 'Error al actualizar el caso médico',
  });
};

export const useApproveMedicalCase = () => {
  return useApi(apiService.approveMedicalCase.bind(apiService), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Caso médico aprobado exitosamente',
    errorMessage: 'Error al aprobar el caso médico',
  });
};

export const useRejectMedicalCase = () => {
  return useApi(apiService.rejectMedicalCase.bind(apiService), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Caso médico rechazado exitosamente',
    errorMessage: 'Error al rechazar el caso médico',
  });
};

export const useUsers = () => {
  return useApi(apiService.getUsers.bind(apiService), {
    showErrorToast: true,
    errorMessage: 'Error al cargar los usuarios',
  });
};

export const useCreateUser = () => {
  return useApi(apiService.createUser.bind(apiService), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Usuario creado exitosamente',
    errorMessage: 'Error al crear el usuario',
  });
};

export const useUpdateUser = () => {
  return useApi(apiService.updateUser.bind(apiService), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Usuario actualizado exitosamente',
    errorMessage: 'Error al actualizar el usuario',
  });
};

export const useDeleteUser = () => {
  return useApi(apiService.deleteUser.bind(apiService), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Usuario eliminado exitosamente',
    errorMessage: 'Error al eliminar el usuario',
  });
};

export const useDashboardStats = () => {
  return useApi(apiService.getDashboardStats.bind(apiService), {
    showErrorToast: true,
    errorMessage: 'Error al cargar las estadísticas del dashboard',
  });
};

export const useRequestHistory = () => {
  return useApi(apiService.getRequestHistory.bind(apiService), {
    showErrorToast: true,
    errorMessage: 'Error al cargar el historial de solicitudes',
  });
};

// Gmail Integration hooks
export const useGmailEmails = () => {
  return useApi(apiService.getGmailEmails.bind(apiService), {
    showErrorToast: true,
    errorMessage: 'Error al cargar los emails de Gmail',
  });
};

export const useGmailStatistics = () => {
  return useApi(apiService.getGmailStatistics.bind(apiService), {
    showErrorToast: true,
    errorMessage: 'Error al cargar las estadísticas de Gmail',
  });
};

export const useTriggerGmailSync = () => {
  return useApi(apiService.triggerGmailSync.bind(apiService), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Sincronización de Gmail iniciada exitosamente',
    errorMessage: 'Error al iniciar la sincronización de Gmail',
  });
};

export const useGmailServiceStatus = () => {
  return useApi(apiService.getGmailServiceStatus.bind(apiService), {
    showErrorToast: true,
    errorMessage: 'Error al obtener el estado del servicio de Gmail',
  });
};

export const useReferrals = () => {
  return useApi(apiService.getReferrals.bind(apiService), {
    showErrorToast: true,
    errorMessage: 'Error al cargar las referencias médicas',
  });
};

export const useUpdateReferral = () => {
  return useApi(apiService.updateReferral.bind(apiService), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Referencia actualizada exitosamente',
    errorMessage: 'Error al actualizar la referencia',
  });
};

export const usePatients = () => {
  return useApi(apiService.getPatients.bind(apiService), {
    showErrorToast: true,
    errorMessage: 'Error al cargar los pacientes',
  });
};

export const useUploadFile = () => {
  return useApi(apiService.uploadFile.bind(apiService), {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: 'Archivo subido exitosamente',
    errorMessage: 'Error al subir el archivo',
  });
};

export default useApi;
