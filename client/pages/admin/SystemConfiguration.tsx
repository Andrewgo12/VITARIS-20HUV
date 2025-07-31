import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/components/ui/notification-system';
import { systemApi } from '@/services/api';
import {
  Settings,
  Hospital,
  Shield,
  Database,
  Bell,
  Smartphone,
  Wifi,
  Cloud,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Server,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Users,
  Activity,
  Zap,
  Cpu,
  HardDrive,
  Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  features: {
    telemedicine: boolean;
    aiAssistant: boolean;
    mobileApp: boolean;
    voiceCommands: boolean;
    biometricAuth: boolean;
    blockchain: boolean;
    iot: boolean;
    analytics: boolean;
  };
}

const SystemConfiguration: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchSystemConfig();
  }, []);

  const fetchSystemConfig = async () => {
    try {
      setLoading(true);
      const response = await systemApi.getConfig();
      
      if (response.success) {
        setConfig(response.data.config);
      }
    } catch (error) {
      console.error('Error fetching system config:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo cargar la configuración del sistema',
        priority: 'high'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (section: keyof SystemConfig, field: string, value: any) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    
    try {
      setSaving(true);
      const response = await systemApi.updateConfig(config);
      
      if (response.success) {
        setHasChanges(false);
        addNotification({
          type: 'success',
          title: 'Configuración Guardada',
          message: 'La configuración del sistema se ha actualizado correctamente',
          priority: 'medium'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error al Guardar',
        message: 'No se pudo guardar la configuración del sistema',
        priority: 'high'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      const response = await systemApi.createBackup();
      
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Backup Creado',
          message: 'El backup del sistema se ha creado exitosamente',
          priority: 'medium'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error en Backup',
        message: 'No se pudo crear el backup del sistema',
        priority: 'high'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando configuración del sistema...</span>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-lg text-gray-600">No se pudo cargar la configuración</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600">Administra la configuración general de VITARIS</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showAdvanced ? 'Ocultar Avanzado' : 'Mostrar Avanzado'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchSystemConfig}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Recargar
          </Button>
          <Button 
            size="sm" 
            onClick={handleSaveConfig}
            disabled={!hasChanges || saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {/* Changes Alert */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              Tienes cambios sin guardar. No olvides guardar la configuración.
            </span>
          </div>
        </motion.div>
      )}

      {/* Configuration Tabs */}
      <Tabs defaultValue="hospital" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hospital">Hospital</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="features">Características</TabsTrigger>
          <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="hospital">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hospital className="w-5 h-5 mr-2 text-blue-600" />
                Información del Hospital
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospital-name">Nombre del Hospital</Label>
                  <Input
                    id="hospital-name"
                    value={config.hospital.name}
                    onChange={(e) => handleConfigChange('hospital', 'name', e.target.value)}
                    placeholder="Nombre del hospital"
                  />
                </div>
                <div>
                  <Label htmlFor="hospital-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="hospital-email"
                      type="email"
                      value={config.hospital.email}
                      onChange={(e) => handleConfigChange('hospital', 'email', e.target.value)}
                      placeholder="email@hospital.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="hospital-phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="hospital-phone"
                      value={config.hospital.phone}
                      onChange={(e) => handleConfigChange('hospital', 'phone', e.target.value)}
                      placeholder="+57 (2) 555-0123"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="hospital-address">Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="hospital-address"
                      value={config.hospital.address}
                      onChange={(e) => handleConfigChange('hospital', 'address', e.target.value)}
                      placeholder="Dirección del hospital"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="w-5 h-5 mr-2 text-green-600" />
                  Configuración del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Versión del Sistema</Label>
                    <div className="flex items-center mt-1">
                      <Info className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="font-medium">{config.system.version}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Entorno</Label>
                    <div className="flex items-center mt-1">
                      <Globe className="w-4 h-4 text-green-500 mr-2" />
                      <span className="font-medium capitalize">{config.system.environment}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Estado del Sistema</Label>
                    <div className="flex items-center mt-1">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="font-medium">Operativo</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                      <div>
                        <Label>Modo de Mantenimiento</Label>
                        <p className="text-sm text-gray-600">Desactiva el acceso de usuarios durante mantenimiento</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.system.maintenanceMode}
                      onCheckedChange={(checked) => handleConfigChange('system', 'maintenanceMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="w-5 h-5 text-blue-500 mr-2" />
                      <div>
                        <Label>Backup Automático</Label>
                        <p className="text-sm text-gray-600">Realiza backups automáticos del sistema</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.system.backupEnabled}
                      onCheckedChange={(checked) => handleConfigChange('system', 'backupEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-purple-500 mr-2" />
                      <div>
                        <Label>Notificaciones del Sistema</Label>
                        <p className="text-sm text-gray-600">Habilita notificaciones automáticas</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.system.notificationsEnabled}
                      onCheckedChange={(checked) => handleConfigChange('system', 'notificationsEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Características del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Características Principales</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Monitor className="w-5 h-5 text-blue-500 mr-2" />
                      <div>
                        <Label>Telemedicina</Label>
                        <p className="text-sm text-gray-600">Consultas médicas virtuales</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.features.telemedicine}
                      onCheckedChange={(checked) => handleConfigChange('features', 'telemedicine', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="w-5 h-5 text-green-500 mr-2" />
                      <div>
                        <Label>Aplicación Móvil</Label>
                        <p className="text-sm text-gray-600">Acceso desde dispositivos móviles</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.features.mobileApp}
                      onCheckedChange={(checked) => handleConfigChange('features', 'mobileApp', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity className="w-5 h-5 text-purple-500 mr-2" />
                      <div>
                        <Label>Analytics</Label>
                        <p className="text-sm text-gray-600">Análisis y métricas avanzadas</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.features.analytics}
                      onCheckedChange={(checked) => handleConfigChange('features', 'analytics', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wifi className="w-5 h-5 text-orange-500 mr-2" />
                      <div>
                        <Label>IoT</Label>
                        <p className="text-sm text-gray-600">Dispositivos médicos conectados</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.features.iot}
                      onCheckedChange={(checked) => handleConfigChange('features', 'iot', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Características Avanzadas</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cpu className="w-5 h-5 text-red-500 mr-2" />
                      <div>
                        <Label>Asistente IA</Label>
                        <p className="text-sm text-gray-600">Inteligencia artificial médica</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.features.aiAssistant}
                      onCheckedChange={(checked) => handleConfigChange('features', 'aiAssistant', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-indigo-500 mr-2" />
                      <div>
                        <Label>Autenticación Biométrica</Label>
                        <p className="text-sm text-gray-600">Acceso por huella o facial</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.features.biometricAuth}
                      onCheckedChange={(checked) => handleConfigChange('features', 'biometricAuth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cloud className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <Label>Blockchain</Label>
                        <p className="text-sm text-gray-600">Registros médicos inmutables</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.features.blockchain}
                      onCheckedChange={(checked) => handleConfigChange('features', 'blockchain', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-teal-500 mr-2" />
                      <div>
                        <Label>Comandos de Voz</Label>
                        <p className="text-sm text-gray-600">Control por voz del sistema</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.features.voiceCommands}
                      onCheckedChange={(checked) => handleConfigChange('features', 'voiceCommands', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  Herramientas de Mantenimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Database className="w-5 h-5 text-blue-500 mr-2" />
                      <h3 className="font-medium">Backup del Sistema</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Crea una copia de seguridad completa del sistema
                    </p>
                    <Button onClick={handleCreateBackup} className="w-full">
                      <HardDrive className="w-4 h-4 mr-2" />
                      Crear Backup
                    </Button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <RefreshCw className="w-5 h-5 text-green-500 mr-2" />
                      <h3 className="font-medium">Reiniciar Servicios</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Reinicia todos los servicios del sistema
                    </p>
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reiniciar Servicios
                    </Button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="w-5 h-5 text-purple-500 mr-2" />
                      <h3 className="font-medium">Verificar Integridad</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Verifica la integridad de los datos del sistema
                    </p>
                    <Button variant="outline" className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verificar Sistema
                    </Button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-orange-500 mr-2" />
                      <h3 className="font-medium">Programar Mantenimiento</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Programa una ventana de mantenimiento
                    </p>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Programar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {showAdvanced && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Configuración Avanzada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="text-red-800 font-medium">
                        ⚠️ Zona de Peligro - Estas acciones pueden afectar el funcionamiento del sistema
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="destructive" className="w-full">
                      <Database className="w-4 h-4 mr-2" />
                      Limpiar Base de Datos
                    </Button>
                    <Button variant="destructive" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Restablecer Sistema
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfiguration;
