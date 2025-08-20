import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  X,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";

interface DashboardStats {
  newRequests: number;
  underReview: number;
  accepted: number;
  rejected: number;
  totalRequests: number;
  avgResponseTime: string;
  alertsCount: number;
}

interface ChartDrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartType: string | null;
  data: DashboardStats;
}

export default function ChartDrillDownModal({ 
  isOpen, 
  onClose, 
  chartType, 
  data 
}: ChartDrillDownModalProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const [viewType, setViewType] = useState("chart");

  if (!chartType) return null;

  const getChartTitle = (type: string) => {
    switch (type) {
      case 'new': return 'Nuevas Solicitudes';
      case 'review': return 'Solicitudes en Revisión';
      case 'accepted': return 'Solicitudes Aceptadas';
      case 'rejected': return 'Solicitudes Rechazadas';
      case 'performance': return 'Métricas de Rendimiento';
      default: return 'Análisis Detallado';
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'new': return <FileText className="w-6 h-6 text-blue-600" />;
      case 'review': return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'accepted': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'rejected': return <XCircle className="w-6 h-6 text-red-600" />;
      case 'performance': return <Activity className="w-6 h-6 text-purple-600" />;
      default: return <BarChart3 className="w-6 h-6" />;
    }
  };

  // Mock data for detailed charts
  const getDetailedData = (type: string) => {
    const baseData = {
      daily: [
        { date: '2024-01-15', value: 12 },
        { date: '2024-01-16', value: 18 },
        { date: '2024-01-17', value: 15 },
        { date: '2024-01-18', value: 22 },
        { date: '2024-01-19', value: 19 },
        { date: '2024-01-20', value: 25 },
        { date: '2024-01-21', value: 24 },
      ],
      hourly: [
        { hour: '08:00', value: 3 },
        { hour: '09:00', value: 5 },
        { hour: '10:00', value: 8 },
        { hour: '11:00', value: 6 },
        { hour: '12:00', value: 4 },
        { hour: '13:00', value: 2 },
        { hour: '14:00', value: 7 },
        { hour: '15:00', value: 9 },
        { hour: '16:00', value: 8 },
        { hour: '17:00', value: 5 },
      ]
    };

    return baseData;
  };

  const getMetrics = (type: string) => {
    switch (type) {
      case 'new':
        return [
          { label: 'Promedio diario', value: '18.5', trend: '+12%', positive: true },
          { label: 'Pico máximo', value: '25', trend: 'Ayer 16:30', positive: null },
          { label: 'Tiempo promedio de llegada', value: '2.3h', trend: '-5%', positive: true },
          { label: 'Fuente principal', value: 'Email', trend: '78%', positive: null },
        ];
      case 'review':
        return [
          { label: 'Tiempo promedio en revisión', value: '4.2h', trend: '-8%', positive: true },
          { label: 'Casos complejos', value: '23%', trend: '+3%', positive: false },
          { label: 'Reasignaciones', value: '5%', trend: '-2%', positive: true },
          { label: 'Médicos activos', value: '12', trend: '+1', positive: true },
        ];
      case 'accepted':
        return [
          { label: 'Tasa de aceptación', value: '74%', trend: '+5%', positive: true },
          { label: 'Tiempo promedio decisión', value: '1.8h', trend: '-12%', positive: true },
          { label: 'Casos urgentes', value: '15%', trend: '+2%', positive: null },
          { label: 'Satisfacción EPS', value: '4.7/5', trend: '+0.2', positive: true },
        ];
      case 'rejected':
        return [
          { label: 'Tasa de rechazo', value: '6%', trend: '-3%', positive: true },
          { label: 'Motivo principal', value: 'Documentación', trend: '45%', positive: null },
          { label: 'Apelaciones', value: '12%', trend: '+1%', positive: false },
          { label: 'Tiempo promedio decisión', value: '1.2h', trend: '-5%', positive: true },
        ];
      case 'performance':
        return [
          { label: 'Disponibilidad sistema', value: '99.8%', trend: '+0.1%', positive: true },
          { label: 'Tiempo respuesta API', value: '120ms', trend: '-15ms', positive: true },
          { label: 'Procesamiento AI', value: '95%', trend: '-2%', positive: false },
          { label: 'Usuarios concurrentes', value: '45', trend: '+8', positive: true },
        ];
      default:
        return [];
    }
  };

  const handleExport = () => {
    // Here you would implement the export functionality
    console.log('Exporting chart data for:', chartType);
  };

  const detailedData = getDetailedData(chartType);
  const metrics = getMetrics(chartType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getChartIcon(chartType)}
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {getChartTitle(chartType)}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Análisis detallado y métricas avanzadas
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Controls */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="90d">Últimos 90 días</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chart">Gráfico</SelectItem>
                  <SelectItem value="table">Tabla</SelectItem>
                  <SelectItem value="both">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    {metric.trend && (
                      <div className="flex items-center gap-1">
                        {metric.positive === true && (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        )}
                        {metric.positive === false && (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${
                          metric.positive === true ? 'text-green-600' : 
                          metric.positive === false ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.trend}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Visualization */}
          {(viewType === 'chart' || viewType === 'both') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Tendencia Temporal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Gráfico interactivo</p>
                    <p className="text-sm text-gray-500">
                      Aquí se mostraría el gráfico de {getChartTitle(chartType).toLowerCase()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Table */}
          {(viewType === 'table' || viewType === 'both') && (
            <Card>
              <CardHeader>
                <CardTitle>Datos Detallados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Período</th>
                        <th className="text-left p-2">Valor</th>
                        <th className="text-left p-2">Cambio</th>
                        <th className="text-left p-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedData.daily.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            {new Date(item.date).toLocaleDateString('es-ES')}
                          </td>
                          <td className="p-2 font-medium">{item.value}</td>
                          <td className="p-2">
                            <Badge variant={index > 0 && item.value > detailedData.daily[index-1].value ? "default" : "secondary"}>
                              {index > 0 ? (item.value - detailedData.daily[index-1].value > 0 ? '+' : '') + (item.value - detailedData.daily[index-1].value) : '-'}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Badge variant="outline">Normal</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insights and Recommendations */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Insights y Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-blue-800">
                {chartType === 'new' && (
                  <>
                    <p>• El volumen de nuevas solicitudes ha aumentado un 12% esta semana</p>
                    <p>• El pico de actividad se registra entre las 14:00 y 16:00 horas</p>
                    <p>• Se recomienda asignar más recursos durante las horas pico</p>
                  </>
                )}
                {chartType === 'review' && (
                  <>
                    <p>• El tiempo de revisión ha mejorado un 8% en promedio</p>
                    <p>• Los casos complejos requieren 2.3x más tiempo de evaluación</p>
                    <p>• Se sugiere implementar pre-clasificación automática</p>
                  </>
                )}
                {chartType === 'accepted' && (
                  <>
                    <p>• La tasa de aceptación se mantiene estable en 74%</p>
                    <p>• Los casos urgentes tienen 95% de tasa de aceptación</p>
                    <p>• La satisfacción de las EPS ha mejorado significativamente</p>
                  </>
                )}
                {chartType === 'rejected' && (
                  <>
                    <p>• La tasa de rechazo ha disminuido un 3% este mes</p>
                    <p>• El 45% de rechazos se debe a documentación incompleta</p>
                    <p>• Se recomienda mejorar las guías de documentación para EPS</p>
                  </>
                )}
                {chartType === 'performance' && (
                  <>
                    <p>• El sistema mantiene una disponibilidad del 99.8%</p>
                    <p>• El procesamiento AI ha tenido una ligera disminución del 2%</p>
                    <p>• Se recomienda revisar y optimizar los algoritmos de IA</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
