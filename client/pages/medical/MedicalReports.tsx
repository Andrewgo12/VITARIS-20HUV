import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import ReportGeneratorModal from "@/components/modals/ReportGeneratorModal";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  Download,
  Users,
  Activity,
  Plus,
  Eye,
  DollarSign,
  Clock,
} from "lucide-react";

const mockReports = [
  {
    id: "RPT-001",
    title: "Reporte de Ocupación UCI",
    type: "Operacional",
    period: "Enero 2024",
    generatedDate: "2024-01-15",
    format: "PDF",
    status: "Completado",
    size: "2.3 MB",
  },
  {
    id: "RPT-002",
    title: "Análisis de Morbimortalidad",
    type: "Clínico",
    period: "Q4 2023",
    generatedDate: "2024-01-10",
    format: "Excel",
    status: "Completado",
    size: "1.8 MB",
  },
  {
    id: "RPT-003",
    title: "Costos por Departamento",
    type: "Financiero",
    period: "Diciembre 2023",
    generatedDate: "2024-01-05",
    format: "PDF",
    status: "En proceso",
    size: "-",
  },
];

export default function MedicalReports() {
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reports] = useState(mockReports);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Clínico': return 'bg-blue-100 text-blue-700';
      case 'Operacional': return 'bg-green-100 text-green-700';
      case 'Financiero': return 'bg-purple-100 text-purple-700';
      case 'Estadístico': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return 'bg-green-100 text-green-700';
      case 'En proceso': return 'bg-yellow-100 text-yellow-700';
      case 'Error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
          <div className="flex gap-2">
            <Button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Generar Reporte
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full h-20 flex flex-col items-center justify-center"
                    variant="outline"
                  >
                    <Plus className="w-6 h-6 mb-2" />
                    <span className="text-sm">Nuevo Reporte</span>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
                  <div className="text-sm text-muted-foreground">Reportes Generados</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {reports.filter(r => r.status === 'Completado').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completados</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {reports.filter(r => r.status === 'En proceso').length}
                  </div>
                  <div className="text-sm text-muted-foreground">En Proceso</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Reportes Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{report.title}</h3>
                          <Badge className={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {report.period}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {report.generatedDate}
                          </div>
                          <div>Formato: {report.format}</div>
                          <div>Tamaño: {report.size}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {report.status === 'Completado' && (
                          <>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Indicadores de Calidad</h3>
                  <p className="text-sm text-muted-foreground mb-4">Métricas de desempeño clínico</p>
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full"
                  >
                    Generar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-red-600" />
                  <h3 className="font-semibold mb-2">Morbimortalidad</h3>
                  <p className="text-sm text-muted-foreground mb-4">Análisis de resultados</p>
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full"
                  >
                    Generar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Seguimiento de Protocolos</h3>
                  <p className="text-sm text-muted-foreground mb-4">Cumplimiento de guías</p>
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full"
                  >
                    Generar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operational" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Eficiencia de Recursos</h3>
                  <p className="text-sm text-muted-foreground mb-4">Utilización de personal y equipos</p>
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full"
                  >
                    Generar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                  <h3 className="font-semibold mb-2">Tiempos de Espera</h3>
                  <p className="text-sm text-muted-foreground mb-4">Análisis de demoras</p>
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full"
                  >
                    Generar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Flujo de Pacientes</h3>
                  <p className="text-sm text-muted-foreground mb-4">Movimiento y ocupación</p>
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full"
                  >
                    Generar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Costos por Paciente</h3>
                  <p className="text-sm text-muted-foreground mb-4">Análisis de costos</p>
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full"
                  >
                    Generar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Facturación</h3>
                  <p className="text-sm text-muted-foreground mb-4">Ingresos por especialidad</p>
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full"
                  >
                    Generar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Rentabilidad</h3>
                  <p className="text-sm text-muted-foreground mb-4">Análisis de márgenes</p>
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full"
                  >
                    Generar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <ReportGeneratorModal
          open={isReportModalOpen}
          onOpenChange={setIsReportModalOpen}
        />
      </div>
    </div>
  );
}
