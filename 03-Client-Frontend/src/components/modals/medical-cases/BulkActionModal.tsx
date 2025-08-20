import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  Clock,
  X,
  Settings,
} from "lucide-react";

interface BulkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCases: string[];
  onAction: (action: {
    type: 'bulk_accept' | 'bulk_reject' | 'bulk_priority' | 'bulk_assign' | 'bulk_export';
    priority?: 'alta' | 'media' | 'baja';
    assignee?: string;
    comments?: string;
  }) => void;
}

export default function BulkActionModal({
  isOpen,
  onClose,
  selectedCases,
  onAction,
}: BulkActionModalProps) {
  const [selectedActionType, setSelectedActionType] = useState<string | null>(null);
  const [priority, setPriority] = useState<'alta' | 'media' | 'baja'>('media');
  const [assignee, setAssignee] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedActionType) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      onAction({
        type: selectedActionType as any,
        priority: selectedActionType === 'bulk_priority' ? priority : undefined,
        assignee: selectedActionType === 'bulk_assign' ? assignee : undefined,
        comments: comments || undefined,
      });
      
      // Reset form
      setSelectedActionType(null);
      setPriority('media');
      setAssignee("");
      setComments("");
    } catch (error) {
      console.error('Error executing bulk action:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'bulk_accept': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'bulk_reject': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'bulk_priority': return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case 'bulk_assign': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
      case 'bulk_export': return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'bulk_accept': return <CheckCircle className="w-5 h-5" />;
      case 'bulk_reject': return <XCircle className="w-5 h-5" />;
      case 'bulk_priority': return <AlertTriangle className="w-5 h-5" />;
      case 'bulk_assign': return <Users className="w-5 h-5" />;
      case 'bulk_export': return <FileText className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'bulk_accept': return 'Aceptar en lote';
      case 'bulk_reject': return 'Rechazar en lote';
      case 'bulk_priority': return 'Cambiar prioridad';
      case 'bulk_assign': return 'Asignar médico';
      case 'bulk_export': return 'Exportar casos';
      default: return '';
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case 'bulk_accept': return 'Aceptar todos los casos seleccionados para traslado';
      case 'bulk_reject': return 'Rechazar todos los casos seleccionados';
      case 'bulk_priority': return 'Cambiar la prioridad de todos los casos seleccionados';
      case 'bulk_assign': return 'Asignar un médico evaluador específico';
      case 'bulk_export': return 'Exportar los casos seleccionados a Excel/PDF';
      default: return '';
    }
  };

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isFormValid = () => {
    if (!selectedActionType) return false;
    if (selectedActionType === 'bulk_reject' && !comments.trim()) return false;
    if (selectedActionType === 'bulk_assign' && !assignee.trim()) return false;
    return true;
  };

  const mockMedicalEvaluators = [
    "Dr. Ana Rodríguez - Cardiología",
    "Dr. Carlos Mendoza - Neurología", 
    "Dra. María González - Medicina Interna",
    "Dr. Roberto Silva - Ortopedia",
    "Dra. Laura Hernández - Ginecología"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Acciones Masivas - {selectedCases.length} casos seleccionados
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selection Summary */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  Casos seleccionados
                </h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-blue-700">
                <Badge className="bg-blue-200 text-blue-800">
                  {selectedCases.length} casos
                </Badge>
                <span>Se aplicará la acción a todos los casos seleccionados</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Selection */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Seleccione una acción:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['bulk_accept', 'bulk_reject', 'bulk_priority', 'bulk_assign', 'bulk_export'].map((action) => (
                <button
                  key={action}
                  onClick={() => setSelectedActionType(action)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedActionType === action
                      ? getActionColor(action) + ' border-current'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    {getActionIcon(action)}
                    <span className="font-medium">{getActionText(action)}</span>
                    <span className="text-xs text-gray-600">
                      {getActionDescription(action)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection (for bulk_priority) */}
          {selectedActionType === 'bulk_priority' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Seleccionar nueva prioridad:
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {['alta', 'media', 'baja'].map((priorityLevel) => (
                  <button
                    key={priorityLevel}
                    onClick={() => setPriority(priorityLevel as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      priority === priorityLevel
                        ? getPriorityColor(priorityLevel) + ' border-current'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-center">
                      <span className="font-medium capitalize">{priorityLevel}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assignee Selection (for bulk_assign) */}
          {selectedActionType === 'bulk_assign' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Asignar a médico evaluador:
              </h4>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar médico evaluador...</option>
                {mockMedicalEvaluators.map((evaluator, index) => (
                  <option key={index} value={evaluator}>
                    {evaluator}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Export Options (for bulk_export) */}
          {selectedActionType === 'bulk_export' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Formato de exportación:
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-2 border-green-200 bg-green-50 cursor-pointer hover:bg-green-100">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <span className="font-medium text-green-800">Excel (.xlsx)</span>
                    <p className="text-xs text-green-600 mt-1">Datos tabulares completos</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-red-200 bg-red-50 cursor-pointer hover:bg-red-100">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <span className="font-medium text-red-800">PDF</span>
                    <p className="text-xs text-red-600 mt-1">Reporte formateado</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Comments Section */}
          {(selectedActionType === 'bulk_reject' || selectedActionType === 'bulk_accept' || selectedActionType === 'bulk_assign') && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {selectedActionType === 'bulk_reject' 
                  ? 'Motivo del rechazo (requerido)' 
                  : 'Comentarios (opcional)'}
              </h4>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={
                  selectedActionType === 'bulk_reject' 
                    ? 'Especifique el motivo del rechazo masivo...'
                    : selectedActionType === 'bulk_assign'
                    ? 'Instrucciones especiales para el médico asignado...'
                    : 'Observaciones para el procesamiento masivo...'
                }
                rows={3}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                {comments.length}/300 caracteres
              </p>
            </div>
          )}

          {/* Action Summary */}
          {selectedActionType && (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Resumen de la acción masiva:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {getActionIcon(selectedActionType)}
                    <span className="font-medium">{getActionText(selectedActionType)}</span>
                  </div>
                  <p>• Casos afectados: <span className="font-medium">{selectedCases.length}</span></p>
                  {selectedActionType === 'bulk_priority' && (
                    <p>• Nueva prioridad: <span className="font-medium capitalize">{priority}</span></p>
                  )}
                  {selectedActionType === 'bulk_assign' && assignee && (
                    <p>• Asignado a: <span className="font-medium">{assignee}</span></p>
                  )}
                  {comments && (
                    <p>• Comentarios: <span className="italic">"{comments}"</span></p>
                  )}
                  <p className="text-gray-600 mt-3">
                    ⚠️ Esta acción se aplicará a todos los casos seleccionados y no se puede deshacer.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid() || loading}
            className={
              selectedActionType === 'bulk_accept' ? 'bg-green-600 hover:bg-green-700' :
              selectedActionType === 'bulk_reject' ? 'bg-red-600 hover:bg-red-700' :
              'bg-blue-600 hover:bg-blue-700'
            }
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <>
                {getActionIcon(selectedActionType || '')}
                <span className="ml-2">
                  Ejecutar acción masiva
                </span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
