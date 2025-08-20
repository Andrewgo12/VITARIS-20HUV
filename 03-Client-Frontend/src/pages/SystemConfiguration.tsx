/**
 * System Configuration for VITAL RED - Administrator View
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Save,
  ArrowLeft,
  Hospital,
  Mail,
  Clock,
  Shield,
  Database,
  Bell,
  Palette,
  Globe,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { apiService } from "@/services/api";
import { useNotifications } from "@/components/ui/notification-system";

interface SystemConfig {
  hospital: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  system: {
    version: string;
    environment: string;
    maintenanceMode: boolean;
    backupEnabled: boolean;
    notificationsEnabled: boolean;
  };
  email: {
    smtpServer: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    alertThreshold: number;
    dailyReports: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    auditLogging: boolean;
  };
  ai: {
    enabled: boolean;
    confidenceThreshold: number;
    autoClassification: boolean;
    nlpLanguage: string;
    processingTimeout: number;
  };
}

const SystemConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<SystemConfig>({
    hospital: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
    system: {
      version: '2.0.0',
      environment: 'production',
      maintenanceMode: false,
      backupEnabled: true,
      notificationsEnabled: true,
    },
    email: {
      smtpServer: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: '',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      alertThreshold: 10,
      dailyReports: true,
    },
    security: {
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
      auditLogging: true,
    },
    ai: {
      enabled: true,
      confidenceThreshold: 0.8,
      autoClassification: true,
      nlpLanguage: 'es',
      processingTimeout: 300,
    },
  });

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      // Real API call to get system configuration
      const response = await apiService.getSystemConfiguration();

      if (response.success && response.data) {
        // Convert API response to SystemConfig format
        const apiConfig = response.data;

        const systemConfig: SystemConfig = {
          hospital: {
            name: apiConfig.hospital.name,
            address: apiConfig.hospital.address,
            phone: apiConfig.hospital.phone,
            email: apiConfig.hospital.email,
          },
          system: {
            version: '2.0.0',
            environment: 'production',
            maintenanceMode: false,
            backupEnabled: apiConfig.backup.enabled,
            notificationsEnabled: apiConfig.notifications.emailEnabled,
          },
          email: {
            smtpServer: 'smtp.gmail.com',
            smtpPort: 587,
            smtpUser: 'vital-red@hospital-ese.com',
            smtpPassword: '••••••••',
            fromEmail: 'vital-red@hospital-ese.com',
            fromName: 'VITAL RED System',
          },
          notifications: {
            emailNotifications: apiConfig.notifications.emailEnabled,
            smsNotifications: apiConfig.notifications.smsEnabled,
            pushNotifications: true,
            alertThreshold: apiConfig.notifications.urgentCaseThreshold,
            dailyReports: true,
          },
          security: {
            sessionTimeout: apiConfig.security.sessionTimeout * 60, // convert to seconds
            maxLoginAttempts: apiConfig.security.maxLoginAttempts,
            passwordMinLength: apiConfig.security.passwordPolicy.minLength,
            requireTwoFactor: false,
            auditLogging: true,
          },
          ai: {
            enabled: apiConfig.ai.enabled,
            confidenceThreshold: apiConfig.ai.confidenceThreshold,
            autoClassification: apiConfig.ai.autoProcessing,
            nlpLanguage: 'es',
            processingTimeout: 300,
          },
        };

        setConfig(systemConfig);
      } else {
        throw new Error(response.error || 'Failed to load configuration');
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando configuración',
        message: 'No se pudo cargar la configuración del sistema.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      if (!config) return;

      // Real API call to save system configuration
      const response = await apiService.updateSystemConfiguration(config);

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Configuración guardada',
          message: 'La configuración del sistema se ha actualizado correctamente.',
          priority: 'medium'
        });
      } else {
        throw new Error(response.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      addNotification({
        type: 'warning',
        title: 'Error guardando configuración',
        message: 'No se pudo guardar la configuración del sistema.',
        priority: 'medium'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/vital-red/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
                <p className="text-gray-600">Configurar parámetros y ajustes del sistema</p>
              </div>
            </div>
            <Button onClick={saveConfiguration} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hospital Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hospital className="w-5 h-5 mr-2" />
                Información del Hospital
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hospital-name">Nombre del Hospital</Label>
                <Input
                  id="hospital-name"
                  value={config.hospital.name}
                  onChange={(e) => updateConfig('hospital', 'name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hospital-address">Dirección</Label>
                <Textarea
                  id="hospital-address"
                  value={config.hospital.address}
                  onChange={(e) => updateConfig('hospital', 'address', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hospital-phone">Teléfono</Label>
                <Input
                  id="hospital-phone"
                  value={config.hospital.phone}
                  onChange={(e) => updateConfig('hospital', 'phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hospital-email">Email</Label>
                <Input
                  id="hospital-email"
                  type="email"
                  value={config.hospital.email}
                  onChange={(e) => updateConfig('hospital', 'email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configuración del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo de Mantenimiento</Label>
                  <p className="text-sm text-gray-600">Deshabilitar acceso al sistema</p>
                </div>
                <Switch
                  checked={config.system.maintenanceMode}
                  onCheckedChange={(checked) => updateConfig('system', 'maintenanceMode', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Respaldos Automáticos</Label>
                  <p className="text-sm text-gray-600">Crear respaldos diarios</p>
                </div>
                <Switch
                  checked={config.system.backupEnabled}
                  onCheckedChange={(checked) => updateConfig('system', 'backupEnabled', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones del Sistema</Label>
                  <p className="text-sm text-gray-600">Habilitar notificaciones</p>
                </div>
                <Switch
                  checked={config.system.notificationsEnabled}
                  onCheckedChange={(checked) => updateConfig('system', 'notificationsEnabled', checked)}
                />
              </div>
              <div>
                <Label>Entorno</Label>
                <Select
                  value={config.system.environment}
                  onValueChange={(value) => updateConfig('system', 'environment', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Desarrollo</SelectItem>
                    <SelectItem value="staging">Pruebas</SelectItem>
                    <SelectItem value="production">Producción</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Email Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Configuración de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="smtp-server">Servidor SMTP</Label>
                <Input
                  id="smtp-server"
                  value={config.email.smtpServer}
                  onChange={(e) => updateConfig('email', 'smtpServer', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="smtp-port">Puerto SMTP</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  value={config.email.smtpPort}
                  onChange={(e) => updateConfig('email', 'smtpPort', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="smtp-user">Usuario SMTP</Label>
                <Input
                  id="smtp-user"
                  value={config.email.smtpUser}
                  onChange={(e) => updateConfig('email', 'smtpUser', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="from-email">Email Remitente</Label>
                <Input
                  id="from-email"
                  type="email"
                  value={config.email.fromEmail}
                  onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Configuración de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="session-timeout">Tiempo de Sesión (segundos)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={config.security.sessionTimeout}
                  onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="max-login-attempts">Máximo Intentos de Login</Label>
                <Input
                  id="max-login-attempts"
                  type="number"
                  value={config.security.maxLoginAttempts}
                  onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="password-min-length">Longitud Mínima de Contraseña</Label>
                <Input
                  id="password-min-length"
                  type="number"
                  value={config.security.passwordMinLength}
                  onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Autenticación de Dos Factores</Label>
                  <p className="text-sm text-gray-600">Requerir 2FA para todos los usuarios</p>
                </div>
                <Switch
                  checked={config.security.requireTwoFactor}
                  onCheckedChange={(checked) => updateConfig('security', 'requireTwoFactor', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Configuración de IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Módulo de IA Habilitado</Label>
                  <p className="text-sm text-gray-600">Procesamiento automático con IA</p>
                </div>
                <Switch
                  checked={config.ai.enabled}
                  onCheckedChange={(checked) => updateConfig('ai', 'enabled', checked)}
                />
              </div>
              <div>
                <Label htmlFor="confidence-threshold">Umbral de Confianza</Label>
                <Input
                  id="confidence-threshold"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={config.ai.confidenceThreshold}
                  onChange={(e) => updateConfig('ai', 'confidenceThreshold', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Idioma de Procesamiento</Label>
                <Select
                  value={config.ai.nlpLanguage}
                  onValueChange={(value) => updateConfig('ai', 'nlpLanguage', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">Inglés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Clasificación Automática</Label>
                  <p className="text-sm text-gray-600">Clasificar casos automáticamente</p>
                </div>
                <Switch
                  checked={config.ai.autoClassification}
                  onCheckedChange={(checked) => updateConfig('ai', 'autoClassification', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por Email</Label>
                  <p className="text-sm text-gray-600">Enviar alertas por email</p>
                </div>
                <Switch
                  checked={config.notifications.emailNotifications}
                  onCheckedChange={(checked) => updateConfig('notifications', 'emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones Push</Label>
                  <p className="text-sm text-gray-600">Notificaciones en tiempo real</p>
                </div>
                <Switch
                  checked={config.notifications.pushNotifications}
                  onCheckedChange={(checked) => updateConfig('notifications', 'pushNotifications', checked)}
                />
              </div>
              <div>
                <Label htmlFor="alert-threshold">Umbral de Alertas</Label>
                <Input
                  id="alert-threshold"
                  type="number"
                  value={config.notifications.alertThreshold}
                  onChange={(e) => updateConfig('notifications', 'alertThreshold', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reportes Diarios</Label>
                  <p className="text-sm text-gray-600">Enviar resumen diario</p>
                </div>
                <Switch
                  checked={config.notifications.dailyReports}
                  onCheckedChange={(checked) => updateConfig('notifications', 'dailyReports', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Alert */}
        <Alert className="mt-8">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            La configuración se guarda automáticamente. Los cambios en configuraciones críticas pueden requerir reinicio del sistema.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SystemConfiguration;
