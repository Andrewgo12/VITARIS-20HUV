/**
 * Gmail Extractor Hook - VITAL RED
 * Hook personalizado para gestionar la funcionalidad de extracción de Gmail
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  gmailExtractorService, 
  ExtractionRequest, 
  ExtractionProgress, 
  ExtractedEmail,
  EmailSearchParams,
  ExtractionStats,
  ExtractorConfig
} from '@/services/gmail-extractor';
import { useNotifications } from '@/components/ui/notification-system';

export interface UseGmailExtractorReturn {
  // Estado de extracción
  isExtracting: boolean;
  progress: ExtractionProgress | null;
  
  // Correos extraídos
  emails: ExtractedEmail[];
  emailsLoading: boolean;
  emailsTotal: number;
  
  // Estadísticas
  stats: ExtractionStats | null;
  statsLoading: boolean;
  
  // Configuración
  config: ExtractorConfig | null;
  configLoading: boolean;
  
  // Funciones de extracción
  startExtraction: (request: ExtractionRequest) => Promise<void>;
  pauseExtraction: () => Promise<void>;
  resumeExtraction: () => Promise<void>;
  stopExtraction: () => Promise<void>;
  
  // Funciones de correos
  searchEmails: (params?: EmailSearchParams) => Promise<void>;
  getEmailDetail: (emailId: string) => Promise<ExtractedEmail>;
  deleteEmail: (emailId: string) => Promise<void>;
  
  // Funciones de configuración
  loadConfig: () => Promise<void>;
  updateConfig: (config: Partial<ExtractorConfig>) => Promise<void>;
  
  // Funciones de estadísticas
  loadStats: () => Promise<void>;
  
  // Funciones de utilidad
  refreshAll: () => Promise<void>;
  exportEmails: (format: 'csv' | 'json' | 'xlsx', params?: EmailSearchParams) => Promise<void>;
}

export const useGmailExtractor = (): UseGmailExtractorReturn => {
  const { addNotification } = useNotifications();
  
  // Estado de extracción
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState<ExtractionProgress | null>(null);
  
  // Estado de correos
  const [emails, setEmails] = useState<ExtractedEmail[]>([]);
  const [emailsLoading, setEmailsLoading] = useState(false);
  const [emailsTotal, setEmailsTotal] = useState(0);
  
  // Estado de estadísticas
  const [stats, setStats] = useState<ExtractionStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Estado de configuración
  const [config, setConfig] = useState<ExtractorConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  
  // Referencias para polling
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);

  // Función para verificar progreso
  const checkProgress = useCallback(async () => {
    if (!isComponentMountedRef.current) return;
    
    try {
      const progressData = await gmailExtractorService.getProgress();
      
      if (!isComponentMountedRef.current) return;
      
      setProgress(progressData);
      
      // Si la extracción terminó, detener polling
      if (progressData.status === 'completed' || progressData.status === 'failed') {
        setIsExtracting(false);
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        
        // Notificar finalización
        addNotification({
          type: progressData.status === 'completed' ? 'success' : 'warning',
          title: 'Extracción finalizada',
          message: `${progressData.successful_extractions} correos extraídos exitosamente`,
          priority: 'medium'
        });
        
        // Recargar datos
        await Promise.all([searchEmails(), loadStats()]);
      }
    } catch (error: any) {
      if (error.message.includes('No hay extracción en progreso')) {
        setIsExtracting(false);
        setProgress(null);
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    }
  }, [addNotification]);

  // Iniciar polling de progreso
  const startProgressPolling = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(checkProgress, 2000);
  }, [checkProgress]);

  // Detener polling de progreso
  const stopProgressPolling = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Función para iniciar extracción
  const startExtraction = useCallback(async (request: ExtractionRequest) => {
    try {
      const result = await gmailExtractorService.startExtraction(request);
      
      setIsExtracting(true);
      startProgressPolling();
      
      addNotification({
        type: 'success',
        title: 'Extracción iniciada',
        message: `Procesando hasta ${request.max_emails} correos`,
        priority: 'medium'
      });
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error iniciando extracción',
        priority: 'medium'
      });
      throw error;
    }
  }, [addNotification, startProgressPolling]);

  // Función para pausar extracción
  const pauseExtraction = useCallback(async () => {
    try {
      await gmailExtractorService.pauseExtraction();
      
      addNotification({
        type: 'success',
        title: 'Extracción pausada',
        message: 'La extracción ha sido pausada',
        priority: 'low'
      });
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error pausando extracción',
        priority: 'medium'
      });
      throw error;
    }
  }, [addNotification]);

  // Función para reanudar extracción
  const resumeExtraction = useCallback(async () => {
    try {
      await gmailExtractorService.resumeExtraction();
      
      addNotification({
        type: 'success',
        title: 'Extracción reanudada',
        message: 'La extracción ha sido reanudada',
        priority: 'low'
      });
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error reanudando extracción',
        priority: 'medium'
      });
      throw error;
    }
  }, [addNotification]);

  // Función para detener extracción
  const stopExtraction = useCallback(async () => {
    try {
      await gmailExtractorService.stopExtraction();
      
      setIsExtracting(false);
      setProgress(null);
      stopProgressPolling();
      
      addNotification({
        type: 'success',
        title: 'Extracción detenida',
        message: 'La extracción ha sido detenida',
        priority: 'low'
      });
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error deteniendo extracción',
        priority: 'medium'
      });
      throw error;
    }
  }, [addNotification, stopProgressPolling]);

  // Función para buscar correos
  const searchEmails = useCallback(async (params: EmailSearchParams = {}) => {
    setEmailsLoading(true);
    try {
      const result = await gmailExtractorService.searchEmails(params);
      setEmails(result.emails);
      setEmailsTotal(result.total);
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error buscando correos',
        priority: 'medium'
      });
      throw error;
    } finally {
      setEmailsLoading(false);
    }
  }, [addNotification]);

  // Función para obtener detalle de correo
  const getEmailDetail = useCallback(async (emailId: string): Promise<ExtractedEmail> => {
    try {
      return await gmailExtractorService.getEmailDetail(emailId);
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error obteniendo detalle del correo',
        priority: 'medium'
      });
      throw error;
    }
  }, [addNotification]);

  // Función para eliminar correo
  const deleteEmail = useCallback(async (emailId: string) => {
    try {
      await gmailExtractorService.deleteEmail(emailId);
      
      // Actualizar lista local
      setEmails(prev => prev.filter(email => email.id !== emailId));
      setEmailsTotal(prev => prev - 1);
      
      addNotification({
        type: 'success',
        title: 'Correo eliminado',
        message: 'El correo ha sido eliminado exitosamente',
        priority: 'low'
      });
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error eliminando correo',
        priority: 'medium'
      });
      throw error;
    }
  }, [addNotification]);

  // Función para cargar configuración
  const loadConfig = useCallback(async () => {
    setConfigLoading(true);
    try {
      const configData = await gmailExtractorService.getConfig();
      setConfig(configData);
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error cargando configuración',
        priority: 'medium'
      });
      throw error;
    } finally {
      setConfigLoading(false);
    }
  }, [addNotification]);

  // Función para actualizar configuración
  const updateConfig = useCallback(async (newConfig: Partial<ExtractorConfig>) => {
    try {
      await gmailExtractorService.updateConfig(newConfig);
      
      // Recargar configuración
      await loadConfig();
      
      addNotification({
        type: 'success',
        title: 'Configuración actualizada',
        message: 'La configuración se ha guardado exitosamente',
        priority: 'medium'
      });
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error actualizando configuración',
        priority: 'medium'
      });
      throw error;
    }
  }, [addNotification, loadConfig]);

  // Función para cargar estadísticas
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const statsData = await gmailExtractorService.getStats();
      setStats(statsData);
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error cargando estadísticas',
        priority: 'medium'
      });
      throw error;
    } finally {
      setStatsLoading(false);
    }
  }, [addNotification]);

  // Función para exportar correos
  const exportEmails = useCallback(async (format: 'csv' | 'json' | 'xlsx', params: EmailSearchParams = {}) => {
    try {
      const blob = await gmailExtractorService.exportEmails(format, params);
      
      // Crear URL de descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `correos_extraidos.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      addNotification({
        type: 'success',
        title: 'Exportación iniciada',
        message: `Descargando correos en formato ${format.toUpperCase()}`,
        priority: 'low'
      });
    } catch (error: any) {
      addNotification({
        type: 'warning',
        title: 'Error',
        message: error.message || 'Error exportando correos',
        priority: 'medium'
      });
      throw error;
    }
  }, [addNotification]);

  // Función para refrescar todos los datos
  const refreshAll = useCallback(async () => {
    await Promise.all([
      searchEmails(),
      loadStats(),
      loadConfig()
    ]);
  }, [searchEmails, loadStats, loadConfig]);

  // Verificar estado inicial al montar
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    // Verificar si hay extracción en progreso
    checkProgress();
    
    // Cargar datos iniciales
    refreshAll();
    
    return () => {
      isComponentMountedRef.current = false;
      stopProgressPolling();
    };
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopProgressPolling();
    };
  }, [stopProgressPolling]);

  return {
    // Estado de extracción
    isExtracting,
    progress,
    
    // Correos extraídos
    emails,
    emailsLoading,
    emailsTotal,
    
    // Estadísticas
    stats,
    statsLoading,
    
    // Configuración
    config,
    configLoading,
    
    // Funciones de extracción
    startExtraction,
    pauseExtraction,
    resumeExtraction,
    stopExtraction,
    
    // Funciones de correos
    searchEmails,
    getEmailDetail,
    deleteEmail,
    
    // Funciones de configuración
    loadConfig,
    updateConfig,
    
    // Funciones de estadísticas
    loadStats,
    
    // Funciones de utilidad
    refreshAll,
    exportEmails
  };
};
