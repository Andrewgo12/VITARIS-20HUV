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
  Clock,
  User,
  FileText,
  X,
} from "lucide-react";

interface MedicalCase {
  id: string;
  patientName: string;
  documentNumber: string;
  age: number;
  gender: string;
  diagnosis: string;
  specialty: string;
  referringPhysician: string;
  referringInstitution: string;
  priority: 'alta' | 'media' | 'baja';
  status: string;
  receivedDate: string;
  dueDate: string;
  attachments: number;
  aiExtracted: boolean;
}

interface QuickDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicalCase: MedicalCase | null;
  onDecision: (decision: {
    action: 'accept' | 'reject' | 'request_info';
    comments: string;
    priority?: 'alta' | 'media' | 'baja';
  }) => void;
}

export default function QuickDecisionModal({
  isOpen,
  onClose,
  medicalCase,
  onDecision,
}: QuickDecisionModalProps) {
  const [selectedAction, setSelectedAction] = useState<'accept' | 'reject' | 'request_info' | null>(null);
  const [comments, setComments] = useState("");
  const [priority, setPriority] = useState<'alta' | 'media' | 'baja'>('media');
  const [loading, setLoading] = useState(false);

  if (!medicalCase) return null;

  const handleSubmit = async () => {
    if (!selectedAction) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onDecision({
        action: selectedAction,
        comments,
        priority: selectedAction === 'accept' ? priority : undefined,
      });
      
      // Reset form
      setSelectedAction(null);
      setComments("");
      setPriority('media');
    } catch (error) {
      console.error('Error submitting decision:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'accept': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'reject': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'request_info': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'accept': return <CheckCircle className="w-5 h-5" />;
      case 'reject': return <XCircle className="w-5 h-5" />;
      case 'request_info': return <AlertTriangle className="w-5 h-5" />;
      default: return null;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'accept': return 'Aceptar Traslado';
      case 'reject': return 'Rechazar Traslado';
      case 'request_info': return 'Solicitar Información';
      default: return '';
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case 'accept': return 'El paciente será trasladado al HUV para atención especializada';
      case 'reject': return 'El traslado será rechazado y se notificará a la EPS remitente';
      case 'request_info': return 'Se solicitará información adicional antes de tomar una decisión';
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

  const getCommentPlaceholder = (action: string) => {
    switch (action) {
      case 'accept': return 'Observaciones para el traslado (opcional)...';
      case 'reject': return 'Motivo del rechazo (requerido)...';
      case 'request_info': return 'Especifique qué información adicional necesita...';
      default: return 'Comentarios...';
    }
  };

  const isFormValid = () => {
    if (!selectedAction) return false;
    if (selectedAction === 'reject' && !comments.trim()) return false;
    if (selectedAction === 'request_info' && !comments.trim()) return false;
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Decisión Rápida - Caso Médico
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information Summary */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {medicalCase.patientName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-blue-700">
                    <span>CC: {medicalCase.documentNumber}</span>
                    <span>{medicalCase.age} años</span>
                    <span>{medicalCase.gender === 'M' ? 'Masculino' : 'Femenino'}</span>
                  </div>
                </div>
                <Badge className={`${medicalCase.priority === 'alta' ? 'bg-red-100 text-red-800' : 
                  medicalCase.priority === 'media' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'}`}>
                  Prioridad: {medicalCase.priority.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-blue-900">Diagnóstico:</span>
                  <p className="text-blue-800">{medicalCase.diagnosis}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Especialidad:</span>
                  <p className="text-blue-800">{medicalCase.specialty}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Médico remitente:</span>
                  <p className="text-blue-800">{medicalCase.referringPhysician}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Institución:</span>
                  <p className="text-blue-800">{medicalCase.referringInstitution}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decision Options */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Seleccione una decisión:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['accept', 'reject', 'request_info'].map((action) => (
                <button
                  key={action}
                  onClick={() => setSelectedAction(action as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedAction === action
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

          {/* Priority Selection (only for accept) */}
          {selectedAction === 'accept' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Asignar prioridad de atención:
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

          {/* Comments Section */}
          {selectedAction && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {selectedAction === 'reject' || selectedAction === 'request_info' 
                  ? 'Comentarios (requerido)' 
                  : 'Comentarios (opcional)'}
              </h4>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={getCommentPlaceholder(selectedAction)}
                rows={4}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                {comments.length}/500 caracteres
              </p>
            </div>
          )}

          {/* Action Summary */}
          {selectedAction && (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Resumen de la decisión:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {getActionIcon(selectedAction)}
                    <span className="font-medium">{getActionText(selectedAction)}</span>
                  </div>
                  {selectedAction === 'accept' && (
                    <p>• Prioridad asignada: <span className="font-medium capitalize">{priority}</span></p>
                  )}
                  {comments && (
                    <p>• Comentarios: <span className="italic">"{comments}"</span></p>
                  )}
                  <p className="text-gray-600">
                    Esta decisión será registrada en el historial del caso y se notificará automáticamente a la EPS remitente.
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
            className={selectedAction === 'accept' ? 'bg-green-600 hover:bg-green-700' :
                      selectedAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                      'bg-yellow-600 hover:bg-yellow-700'}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <>
                {getActionIcon(selectedAction || '')}
                <span className="ml-2">
                  {selectedAction ? getActionText(selectedAction) : 'Confirmar decisión'}
                </span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
