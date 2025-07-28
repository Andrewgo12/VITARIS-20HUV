import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  MessageSquare,
  Users,
  Bell,
  Phone,
  Mail,
  Calendar,
  Video,
} from "lucide-react";

export default function TeamCommunication() {
  const navigate = useNavigate();

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
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                <strong>Chat Médico Seguro:</strong> Mensajería cifrada entre
                especialistas, grupos por departamento, intercambio de imágenes
                médicas y casos complejos.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <Alert>
              <Phone className="h-4 w-4" />
              <AlertDescription>
                <strong>Sistema de Llamadas:</strong> Comunicación directa entre
                médicos, llamadas de emergencia, interconsultas telefónicas y
                registro de conversaciones.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>Sistema de Notificaciones:</strong> Alertas automáticas
                de pacientes críticos, recordatorios de procedimientos,
                actualizaciones de estado y protocolos de escalación.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="conferences" className="space-y-6">
            <Alert>
              <Video className="h-4 w-4" />
              <AlertDescription>
                <strong>Videoconferencias Médicas:</strong> Juntas médicas
                virtuales, consultorías a distancia, educación médica continua y
                discusión de casos.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
