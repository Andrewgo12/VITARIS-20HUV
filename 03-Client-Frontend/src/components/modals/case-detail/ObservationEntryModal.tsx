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
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Save,
  X,
  Clock,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface ObservationEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onSave: (observation: {
    content: string;
    type: 'clinical' | 'administrative' | 'urgent';
    isPrivate: boolean;
  }) => void;
}

export default function ObservationEntryModal({
  isOpen,
  onClose,
  caseId,
  onSave,
}: ObservationEntryModalProps) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<'clinical' | 'administrative' | 'urgent'>('clinical');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave({
        content: content.trim(),
        type,
        isPrivate,
      });
      
      // Reset form
      setContent("");
      setType('clinical');
      setIsPrivate(false);
    } catch (error) {
      console.error('Error saving observation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (observationType: string) => {
    switch (observationType) {
      case 'clinical': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'administrative': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (observationType: string) => {
    switch (observationType) {
      case 'clinical': return <FileText className="w-4 h-4" />;
      case 'administrative': return <User className="w-4 h-4" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeDescription = (observationType: string) => {
    switch (observationType) {
      case 'clinical': return 'Observaciones médicas sobre el caso clínico';
      case 'administrative': return 'Notas administrativas y de proceso';
      case 'urgent': return 'Observaciones urgentes que requieren atención inmediata';
      default: return '';
    }
  };

  const getCharacterLimit = () => {
    switch (type) {
      case 'urgent': return 500;
      case 'clinical': return 1000;
      case 'administrative': return 800;
      default: return 1000;
    }
  };

  const isFormValid = () => {
    return content.trim().length > 0 && content.length <= getCharacterLimit();
  };

  // Mock previous observations for context
  const previousObservations = [
    {
      id: "1",
      content: "Paciente presenta signos de deterioro hemodinámico. Se recomienda traslado urgente.",
      type: "clinical",
      author: "Dr. Ana Rodríguez",
      timestamp: "2024-01-21T14:30:00Z",
      isPrivate: false
    },
    {
      id: "2", 
      content: "Contacto establecido con familia. Autorizan procedimientos necesarios.",
      type: "administrative",
      author: "Enfermera María López",
      timestamp: "2024-01-21T13:45:00Z",
      isPrivate: false
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <DialogTitle className="text-xl font-bold text-gray-900">
                Añadir Observación - Caso #{caseId}
              </DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Previous Observations Context */}
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Observaciones anteriores</h4>
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {previousObservations.map((obs) => (
                  <div key={obs.id} className="bg-white rounded-lg p-3 border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(obs.type)}
                        <span className="text-sm font-medium text-gray-900">{obs.author}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(obs.type)}`}>
                          {obs.type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(obs.timestamp).toLocaleString('es-ES')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{obs.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observation Type Selection */}
          <div>
            <Label className="text-base font-semibold text-gray-900 mb-3 block">
              Tipo de observación
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['clinical', 'administrative', 'urgent'].map((observationType) => (
                <button
                  key={observationType}
                  onClick={() => setType(observationType as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    type === observationType
                      ? getTypeColor(observationType) + ' border-current'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    {getTypeIcon(observationType)}
                    <span className="font-medium capitalize">
                      {observationType === 'clinical' ? 'Clínica' :
                       observationType === 'administrative' ? 'Administrativa' : 'Urgente'}
                    </span>
                    <span className="text-xs text-gray-600">
                      {getTypeDescription(observationType)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Observation Content */}
          <div>
            <Label htmlFor="observation-content" className="text-base font-semibold text-gray-900 mb-3 block">
              Contenido de la observación
            </Label>
            <Textarea
              id="observation-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === 'clinical' 
                  ? 'Describa sus observaciones clínicas sobre el caso...'
                  : type === 'administrative'
                  ? 'Añada notas administrativas o de proceso...'
                  : 'Describa la situación urgente que requiere atención...'
              }
              rows={6}
              className="w-full resize-none"
              maxLength={getCharacterLimit()}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                {content.length}/{getCharacterLimit()} caracteres
              </p>
              {content.length > getCharacterLimit() * 0.9 && (
                <span className="text-sm text-orange-600">
                  Acercándose al límite
                </span>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="private-observation"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mt-1 rounded border-gray-300"
              />
              <div>
                <Label htmlFor="private-observation" className="font-medium text-gray-900 cursor-pointer">
                  Observación privada
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Las observaciones privadas solo son visibles para médicos evaluadores y no se incluyen en reportes enviados a la EPS remitente.
                </p>
              </div>
            </div>
          </div>

          {/* Urgent Observation Warning */}
          {type === 'urgent' && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Observación urgente</h4>
                    <p className="text-sm text-red-800">
                      Las observaciones marcadas como urgentes generarán notificaciones inmediatas a todo el equipo médico y se priorizarán en el sistema.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview */}
          {content.trim() && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Vista previa de la observación</h4>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(type)}
                      <span className="text-sm font-medium text-gray-900">Dr. Usuario Actual</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(type)}`}>
                        {type === 'clinical' ? 'clínica' : type === 'administrative' ? 'administrativa' : 'urgente'}
                      </span>
                      {isPrivate && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          Privada
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleString('es-ES')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{content}</p>
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
            onClick={handleSave} 
            disabled={!isFormValid() || loading}
            className={
              type === 'urgent' ? 'bg-red-600 hover:bg-red-700' :
              type === 'clinical' ? 'bg-blue-600 hover:bg-blue-700' :
              'bg-gray-600 hover:bg-gray-700'
            }
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar observación
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
