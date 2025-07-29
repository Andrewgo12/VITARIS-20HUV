import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Users,
  Clock,
  User,
  Calendar,
  MessageSquare,
  Plus,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Brain,
  Heart,
  Bone,
} from "lucide-react";

const mockConsultations = [
  {
    id: "CONS-001",
    patient: { name: "María Elena Rodríguez", room: "UCI-101", age: 67 },
    requesting: { doctor: "Dr. Carlos Mendoza", specialty: "Cardiología" },
    requested: { specialty: "Endocrinología", doctor: "Dr. Patricia Silva" },
    reason: "Manejo de diabetes en contexto de IAM",
    priority: "URGENTE",
    status: "PENDIENTE",
    requestDate: "2024-01-15",
    responseTime: null,
    recommendations: null,
  },
  {
    id: "CONS-002",
    patient: { name: "Carlos Alberto Vásquez", room: "TRAUMA-205", age: 34 },
    requesting: { doctor: "Dra. Ana Martínez", specialty: "Traumatología" },
    requested: { specialty: "Anestesiología", doctor: "Dr. Miguel Sánchez" },
    reason: "Evaluación pre-anestésica para cirugía RAFI",
    priority: "PROGRAMADA",
    status: "COMPLETADA",
    requestDate: "2024-01-15",
    responseTime: "2 horas",
    recommendations: "Paciente apto para anestesia general + bloqueo regional",
  },
];

const specialties = [
  { name: "Cardiología", icon: Heart, available: 3, busy: 1 },
  { name: "Neurología", icon: Brain, available: 2, busy: 0 },
  { name: "Traumatología", icon: Bone, available: 4, busy: 2 },
  { name: "Medicina Interna", icon: Stethoscope, available: 5, busy: 1 },
];

