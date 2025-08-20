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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Send,
  X,
  FileText,
  Clock,
  User,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react";

interface AdditionalInfoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  referringPhysician: string;
  onSend: (request: {
    requestType: string[];
    customMessage: string;
    urgency: 'normal' | 'urgent' | 'critical';
    deadline: string;
  }) => void;
}

export default function AdditionalInfoRequestModal({
  isOpen,
  onClose,
  caseId,
  referringPhysician,
  onSend,
}: AdditionalInfoRequestModalProps) {
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'critical'>('normal');
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (selectedRequests.length === 0 && !customMessage.trim()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      onSend({
        requestType: selectedRequests,
        customMessage: customMessage.trim(),
        urgency,
        deadline,
      });
      
      // Reset form
      setSelectedRequests([]);
      setCustomMessage("");
      setUrgency('normal');
      setDeadline("");
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestToggle = (requestType: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestType)
        ? prev.filter(r => r !== requestType)
        : [...prev, requestType]
    );
  };

  const getUrgencyColor = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyDescription = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case 'critical': return 'Respuesta requerida en 2 horas - Caso crítico';
      case 'urgent': return 'Respuesta requerida en 24 horas - Caso urgente';
      case 'normal': return 'Respuesta requerida en 48 horas - Proceso normal';
      default: return '';
    }
  };

  const requestTemplates = [
    {
      id: 'lab_results',
      title: 'Resultados de laboratorio adicionales',
      description: 'Solicitar exámenes de laboratorio específicos o resultados pendientes',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'imaging_studies',
      title: 'Estudios de imagen complementarios',
      description: 'Radiografías, TAC, resonancias u otros estudios de imagen',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'medical_history',
      title: 'Historia clínica completa',
      description: 'Antecedentes médicos, quirúrgicos y familiares detallados',
      icon: <User className="w-5 h-5" />
    },
    {
      id: 'current_medications',
      title: 'Medicamentos actuales',
      description: 'Lista completa de medicamentos, dosis y frecuencias',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'vital_signs',
      title: 'Signos vitales actualizados',
      description: 'Monitoreo reciente de signos vitales y estado hemodinámico',
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'specialist_evaluation',
      title: 'Evaluación por especialista',
      description: 'Interconsulta o evaluación por especialista específico',
      icon: <User className="w-5 h-5" />
    },
    {
      id: 'family_consent',
      title: 'Consentimiento familiar',
      description: 'Autorización familiar para procedimientos o traslado',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'insurance_authorization',
      title: 'Autorización de seguro',
      description: 'Documentación de autorización del plan de salud',
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const isFormValid = () => {
    return selectedRequests.length > 0 || customMessage.trim().length > 0;
  };

  // Calculate suggested deadline based on urgency
  const getSuggestedDeadline = () => {
    const now = new Date();
    switch (urgency) {
      case 'critical':
        now.setHours(now.getHours() + 2);
        break;
      case 'urgent':
        now.setDate(now.getDate() + 1);
        break;
      case 'normal':
        now.setDate(now.getDate() + 2);
        break;
    }
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Solicitar Información Adicional
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Caso #{caseId} - Dr. {referringPhysician}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Información de contacto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800">Médico remitente: {referringPhysician}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800">Email: medico@eps-sanitas.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800">Teléfono: +57 300 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800">Horario: 24/7 disponible</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Urgency Level */}
          <div>
            <Label className="text-base font-semibold text-gray-900 mb-3 block">
              Nivel de urgencia
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['normal', 'urgent', 'critical'].map((urgencyLevel) => (
                <button
                  key={urgencyLevel}
                  onClick={() => setUrgency(urgencyLevel as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    urgency === urgencyLevel
                      ? getUrgencyColor(urgencyLevel) + ' border-current'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-center">
                    <span className="font-medium capitalize block mb-1">
                      {urgencyLevel === 'normal' ? 'Normal' : 
                       urgencyLevel === 'urgent' ? 'Urgente' : 'Crítico'}
                    </span>
                    <span className="text-xs text-gray-600">
                      {getUrgencyDescription(urgencyLevel)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Request Templates */}
          <div>
            <Label className="text-base font-semibold text-gray-900 mb-3 block">
              Información requerida (seleccione todas las que apliquen)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requestTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedRequests.includes(template.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => handleRequestToggle(template.id)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedRequests.includes(template.id)}
                      onChange={() => handleRequestToggle(template.id)}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {template.icon}
                        <h4 className="font-medium text-gray-900">{template.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <Label htmlFor="custom-message" className="text-base font-semibold text-gray-900 mb-3 block">
              Mensaje personalizado (opcional)
            </Label>
            <Textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Especifique información adicional que necesite o proporcione contexto específico para la solicitud..."
              rows={4}
              className="w-full"
              maxLength={800}
            />
            <p className="text-sm text-gray-500 mt-2">
              {customMessage.length}/800 caracteres
            </p>
          </div>

          {/* Deadline */}
          <div>
            <Label htmlFor="deadline" className="text-base font-semibold text-gray-900 mb-3 block">
              Fecha límite para respuesta
            </Label>
            <div className="flex gap-3">
              <input
                type="datetime-local"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="outline"
                onClick={() => setDeadline(getSuggestedDeadline())}
              >
                Usar sugerida
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Sugerida para {urgency}: {new Date(getSuggestedDeadline()).toLocaleString('es-ES')}
            </p>
          </div>

          {/* Request Summary */}
          {(selectedRequests.length > 0 || customMessage.trim()) && (
            <Card className="border-gray-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Resumen de la solicitud</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedRequests.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información solicitada:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {selectedRequests.map(requestId => {
                        const template = requestTemplates.find(t => t.id === requestId);
                        return (
                          <li key={requestId}>{template?.title}</li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {customMessage.trim() && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Mensaje personalizado:</h4>
                    <p className="text-sm text-gray-700 italic">"{customMessage}"</p>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className={`px-2 py-1 rounded-full ${getUrgencyColor(urgency)}`}>
                    Urgencia: {urgency === 'normal' ? 'Normal' : urgency === 'urgent' ? 'Urgente' : 'Crítico'}
                  </span>
                  {deadline && (
                    <span className="text-gray-600">
                      Respuesta antes de: {new Date(deadline).toLocaleString('es-ES')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Notice */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-semibold text-yellow-900 mb-1">Información importante</h4>
                  <ul className="text-yellow-800 space-y-1">
                    <li>• La solicitud será enviada automáticamente al médico remitente</li>
                    <li>• Se generará una notificación en el sistema de la EPS</li>
                    <li>• El caso permanecerá en estado "Información adicional" hasta recibir respuesta</li>
                    <li>• Se enviará recordatorio automático 24 horas antes del vencimiento</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!isFormValid() || loading}
            className={
              urgency === 'critical' ? 'bg-red-600 hover:bg-red-700' :
              urgency === 'urgent' ? 'bg-yellow-600 hover:bg-yellow-700' :
              'bg-blue-600 hover:bg-blue-700'
            }
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </div>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar solicitud
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
