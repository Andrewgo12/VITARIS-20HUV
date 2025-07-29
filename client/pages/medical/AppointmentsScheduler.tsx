import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
} from "lucide-react";

export default function AppointmentsScheduler() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Programación de Citas
              </h1>
              <p className="text-muted-foreground">
                Gestión integral de citas médicas
              </p>
            </div>
          </div>
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4" />
            Nueva Cita
          </Button>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Calendario
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Clock className="w-4 h-4 mr-2" />
              Citas
            </TabsTrigger>
            <TabsTrigger value="availability">
              <User className="w-4 h-4 mr-2" />
              Disponibilidad
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Search className="w-4 h-4 mr-2" />
              Recordatorios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Calendario Médico:</strong> Vista semanal/mensual de
                citas programadas, disponibilidad de especialistas, bloqueos de
                tiempo y gestión de recursos.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Gestión de Citas:</strong> Programación automática,
                lista de espera, reagendamiento dinámico y optimización de
                horarios por especialidad.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                <strong>Disponibilidad Médica:</strong> Horarios de
                especialistas, vacaciones, guardias médicas, rotaciones y
                gestión de ausencias.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <Alert>
              <Search className="h-4 w-4" />
              <AlertDescription>
                <strong>Recordatorios Automáticos:</strong> SMS, email y
                llamadas automáticas, confirmación de citas, seguimiento
                post-cita y encuestas de satisfacción.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
