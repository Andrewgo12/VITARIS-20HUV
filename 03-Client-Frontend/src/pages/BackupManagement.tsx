/**
 * Backup Management for VITAL RED - Administrator View
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Database,
  Download,
  Upload,
  Trash2,
  ArrowLeft,
  Calendar,
  HardDrive,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import { apiService } from "@/services/api";
import { useNotifications } from "@/components/ui/notification-system";

interface BackupItem {
  id: string;
  filename: string;
  type: 'full' | 'incremental' | 'differential';
  size: number;
  createdAt: string;
  status: 'completed' | 'in_progress' | 'failed';
  description?: string;
  duration?: number;
}

interface BackupStats {
  totalBackups: number;
  totalSize: number;
  lastBackup: string;
  nextScheduled: string;
  successRate: number;
  averageSize: number;
}

const BackupManagement: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [stats, setStats] = useState<BackupStats>({
    totalBackups: 0,
    totalSize: 0,
    lastBackup: '',
    nextScheduled: '',
    successRate: 0,
    averageSize: 0,
  });
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    loadBackupData();
  }, []);

  const loadBackupData = async () => {
    setLoading(true);
    try {
      // Real API call to get backups
      const response = await apiService.getBackups();

      if (response.success && response.data) {
        const data = response.data;

        // Convert API response to BackupItem format
        const backupItems: BackupItem[] = data.backups.map((backup: any) => ({
          id: backup.id,
          filename: backup.filename,
          type: backup.type,
          size: parseFloat(backup.size.replace(' MB', '')) * 1024 * 1024, // Convert MB to bytes
          createdAt: backup.created_at,
          status: backup.status,
          description: `Respaldo ${backup.type} - ${backup.records_count} registros`,
          duration: parseDuration(backup.duration)
        }));

        const backupStats: BackupStats = {
          totalBackups: data.total,
          totalSize: parseFloat(data.storage_used.replace(' MB', '')) * 1024 * 1024,
          lastBackup: backupItems.length > 0 ? backupItems[0].createdAt : '',
          nextScheduled: data.next_scheduled,
          successRate: calculateSuccessRate(backupItems),
          averageSize: backupItems.length > 0 ?
            backupItems.reduce((sum, backup) => sum + backup.size, 0) / backupItems.length : 0
        };

        setBackups(backupItems);
        setStats(backupStats);

      } else {
        throw new Error(response.error || 'Failed to load backups');
      }
    } catch (error) {
      console.error('Error loading backup data:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando respaldos',
        message: 'No se pudo cargar la información de respaldos.',
        priority: 'medium'
      });

      // Set empty data on error
      setBackups([]);
      setStats({
        totalBackups: 0,
        totalSize: 0,
        lastBackup: '',
        nextScheduled: '',
        successRate: 0,
        averageSize: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)m\s*(\d+)s/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
  };

  const calculateSuccessRate = (backups: BackupItem[]): number => {
    if (backups.length === 0) return 0;
    const successful = backups.filter(b => b.status === 'completed').length;
    return Math.round((successful / backups.length) * 100);
  };

  const createBackup = async (type: 'full' | 'incremental') => {
    setIsCreatingBackup(true);
    setBackupProgress(0);

    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Real API call to create backup
      const response = await apiService.createBackup({
        type: type,
        description: `Respaldo ${type === 'full' ? 'completo' : 'incremental'} manual`
      });

      clearInterval(progressInterval);
      setBackupProgress(100);

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Respaldo iniciado',
          message: `Respaldo ${type === 'full' ? 'completo' : 'incremental'} creado exitosamente.`,
          priority: 'medium'
        });

        // Reload backup data to show new backup
        await loadBackupData();
      } else {
        throw new Error(response.error || 'Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el respaldo',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingBackup(false);
      setBackupProgress(0);
    }
  };

  const deleteBackup = async (backup: BackupItem) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBackups(prev => prev.filter(b => b.id !== backup.id));
      setShowDeleteDialog(false);
      setSelectedBackup(null);
      
      toast({
        title: 'Respaldo eliminado',
        description: 'El respaldo se ha eliminado correctamente',
      });
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el respaldo',
        variant: 'destructive',
      });
    }
  };

  const restoreBackup = async (backup: BackupItem) => {
    setIsRestoring(true);
    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setShowRestoreDialog(false);
      setSelectedBackup(null);
      
      toast({
        title: 'Restauración completada',
        description: 'El sistema se ha restaurado correctamente',
      });
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast({
        title: 'Error',
        description: 'No se pudo restaurar el respaldo',
        variant: 'destructive',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const downloadBackup = (backup: BackupItem) => {
    // Simulate download
    toast({
      title: 'Descarga iniciada',
      description: `Descargando ${backup.filename}`,
    });
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'bg-purple-100 text-purple-800';
      case 'incremental': return 'bg-blue-100 text-blue-800';
      case 'differential': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando gestión de respaldos...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Respaldos</h1>
                <p className="text-gray-600">Administrar respaldos y restauraciones del sistema</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select onValueChange={(value) => createBackup(value as 'full' | 'incremental')}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Crear respaldo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Respaldo Completo</SelectItem>
                  <SelectItem value="incremental">Respaldo Incremental</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={loadBackupData} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Backup Progress */}
        {isCreatingBackup && (
          <Alert className="mb-6">
            <Database className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Creando respaldo... {backupProgress}%</span>
                <div className="w-32">
                  <Progress value={backupProgress} className="h-2" />
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Respaldos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBackups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <HardDrive className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tamaño Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Último Respaldo</p>
                  <p className="text-lg font-bold text-gray-900">
                    {format(new Date(stats.lastBackup), 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backup List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Lista de Respaldos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Archivo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{backup.filename}</div>
                        <div className="text-sm text-gray-500">{backup.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(backup.type)}>
                        {backup.type === 'full' ? 'Completo' : 
                         backup.type === 'incremental' ? 'Incremental' : 'Diferencial'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(backup.size)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status === 'completed' ? 'Completado' :
                         backup.status === 'in_progress' ? 'En Progreso' : 'Fallido'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {backup.duration ? formatDuration(backup.duration) : '-'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(backup.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadBackup(backup)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBackup(backup);
                            setShowRestoreDialog(true);
                          }}
                          disabled={backup.status !== 'completed'}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBackup(backup);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar el respaldo "{selectedBackup?.filename}"?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedBackup && deleteBackup(selectedBackup)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Restauración</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea restaurar el sistema desde el respaldo "{selectedBackup?.filename}"?
              Esto sobrescribirá todos los datos actuales.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => selectedBackup && restoreBackup(selectedBackup)}
              disabled={isRestoring}
            >
              {isRestoring ? 'Restaurando...' : 'Restaurar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BackupManagement;
