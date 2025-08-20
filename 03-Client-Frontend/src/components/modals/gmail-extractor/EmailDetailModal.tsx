/**
 * Email Detail Modal - Gmail Extractor
 * Modal para mostrar detalles completos de un correo extraído
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, 
  User, 
  Calendar, 
  FileText, 
  Download,
  Eye,
  Brain,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useNotifications } from '@/components/ui/notification-system';

interface EmailDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailId: string | null;
}

interface EmailDetail {
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

const EmailDetailModal: React.FC<EmailDetailModalProps> = ({
  isOpen,
  onClose,
  emailId
}) => {
  const { addNotification } = useNotifications();
  const [email, setEmail] = useState<EmailDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && emailId) {
      loadEmailDetail();
    }
  }, [isOpen, emailId]);

  const loadEmailDetail = async () => {
    if (!emailId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/gmail-extractor/emails/${emailId}`);
      
      if (response.ok) {
        const emailData = await response.json();
        setEmail(emailData);
      } else {
        throw new Error('Error cargando detalle del correo');
      }
    } catch (error) {
      console.error('Error loading email detail:', error);
      addNotification({
        type: 'warning',
        title: 'Error',
        message: 'No se pudo cargar el detalle del correo',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification({
      type: 'success',
      title: 'Copiado',
      message: 'Texto copiado al portapapeles',
      priority: 'low'
    });
  };

  const downloadAttachment = async (attachmentId: number, filename: string) => {
    try {
      const response = await fetch(`/api/gmail-extractor/attachments/${attachmentId}/download`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        addNotification({
          type: 'success',
          title: 'Descarga iniciada',
          message: `Descargando ${filename}`,
          priority: 'low'
        });
      } else {
        throw new Error('Error descargando archivo');
      }
    } catch (error) {
      console.error('Error downloading attachment:', error);
      addNotification({
        type: 'warning',
        title: 'Error',
        message: 'No se pudo descargar el archivo',
        priority: 'medium'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAIAnalysis = () => {
    if (!email?.ai_analysis) {
      return (
        <div className="text-center text-gray-500 py-8">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No hay análisis de IA disponible</p>
        </div>
      );
    }

    const analysis = email.ai_analysis;

    return (
      <div className="space-y-4">
        {analysis.tipo_documento && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Tipo de Documento</h4>
            <Badge variant="outline">{analysis.tipo_documento}</Badge>
          </div>
        )}

        {analysis.informacion_paciente && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Información del Paciente</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(analysis.informacion_paciente, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {analysis.diagnosticos && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Diagnósticos</h4>
            <div className="space-y-1">
              {Array.isArray(analysis.diagnosticos) ? (
                analysis.diagnosticos.map((diagnostico: string, index: number) => (
                  <Badge key={index} variant="secondary">{diagnostico}</Badge>
                ))
              ) : (
                <Badge variant="secondary">{analysis.diagnosticos}</Badge>
              )}
            </div>
          </div>
        )}

        {analysis.urgencia && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Nivel de Urgencia</h4>
            <Badge 
              variant={analysis.urgencia === 'alta' ? 'destructive' : 
                     analysis.urgencia === 'media' ? 'default' : 'secondary'}
            >
              {analysis.urgencia.toUpperCase()}
            </Badge>
          </div>
        )}

        {analysis.resumen_ejecutivo && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Resumen Ejecutivo</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">{analysis.resumen_ejecutivo}</p>
            </div>
          </div>
        )}

        {analysis.palabras_clave && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Palabras Clave Médicas</h4>
            <div className="flex flex-wrap gap-1">
              {Array.isArray(analysis.palabras_clave) ? (
                analysis.palabras_clave.map((palabra: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {palabra}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-xs">
                  {analysis.palabras_clave}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando detalle del correo...</span>
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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Detalle del Correo
          </DialogTitle>
          <DialogDescription>
            Información completa del correo extraído
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="attachments">Adjuntos ({email.attachment_details?.length || 0})</TabsTrigger>
            <TabsTrigger value="ai-analysis">Análisis IA</TabsTrigger>
            <TabsTrigger value="metadata">Metadatos</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Información Básica</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Asunto:</span>
                    <p className="text-gray-700">{email.subject || 'Sin asunto'}</p>
                  </div>
                  <div>
                    <span className="font-medium">De:</span>
                    <p className="text-gray-700">{email.sender}</p>
                  </div>
                  <div>
                    <span className="font-medium">Para:</span>
                    <p className="text-gray-700">
                      {Array.isArray(email.recipients) ? email.recipients.join(', ') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Fecha:</span>
                    <p className="text-gray-700">{formatDate(email.date)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Información de Extracción</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Método:</span>
                    <Badge variant="outline">{email.extraction_method}</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Procesado:</span>
                    <p className="text-gray-700">{formatDate(email.processed_at)}</p>
                  </div>
                  <div>
                    <span className="font-medium">ID:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {email.id}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(email.id)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contenido del Correo</h4>
              <ScrollArea className="h-64 w-full border rounded-lg p-4">
                <div className="whitespace-pre-wrap text-sm text-gray-700">
                  {email.body_text || 'Sin contenido de texto'}
                </div>
              </ScrollArea>
            </div>

            {email.body_html && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contenido HTML</h4>
                <ScrollArea className="h-32 w-full border rounded-lg p-4">
                  <code className="text-xs text-gray-600">
                    {email.body_html}
                  </code>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="attachments" className="space-y-4">
            {email.attachment_details && email.attachment_details.length > 0 ? (
              <div className="space-y-3">
                {email.attachment_details.map((attachment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{attachment.filename}</p>
                          <p className="text-sm text-gray-500">
                            {attachment.content_type} • {(attachment.size_bytes / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadAttachment(attachment.id, attachment.filename)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {attachment.extracted_text && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-2">Texto Extraído:</h5>
                        <ScrollArea className="h-32 w-full bg-gray-50 rounded p-2">
                          <p className="text-xs text-gray-700 whitespace-pre-wrap">
                            {attachment.extracted_text}
                          </p>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay archivos adjuntos</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-analysis" className="space-y-4">
            {renderAIAnalysis()}
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Metadatos de Extracción</h4>
              <ScrollArea className="h-64 w-full border rounded-lg p-4">
                <pre className="text-xs text-gray-600">
                  {JSON.stringify(email.metadata, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDetailModal;
