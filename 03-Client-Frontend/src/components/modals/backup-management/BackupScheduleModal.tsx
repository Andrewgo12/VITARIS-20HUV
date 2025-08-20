/**
 * Backup Schedule Modal - VITAL RED
 * Modal para configurar programación automática de respaldos
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Calendar, 
  Settings, 
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { apiService } from '@/services/api';
import { useNotifications } from '@/components/ui/notification-system';

interface BackupScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScheduleConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  retentionDays: number;
  includeFiles: boolean;
  includeDatabase: boolean;
  includeConfig: boolean;
  compressionLevel: 'low' | 'medium' | 'high';
  emailNotifications: boolean;
  notificationEmail: string;
}

const BackupScheduleModal: React.FC<BackupScheduleModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ScheduleConfig>({
    enabled: true,
    frequency: 'daily',
    time: '02:00',
    retentionDays: 30,
    includeFiles: true,
    includeDatabase: true,
    includeConfig: true,
    compressionLevel: 'medium',
    emailNotifications: true,
    notificationEmail: 'admin@hospital-ese.com'
  });

  useEffect(() => {
    if (isOpen) {
      loadScheduleConfig();
    }
  }, [isOpen]);

  const loadScheduleConfig = async () => {
    setLoading(true);
    try {
      const response = await apiService.getBackupSchedule();
      if (response.success && response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Error loading backup schedule:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando configuración',
        message: 'No se pudo cargar la configuración de respaldos.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      const response = await apiService.updateBackupSchedule(config);
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Configuración guardada',
          message: 'La programación de respaldos se ha actualizado.',
          priority: 'medium'
        });
        onClose();
      } else {
        throw new Error(response.error || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving backup schedule:', error);
      addNotification({
        type: 'warning',
        title: 'Error guardando configuración',
        message: 'No se pudo guardar la configuración de respaldos.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const getNextBackupTime = () => {
    const now = new Date();
    const [hours, minutes] = config.time.split(':').map(Number);
    
    let nextBackup = new Date();
    nextBackup.setHours(hours, minutes, 0, 0);
    
    if (config.frequency === 'daily') {
      if (nextBackup <= now) {
        nextBackup.setDate(nextBackup.getDate() + 1);
      }
    } else if (config.frequency === 'weekly' && config.dayOfWeek !== undefined) {
      const daysUntilNext = (config.dayOfWeek - now.getDay() + 7) % 7;
      if (daysUntilNext === 0 && nextBackup <= now) {
        nextBackup.setDate(nextBackup.getDate() + 7);
      } else {
        nextBackup.setDate(nextBackup.getDate() + daysUntilNext);
      }
    } else if (config.frequency === 'monthly' && config.dayOfMonth !== undefined) {
      nextBackup.setDate(config.dayOfMonth);
      if (nextBackup <= now) {
        nextBackup.setMonth(nextBackup.getMonth() + 1);
      }
    }
    
    return nextBackup.toLocaleString('es-ES');
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayIndex];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Programación de Respaldos Automáticos
          </DialogTitle>
          <DialogDescription>
            Configurar la programación automática de respaldos del sistema
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="schedule" className="flex-1 overflow-hidden">
          <TabsList>
            <TabsTrigger value="schedule">Programación</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6 overflow-y-auto max-h-96">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Estado de Respaldos Automáticos</h3>
                <p className="text-sm text-gray-600">
                  {config.enabled ? 'Los respaldos automáticos están habilitados' : 'Los respaldos automáticos están deshabilitados'}
                </p>
              </div>
              <Switch
                checked={config.enabled}
                onCheckedChange={(enabled) => setConfig({ ...config, enabled })}
              />
            </div>

            {config.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequency">Frecuencia</Label>
                    <select
                      id="frequency"
                      value={config.frequency}
                      onChange={(e) => setConfig({ ...config, frequency: e.target.value as ScheduleConfig['frequency'] })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      type="time"
                      value={config.time}
                      onChange={(e) => setConfig({ ...config, time: e.target.value })}
                    />
                  </div>
                </div>

                {config.frequency === 'weekly' && (
                  <div>
                    <Label>Día de la Semana</Label>
                    <div className="flex gap-2 mt-2">
                      {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <Button
                          key={day}
                          variant={config.dayOfWeek === day ? "default" : "outline"}
                          size="sm"
                          onClick={() => setConfig({ ...config, dayOfWeek: day })}
                        >
                          {getDayName(day).slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {config.frequency === 'monthly' && (
                  <div>
                    <Label htmlFor="dayOfMonth">Día del Mes</Label>
                    <Input
                      id="dayOfMonth"
                      type="number"
                      min="1"
                      max="31"
                      value={config.dayOfMonth || 1}
                      onChange={(e) => setConfig({ ...config, dayOfMonth: parseInt(e.target.value) })}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="retention">Retención (días)</Label>
                  <Input
                    id="retention"
                    type="number"
                    min="1"
                    max="365"
                    value={config.retentionDays}
                    onChange={(e) => setConfig({ ...config, retentionDays: parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Los respaldos se eliminarán automáticamente después de este período
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Próximo Respaldo</span>
                  </div>
                  <p className="text-blue-700 mt-1">{getNextBackupTime()}</p>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Contenido del Respaldo</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Base de Datos</Label>
                    <p className="text-sm text-gray-600">Incluir todas las tablas y datos</p>
                  </div>
                  <Switch
                    checked={config.includeDatabase}
                    onCheckedChange={(includeDatabase) => setConfig({ ...config, includeDatabase })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Archivos del Sistema</Label>
                    <p className="text-sm text-gray-600">Incluir archivos subidos y documentos</p>
                  </div>
                  <Switch
                    checked={config.includeFiles}
                    onCheckedChange={(includeFiles) => setConfig({ ...config, includeFiles })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Configuración</Label>
                    <p className="text-sm text-gray-600">Incluir configuraciones del sistema</p>
                  </div>
                  <Switch
                    checked={config.includeConfig}
                    onCheckedChange={(includeConfig) => setConfig({ ...config, includeConfig })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="compression">Nivel de Compresión</Label>
              <select
                id="compression"
                value={config.compressionLevel}
                onChange={(e) => setConfig({ ...config, compressionLevel: e.target.value as ScheduleConfig['compressionLevel'] })}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="low">Bajo (más rápido, mayor tamaño)</option>
                <option value="medium">Medio (balanceado)</option>
                <option value="high">Alto (más lento, menor tamaño)</option>
              </select>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Notificaciones por Email</h3>
                <p className="text-sm text-gray-600">
                  Recibir notificaciones sobre el estado de los respaldos
                </p>
              </div>
              <Switch
                checked={config.emailNotifications}
                onCheckedChange={(emailNotifications) => setConfig({ ...config, emailNotifications })}
              />
            </div>

            {config.emailNotifications && (
              <div>
                <Label htmlFor="notificationEmail">Email de Notificaciones</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={config.notificationEmail}
                  onChange={(e) => setConfig({ ...config, notificationEmail: e.target.value })}
                  placeholder="admin@hospital-ese.com"
                />
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-medium">Se enviarán notificaciones para:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Respaldos completados exitosamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Errores en respaldos</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Advertencias de espacio en disco</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSaveConfig} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Configuración
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackupScheduleModal;
