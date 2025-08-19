import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import {
  Download,
  Upload,
  RefreshCw,
  Database,
  HardDrive,
  Cloud,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Play,
  Pause,
  Settings,
  FileText,
  Calendar,
  Trash2,
  Eye,
  Copy,
} from "lucide-react";

export interface BackupItem {
  id: string;
  name: string;
  type: "full" | "incremental" | "differential";
  size: string;
  date: Date;
  status: "completed" | "in_progress" | "failed" | "scheduled";
  location: "local" | "cloud" | "external";
  description?: string;
  duration?: number;
  checksum?: string;
}

export interface BackupConfig {
  autoBackup: boolean;
  frequency: "hourly" | "daily" | "weekly" | "monthly";
  retentionDays: number;
  compression: boolean;
  encryption: boolean;
  location: "local" | "cloud" | "both";
  maxBackups: number;
}

const mockBackups: BackupItem[] = [
  {
    id: "backup_001",
    name: "Backup Completo - Sistema Principal",
    type: "full",
    size: "2.4 GB",
    date: new Date("2024-01-15T02:00:00"),
    status: "completed",
    location: "cloud",
    description: "Backup completo de base de datos y archivos del sistema",
    duration: 45,
    checksum: "sha256:a1b2c3d4e5f6...",
  },
  {
    id: "backup_002",
    name: "Backup Incremental - Datos Médicos",
    type: "incremental",
    size: "156 MB",
    date: new Date("2024-01-15T14:00:00"),
    status: "completed",
    location: "local",
    description:
      "Backup incremental de historias clínicas y datos de pacientes",
    duration: 8,
    checksum: "sha256:f6e5d4c3b2a1...",
  },
  {
    id: "backup_003",
    name: "Backup Programado - Noche",
    type: "full",
    size: "2.1 GB",
    date: new Date("2024-01-16T02:00:00"),
    status: "scheduled",
    location: "cloud",
    description: "Backup automático programado para las 2:00 AM",
  },
  {
    id: "backup_004",
    name: "Backup Manual - Configuración",
    type: "differential",
    size: "45 MB",
    date: new Date("2024-01-15T16:30:00"),
    status: "in_progress",
    location: "local",
    description: "Backup de configuraciones del sistema",
    duration: 3,
  },
];

const defaultConfig: BackupConfig = {
  autoBackup: true,
  frequency: "daily",
  retentionDays: 30,
  compression: true,
  encryption: true,
  location: "cloud",
  maxBackups: 10,
};

