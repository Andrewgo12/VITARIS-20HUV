import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import TelemedicineSessionModal from "@/components/modals/TelemedicineSessionModal";
import {
  ArrowLeft,
  Video,
  Monitor,
  Users,
  Phone,
  Camera,
  Wifi,
  Shield,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const mockSessions = [
  {
    id: "TELE-001",
    patient: { name: "María Elena Rodríguez", id: "P001" },
    doctor: "Dr. Carlos Mendoza",
    specialty: "Cardiología",
    scheduledTime: "14:00",
    date: "2024-01-15",
    status: "En curso",
    duration: "30 min",
    type: "Consulta de seguimiento",
  },
  {
    id: "TELE-002",
    patient: { name: "Carlos Alberto Vásquez", id: "P002" },
    doctor: "Dra. Ana Martínez",
    specialty: "Neurología",
    scheduledTime: "15:30",
    date: "2024-01-15",
    status: "Programada",
    duration: "45 min",
    type: "Primera consulta",
  },
];

export default function Telemedicine() {
  const navigate = useNavigate();
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessions] = useState(mockSessions);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En curso":
        return "bg-green-100 text-green-700";
      case "Programada":
        return "bg-blue-100 text-blue-700";
      case "Completada":
        return "bg-gray-100 text-gray-700";
      case "Cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Telemedicina
              </h1>
              <p className="text-muted-foreground">
                Consultas médicas a distancia
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsSessionModalOpen(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700"
          >
            <Video className="w-4 h-4" />
            Nueva Consulta Virtual
          </Button>
        </div>

        <Tabs defaultValue="consultations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="consultations">
              <Video className="w-4 h-4 mr-2" />
              Consultas
            </TabsTrigger>
            <TabsTrigger value="monitoring">
              <Monitor className="w-4 h-4 mr-2" />
              Monitoreo
            </TabsTrigger>
            <TabsTrigger value="education">
              <Users className="w-4 h-4 mr-2" />
              Educación
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consultations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {sessions.filter((s) => s.status === "En curso").length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sesiones Activas
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {sessions.filter((s) => s.status === "Programada").length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Programadas Hoy
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-600">95%</div>
                  <div className="text-sm text-muted-foreground">
                    Calidad de Conexión
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold">
                            {session.patient.name}
                          </h3>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {session.patient.id}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">Horario</h4>
                        </div>
                        <div className="text-sm">
                          <div>
                            {session.date} - {session.scheduledTime}
                          </div>
                          <div>Duración: {session.duration}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Video className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold">Consulta</h4>
                        </div>
                        <div className="text-sm">
                          <div>{session.doctor}</div>
                          <div>{session.specialty}</div>
                          <div className="text-muted-foreground">
                            {session.type}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <div className="space-y-2">
                          {session.status === "En curso" ? (
                            <Button
                              onClick={() => setIsSessionModalOpen(true)}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Unirse
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setIsSessionModalOpen(true)}
                              variant="outline"
                              className="w-full"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Iniciar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Dispositivos Conectados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Monitor Cardíaco P001</span>
                    </div>
                    <Badge variant="secondary">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                      <span className="text-sm">Glucómetro P002</span>
                    </div>
                    <Badge variant="secondary">Batería Baja</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Alertas de Monitoreo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Glucosa elevada:</strong> Paciente P002 - 180
                      mg/dL
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Signos estables:</strong> Paciente P001 - Ritmo
                      normal
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Educación al Paciente:</strong> Material educativo
                interactivo, videos explicativos, seguimiento de adherencia y
                evaluación de comprensión.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Seguridad HIPAA:</strong> Cifrado end-to-end,
                autenticación multifactor, logs de auditoría, cumplimiento
                regulatorio y protección de datos sensibles.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <TelemedicineSessionModal
          open={isSessionModalOpen}
          onOpenChange={setIsSessionModalOpen}
        />
      </div>
    </div>
  );
}
