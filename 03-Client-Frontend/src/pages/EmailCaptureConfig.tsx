/**
 * Configuración del Capturador de Correos - VITAL RED
 * Vista para el módulo de IA (Backoffice automatizado)
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Mail, 
  Clock, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Save,
  TestTube,
  Key,
  Server,
  Filter,
  Bell,
  Database
} from 'lucide-react';
import { apiService } from "@/services/api";
import { useNotifications } from "@/components/ui/notification-system";

interface CaptureConfig {
  enabled: boolean;
  interval: number;
  emailAccount: string;
  oauthConfigured: boolean;
  lastSync: string;
  totalCaptured: number;
  errorCount: number;
}

interface FilterConfig {
  keywords: string[];
  senderDomains: string[];
  subjectFilters: string[];
  excludeKeywords: string[];
}

interface NotificationConfig {
  emailNotifications: boolean;
  notificationEmail: string;
  alertThreshold: number;
  dailyReport: boolean;
}

const EmailCaptureConfig: React.FC = () => {
  const { addNotification } = useNotifications();
  const [config, setConfig] = useState<CaptureConfig>({
    enabled: true,
    interval: 5,
    emailAccount: 'referrals@hospital-ese.com',
    oauthConfigured: true,
    lastSync: '2025-01-20T10:30:00Z',
    totalCaptured: 1247,
    errorCount: 3
  });

  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    keywords: ['referencia', 'interconsulta', 'remision', 'derivacion'],
    senderDomains: ['eps-sanitas.com.co', 'compensar.com', 'sura.com.co', 'nuevaeps.com.co'],
    subjectFilters: ['urgente', 'critico', 'emergencia'],
    excludeKeywords: ['spam', 'publicidad', 'marketing']
  });

  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    emailNotifications: true,
    notificationEmail: 'admin@hospital-ese.com',
    alertThreshold: 10,
    dailyReport: true
  });

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const response = await apiService.getGmailConfig();

      if (response.success && response.data) {
        const data = response.data;

        setConfig({
          enabled: data.enabled,
          interval: data.capture_interval / 60, // Convert seconds to minutes
          emailAccount: 'referrals@hospital-ese.com',
          oauthConfigured: data.oauth_configured,
          lastSync: data.status.last_sync,
          totalCaptured: data.status.emails_processed,
          errorCount: 0
        });

        setFilters({
          keywords: data.keywords,
          senderDomains: ['eps-sanitas.com.co', 'compensar.com', 'nuevaeps.com.co'],
          subjectFilters: ['referencia', 'interconsulta', 'traslado'],
          excludeKeywords: ['spam', 'promocion']
        });

        setNotifications({
          enabled: true,
          notificationEmail: 'admin@hospital-ese.com',
          alertThreshold: 10,
          dailyReport: true
        });
      }
    } catch (error) {
      console.error('Error loading Gmail config:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando configuración',
        message: 'No se pudo cargar la configuración de Gmail.',
        priority: 'medium'
      });
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const configData = {
        enabled: config.enabled,
        capture_interval: config.interval * 60, // Convert minutes to seconds
        keywords: filters.keywords,
        filters: {
          include_attachments: true,
          min_confidence: 0.7,
          auto_process: true
        }
      };

      const response = await apiService.updateGmailConfig(configData);

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Configuración guardada',
          message: 'La configuración de Gmail se ha actualizado correctamente.',
          priority: 'medium'
        });
        setTestResult({ success: true, message: 'Configuración guardada exitosamente' });
      } else {
        throw new Error(response.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving Gmail config:', error);
      addNotification({
        type: 'warning',
        title: 'Error guardando configuración',
        message: 'No se pudo guardar la configuración de Gmail.',
        priority: 'medium'
      });
      setTestResult({ success: false, message: 'Error al guardar la configuración' });
    } finally {
      setSaving(false);
      setTimeout(() => setTestResult(null), 3000);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await apiService.testGmailConnection();

      if (response.success && response.data) {
        const data = response.data;
        setTestResult({
          success: data.connection_status === 'success',
          message: data.connection_status === 'success'
            ? `Conexión exitosa. OAuth: ${data.oauth_status}. Cuota API: ${data.api_quota.percentage}%`
            : 'Error de conexión. Verificar credenciales OAuth2.'
        });
      } else {
        throw new Error(response.error || 'Failed to test connection');
      }
    } catch (error) {
      console.error('Error testing Gmail connection:', error);
      setTestResult({
        success: false,
        message: 'Error de conexión. Verificar credenciales OAuth2.'
      });
    } finally {
      setTesting(false);
    }
  };

  const addKeyword = (type: keyof FilterConfig, value: string) => {
    if (value.trim()) {
      setFilterConfig(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()]
      }));
    }
  };

  const removeKeyword = (type: keyof FilterConfig, index: number) => {
    setFilterConfig(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const getStatusBadge = () => {
    if (!config.enabled) {
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Desactivado</Badge>;
    }
    if (config.errorCount > 0) {
      return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Con errores</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Activo</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Capturador</h1>
          <p className="text-gray-600 mt-1">Módulo de IA - Configuración de Gmail API</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testing}
          >
            <TestTube className={`w-4 h-4 mr-2 ${testing ? 'animate-pulse' : ''}`} />
            Probar Conexión
          </Button>
          
          <Button onClick={handleSaveConfig} disabled={saving}>
            <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-pulse' : ''}`} />
            Guardar Configuración
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {testResult && (
        <Alert variant={testResult.success ? "default" : "destructive"}>
          {testResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertDescription>{testResult.message}</AlertDescription>
        </Alert>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estado</p>
                <div className="mt-1">{getStatusBadge()}</div>
              </div>
              <Settings className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Correos Capturados</p>
                <p className="text-2xl font-bold text-green-600">{config.totalCaptured}</p>
              </div>
              <Mail className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Intervalo</p>
                <p className="text-2xl font-bold text-blue-600">{config.interval}min</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errores</p>
                <p className="text-2xl font-bold text-red-600">{config.errorCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="filters">Filtros</TabsTrigger>
          <TabsTrigger value="oauth">OAuth2</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        {/* General Configuration */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configuración General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Capturador Automático</Label>
                  <p className="text-sm text-gray-500">
                    Activar/desactivar la captura automática de correos
                  </p>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email-account">Cuenta de Correo</Label>
                  <Input
                    id="email-account"
                    value={config.emailAccount}
                    onChange={(e) => setConfig(prev => ({ ...prev, emailAccount: e.target.value }))}
                    placeholder="referrals@hospital-ese.com"
                  />
                  <p className="text-xs text-gray-500">
                    Cuenta Gmail configurada para recibir referencias
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interval">Intervalo de Lectura</Label>
                  <Select
                    value={config.interval.toString()}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, interval: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minuto</SelectItem>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="10">10 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Frecuencia de verificación de correos nuevos
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Información de Sincronización</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Última sincronización:</span>
                    <p className="font-medium">{new Date(config.lastSync).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado OAuth2:</span>
                    <p className="font-medium text-green-600">
                      {config.oauthConfigured ? 'Configurado' : 'Pendiente'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Filters Configuration */}
        <TabsContent value="filters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Configuración de Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Keywords */}
              <div className="space-y-3">
                <Label>Palabras Clave de Referencia</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {filterConfig.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" 
                           onClick={() => removeKeyword('keywords', index)}>
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar palabra clave..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addKeyword('keywords', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button variant="outline" size="sm">Agregar</Button>
                </div>
              </div>

              {/* Sender Domains */}
              <div className="space-y-3">
                <Label>Dominios Permitidos</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {filterConfig.senderDomains.map((domain, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer"
                           onClick={() => removeKeyword('senderDomains', index)}>
                      {domain} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar dominio..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addKeyword('senderDomains', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button variant="outline" size="sm">Agregar</Button>
                </div>
              </div>

              {/* Subject Filters */}
              <div className="space-y-3">
                <Label>Filtros de Asunto (Prioridad)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {filterConfig.subjectFilters.map((filter, index) => (
                    <Badge key={index} variant="destructive" className="cursor-pointer"
                           onClick={() => removeKeyword('subjectFilters', index)}>
                      {filter} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar filtro de urgencia..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addKeyword('subjectFilters', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button variant="outline" size="sm">Agregar</Button>
                </div>
              </div>

              {/* Exclude Keywords */}
              <div className="space-y-3">
                <Label>Palabras de Exclusión</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {filterConfig.excludeKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer bg-red-100 text-red-800"
                           onClick={() => removeKeyword('excludeKeywords', index)}>
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar palabra de exclusión..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addKeyword('excludeKeywords', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button variant="outline" size="sm">Agregar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OAuth2 Configuration */}
        <TabsContent value="oauth">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Configuración OAuth2
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  La configuración OAuth2 permite el acceso seguro a Gmail API. 
                  Asegúrese de usar credenciales autorizadas por el hospital.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Estado de Autorización</Label>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">Autorizado</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Última autorización: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Permisos Concedidos</Label>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Lectura de correos
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Acceso a adjuntos
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Metadatos de mensajes
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Renovar Token
                </Button>
                <Button variant="outline">
                  <Key className="w-4 h-4 mr-2" />
                  Reconfigurar OAuth2
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Configuration */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificaciones por Email</Label>
                  <p className="text-sm text-gray-500">
                    Recibir alertas por correo electrónico
                  </p>
                </div>
                <Switch
                  checked={notificationConfig.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationConfig(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="notification-email">Email de Notificaciones</Label>
                  <Input
                    id="notification-email"
                    value={notificationConfig.notificationEmail}
                    onChange={(e) => 
                      setNotificationConfig(prev => ({ ...prev, notificationEmail: e.target.value }))
                    }
                    placeholder="admin@hospital-ese.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert-threshold">Umbral de Alerta</Label>
                  <Input
                    id="alert-threshold"
                    type="number"
                    value={notificationConfig.alertThreshold}
                    onChange={(e) => 
                      setNotificationConfig(prev => ({ ...prev, alertThreshold: parseInt(e.target.value) }))
                    }
                    placeholder="10"
                  />
                  <p className="text-xs text-gray-500">
                    Número de errores antes de enviar alerta
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Reporte Diario</Label>
                  <p className="text-sm text-gray-500">
                    Enviar resumen diario de actividad
                  </p>
                </div>
                <Switch
                  checked={notificationConfig.dailyReport}
                  onCheckedChange={(checked) => 
                    setNotificationConfig(prev => ({ ...prev, dailyReport: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailCaptureConfig;
