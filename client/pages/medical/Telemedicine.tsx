import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Video,
  Monitor,
  Users,
  Phone,
  Camera,
  Wifi,
  Shield,
} from "lucide-react";

export default function Telemedicine() {
  const navigate = useNavigate();

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
          <Button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700">
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
            <Alert>
              <Video className="h-4 w-4" />
              <AlertDescription>
                <strong>Consultas Virtuales:</strong> Videoconferencias HD con
                pacientes, compartir pantalla, grabación de sesiones y
                expediente digital integrado.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Alert>
              <Monitor className="h-4 w-4" />
              <AlertDescription>
                <strong>Monitoreo Remoto:</strong> Dispositivos IoT para signos
                vitales, seguimiento de pacientes crónicos, alertas automáticas
                y análisis predictivo.
              </AlertDescription>
            </Alert>
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
      </div>
    </div>
  );
}
