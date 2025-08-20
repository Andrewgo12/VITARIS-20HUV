import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  History,
  X,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Eye,
  Calendar,
} from "lucide-react";

interface HistoricalRequest {
  id: string;
  patientName: string;
  documentNumber: string;
  diagnosis: string;
  specialty: string;
  referringPhysician: string;
  referringInstitution: string;
  priority: 'alta' | 'media' | 'baja';
  finalDecision: 'aceptada' | 'rechazada';
  decisionDate: string;
  receivedDate: string;
  responseTime: string;
  evaluatorNotes: string;
  currentEvaluator: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'received' | 'assigned' | 'reviewed' | 'decision' | 'observation' | 'completed';
  title: string;
  description: string;
  author: string;
  metadata?: Record<string, any>;
}

interface RequestTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: HistoricalRequest | null;
}

export default function RequestTimelineModal({
  isOpen,
  onClose,
  request,
}: RequestTimelineModalProps) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (request && isOpen) {
      loadTimeline();
    }
  }, [request, isOpen]);

  if (!request) return null;

  const loadTimeline = async () => {
    setLoading(true);
    try {
      // Simulate API call to get timeline for this specific request
      const mockTimeline: TimelineEvent[] = [
        {
          id: "1",
          timestamp: request.receivedDate,
          type: "received",
          title: "Solicitud recibida",
          description: `Solicitud de traslado recibida desde ${request.referringInstitution}`,
          author: "Sistema VITAL RED",
          metadata: {
            source: "Email automático",
            referringInstitution: request.referringInstitution
          }
        },
        {
          id: "2",
          timestamp: new Date(new Date(request.receivedDate).getTime() + 5 * 60000).toISOString(),
          type: "assigned",
          title: "Caso asignado",
          description: `Caso asignado a ${request.currentEvaluator} por especialidad (${request.specialty})`,
          author: "Sistema VITAL RED",
          metadata: {
            evaluator: request.currentEvaluator,
            specialty: request.specialty,
            assignmentMethod: "Automático"
          }
        },
        {
          id: "3",
          timestamp: new Date(new Date(request.receivedDate).getTime() + 30 * 60000).toISOString(),
          type: "reviewed",
          title: "Caso revisado",
          description: "Médico evaluador inició revisión del caso clínico",
          author: request.currentEvaluator,
          metadata: {
            action: "case_opened"
          }
        },
        {
          id: "4",
          timestamp: new Date(new Date(request.decisionDate).getTime() - 15 * 60000).toISOString(),
          type: "observation",
          title: "Observación añadida",
          description: request.evaluatorNotes,
          author: request.currentEvaluator,
          metadata: {
            observationType: "clinical"
          }
        },
        {
          id: "5",
          timestamp: request.decisionDate,
          type: "decision",
          title: `Decisión: ${request.finalDecision.toUpperCase()}`,
          description: `Decisión final tomada: ${request.finalDecision === 'aceptada' ? 'Traslado aprobado' : 'Traslado rechazado'}`,
          author: request.currentEvaluator,
          metadata: {
            decision: request.finalDecision,
            priority: request.priority
          }
        },
        {
          id: "6",
          timestamp: new Date(new Date(request.decisionDate).getTime() + 5 * 60000).toISOString(),
          type: "completed",
          title: "Caso completado",
          description: "Notificación enviada a la EPS remitente",
          author: "Sistema VITAL RED",
          metadata: {
            notificationSent: true
          }
        }
      ];

      setTimeline(mockTimeline.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'received': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'assigned': return <User className="w-4 h-4 text-indigo-600" />;
      case 'reviewed': return <Eye className="w-4 h-4 text-purple-600" />;
      case 'decision': return request?.finalDecision === 'aceptada' ? 
        <CheckCircle className="w-4 h-4 text-green-600" /> : 
        <XCircle className="w-4 h-4 text-red-600" />;
      case 'observation': return <MessageSquare className="w-4 h-4 text-orange-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'received': return 'border-blue-200 bg-blue-50';
      case 'assigned': return 'border-indigo-200 bg-indigo-50';
      case 'reviewed': return 'border-purple-200 bg-purple-50';
      case 'decision': return request?.finalDecision === 'aceptada' ? 
        'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
      case 'observation': return 'border-orange-200 bg-orange-50';
      case 'completed': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-blue-600" />
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Cronología del Caso - {request.id}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {request.patientName} - {request.diagnosis}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Summary */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-900">Paciente:</span>
                  <p className="text-blue-800">{request.patientName}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Documento:</span>
                  <p className="text-blue-800">{request.documentNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Diagnóstico:</span>
                  <p className="text-blue-800">{request.diagnosis}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Especialidad:</span>
                  <p className="text-blue-800">{request.specialty}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Tiempo de respuesta:</span>
                  <p className="text-blue-800">{request.responseTime}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Decisión final:</span>
                  <Badge className={request.finalDecision === 'aceptada' ? 
                    'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {request.finalDecision.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando cronología...</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {timeline.map((event, index) => {
                  const { date, time } = formatTimestamp(event.timestamp);
                  
                  return (
                    <div key={event.id} className="relative flex gap-6">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-gray-200">
                        {getEventIcon(event.type)}
                      </div>
                      
                      {/* Event content */}
                      <div className="flex-1 min-w-0">
                        <Card className={`${getEventColor(event.type)} border-l-4`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {event.title}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                  <span>{date}</span>
                                  <span>{time}</span>
                                </div>
                              </div>
                              <div className="text-right text-sm">
                                <p className="font-medium text-gray-900">{event.author}</p>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3">{event.description}</p>
                            
                            {/* Metadata */}
                            {event.metadata && Object.keys(event.metadata).length > 0 && (
                              <div className="bg-white bg-opacity-50 rounded-lg p-3 mt-3">
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Detalles:</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                  {Object.entries(event.metadata).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="text-gray-600 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                      </span>
                                      <span className="text-gray-900 font-medium">
                                        {String(value)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
