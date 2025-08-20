/**
 * Gmail Extractor Service - VITAL RED
 * Servicio específico para la funcionalidad de extracción de Gmail
 */

import { apiService } from './api';

export interface ExtractionRequest {
  email: string;
  password: string;
  max_emails: number;
  gemini_api_key?: string;
  headless: boolean;
}

export interface ExtractionProgress {
  session_id: string;
  status: string;
  total_emails: number;
  processed_emails: number;
  successful_extractions: number;
  failed_extractions: number;
  success_rate: number;
  elapsed_time_seconds: number;
  estimated_completion: string | null;
  current_email_id: string | null;
  errors_count: number;
}

export interface ExtractedEmail {
  id: string;
  subject: string;
  sender: string;
  recipients: string[];
  date: string;
  body_text: string;
  body_html: string;
  attachments: any[];
  metadata: any;
  ai_analysis: any;
  processed_at: string;
  extraction_method: string;
  attachment_details: any[];
}

export interface EmailSearchParams {
  query?: string;
  sender?: string;
  date_from?: string;
  date_to?: string;
  has_attachments?: boolean;
  limit?: number;
  offset?: number;
}

export interface ExtractionStats {
  total_emails: number;
  emails_with_attachments: number;
  emails_with_ai_analysis: number;
  total_attachments: number;
  extraction_methods: Array<{ extraction_method: string; count: number }>;
  daily_extractions: Array<{ date: string; count: number }>;
}

export interface ExtractorConfig {
  max_emails: number;
  batch_size: number;
  retry_attempts: number;
  retry_delay: number;
  headless: boolean;
  window_width: number;
  window_height: number;
  timeout: number;
  implicit_wait: number;
  download_attachments: boolean;
  process_pdfs: boolean;
  enable_ocr: boolean;
  enable_ai_analysis: boolean;
  gemini_api_key: string;
  gemini_model: string;
  gemini_max_tokens: number;
  db_host: string;
  db_port: number;
  db_user: string;
  db_password: string;
  db_name: string;
  user_agent: string;
  delay_between_requests: number;
  max_concurrent_extractions: number;
}

class GmailExtractorService {
  private baseUrl = '/api/gmail-extractor';

  /**
   * Iniciar extracción masiva de correos
   */
  async startExtraction(request: ExtractionRequest): Promise<{ session_id: string; status: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error iniciando extracción');
    }

    return response.json();
  }

  /**
   * Obtener progreso de extracción actual
   */
  async getProgress(): Promise<ExtractionProgress> {
    const response = await fetch(`${this.baseUrl}/progress`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No hay extracción en progreso');
      }
      const error = await response.json();
      throw new Error(error.detail || 'Error obteniendo progreso');
    }

    return response.json();
  }

  /**
   * Pausar extracción actual
   */
  async pauseExtraction(): Promise<{ message: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/pause`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error pausando extracción');
    }

    return response.json();
  }

  /**
   * Reanudar extracción pausada
   */
  async resumeExtraction(): Promise<{ message: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/resume`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error reanudando extracción');
    }

    return response.json();
  }

  /**
   * Detener extracción actual
   */
  async stopExtraction(): Promise<{ message: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/stop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error deteniendo extracción');
    }

    return response.json();
  }

  /**
   * Buscar correos extraídos
   */
  async searchEmails(params: EmailSearchParams = {}): Promise<{
    emails: ExtractedEmail[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseUrl}/emails?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error buscando correos');
    }

    return response.json();
  }

  /**
   * Obtener detalle completo de un correo
   */
  async getEmailDetail(emailId: string): Promise<ExtractedEmail> {
    const response = await fetch(`${this.baseUrl}/emails/${emailId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Correo no encontrado');
      }
      const error = await response.json();
      throw new Error(error.detail || 'Error obteniendo detalle del correo');
    }

    return response.json();
  }

  /**
   * Eliminar correo extraído
   */
  async deleteEmail(emailId: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/emails/${emailId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Correo no encontrado');
      }
      const error = await response.json();
      throw new Error(error.detail || 'Error eliminando correo');
    }

    return response.json();
  }

  /**
   * Obtener estadísticas de extracción
   */
  async getStats(): Promise<ExtractionStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error obteniendo estadísticas');
    }

    return response.json();
  }

  /**
   * Obtener configuración actual
   */
  async getConfig(): Promise<ExtractorConfig> {
    const response = await fetch(`${this.baseUrl}/config`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error obteniendo configuración');
    }

    return response.json();
  }

  /**
   * Actualizar configuración
   */
  async updateConfig(config: Partial<ExtractorConfig>): Promise<{ message: string; config: any }> {
    const response = await fetch(`${this.baseUrl}/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error actualizando configuración');
    }

    return response.json();
  }

  /**
   * Probar conexión con Gemini AI
   */
  async testGeminiConnection(apiKey: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/test-gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      },
      body: JSON.stringify({ api_key: apiKey })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error probando conexión con Gemini');
    }

    return response.json();
  }

  /**
   * Descargar archivo adjunto
   */
  async downloadAttachment(attachmentId: number, filename: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/attachments/${attachmentId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error descargando archivo');
    }

    return response.blob();
  }

  /**
   * Exportar correos extraídos
   */
  async exportEmails(format: 'csv' | 'json' | 'xlsx', params: EmailSearchParams = {}): Promise<Blob> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    searchParams.append('format', format);

    const response = await fetch(`${this.baseUrl}/export?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error exportando correos');
    }

    return response.blob();
  }

  /**
   * Obtener logs de extracción
   */
  async getExtractionLogs(sessionId?: string): Promise<any[]> {
    const params = sessionId ? `?session_id=${sessionId}` : '';
    
    const response = await fetch(`${this.baseUrl}/logs${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error obteniendo logs');
    }

    return response.json();
  }

  /**
   * Limpiar datos antiguos
   */
  async cleanupOldData(daysOld: number): Promise<{ message: string; deleted_count: number }> {
    const response = await fetch(`${this.baseUrl}/cleanup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('vital_red_token')}`
      },
      body: JSON.stringify({ days_old: daysOld })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error limpiando datos');
    }

    return response.json();
  }
}

// Instancia singleton del servicio
export const gmailExtractorService = new GmailExtractorService();

// Exportar también la clase para casos especiales
export { GmailExtractorService };
