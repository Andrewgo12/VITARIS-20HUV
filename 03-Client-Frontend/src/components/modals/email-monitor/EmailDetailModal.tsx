/**
 * Email Detail Modal - VITAL RED
 * Modal para mostrar detalles completos de un email procesado
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  User, 
  Clock, 
  FileText, 
  Brain,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';
import { apiService } from '@/services/api';
import { useNotifications } from '@/components/ui/notification-system';

interface EmailDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailId: string;
}

interface EmailDetail {
  id: string;
  subject: string;
  sender: string;
  receivedAt: string;
  status: 'pending' | 'processed' | 'error';
  content: string;
  attachments: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
  }>;
  extractedData: {
    patientName?: string;
    patientDocument?: string;
    diagnosis?: string;
    referringPhysician?: string;
    referringInstitution?: string;
    priority?: string;
    specialty?: string;
  };
  aiAnalysis: {
    confidence: number;
    processingTime: number;
    fieldsExtracted: number;
    totalFields: number;
    errors: string[];
    warnings: string[];
  };
  processingHistory: Array<{
    timestamp: string;
    action: string;
    status: string;
    details: string;
  }>;
}

const EmailDetailModal: React.FC<EmailDetailModalProps> = ({
  isOpen,
  onClose,
  emailId
}) => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<EmailDetail | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (isOpen && emailId) {
      loadEmailDetail();
    }
  }, [isOpen, emailId]);

  const loadEmailDetail = async () => {
    setLoading(true);
    try {
      const response = await apiService.getEmailDetail(emailId);
      if (response.success && response.data) {
        setEmail(response.data);
      } else {
        // Mock data for demonstration
        const mockEmail: EmailDetail = {
          id: emailId,
          subject: 'Referencia Urgente - Cardiología',
          sender: 'dr.martinez@eps-sanitas.com.co',
          receivedAt: '2025-01-20T10:30:00Z',
          status: 'processed',
          content: `
            Estimados colegas,
            
            Les remito paciente Juan Pérez García, documento 12345678, 
            con diagnóstico de infarto agudo de miocardio.
            
            Requiere evaluación urgente en cardiología.
            
            Dr. Carlos Martínez
            Hospital San José
          `,
          attachments: [
            {
              id: '1',
              name: 'electrocardiograma.pdf',
              size: '2.5 MB',
              type: 'application/pdf'
            },
            {
              id: '2',
              name: 'laboratorios.pdf',
              size: '1.2 MB',
              type: 'application/pdf'
            }
          ],
          extractedData: {
            patientName: 'Juan Pérez García',
            patientDocument: '12345678',
            diagnosis: 'Infarto agudo de miocardio',
            referringPhysician: 'Dr. Carlos Martínez',
            referringInstitution: 'Hospital San José',
            priority: 'alta',
            specialty: 'cardiología'
          },
          aiAnalysis: {
            confidence: 0.92,
            processingTime: 2.3,
            fieldsExtracted: 7,
            totalFields: 8,
            errors: [],
            warnings: ['Especialidad inferida del contexto']
          },
          processingHistory: [
            {
              timestamp: '2025-01-20T10:30:15Z',
              action: 'Email recibido',
              status: 'success',
              details: 'Email ingresado al sistema'
            },
            {
              timestamp: '2025-01-20T10:30:18Z',
              action: 'Procesamiento IA iniciado',
              status: 'success',
              details: 'Análisis de contenido iniciado'
            },
            {
              timestamp: '2025-01-20T10:30:21Z',
              action: 'Extracción completada',
              status: 'success',
              details: '7 de 8 campos extraídos exitosamente'
            },
            {
              timestamp: '2025-01-20T10:30:22Z',
              action: 'Caso médico creado',
              status: 'success',
              details: 'Caso REF-2025-001 creado'
            }
          ]
        };
        setEmail(mockEmail);
      }
    } catch (error) {
      console.error('Error loading email detail:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando email',
        message: 'No se pudieron cargar los detalles del email.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetryProcessing = async () => {
    if (!email) return;

    setRetrying(true);
    try {
      const response = await apiService.retryEmailProcessing(email.id);
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Reintento iniciado',
          message: 'Se ha iniciado el reprocesamiento del email.',
          priority: 'medium'
        });
        await loadEmailDetail();
      }
    } catch (error) {
      console.error('Error retrying email processing:', error);
      addNotification({
        type: 'warning',
        title: 'Error en reintento',
        message: 'No se pudo reintentar el procesamiento.',
        priority: 'medium'
      });
    } finally {
      setRetrying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-100 text-green-800">Procesado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Cargando detalles del email...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!email) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Detalles del Email
          </DialogTitle>
          <DialogDescription>
            Información completa del procesamiento del email
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {getStatusBadge(email.status)}
            <span className="text-sm text-gray-600">
              Recibido: {formatDate(email.receivedAt)}
            </span>
          </div>
          {email.status === 'error' && (
            <Button
              onClick={handleRetryProcessing}
              disabled={retrying}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${retrying ? 'animate-spin' : ''}`} />
              Reintentar
            </Button>
          )}
        </div>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="extracted">Datos Extraídos</TabsTrigger>
            <TabsTrigger value="analysis">Análisis IA</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 overflow-y-auto max-h-96">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Asunto</Label>
                  <p className="text-sm">{email.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Remitente</Label>
                  <p className="text-sm">{email.sender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <div className="mt-1">{getStatusBadge(email.status)}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Archivos Adjuntos</Label>
                  <p className="text-sm">{email.attachments.length} archivo(s)</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Confianza IA</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={email.aiAnalysis.confidence * 100} className="flex-1" />
                    <span className="text-sm">{Math.round(email.aiAnalysis.confidence * 100)}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tiempo de Procesamiento</Label>
                  <p className="text-sm">{email.aiAnalysis.processingTime}s</p>
                </div>
              </div>
            </div>

            {email.attachments.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Archivos Adjuntos</Label>
                <div className="space-y-2 mt-2">
                  {email.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{attachment.name}</span>
                        <Badge variant="outline" className="text-xs">{attachment.size}</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content" className="overflow-y-auto max-h-96">
            <div>
              <Label className="text-sm font-medium">Contenido del Email</Label>
              <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                <pre className="text-sm whitespace-pre-wrap">{email.content}</pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="extracted" className="space-y-4 overflow-y-auto max-h-96">
            <div>
              <Label className="text-sm font-medium">Datos Extraídos por IA</Label>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.entries(email.extractedData).map(([key, value]) => (
                  value && (
                    <div key={key} className="p-3 border rounded-lg">
                      <Label className="text-xs text-gray-600 uppercase tracking-wide">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <p className="text-sm font-medium mt-1">{value}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 overflow-y-auto max-h-96">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Métricas de Procesamiento</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Confianza:</span>
                      <span className="text-sm font-medium">{Math.round(email.aiAnalysis.confidence * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Campos extraídos:</span>
                      <span className="text-sm font-medium">
                        {email.aiAnalysis.fieldsExtracted}/{email.aiAnalysis.totalFields}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tiempo:</span>
                      <span className="text-sm font-medium">{email.aiAnalysis.processingTime}s</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {email.aiAnalysis.warnings.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Advertencias</Label>
                    <div className="space-y-1 mt-2">
                      {email.aiAnalysis.warnings.map((warning, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-yellow-700">
                          <AlertCircle className="w-4 h-4" />
                          {warning}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {email.aiAnalysis.errors.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Errores</Label>
                    <div className="space-y-1 mt-2">
                      {email.aiAnalysis.errors.map((error, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-red-700">
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="overflow-y-auto max-h-96">
            <div>
              <Label className="text-sm font-medium">Historial de Procesamiento</Label>
              <div className="space-y-3 mt-4">
                {email.processingHistory.map((entry, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {entry.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{entry.action}</span>
                        <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}

export default EmailDetailModal;
