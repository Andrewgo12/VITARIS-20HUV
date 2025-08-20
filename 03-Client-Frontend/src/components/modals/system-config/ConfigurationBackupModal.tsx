/**
 * Configuration Backup Modal - VITAL RED
 * Modal para respaldar y restaurar configuraciones del sistema
 */

import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Upload, 
  Save, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { apiService } from '@/services/api';
import { useNotifications } from '@/components/ui/notification-system';

interface ConfigurationBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'backup' | 'restore';
  currentConfig?: any;
}

interface BackupItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  size: string;
  version: string;
}

const ConfigurationBackupModal: React.FC<ConfigurationBackupModalProps> = ({
  isOpen,
  onClose,
  mode,
  currentConfig
}) => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backupName, setBackupName] = useState('');
  const [backupDescription, setBackupDescription] = useState('');
  const [availableBackups, setAvailableBackups] = useState<BackupItem[]>([
    {
      id: '1',
      name: 'Config_Backup_2025_01_19',
      description: 'Configuración completa antes de actualización',
      createdAt: '2025-01-19T10:30:00Z',
      size: '2.5 MB',
      version: '2.0.0'
    },
    {
      id: '2', 
      name: 'Config_Backup_2025_01_15',
      description: 'Configuración inicial de producción',
      createdAt: '2025-01-15T14:20:00Z',
      size: '2.3 MB',
      version: '1.9.5'
    }
  ]);
  const [selectedBackup, setSelectedBackup] = useState<string>('');

  const handleCreateBackup = async () => {
    if (!backupName.trim()) {
      addNotification({
        type: 'warning',
        title: 'Nombre requerido',
        message: 'Por favor ingrese un nombre para el respaldo.',
        priority: 'medium'
      });
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // Simulate backup progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create backup via API
      const backupData = {
        name: backupName,
        description: backupDescription,
        config: currentConfig,
        timestamp: new Date().toISOString()
      };

      const response = await apiService.createConfigBackup(backupData);

      clearInterval(progressInterval);
      setProgress(100);

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Respaldo creado',
          message: 'La configuración se ha respaldado exitosamente.',
          priority: 'medium'
        });

        // Reset form
        setBackupName('');
        setBackupDescription('');
        onClose();
      } else {
        throw new Error(response.error || 'Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      addNotification({
        type: 'warning',
        title: 'Error en respaldo',
        message: 'No se pudo crear el respaldo de configuración.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) {
      addNotification({
        type: 'warning',
        title: 'Selección requerida',
        message: 'Por favor seleccione un respaldo para restaurar.',
        priority: 'medium'
      });
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // Simulate restore progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      const response = await apiService.restoreConfigBackup(selectedBackup);

      clearInterval(progressInterval);
      setProgress(100);

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Configuración restaurada',
          message: 'La configuración se ha restaurado exitosamente.',
          priority: 'medium'
        });

        onClose();
      } else {
        throw new Error(response.error || 'Failed to restore backup');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      addNotification({
        type: 'warning',
        title: 'Error en restauración',
        message: 'No se pudo restaurar la configuración.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'backup' ? (
              <>
                <Download className="w-5 h-5" />
                Crear Respaldo de Configuración
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Restaurar Configuración
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'backup' 
              ? 'Crear un respaldo de la configuración actual del sistema'
              : 'Restaurar la configuración desde un respaldo existente'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {mode === 'backup' ? (
            // Backup Mode
            <div className="space-y-4">
              <div>
                <Label htmlFor="backupName">Nombre del Respaldo</Label>
                <Input
                  id="backupName"
                  value={backupName}
                  onChange={(e) => setBackupName(e.target.value)}
                  placeholder="Ej: Config_Backup_2025_01_19"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="backupDescription">Descripción</Label>
                <Textarea
                  id="backupDescription"
                  value={backupDescription}
                  onChange={(e) => setBackupDescription(e.target.value)}
                  placeholder="Descripción opcional del respaldo..."
                  disabled={loading}
                  rows={3}
                />
              </div>

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Creando respaldo...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </div>
          ) : (
            // Restore Mode
            <div className="space-y-4">
              <div>
                <Label>Respaldos Disponibles</Label>
                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                  {availableBackups.map((backup) => (
                    <div
                      key={backup.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedBackup === backup.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedBackup(backup.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{backup.name}</h4>
                          <p className="text-sm text-gray-600">{backup.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatDate(backup.createdAt)}
                            </span>
                            <Badge variant="outline">{backup.version}</Badge>
                            <span className="text-xs text-gray-500">{backup.size}</span>
                          </div>
                        </div>
                        {selectedBackup === backup.id && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Restaurando configuración...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {selectedBackup && !loading && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Advertencia
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    La restauración sobrescribirá la configuración actual del sistema.
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          {mode === 'backup' ? (
            <Button onClick={handleCreateBackup} disabled={loading || !backupName.trim()}>
              <Save className="w-4 h-4 mr-2" />
              Crear Respaldo
            </Button>
          ) : (
            <Button 
              onClick={handleRestoreBackup} 
              disabled={loading || !selectedBackup}
              variant="destructive"
            >
              <Upload className="w-4 h-4 mr-2" />
              Restaurar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationBackupModal;
