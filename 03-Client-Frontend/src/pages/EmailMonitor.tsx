/**
 * Monitor de Correos Entrantes - VITAL RED
 * Vista para el módulo de IA (Backoffice automatizado)
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  User, 
  Hospital,
  Search,
  Filter,
  Download,
  Eye,
  RotateCcw
} from 'lucide-react';
import { apiService } from "@/services/api";
import { useNotifications } from "@/components/ui/notification-system";

interface EmailData {
  id: string;
  subject: string;
  sender: string;
  receivedAt: string;
  status: 'pending' | 'processed' | 'error';
  patientName?: string;
  diagnosis?: string;
  remittingHospital?: string;
  attachments: number;
  extractedData?: {
    patientId?: string;
    urgency?: string;
    specialty?: string;
  };
  errorMessage?: string;
}

interface ProcessingStats {
  total: number;
  pending: number;
  processed: number;
  errors: number;
  lastUpdate: string;
}

const EmailMonitor: React.FC = () => {
  const { addNotification } = useNotifications();
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [stats, setStats] = useState<ProcessingStats>({
    total: 0,
    pending: 0,
    processed: 0,
    errors: 0,
    lastUpdate: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load real email data
  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    try {
      const response = await apiService.getEmails({
        skip: 0,
        limit: 50,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });

      if (response.success && response.data) {
        const emailData: EmailData[] = response.data.emails.map((email: any) => ({
          id: email.id,
          subject: email.subject,
          sender: email.sender,
          receivedAt: email.receivedAt,
          status: email.status,
          patientName: email.extractedData?.patient_name,
          diagnosis: email.extractedData?.diagnosis,
          remittingHospital: email.extractedData?.referring_institution,
          attachments: email.attachments,
          extractedData: {
            patientId: email.extractedData?.patient_document,
            urgency: email.extractedData?.priority_level,
            specialty: email.extractedData?.specialty
          },
          errorMessage: email.errorMessage
        }));

        setEmails(emailData);

        // Calculate stats
        setStats({
          total: emailData.length,
          pending: emailData.filter(e => e.status === 'pending').length,
          processed: emailData.filter(e => e.status === 'processed').length,
          errors: emailData.filter(e => e.status === 'error').length,
          lastUpdate: new Date().toISOString()
        });
      } else {
        throw new Error(response.error || 'Failed to load emails');
      }
    } catch (error) {
      console.error('Error loading email data:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando emails',
        message: 'No se pudieron cargar los emails del monitor.',
        priority: 'medium'
      });

      // Set empty data on error
      setEmails([]);
      setStats({
        total: 0,
        pending: 0,
        processed: 0,
        errors: 0,
        lastUpdate: new Date().toISOString()
      });
    }
  };

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = async () => {
    setLoading(true);
    await loadEmailData();
    setLoading(false);
  };

  const handleProcessEmails = async () => {
    try {
      const response = await apiService.processEmails();
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Procesamiento iniciado',
          message: 'Se ha iniciado el procesamiento de emails.',
          priority: 'medium'
        });
        await loadEmailData();
      } else {
        throw new Error(response.error || 'Failed to process emails');
      }
    } catch (error) {
      console.error('Error processing emails:', error);
      addNotification({
        type: 'warning',
        title: 'Error procesando emails',
        message: 'No se pudo iniciar el procesamiento de emails.',
        priority: 'medium'
      });
    }
  };

  const handleRetryEmail = async (emailId: string) => {
    try {
      const response = await apiService.retryEmailProcessing(emailId);
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Reintento iniciado',
          message: 'Se ha iniciado el reintento del procesamiento.',
          priority: 'medium'
        });
        await loadEmailData();
      } else {
        throw new Error(response.error || 'Failed to retry email');
      }
    } catch (error) {
      console.error('Error retrying email:', error);
      addNotification({
        type: 'warning',
        title: 'Error en reintento',
        message: 'No se pudo reintentar el procesamiento del email.',
        priority: 'medium'
      });
    }
  };

  const handleRetryProcessing = async (emailId: string) => {
    setLoading(true);
    // Simular reintento de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, status: 'pending' as const }
        : email
    ));
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Procesado</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (email.patientName && email.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitor de Correos Entrantes</h1>
          <p className="text-gray-600 mt-1">Módulo de IA - Backoffice Automatizado</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          
          <Button onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Correos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Procesados</p>
                <p className="text-2xl font-bold text-green-600">{stats.processed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errores</p>
                <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Progress */}
      {stats.pending > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Procesando {stats.pending} correos pendientes...
            <Progress value={(stats.processed / stats.total) * 100} className="mt-2" />
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por asunto, remitente o paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="processed">Procesados</SelectItem>
                <SelectItem value="error">Con errores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Email List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Correos Detectados</span>
            <span className="text-sm font-normal text-gray-500">
              Última actualización: {new Date(stats.lastUpdate).toLocaleTimeString()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Remitente</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead>Adjuntos</TableHead>
                  <TableHead>Recibido</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>{getStatusBadge(email.status)}</TableCell>
                    <TableCell className="font-medium">{email.subject}</TableCell>
                    <TableCell>{email.sender}</TableCell>
                    <TableCell>{email.patientName || '-'}</TableCell>
                    <TableCell>{email.diagnosis || '-'}</TableCell>
                    <TableCell>
                      {email.attachments > 0 && (
                        <Badge variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          {email.attachments}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(email.receivedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEmail(email)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {email.status === 'error' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetryProcessing(email.id)}
                            disabled={loading}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Detalle del Correo</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedEmail(null)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <div className="mt-1">{getStatusBadge(selectedEmail.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Recibido</label>
                  <p className="mt-1">{new Date(selectedEmail.receivedAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Asunto</label>
                <p className="mt-1 font-medium">{selectedEmail.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Remitente</label>
                <p className="mt-1">{selectedEmail.sender}</p>
              </div>

              {selectedEmail.extractedData && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Datos Extraídos</label>
                  <div className="mt-1 bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedEmail.extractedData.patientId && (
                        <div><strong>ID Paciente:</strong> {selectedEmail.extractedData.patientId}</div>
                      )}
                      {selectedEmail.extractedData.urgency && (
                        <div><strong>Urgencia:</strong> {selectedEmail.extractedData.urgency}</div>
                      )}
                      {selectedEmail.extractedData.specialty && (
                        <div><strong>Especialidad:</strong> {selectedEmail.extractedData.specialty}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedEmail.errorMessage && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{selectedEmail.errorMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmailMonitor;
