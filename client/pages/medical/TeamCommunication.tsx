import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TeamCommunicationModal from "@/components/modals/TeamCommunicationModal";
import {
  ArrowLeft,
  MessageSquare,
  Users,
  Bell,
  Phone,
  Mail,
  Calendar,
  Video,
  Plus,
  Circle,
} from "lucide-react";

const mockTeams = [
  {
    id: "TEAM001",
    name: "Equipo UCI",
    members: 4,
    lastActivity: "Hace 2 minutos",
    status: "online",
    unreadCount: 3,
  },
  {
    id: "TEAM002",
    name: "Urgencias",
    members: 6,
    lastActivity: "Hace 15 minutos",
    status: "busy",
    unreadCount: 0,
  },
  {
    id: "TEAM003",
    name: "Cirugía",
    members: 3,
    lastActivity: "Hace 1 hora",
    status: "away",
    unreadCount: 1,
  },
];

const mockMessages = [
  {
    id: 1,
    team: "Equipo UCI",
    sender: "Dr. Carlos Mendoza",
    message: "Paciente en cama 3 presenta taquicardia",
    time: "14:30",
    priority: "high",
  },
  {
    id: 2,
    team: "Urgencias",
    sender: "Enf. María González",
    message: "Llegada de paciente por accidente de tránsito",
    time: "14:25",
    priority: "urgent",
  },
];

export default function TeamCommunication() {
  const navigate = useNavigate();
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] =
    useState(false);
  const [teams] = useState(mockTeams);
  const [messages] = useState(mockMessages);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500";
      case "busy":
        return "text-red-500";
      case "away":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Comunicación Médica
              </h1>
              <p className="text-muted-foreground">
                Comunicación segura entre equipos médicos
              </p>
            </div>
            <Button
              onClick={() => setIsCommunicationModalOpen(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Nueva Comunicación
            </Button>
          </div>
        </div>

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="calls">
              <Phone className="w-4 h-4 mr-2" />
              Llamadas
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="conferences">
              <Video className="w-4 h-4 mr-2" />
              Videoconferencias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Equipos Médicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Circle
                            className={`w-3 h-3 fill-current ${getStatusColor(team.status)}`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{team.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {team.members} miembros
                          </p>
                        </div>
                      </div>
                      {team.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {team.unreadCount}
                        </Badge>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={() => setIsCommunicationModalOpen(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Abrir Chat Completo
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">Mensajes Recientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {message.sender
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">
                            {message.sender}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {message.team}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {message.time}
                          </span>
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority === "urgent" ? "Urgente" : "Alta"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Control de Llamadas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => setIsCommunicationModalOpen(true)}
                    className="w-full h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="w-6 h-6 mb-2" />
                    <span>Iniciar Llamada</span>
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Conferencia
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Emergencia
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Llamadas Recientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Circle className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Equipo UCI</span>
                    </div>
                    <span className="text-xs text-muted-foreground">5:32</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Circle className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm">Dr. Roberto Castro</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Perdida
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Enviar Alerta</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setIsCommunicationModalOpen(true)}
                    className="w-full h-20 flex flex-col items-center justify-center bg-red-600 hover:bg-red-700"
                  >
                    <Bell className="w-6 h-6 mb-2" />
                    <span>Nueva Alerta</span>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Alertas Activas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert>
                    <Bell className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Urgente:</strong> Paciente crítico en UCI - Cama 3
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Bell className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Info:</strong> Cambio de turno en 30 minutos
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conferences" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Programar Videoconferencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setIsCommunicationModalOpen(true)}
                    className="w-full h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700"
                  >
                    <Video className="w-6 h-6 mb-2" />
                    <span>Nueva Conferencia</span>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Conferencias Programadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        Junta Médica Matutina
                      </span>
                      <Badge variant="secondary">Hoy 08:00</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Revisión de casos UCI
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        Interconsulta Cardiología
                      </span>
                      <Badge variant="secondary">Mañana 14:00</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Caso complejo paciente P001
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <TeamCommunicationModal
          open={isCommunicationModalOpen}
          onOpenChange={setIsCommunicationModalOpen}
        />
      </div>
    </div>
  );
}