export const BackupSystem: React.FC = () => {
  const [backups, setBackups] = useState<BackupItem[]>(mockBackups);
  const [config, setConfig] = useState<BackupConfig>(defaultConfig);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(null);
  const [backupProgress, setBackupProgress] = useState(0);

  const [newBackup, setNewBackup] = useState({
    name: "",
    type: "full" as BackupItem["type"],
    location: "cloud" as BackupItem["location"],
    description: "",
  });

  // Simular progreso de backup
  useEffect(() => {
    if (isCreatingBackup) {
      const interval = setInterval(() => {
        setBackupProgress((prev) => {
          if (prev >= 100) {
            setIsCreatingBackup(false);
            // Agregar nuevo backup a la lista
            const backup: BackupItem = {
              id: `backup_${Date.now()}`,
              name: newBackup.name || "Backup Manual",
              type: newBackup.type,
              size: `${(Math.random() * 2 + 0.5).toFixed(1)} GB`,
              date: new Date(),
              status: "completed",
              location: newBackup.location,
              description: newBackup.description,
              duration: Math.floor(Math.random() * 30 + 10),
              checksum: `sha256:${Math.random().toString(36).substring(2, 15)}...`,
            };
            setBackups((prev) => [backup, ...prev]);
            setShowCreateDialog(false);
            setNewBackup({
              name: "",
              type: "full",
              location: "cloud",
              description: "",
            });
            return 0;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isCreatingBackup, newBackup]);

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);
  };

  const handleDeleteBackup = (id: string) => {
    setBackups((prev) => prev.filter((backup) => backup.id !== id));
  };

  const handleRestoreBackup = async (backup: BackupItem) => {
    // Simular proceso de restauración
    console.log("Restaurando backup:", backup.name);
    setShowRestoreDialog(false);
    setSelectedBackup(null);
  };

  const getStatusIcon = (status: BackupItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <X className="w-4 h-4 text-red-500" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: BackupItem["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "info";
      case "failed":
        return "destructive";
      case "scheduled":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getLocationIcon = (location: BackupItem["location"]) => {
    switch (location) {
      case "cloud":
        return <Cloud className="w-4 h-4" />;
      case "local":
        return <HardDrive className="w-4 h-4" />;
      case "external":
        return <Database className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: BackupItem["type"]) => {
    switch (type) {
      case "full":
        return "default";
      case "incremental":
        return "secondary";
      case "differential":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Sistema de Backup
          </h2>
          <p className="text-muted-foreground">
            Gestiona copias de seguridad y restauración del sistema
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Download className="w-4 h-4 mr-2" />
            Crear Backup
          </Button>
        </div>
      </div>

      {/* Estado del sistema */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
            <p className="text-xs text-muted-foreground">
              {backups.filter((b) => b.status === "completed").length}{" "}
              completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espacio Usado</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2 GB</div>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h</div>
            <p className="text-xs text-muted-foreground">Hace 2 horas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Activo</div>
            <p className="text-xs text-muted-foreground">Sistema operativo</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de backups */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Backups</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(backup.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{backup.name}</h4>
                        <Badge variant={getTypeColor(backup.type)}>
                          {backup.type}
                        </Badge>
                        <Badge variant="outline">
                          {getLocationIcon(backup.location)}
                          <span className="ml-1">{backup.location}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{backup.date.toLocaleString()}</span>
                        <span>{backup.size}</span>
                        {backup.duration && <span>{backup.duration} min</span>}
                      </div>
                      {backup.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {backup.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(backup.status) as any}>
                      {backup.status}
                    </Badge>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>

                      {backup.status === "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBackup(backup);
                            setShowRestoreDialog(true);
                          }}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBackup(backup.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Dialog para crear backup */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Backup</DialogTitle>
            <DialogDescription>
              Configura los parámetros para el nuevo backup del sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backupName">Nombre del Backup</Label>
              <Input
                id="backupName"
                value={newBackup.name}
                onChange={(e) =>
                  setNewBackup((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Backup Manual - Sistema"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backupType">Tipo de Backup</Label>
              <Select
                value={newBackup.type}
                onValueChange={(value: BackupItem["type"]) =>
                  setNewBackup((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Completo</SelectItem>
                  <SelectItem value="incremental">Incremental</SelectItem>
                  <SelectItem value="differential">Diferencial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backupLocation">Ubicación</Label>
              <Select
                value={newBackup.location}
                onValueChange={(value: BackupItem["location"]) =>
                  setNewBackup((prev) => ({ ...prev, location: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="cloud">Nube</SelectItem>
                  <SelectItem value="external">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backupDescription">Descripción</Label>
              <Textarea
                id="backupDescription"
                value={newBackup.description}
                onChange={(e) =>
                  setNewBackup((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descripción opcional del backup"
                rows={3}
              />
            </div>

            {isCreatingBackup && (
              <div className="space-y-2">
                <Label>Progreso del Backup</Label>
                <Progress value={backupProgress} />
                <p className="text-sm text-muted-foreground">
                  {Math.round(backupProgress)}% completado
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={isCreatingBackup}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup || !newBackup.name}
            >
              {isCreatingBackup ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Crear Backup
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para restaurar backup */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restaurar Backup</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres restaurar este backup? Esta acción
              sobrescribirá los datos actuales.
            </DialogDescription>
          </DialogHeader>

          {selectedBackup && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium">{selectedBackup.name}</h4>
                <div className="text-sm text-muted-foreground mt-1">
                  <p>Fecha: {selectedBackup.date.toLocaleString()}</p>
                  <p>Tamaño: {selectedBackup.size}</p>
                  <p>Tipo: {selectedBackup.type}</p>
                  <p>Ubicación: {selectedBackup.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Esta acción no se puede deshacer. Se recomienda crear un
                  backup actual antes de proceder.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRestoreDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedBackup && handleRestoreBackup(selectedBackup)
              }
            >
              <Upload className="w-4 h-4 mr-2" />
              Restaurar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BackupSystem;
