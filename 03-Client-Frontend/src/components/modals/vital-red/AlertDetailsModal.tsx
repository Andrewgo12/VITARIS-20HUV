import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  XCircle,
  Bell,
  Clock,
  User,
  CheckCircle,
  X,
} from "lucide-react";

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface AlertDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: SystemAlert | null;
}

export default function AlertDetailsModal({ isOpen, onClose, alert }: AlertDetailsModalProps) {
  if (!alert) return null;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'info':
        return <Bell className="w-8 h-8 text-blue-500" />;
      default:
        return <Bell className="w-8 h-8" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleMarkAsRead = () => {
    // Here you would typically make an API call to mark the alert as read
    console.log('Marking alert as read:', alert.id);
    onClose();
  };

  const handleDismiss = () => {
    // Here you would typically make an API call to dismiss the alert
    console.log('Dismissing alert:', alert.id);
    onClose();
  };

  const getRecommendedActions = (type: string, title: string) => {
    if (type === 'error' && title.includes('AI')) {
      return [
        'Verificar conectividad del módulo AI',
        'Revisar logs del sistema',
        'Contactar soporte técnico si persiste',
        'Procesar solicitudes manualmente mientras tanto'
      ];
    }
    if (type === 'warning' && title.includes('volumen')) {
      return [
        'Asignar más médicos evaluadores',
        'Priorizar casos urgentes',
        'Revisar capacidad del sistema',
        'Notificar a supervisores'
      ];
    }
    if (type === 'info' && title.includes('mantenimiento')) {
      return [
        'Notificar a todos los usuarios',
        'Programar respaldo de datos',
        'Preparar comunicado oficial',
        'Verificar sistemas alternativos'
      ];
    }
    return [
      'Revisar detalles del problema',
      'Tomar acción según protocolo',
      'Documentar la resolución',
      'Monitorear situación'
    ];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getAlertIcon(alert.type)}
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-gray-900">
                Detalles de la Alerta
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getPriorityColor(alert.priority)}>
                  Prioridad: {alert.priority.toUpperCase()}
                </Badge>
                <Badge className={getTypeColor(alert.type)}>
                  {alert.type.toUpperCase()}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {alert.title}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {alert.message}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(alert.timestamp).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>Sistema VITAL RED</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Actions */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Acciones Recomendadas
              </h4>
              <ul className="space-y-2">
                {getRecommendedActions(alert.type, alert.title).map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Alert Timeline */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Cronología de la Alerta
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Alerta generada</p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">En revisión</p>
                    <p className="text-xs text-gray-500">Pendiente de acción</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Impact */}
          {alert.type === 'error' && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-red-900 mb-3">
                  Impacto en el Sistema
                </h4>
                <div className="space-y-2 text-sm text-red-800">
                  <p>• Funcionalidad afectada: Procesamiento automático de emails</p>
                  <p>• Usuarios impactados: Todos los médicos evaluadores</p>
                  <p>• Tiempo estimado de resolución: 30-60 minutos</p>
                  <p>• Solución temporal: Procesamiento manual disponible</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAsRead}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar como leída
          </Button>
          <Button variant="outline" onClick={handleDismiss}>
            Descartar alerta
          </Button>
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
