import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Bed,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar,
  Filter,
  ArrowLeft,
  Building,
  Heart,
  Stethoscope,
  Shield,
  Target,
  Timer,
  FileText,
  Printer,
  Mail,
  Share2,
  Database,
  ChartBar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  trend: "up" | "down" | "stable";
  percentage: number;
  icon: any;
  color: string;
}

interface SectorStats {
  sector: string;
  totalBeds: number;
  occupiedBeds: number;
  occupancyRate: number;
  avgStayDays: number;
  dischargesThisMonth: number;
  criticalPatients: number;
}

interface DoctorPerformance {
  name: string;
  specialty: string;
  patientsThisMonth: number;
  avgStayDays: number;
  satisfactionRate: number;
  procedures: number;
}

const mockMetrics: MetricCard[] = [
  {
    id: "total-patients",
    title: "Pacientes Activos",
    value: 245,
    subtitle: "En hospitalización",
    trend: "up",
    percentage: 12,
    icon: Users,
    color: "blue",
  },
  {
    id: "bed-occupancy",
    title: "Ocupación de Camas",
    value: "87%",
    subtitle: "143 de 165 camas",
    trend: "up",
    percentage: 5,
    icon: Bed,
    color: "green",
  },
  {
    id: "avg-stay",
    title: "Estancia Promedio",
    value: "4.2 días",
    subtitle: "Esta semana",
    trend: "down",
    percentage: 8,
    icon: Clock,
    color: "yellow",
  },
  {
    id: "critical-alerts",
    title: "Alertas Críticas",
    value: 8,
    subtitle: "Requieren atención",
    trend: "down",
    percentage: 15,
    icon: AlertTriangle,
    color: "red",
  },
  {
    id: "discharges",
    title: "Altas del Mes",
    value: 156,
    subtitle: "Meta: 180",
    trend: "up",
    percentage: 22,
    icon: CheckCircle,
    color: "purple",
  },
  {
    id: "eps-referrals",
    title: "Remisiones EPS",
    value: 89,
    subtitle: "Este mes",
    trend: "up",
    percentage: 18,
    icon: FileText,
    color: "indigo",
  },
];

const mockSectorStats: SectorStats[] = [
  {
    sector: "UCI",
    totalBeds: 20,
    occupiedBeds: 18,
    occupancyRate: 90,
    avgStayDays: 6.8,
    dischargesThisMonth: 25,
    criticalPatients: 12,
  },
  {
    sector: "Urgencias",
    totalBeds: 30,
    occupiedBeds: 25,
    occupancyRate: 83,
    avgStayDays: 1.2,
    dischargesThisMonth: 180,
    criticalPatients: 8,
  },
  {
    sector: "Cardiología",
    totalBeds: 25,
    occupiedBeds: 20,
    occupancyRate: 80,
    avgStayDays: 4.5,
    dischargesThisMonth: 45,
    criticalPatients: 5,
  },
  {
    sector: "Ginecología",
    totalBeds: 22,
    occupiedBeds: 15,
    occupancyRate: 68,
    avgStayDays: 2.8,
    dischargesThisMonth: 67,
    criticalPatients: 2,
  },
  {
    sector: "Pediatría",
    totalBeds: 18,
    occupiedBeds: 12,
    occupancyRate: 67,
    avgStayDays: 3.1,
    dischargesThisMonth: 34,
    criticalPatients: 3,
  },
  {
    sector: "Cirugía",
    totalBeds: 28,
    occupiedBeds: 22,
    occupancyRate: 79,
    avgStayDays: 5.2,
    dischargesThisMonth: 52,
    criticalPatients: 4,
  },
];