export default function ConsultationsHub() {
  const navigate = useNavigate();
  const [consultations] = useState(mockConsultations);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-yellow-500 text-black";
      case "EN_PROCESO":
        return "bg-blue-500 text-white";
      case "COMPLETADA":
        return "bg-green-500 text-white";
      case "CANCELADA":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENTE":
        return "text-red-600";
      case "ALTO":
        return "text-orange-600";
      case "PROGRAMADA":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/system")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Sistema
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hub de Interconsultas
              </h1>
              <p className="text-muted-foreground">
                Gestión de interconsultas entre especialidades médicas
              </p>
            </div>
          </div>
          <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4" />
            Nueva Interconsulta
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {consultations.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Interconsultas
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {consultations.filter((c) => c.status === "PENDIENTE").length}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {consultations.filter((c) => c.status === "COMPLETADA").length}
              </div>
              <div className="text-sm text-muted-foreground">Completadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">14</div>
              <div className="text-sm text-muted-foreground">
                Especialistas Disponibles
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Activas
            </TabsTrigger>
            <TabsTrigger
              value="specialists"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Especialistas
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Historial
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comunicación
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <Card
                  key={consultation.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold">
                            {consultation.patient.name}
                          </h3>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>
                            <strong>Habitación:</strong>{" "}
                            {consultation.patient.room}
                          </div>
                          <div>
                            <strong>Edad:</strong> {consultation.patient.age}{" "}
                            años
                          </div>
                          <div>
                            <strong>ID:</strong> {consultation.id}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">Solicitud</h4>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>
                            <strong>Solicitante:</strong>{" "}
                            {consultation.requesting.doctor}
                          </div>
                          <div>
                            <strong>Especialidad origen:</strong>{" "}
                            {consultation.requesting.specialty}
                          </div>
                          <div>
                            <strong>Motivo:</strong> {consultation.reason}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getStatusColor(consultation.status)}
                            >
                              {consultation.status}
                            </Badge>
                            <span
                              className={`text-sm font-medium ${getPriorityColor(consultation.priority)}`}
                            >
                              {consultation.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold">Especialista</h4>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>
                            <strong>Especialidad:</strong>{" "}
                            {consultation.requested.specialty}
                          </div>
                          <div>
                            <strong>Especialista:</strong>{" "}
                            {consultation.requested.doctor}
                          </div>
                          <div>
                            <strong>Fecha solicitud:</strong>{" "}
                            {consultation.requestDate}
                          </div>
                          {consultation.responseTime && (
                            <div>
                              <strong>Tiempo respuesta:</strong>{" "}
                              {consultation.responseTime}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-orange-600" />
                          <h4 className="font-semibold">Acciones</h4>
                        </div>
                        {consultation.recommendations ? (
                          <div className="text-sm">
                            <strong>Recomendaciones:</strong>
                            <p className="mt-1 p-2 bg-green-50 rounded">
                              {consultation.recommendations}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Button size="sm" className="w-full">
                              Ver Paciente
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              Contactar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              Responder
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="specialists" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialties.map((specialty) => {
                const IconComponent = specialty.icon;
                return (
                  <Card key={specialty.name}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <IconComponent className="w-8 h-8 text-indigo-600" />
                        <h3 className="text-lg font-semibold">
                          {specialty.name}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-xl font-bold text-green-600">
                            {specialty.available}
                          </div>
                          <div className="text-muted-foreground">
                            Disponibles
                          </div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded">
                          <div className="text-xl font-bold text-red-600">
                            {specialty.busy}
                          </div>
                          <div className="text-muted-foreground">Ocupados</div>
                        </div>
                      </div>
                      <Button className="w-full mt-4" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Solicitar Interconsulta
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Estadísticas de Rendimiento */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Métricas de Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Interconsultas', value: '1,247', change: '+12%', color: 'blue' },
                      { label: 'Tiempo Promedio Respuesta', value: '2.3h', change: '-15%', color: 'green' },
                      { label: 'Interconsultas Urgentes', value: '89', change: '+5%', color: 'red' },
                      { label: 'Tasa de Resolución', value: '94%', change: '+3%', color: 'purple' }
                    ].map((metric, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">{metric.label}</div>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className={`text-sm text-${metric.color}-600`}>{metric.change} vs mes anterior</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Historial Reciente */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historial Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: 'IC-2024-0234',
                        date: '2024-01-15',
                        requesting: 'Dr. García - Medicina Interna',
                        specialist: 'Dr. López - Cardiología',
                        patient: 'María González',
                        reason: 'Evaluación de soplo cardíaco',
                        responseTime: '1.2h',
                        status: 'COMPLETED'
                      },
                      {
                        id: 'IC-2024-0233',
                        date: '2024-01-15',
                        requesting: 'Dr. Martín - Urgencias',
                        specialist: 'Dr. Silva - Neurología',
                        patient: 'Carlos Ruiz',
                        reason: 'Cefalea intensa con signos neurológicos',
                        responseTime: '45min',
                        status: 'COMPLETED'
                      },
                      {
                        id: 'IC-2024-0232',
                        date: '2024-01-14',
                        requesting: 'Dr. Torres - Pediatría',
                        specialist: 'Dr. Vega - Infectología',
                        patient: 'Ana Pérez (8 años)',
                        reason: 'Fiebre prolongada sin foco',
                        responseTime: '3.1h',
                        status: 'COMPLETED'
                      }
                    ].map((consultation, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="font-medium">{consultation.id}</div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{consultation.responseTime}</Badge>
                              <Badge variant="default">COMPLETADA</Badge>
                            </div>
                          </div>
                          <div className="text-sm space-y-1">
                            <div><strong>Paciente:</strong> {consultation.patient}</div>
                            <div><strong>Solicitante:</strong> {consultation.requesting}</div>
                            <div><strong>Especialista:</strong> {consultation.specialist}</div>
                            <div><strong>Motivo:</strong> {consultation.reason}</div>
                            <div className="text-gray-500">{consultation.date}</div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Análisis de Patrones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Patrones de Derivación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { specialty: 'Cardiología', count: 156, percentage: 18 },
                      { specialty: 'Neurología', count: 134, percentage: 15 },
                      { specialty: 'Endocrinología', count: 98, percentage: 11 },
                      { specialty: 'Infectología', count: 87, percentage: 10 },
                      { specialty: 'Oncología', count: 76, percentage: 9 },
                      { specialty: 'Otros', count: 234, percentage: 27 }
                    ].map((pattern, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{pattern.specialty}</span>
                          <span className="text-sm text-gray-600">{pattern.count} ({pattern.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${pattern.percentage * 3.7}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                <strong>Sistema de Comunicación:</strong> Chat en tiempo real
                entre especialistas, intercambio seguro de información médica y
                notificaciones automáticas.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
