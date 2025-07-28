import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  Download,
  Users,
  Activity,
} from "lucide-react";

export default function MedicalReports() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Reportes Médicos
              </h1>
              <p className="text-muted-foreground">
                Estadísticas, análisis y reportes del sistema
              </p>
            </div>
          </div>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Exportar Reportes
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-muted-foreground">
                Pacientes Totales
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-muted-foreground">
                Ocupación Camas
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">2.5h</div>
              <div className="text-sm text-muted-foreground">
                Tiempo Promedio Espera
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-muted-foreground">
                Satisfacción Pacientes
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clinical">
              <Activity className="w-4 h-4 mr-2" />
              Clínicos
            </TabsTrigger>
            <TabsTrigger value="operational">
              <Users className="w-4 h-4 mr-2" />
              Operacionales
            </TabsTrigger>
            <TabsTrigger value="financial">
              <TrendingUp className="w-4 h-4 mr-2" />
              Financieros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admisiones por Día</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      Gráfica de tendencias de admisiones diarias, análisis de
                      patrones y predicciones.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Especialidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <BarChart3 className="h-4 w-4" />
                    <AlertDescription>
                      Distribución de casos por especialidad médica y carga de
                      trabajo.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clinical" className="space-y-6">
            <Alert>
              <Activity className="h-4 w-4" />
              <AlertDescription>
                <strong>Reportes Clínicos:</strong> Indicadores de calidad,
                tiempos de respuesta, resultados de tratamiento, morbimortalidad
                y seguimiento de protocolos.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="operational" className="space-y-6">
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Reportes Operacionales:</strong> Eficiencia de recursos,
                utilización de equipos, tiempos de espera, flujo de pacientes y
                optimización de procesos.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Reportes Financieros:</strong> Costos por paciente,
                facturación por especialidad, análisis de rentabilidad y
                presupuestos por departamento.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
