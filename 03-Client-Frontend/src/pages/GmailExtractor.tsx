/**
 * Gmail Extractor Page - VITAL RED
 * Interfaz para la funcionalidad avanzada de extracción de Gmail
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Download, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Search,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useNotifications } from '@/components/ui/notification-system';
import { useGmailExtractor } from '@/hooks/useGmailExtractor';
import EmailDetailModal from '@/components/modals/gmail-extractor/EmailDetailModal';
import ExtractionConfigModal from '@/components/modals/gmail-extractor/ExtractionConfigModal';

interface ExtractionProgress {
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

interface ExtractedEmail {
  id: string;
  subject: string;
  sender: string;
  date: string;
  attachment_count: number;
  preview: string;
  processed_at: string;
  extraction_method: string;
}

const GmailExtractor: React.FC = () => {
  const { addNotification } = useNotifications();

  // Usar hook personalizado para Gmail Extractor
  const {
    isExtracting,
    progress,
    emails: extractedEmails,
    emailsLoading,
    emailsTotal,
    stats,
    statsLoading,
    config,
    configLoading,
    startExtraction,
    pauseExtraction,
    resumeExtraction,
    stopExtraction,
    searchEmails,
    getEmailDetail,
    deleteEmail,
    loadConfig,
    updateConfig,
    loadStats,
    refreshAll,
    exportEmails
  } = useGmailExtractor();

  // Estado local para UI
  const [extractionConfig, setExtractionConfig] = useState({
    email: '',
    password: '',
    maxEmails: 300,
    geminiApiKey: '',
    headless: true
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    sender: '',
    dateFrom: '',
    dateTo: '',
    hasAttachments: null as boolean | null
  });

  // Estado de modales
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [showEmailDetail, setShowEmailDetail] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  useEffect(() => {
    // El hook ya maneja la carga inicial y el polling
    // Solo necesitamos cargar los correos cuando cambie la búsqueda
    handleSearch();
  }, []);
  
  const handleStartExtraction = async () => {
    try {
      if (!extractionConfig.email || !extractionConfig.password) {
        addNotification({
          type: 'warning',
          title: 'Campos requeridos',
          message: 'Por favor ingrese email y contraseña.',
          priority: 'medium'
        });
        return;
      }

      await startExtraction({
        email: extractionConfig.email,
        password: extractionConfig.password,
        max_emails: extractionConfig.maxEmails,
        gemini_api_key: extractionConfig.geminiApiKey || undefined,
        headless: extractionConfig.headless
      });

    } catch (error) {
      // El error ya es manejado por el hook
      console.error('Error starting extraction:', error);
    }
  };
  
  const handleSearch = async () => {
    const params = {
      query: searchQuery || undefined,
      sender: searchFilters.sender || undefined,
      date_from: searchFilters.dateFrom || undefined,
      date_to: searchFilters.dateTo || undefined,
      has_attachments: searchFilters.hasAttachments
    };

    await searchEmails(params);
  };

  const handleViewEmailDetail = (emailId: string) => {
    setSelectedEmailId(emailId);
    setShowEmailDetail(true);
  };

  const handleDeleteEmail = async (emailId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este correo?')) {
      await deleteEmail(emailId);
    }
  };

  const handleExport = async (format: 'csv' | 'json' | 'xlsx') => {
    const params = {
      query: searchQuery || undefined,
      sender: searchFilters.sender || undefined,
      date_from: searchFilters.dateFrom || undefined,
      date_to: searchFilters.dateTo || undefined,
      has_attachments: searchFilters.hasAttachments
    };

    await exportEmails(format, params);
  };
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4 text-green-600" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Extractor Avanzado de Gmail</h1>
          <p className="text-gray-600 mt-2">
            Sistema de extracción masiva sin API oficial - Procesamiento inteligente con IA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-8 h-8 text-blue-600" />
          <Download className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <Tabs defaultValue="extractor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="extractor">Extractor</TabsTrigger>
          <TabsTrigger value="emails">Correos Extraídos</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
        </TabsList>

        {/* Tab: Extractor */}
        <TabsContent value="extractor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuración de extracción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración de Extracción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email de Gmail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={extractionConfig.email}
                    onChange={(e) => setExtractionConfig({
                      ...extractionConfig,
                      email: e.target.value
                    })}
                    placeholder="usuario@gmail.com"
                    disabled={isExtracting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={extractionConfig.password}
                    onChange={(e) => setExtractionConfig({
                      ...extractionConfig,
                      password: e.target.value
                    })}
                    placeholder="Contraseña de Gmail"
                    disabled={isExtracting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxEmails">Máximo de correos</Label>
                  <Input
                    id="maxEmails"
                    type="number"
                    value={extractionConfig.maxEmails}
                    onChange={(e) => setExtractionConfig({
                      ...extractionConfig,
                      maxEmails: parseInt(e.target.value) || 300
                    })}
                    min="1"
                    max="1000"
                    disabled={isExtracting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="geminiKey">Clave API de Gemini (opcional)</Label>
                  <Input
                    id="geminiKey"
                    type="password"
                    value={extractionConfig.geminiApiKey}
                    onChange={(e) => setExtractionConfig({
                      ...extractionConfig,
                      geminiApiKey: e.target.value
                    })}
                    placeholder="Para análisis con IA"
                    disabled={isExtracting}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="headless"
                    checked={extractionConfig.headless}
                    onCheckedChange={(checked) => setExtractionConfig({
                      ...extractionConfig,
                      headless: checked
                    })}
                    disabled={isExtracting}
                  />
                  <Label htmlFor="headless">Modo sin interfaz (más rápido)</Label>
                </div>
                
                <div className="flex gap-2">
                  {!isExtracting ? (
                    <Button onClick={handleStartExtraction} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar Extracción
                    </Button>
                  ) : (
                    <div className="flex gap-2 flex-1">
                      {progress?.status === 'running' ? (
                        <Button onClick={pauseExtraction} variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar
                        </Button>
                      ) : (
                        <Button onClick={resumeExtraction} variant="outline">
                          <Play className="w-4 h-4 mr-2" />
                          Reanudar
                        </Button>
                      )}
                      <Button onClick={stopExtraction} variant="destructive">
                        <Square className="w-4 h-4 mr-2" />
                        Detener
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progreso de extracción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Progreso de Extracción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progress ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Estado:</span>
                      <Badge className={getStatusColor(progress.status)}>
                        {getStatusIcon(progress.status)}
                        <span className="ml-1 capitalize">{progress.status}</span>
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progreso</span>
                        <span>{progress.processed_emails}/{progress.total_emails}</span>
                      </div>
                      <Progress 
                        value={(progress.processed_emails / progress.total_emails) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Exitosos:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {progress.successful_extractions}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fallidos:</span>
                        <span className="ml-2 font-medium text-red-600">
                          {progress.failed_extractions}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tasa de éxito:</span>
                        <span className="ml-2 font-medium">
                          {progress.success_rate.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tiempo:</span>
                        <span className="ml-2 font-medium">
                          {formatTime(progress.elapsed_time_seconds)}
                        </span>
                      </div>
                    </div>
                    
                    {progress.estimated_completion && (
                      <div className="text-sm">
                        <span className="text-gray-600">Finalización estimada:</span>
                        <span className="ml-2 font-medium">
                          {new Date(progress.estimated_completion).toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {progress.errors_count > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Se han detectado {progress.errors_count} errores durante la extracción.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay extracción en progreso</p>
                    <p className="text-sm">Configure los parámetros e inicie una extracción</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Correos Extraídos */}
        <TabsContent value="emails" className="space-y-6">
          {/* Filtros de búsqueda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Correos Extraídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Buscar en asunto y contenido..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Input
                  placeholder="Filtrar por remitente..."
                  value={searchFilters.sender}
                  onChange={(e) => setSearchFilters({
                    ...searchFilters,
                    sender: e.target.value
                  })}
                />
                <Input
                  type="date"
                  placeholder="Fecha desde"
                  value={searchFilters.dateFrom}
                  onChange={(e) => setSearchFilters({
                    ...searchFilters,
                    dateFrom: e.target.value
                  })}
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de correos */}
          <Card>
            <CardHeader>
              <CardTitle>Correos Extraídos ({extractedEmails.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {extractedEmails.map((email) => (
                  <div
                    key={email.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {email.subject || 'Sin asunto'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          De: {email.sender} • {new Date(email.date).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          {email.preview}...
                        </p>
                        <div className="flex items-center gap-2">
                          {email.attachment_count > 0 && (
                            <Badge variant="outline">
                              <FileText className="w-3 h-3 mr-1" />
                              {email.attachment_count} adjuntos
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {email.extraction_method}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewEmailDetail(email.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteEmail(email.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {extractedEmails.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No se encontraron correos extraídos</p>
                    <p className="text-sm">Inicie una extracción para ver correos aquí</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Estadísticas */}
        <TabsContent value="stats" className="space-y-6">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Correos</p>
                      <p className="text-2xl font-bold">{stats.total_emails}</p>
                    </div>
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Con Adjuntos</p>
                      <p className="text-2xl font-bold">{stats.emails_with_attachments}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Con Análisis IA</p>
                      <p className="text-2xl font-bold">{stats.emails_with_ai_analysis}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Adjuntos</p>
                      <p className="text-2xl font-bold">{stats.total_attachments}</p>
                    </div>
                    <Download className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Tab: Configuración */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Esta funcionalidad utiliza técnicas avanzadas de web scraping y no depende de la API oficial de Google.
                  Asegúrese de cumplir con los términos de servicio de Gmail.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowConfigModal(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Configuración Avanzada
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleExport('csv')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleExport('json')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar JSON
                </Button>

                <Button
                  variant="outline"
                  onClick={refreshAll}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualizar Todo
                </Button>
              </div>

              {config && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Configuración Actual</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Máx. correos:</span>
                      <span className="ml-2 font-medium">{config.max_emails}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tamaño lote:</span>
                      <span className="ml-2 font-medium">{config.batch_size}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Modo headless:</span>
                      <span className="ml-2 font-medium">{config.headless ? 'Sí' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Análisis IA:</span>
                      <span className="ml-2 font-medium">{config.enable_ai_analysis ? 'Habilitado' : 'Deshabilitado'}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <EmailDetailModal
        isOpen={showEmailDetail}
        onClose={() => {
          setShowEmailDetail(false);
          setSelectedEmailId(null);
        }}
        emailId={selectedEmailId}
      />

      <ExtractionConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSave={(newConfig) => {
          updateConfig(newConfig);
          setShowConfigModal(false);
        }}
      />
    </div>
  );
};

export default GmailExtractor;
