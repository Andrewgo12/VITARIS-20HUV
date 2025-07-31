import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RoleManager } from '@/components/ui/permissions-system';
import { AnalyticsDashboard } from '@/components/ui/analytics-dashboard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Settings,
  Shield,
  Database,
  Bell,
  Palette,
  Globe,
  Lock,
  Activity,
  Users,
  Server,
  Mail,
  Smartphone,
  Monitor,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SystemConfig {
  general: {
    hospitalName: string;
    timezone: string;
    language: string;
    dateFormat: string;
    currency: string;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    twoFactorAuth: boolean;
    loginAttempts: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    emergencyAlerts: boolean;
    maintenanceAlerts: boolean;
  };
  database: {
    backupFrequency: string;
    retentionPeriod: number;
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    maxConcurrentUsers: number;
    sessionCleanupInterval: number;
    logLevel: string;
  };
}

const defaultConfig: SystemConfig = {
  general: {
    hospitalName: 'Hospital Universitario del Valle',
    timezone: 'America/Bogota',
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    currency: 'COP',
  },
  security: {
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false,
    },
    twoFactorAuth: false,
    loginAttempts: 3,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    emergencyAlerts: true,
    maintenanceAlerts: true,
  },
  database: {
    backupFrequency: 'daily',
    retentionPeriod: 90,
    compressionEnabled: true,
    encryptionEnabled: true,
  },
  performance: {
    cacheEnabled: true,
    maxConcurrentUsers: 100,
    sessionCleanupInterval: 60,
    logLevel: 'info',
  },
};

const AdvancedSettings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);

  const updateConfig = (section: keyof SystemConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateNestedConfig = (section: keyof SystemConfig, nestedKey: string, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedKey]: {
          ...(prev[section] as any)[nestedKey],
          [key]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Configuración guardada:', config);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      // Simular backup
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowBackupDialog(false);
    } catch (error) {
      console.error('Error en backup:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración Avanzada</h1>
          <p className="text-muted-foreground">
            Administra la configuración del sistema y parámetros avanzados
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowBackupDialog(true)}>
            <Download className="w-4 h-4 mr-2" />
            Backup
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Base de Datos
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Activity className="w-4 h-4 mr-2" />
            Rendimiento
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Users className="w-4 h-4 mr-2" />
            Permisos
          </TabsTrigger>
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Nombre del Hospital</Label>
                  <Input
                    id="hospitalName"
                    value={config.general.hospitalName}
                    onChange={(e) => updateConfig('general', 'hospitalName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select
                    value={config.general.timezone}
                    onValueChange={(value) => updateConfig('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Bogota">América/Bogotá</SelectItem>
                      <SelectItem value="America/New_York">América/Nueva York</SelectItem>
                      <SelectItem value="Europe/Madrid">Europa/Madrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={config.general.language}
                    onValueChange={(value) => updateConfig('general', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select
                    value={config.general.currency}
                    onValueChange={(value) => updateConfig('general', 'currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Seguridad */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={config.security.sessionTimeout}
                    onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Intentos de Login</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={config.security.loginAttempts}
                    onChange={(e) => updateConfig('security', 'loginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Política de Contraseñas</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Longitud Mínima</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={config.security.passwordPolicy.minLength}
                      onChange={(e) => updateNestedConfig('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase">Requerir Mayúsculas</Label>
                    <Switch
                      id="requireUppercase"
                      checked={config.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => updateNestedConfig('security', 'passwordPolicy', 'requireUppercase', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">Requerir Números</Label>
                    <Switch
                      id="requireNumbers"
                      checked={config.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => updateNestedConfig('security', 'passwordPolicy', 'requireNumbers', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactorAuth">Autenticación de Dos Factores</Label>
                    <Switch
                      id="twoFactorAuth"
                      checked={config.security.twoFactorAuth}
                      onCheckedChange={(checked) => updateConfig('security', 'twoFactorAuth', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Notificaciones */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <Label htmlFor="emailEnabled">Notificaciones por Email</Label>
                  </div>
                  <Switch
                    id="emailEnabled"
                    checked={config.notifications.emailEnabled}
                    onCheckedChange={(checked) => updateConfig('notifications', 'emailEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <Label htmlFor="smsEnabled">Notificaciones por SMS</Label>
                  </div>
                  <Switch
                    id="smsEnabled"
                    checked={config.notifications.smsEnabled}
                    onCheckedChange={(checked) => updateConfig('notifications', 'smsEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <Label htmlFor="pushEnabled">Notificaciones Push</Label>
                  </div>
                  <Switch
                    id="pushEnabled"
                    checked={config.notifications.pushEnabled}
                    onCheckedChange={(checked) => updateConfig('notifications', 'pushEnabled', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <Label htmlFor="emergencyAlerts">Alertas de Emergencia</Label>
                  </div>
                  <Switch
                    id="emergencyAlerts"
                    checked={config.notifications.emergencyAlerts}
                    onCheckedChange={(checked) => updateConfig('notifications', 'emergencyAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <Label htmlFor="maintenanceAlerts">Alertas de Mantenimiento</Label>
                  </div>
                  <Switch
                    id="maintenanceAlerts"
                    checked={config.notifications.maintenanceAlerts}
                    onCheckedChange={(checked) => updateConfig('notifications', 'maintenanceAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Base de Datos */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Base de Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Frecuencia de Backup</Label>
                  <Select
                    value={config.database.backupFrequency}
                    onValueChange={(value) => updateConfig('database', 'backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Cada Hora</SelectItem>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retentionPeriod">Período de Retención (días)</Label>
                  <Input
                    id="retentionPeriod"
                    type="number"
                    value={config.database.retentionPeriod}
                    onChange={(e) => updateConfig('database', 'retentionPeriod', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compressionEnabled">Compresión de Backups</Label>
                  <Switch
                    id="compressionEnabled"
                    checked={config.database.compressionEnabled}
                    onCheckedChange={(checked) => updateConfig('database', 'compressionEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="encryptionEnabled">Encriptación de Datos</Label>
                  <Switch
                    id="encryptionEnabled"
                    checked={config.database.encryptionEnabled}
                    onCheckedChange={(checked) => updateConfig('database', 'encryptionEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Rendimiento */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxConcurrentUsers">Usuarios Concurrentes Máximos</Label>
                  <Input
                    id="maxConcurrentUsers"
                    type="number"
                    value={config.performance.maxConcurrentUsers}
                    onChange={(e) => updateConfig('performance', 'maxConcurrentUsers', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionCleanupInterval">Intervalo de Limpieza (minutos)</Label>
                  <Input
                    id="sessionCleanupInterval"
                    type="number"
                    value={config.performance.sessionCleanupInterval}
                    onChange={(e) => updateConfig('performance', 'sessionCleanupInterval', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logLevel">Nivel de Logs</Label>
                <Select
                  value={config.performance.logLevel}
                  onValueChange={(value) => updateConfig('performance', 'logLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="cacheEnabled">Cache Habilitado</Label>
                <Switch
                  id="cacheEnabled"
                  checked={config.performance.cacheEnabled}
                  onCheckedChange={(checked) => updateConfig('performance', 'cacheEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de Permisos */}
        <TabsContent value="permissions" className="space-y-4">
          <RoleManager />
        </TabsContent>
      </Tabs>

      {/* Dialog de Backup */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Backup del Sistema</DialogTitle>
            <DialogDescription>
              Se creará un backup completo de la base de datos y configuración del sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackupDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleBackup}>
              <Download className="w-4 h-4 mr-2" />
              Crear Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedSettings;
