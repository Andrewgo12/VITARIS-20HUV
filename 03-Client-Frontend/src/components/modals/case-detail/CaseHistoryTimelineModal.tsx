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
  Download,
  Filter,
  Calendar,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'created' | 'updated' | 'decision' | 'observation' | 'request' | 'response' | 'assignment';
  title: string;
  description: string;
  author: string;
  authorRole: string;
  metadata?: Record<string, any>;
}

interface CaseHistoryTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
}

export default function CaseHistoryTimelineModal({
  isOpen,
  onClose,
  caseId,
}: CaseHistoryTimelineModalProps) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [filteredTimeline, setFilteredTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAuthor, setFilterAuthor] = useState<string>('all');

  useEffect(() => {
    loadTimeline();
  }, [caseId]);

  useEffect(() => {
    applyFilters();
  }, [timeline, filterType, filterAuthor]);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockTimeline: TimelineEvent[] = [
        {
          id: "1",
          timestamp: "2024-01-21T10:30:00Z",
          type: "created",
          title: "Caso creado",
          description: "Solicitud de traslado recibida desde EPS Sanitas",
          author: "Sistema VITAL RED",
          authorRole: "Sistema",
          metadata: {
            source: "Email automático",
            referringInstitution: "EPS Sanitas"
          }
        },
        {
          id: "2",
          timestamp: "2024-01-21T10:32:00Z",
          type: "updated",
          title: "Procesamiento IA completado",
          description: "Extracción automática de datos médicos completada con 92% de confianza",
          author: "Módulo IA",
          authorRole: "Sistema",
          metadata: {
            confidence: 92,
            fieldsExtracted: 15
          }
        },
        {
          id: "3",
          timestamp: "2024-01-21T11:15:00Z",
          type: "assignment",
          title: "Caso asignado",
          description: "Caso asignado automáticamente por especialidad (Cardiología)",
          author: "Dr. Ana Rodríguez",
          authorRole: "Médico Evaluador",
          metadata: {
            specialty: "Cardiología",
            assignmentMethod: "Automático"
          }
        },
        {
          id: "4",
          timestamp: "2024-01-21T13:45:00Z",
          type: "observation",
          title: "Observación clínica añadida",
          description: "Paciente presenta signos de deterioro hemodinámico. Se recomienda traslado urgente.",
          author: "Dr. Ana Rodríguez",
          authorRole: "Médico Evaluador",
          metadata: {
            observationType: "clinical",
            isPrivate: false
          }
        },
        {
          id: "5",
          timestamp: "2024-01-21T14:20:00Z",
          type: "request",
          title: "Información adicional solicitada",
          description: "Solicitados resultados de laboratorio adicionales y signos vitales actualizados",
          author: "Dr. Ana Rodríguez",
          authorRole: "Médico Evaluador",
          metadata: {
            urgency: "urgent",
            deadline: "2024-01-22T14:20:00Z",
            requestTypes: ["lab_results", "vital_signs"]
          }
        },
        {
          id: "6",
          timestamp: "2024-01-21T16:30:00Z",
          type: "response",
          title: "Respuesta recibida",
          description: "Dr. Carlos Mendoza respondió con información adicional solicitada",
          author: "Dr. Carlos Mendoza",
          authorRole: "Médico Remitente",
          metadata: {
            responseTime: "2h 10m",
            attachments: 2
          }
        },
        {
          id: "7",
          timestamp: "2024-01-21T17:45:00Z",
          type: "updated",
          title: "Prioridad actualizada",
          description: "Prioridad cambiada de Media a Alta basada en nueva información",
          author: "Dr. Ana Rodríguez",
          authorRole: "Médico Evaluador",
          metadata: {
            previousPriority: "media",
            newPriority: "alta",
            reason: "Deterioro clínico"
          }
        },
        {
          id: "8",
          timestamp: "2024-01-21T18:00:00Z",
          type: "decision",
          title: "Decisión pendiente",
          description: "Caso en revisión final para decisión de traslado",
          author: "Dr. Ana Rodríguez",
          authorRole: "Médico Evaluador",
          metadata: {
            status: "en_revision"
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

  const applyFilters = () => {
    let filtered = timeline;

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    if (filterAuthor !== 'all') {
      filtered = filtered.filter(event => event.authorRole === filterAuthor);
    }

    setFilteredTimeline(filtered);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'updated': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'decision': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'observation': return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'request': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'response': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'assignment': return <User className="w-4 h-4 text-indigo-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'created': return 'border-blue-200 bg-blue-50';
      case 'updated': return 'border-yellow-200 bg-yellow-50';
      case 'decision': return 'border-green-200 bg-green-50';
      case 'observation': return 'border-purple-200 bg-purple-50';
      case 'request': return 'border-orange-200 bg-orange-50';
      case 'response': return 'border-green-200 bg-green-50';
      case 'assignment': return 'border-indigo-200 bg-indigo-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'created': return 'Creación';
      case 'updated': return 'Actualización';
      case 'decision': return 'Decisión';
      case 'observation': return 'Observación';
      case 'request': return 'Solicitud';
      case 'response': return 'Respuesta';
      case 'assignment': return 'Asignación';
      default: return type;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getUniqueAuthors = () => {
    const authors = [...new Set(timeline.map(event => event.authorRole))];
    return authors.sort();
  };

  const getUniqueTypes = () => {
    const types = [...new Set(timeline.map(event => event.type))];
    return types.sort();
  };

  const handleExport = () => {
    const exportData = filteredTimeline.map(event => ({
      Fecha: formatTimestamp(event.timestamp).date,
      Hora: formatTimestamp(event.timestamp).time,
      Tipo: getTypeLabel(event.type),
      Título: event.title,
      Descripción: event.description,
      Autor: event.author,
      Rol: event.authorRole
    }));

    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historial_caso_${caseId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
                  Historial del Caso #{caseId}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Cronología completa de eventos y decisiones
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Todos los tipos</option>
                  {getUniqueTypes().map(type => (
                    <option key={type} value={type}>{getTypeLabel(type)}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <select
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Todos los autores</option>
                  {getUniqueAuthors().map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Badge variant="outline">
                {filteredTimeline.length} eventos
              </Badge>
            </div>
          </div>

          {/* Timeline */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando historial...</p>
            </div>
          ) : filteredTimeline.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay eventos</h3>
                <p className="text-gray-600">No se encontraron eventos que coincidan con los filtros aplicados.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {filteredTimeline.map((event, index) => {
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
                                  <Badge variant="outline" className="text-xs">
                                    {getTypeLabel(event.type)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right text-sm">
                                <p className="font-medium text-gray-900">{event.author}</p>
                                <p className="text-gray-600">{event.authorRole}</p>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3">{event.description}</p>
                            
                            {/* Metadata */}
                            {event.metadata && Object.keys(event.metadata).length > 0 && (
                              <div className="bg-white bg-opacity-50 rounded-lg p-3 mt-3">
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Detalles adicionales:</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                  {Object.entries(event.metadata).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="text-gray-600 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                      </span>
                                      <span className="text-gray-900 font-medium">
                                        {Array.isArray(value) ? value.join(', ') : String(value)}
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

          {/* Summary Statistics */}
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Estadísticas del caso</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {timeline.filter(e => e.type === 'observation').length}
                  </p>
                  <p className="text-sm text-gray-600">Observaciones</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {timeline.filter(e => e.type === 'request').length}
                  </p>
                  <p className="text-sm text-gray-600">Solicitudes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {timeline.filter(e => e.type === 'response').length}
                  </p>
                  <p className="text-sm text-gray-600">Respuestas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {timeline.filter(e => e.type === 'updated').length}
                  </p>
                  <p className="text-sm text-gray-600">Actualizaciones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