const mockDoctorPerformance: DoctorPerformance[] = [
  {
    name: "Dr. Alberto Ramírez",
    specialty: "Cardiología",
    patientsThisMonth: 45,
    avgStayDays: 4.2,
    satisfactionRate: 96,
    procedures: 28,
  },
  {
    name: "Dra. Carmen López",
    specialty: "Ginecología",
    patientsThisMonth: 52,
    avgStayDays: 2.8,
    satisfactionRate: 94,
    procedures: 35,
  },
  {
    name: "Dr. Fernando Castillo",
    specialty: "Urgencias",
    patientsThisMonth: 89,
    avgStayDays: 1.1,
    satisfactionRate: 92,
    procedures: 67,
  },
  {
    name: "Dra. Patricia Morales",
    specialty: "UCI",
    patientsThisMonth: 38,
    avgStayDays: 6.5,
    satisfactionRate: 98,
    procedures: 42,
  },
];

export default function ClinicalReports() {
  const [dateRange, setDateRange] = useState("7days");
  const [selectedSector, setSelectedSector] = useState("ALL");
  const [reportType, setReportType] = useState("summary");
  const navigate = useNavigate();

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-500 text-blue-600 bg-blue-50 border-blue-200",
      green: "bg-green-500 text-green-600 bg-green-50 border-green-200",
      slate: "bg-slate-500 text-slate-600 bg-slate-50 border-slate-200",
      red: "bg-red-500 text-red-600 bg-red-50 border-red-200",
      purple: "bg-purple-500 text-purple-600 bg-purple-50 border-purple-200",
      indigo: "bg-indigo-500 text-indigo-600 bg-indigo-50 border-indigo-200",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const exportReport = (format: string) => {
    console.log(`Exportando reporte en formato: ${format}`);
    // Aquí se implementaría la lógica de exportación
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      {/* Header */}
      <motion.div
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl border-0 p-8 mb-6 relative overflow-hidden"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <BarChart3 className="w-full h-full text-purple-500" />
          </motion.div>
        </div>

        <div className="flex justify-between items-center relative z-10">
          <motion.div
            className="flex items-center gap-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              onClick={() => navigate("/medical-dashboard")}
              className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <motion.div
                className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <ChartBar className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-black text-black tracking-tight">
                  REPORTES{" "}
                  <span className="text-purple-500 font-light">CLÍNICOS</span>
                </h1>
                <p className="text-black font-medium">
                  Análisis y Métricas Hospitalarias
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge
              variant="outline"
              className="bg-purple-100 border-purple-300 text-purple-700 px-4 py-2"
            >
              <Database className="w-4 h-4 mr-2" />
              Datos en Tiempo Real
            </Badge>
            <Button
              variant="outline"
              onClick={() => exportReport("PDF")}
              className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Filtros de Reporte */}
      <motion.div
        className="mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Período de Tiempo
                </Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24hours">Últimas 24 horas</SelectItem>
                    <SelectItem value="7days">Últimos 7 días</SelectItem>
                    <SelectItem value="30days">Últimos 30 días</SelectItem>
                    <SelectItem value="3months">Últimos 3 meses</SelectItem>
                    <SelectItem value="1year">Último año</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Sector
                </Label>
                <Select
                  value={selectedSector}
                  onValueChange={setSelectedSector}
                >
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los Sectores</SelectItem>
                    <SelectItem value="UCI">UCI</SelectItem>
                    <SelectItem value="URGENCIAS">Urgencias</SelectItem>
                    <SelectItem value="CARDIOLOGIA">Cardiología</SelectItem>
                    <SelectItem value="GINECOLOGIA">Ginecología</SelectItem>
                    <SelectItem value="PEDIATRIA">Pediatría</SelectItem>
                    <SelectItem value="CIRUGIA">Cirugía</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Tipo de Reporte
                </Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Resumen Ejecutivo</SelectItem>
                    <SelectItem value="detailed">Reporte Detallado</SelectItem>
                    <SelectItem value="comparative">
                      Análisis Comparativo
                    </SelectItem>
                    <SelectItem value="performance">
                      Rendimiento Médico
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                <Button variant="outline" className="flex-1 h-11">
                  <Filter className="w-4 h-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métricas Principales */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {mockMetrics.map((metric, index) => {
          const colorClasses = getColorClasses(metric.color).split(" ");
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-12 h-12 ${colorClasses[0]} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <metric.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-black">
                            {metric.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {metric.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-3xl font-bold text-black mb-1">
                            {metric.value}
                          </p>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(metric.trend)}
                            <span
                              className={`text-sm font-semibold ${
                                metric.trend === "up"
                                  ? "text-green-600"
                                  : metric.trend === "down"
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {metric.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tabs de Reportes Detallados */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Tabs defaultValue="sectors" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sectors" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Por Sectores
            </TabsTrigger>
            <TabsTrigger value="doctors" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Médicos
            </TabsTrigger>
            <TabsTrigger
              value="eps-analysis"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Análisis EPS
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Calidad
            </TabsTrigger>
          </TabsList>

          {/* Tab: Análisis por Sectores */}
          <TabsContent value="sectors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-500" />
                  Rendimiento por Sectores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSectorStats.map((sector, index) => (
                    <motion.div
                      key={sector.sector}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-black">
                            {sector.sector}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {sector.occupiedBeds} de {sector.totalBeds} camas
                            ocupadas
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              sector.occupancyRate > 85
                                ? "destructive"
                                : sector.occupancyRate > 70
                                  ? "warning"
                                  : "success"
                            }
                          >
                            {sector.occupancyRate}% Ocupación
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded border border-blue-200">
                          <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-blue-600">
                            {sector.avgStayDays}
                          </p>
                          <p className="text-xs text-gray-600">Días promedio</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-green-600">
                            {sector.dischargesThisMonth}
                          </p>
                          <p className="text-xs text-gray-600">
                            Altas este mes
                          </p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded border border-red-200">
                          <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-red-600">
                            {sector.criticalPatients}
                          </p>
                          <p className="text-xs text-gray-600">
                            Pacientes críticos
                          </p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded border border-purple-200">
                          <Bed className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-purple-600">
                            {sector.totalBeds}
                          </p>
                          <p className="text-xs text-gray-600">Total camas</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded border border-slate-200">
                          <PieChart className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-yellow-600">
                            {Math.round(
                              (sector.dischargesThisMonth / sector.totalBeds) *
                                10,
                            ) / 10}
                          </p>
                          <p className="text-xs text-gray-600">Rotación</p>
                        </div>
                      </div>

                      <div className="mt-4 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            sector.occupancyRate > 85
                              ? "bg-red-500"
                              : sector.occupancyRate > 70
                                ? "bg-slate-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${sector.occupancyRate}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Rendimiento de Médicos */}
          <TabsContent value="doctors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-green-500" />
                  Rendimiento del Personal Médico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDoctorPerformance.map((doctor, index) => (
                    <motion.div
                      key={doctor.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-black">
                            {doctor.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {doctor.specialty}
                          </p>
                        </div>
                        <Badge variant="success">
                          {doctor.satisfactionRate}% Satisfacción
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded border border-blue-200">
                          <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-blue-600">
                            {doctor.patientsThisMonth}
                          </p>
                          <p className="text-xs text-gray-600">
                            Pacientes atendidos
                          </p>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded border border-slate-200">
                          <Clock className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-yellow-600">
                            {doctor.avgStayDays}
                          </p>
                          <p className="text-xs text-gray-600">Días promedio</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded border border-purple-200">
                          <Activity className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-purple-600">
                            {doctor.procedures}
                          </p>
                          <p className="text-xs text-gray-600">
                            Procedimientos
                          </p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                          <Heart className="w-6 h-6 text-green-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-green-600">
                            {doctor.satisfactionRate}%
                          </p>
                          <p className="text-xs text-gray-600">Satisfacción</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Análisis EPS */}
          <TabsContent value="eps-analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  Análisis de Remisiones EPS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-black">
                      Remisiones por EPS
                    </h4>
                    <div className="space-y-3">
                      {[
                        { eps: "NUEVA_EPS", count: 34, percentage: 38 },
                        { eps: "SANITAS", count: 22, percentage: 25 },
                        { eps: "FAMISANAR", count: 18, percentage: 20 },
                        { eps: "SURA", count: 10, percentage: 11 },
                        { eps: "COMPENSAR", count: 5, percentage: 6 },
                      ].map((eps) => (
                        <div
                          key={eps.eps}
                          className="flex items-center justify-between p-3 bg-indigo-50 rounded border border-indigo-200"
                        >
                          <span className="font-medium text-black">
                            {eps.eps}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                              {eps.count} remisiones
                            </span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-indigo-500 rounded-full"
                                style={{ width: `${eps.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-indigo-600">
                              {eps.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-black">
                      Tiempos de Respuesta
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          metric: "Tiempo promedio de autorización",
                          value: "2.4 horas",
                          status: "good",
                        },
                        {
                          metric: "Remisiones pendientes",
                          value: "12",
                          status: "warning",
                        },
                        {
                          metric: "Tasa de aprobación",
                          value: "94%",
                          status: "good",
                        },
                        {
                          metric: "Tiempo de traslado promedio",
                          value: "45 min",
                          status: "good",
                        },
                      ].map((metric) => (
                        <div
                          key={metric.metric}
                          className={`p-3 rounded border ${
                            metric.status === "good"
                              ? "bg-green-50 border-green-200"
                              : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {metric.metric}
                            </span>
                            <span className="font-bold text-black">
                              {metric.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Indicadores de Calidad */}
          <TabsContent value="quality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  Indicadores de Calidad Hospitalaria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Satisfacción del Paciente",
                      value: "4.7/5.0",
                      target: "4.5",
                      status: "success",
                      icon: Heart,
                    },
                    {
                      title: "Tiempo de Espera",
                      value: "18 min",
                      target: "< 30 min",
                      status: "success",
                      icon: Timer,
                    },
                    {
                      title: "Tasa de Readmisión",
                      value: "3.2%",
                      target: "< 5%",
                      status: "success",
                      icon: TrendingDown,
                    },
                    {
                      title: "Infecciones Nosocomiales",
                      value: "1.8%",
                      target: "< 2%",
                      status: "success",
                      icon: Shield,
                    },
                    {
                      title: "Mortalidad Intrahospitalaria",
                      value: "2.1%",
                      target: "< 3%",
                      status: "success",
                      icon: Activity,
                    },
                    {
                      title: "Cumplimiento Protocolos",
                      value: "96%",
                      target: "> 95%",
                      status: "success",
                      icon: CheckCircle,
                    },
                  ].map((indicator, index) => (
                    <motion.div
                      key={indicator.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            indicator.status === "success"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          <indicator.icon
                            className={`w-6 h-6 ${
                              indicator.status === "success"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-black">
                            {indicator.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Meta: {indicator.target}
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-black mb-2">
                          {indicator.value}
                        </p>
                        <Badge
                          variant={
                            indicator.status === "success"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {indicator.status === "success"
                            ? "Cumplido"
                            : "No Cumplido"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Botones de Acción */}
      <motion.div
        className="flex justify-center gap-4 mt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button variant="outline" onClick={() => exportReport("PDF")}>
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
        <Button variant="outline" onClick={() => exportReport("Excel")}>
          <FileText className="w-4 h-4 mr-2" />
          Exportar Excel
        </Button>
        <Button variant="outline" onClick={() => exportReport("Print")}>
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
        <Button variant="outline" onClick={() => exportReport("Email")}>
          <Mail className="w-4 h-4 mr-2" />
          Enviar por Email
        </Button>
      </motion.div>
    </div>
  );
}
