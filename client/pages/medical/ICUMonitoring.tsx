import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useMedicalData } from "@/context/MedicalDataContext";
import {
  ArrowLeft,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  User,
  Monitor,
  Zap,
  Clock,
  Brain,
  Target,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react";
import VitalSignsChart from "@/components/medical/VitalSignsChart";
import AlertsManager from "@/components/medical/AlertsManager";
import BreadcrumbNavigation, {
  MedicalBreadcrumb,
} from "@/components/ui/breadcrumb-navigation";
import LoadingState, { useLoadingState } from "@/components/ui/loading-state";

const mockICUPatients = [
  {
    id: "ICU-001",
    patient: { name: "María Elena Rodríguez", age: 67, bed: "UCI-101" },
    condition: "Post-IAM, inestabilidad hemodinámica",
    severity: "CRITICO",
    ventilator: { status: "CONECTADO", mode: "SIMV", fio2: 40, peep: 8 },
    vitals: {
      hr: { value: 120, trend: "SUBIENDO", alert: true },
      bp: { systolic: 180, diastolic: 95, trend: "ESTABLE", alert: true },
      temp: { value: 38.5, trend: "BAJANDO", alert: false },
      spo2: { value: 89, trend: "SUBIENDO", alert: true },
      rr: { value: 28, trend: "ESTABLE", alert: true },
    },
    medications: ["Noradrenalina", "Dobutamina", "Heparina"],
    lastUpdate: "Hace 1 min",
    glasgow: 15,
    apache: 18,
    interventions: ["Catéter Swan-Ganz", "Catéter arterial", "Sonda vesical"],
  },
  {
    id: "ICU-002",
    patient: { name: "Roberto Jiménez", age: 52, bed: "UCI-102" },
    condition: "Post-operatorio neurocirugía, edema cerebral",
    severity: "GRAVE",
    ventilator: { status: "CONECTADO", mode: "AC", fio2: 35, peep: 5 },
    vitals: {
      hr: { value: 85, trend: "ESTABLE", alert: false },
      bp: { systolic: 140, diastolic: 80, trend: "ESTABLE", alert: false },
      temp: { value: 37.2, trend: "ESTABLE", alert: false },
      spo2: { value: 96, trend: "ESTABLE", alert: false },
      rr: { value: 18, trend: "ESTABLE", alert: false },
    },
    medications: ["Manitol", "Dexametasona", "Fenitoína"],
    lastUpdate: "Hace 2 min",
    glasgow: 8,
    apache: 15,
    interventions: [
      "PIC monitor",
      "Catéter venoso central",
      "Sonda nasogástrica",
    ],
  },
];

export default function ICUMonitoring() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(mockICUPatients);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPatientForChart, setSelectedPatientForChart] =
    useState<any>(null);
  const [showCharts, setShowCharts] = useState(false);
  const { isLoading, startLoading, stopLoading, loadingMessage } =
    useLoadingState();

  useEffect(() => {
    // Simulate initial data loading
    startLoading("Cargando datos de pacientes UCI...");

    setTimeout(() => {
      setPatients(mockICUPatients);
      stopLoading();
    }, 1500);

    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICO":
        return "bg-red-500 text-white";
      case "GRAVE":
        return "bg-orange-500 text-white";
      case "MODERADO":
        return "bg-yellow-500 text-black";
      case "ESTABLE":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "SUBIENDO":
        return "↗️";
      case "BAJANDO":
        return "↘️";
      case "ESTABLE":
        return "➡️";
      default:
        return "➡️";
    }
  };

  const getVitalStatus = (vital: any) => {
    return vital.alert ? "text-red-600" : "text-green-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-4">
          <MedicalBreadcrumb
            currentSection="Monitoreo UCI"
            loading={isLoading}
          />
        </div>

        {isLoading ? (
          <LoadingState variant="medical" message={loadingMessage} size="lg" />
        ) : (
          <>
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
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Monitoreo UCI
                  </h1>
                  <p className="text-muted-foreground">
                    Cuidados intensivos en tiempo real -{" "}
                    {currentTime.toLocaleTimeString("es-CO")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white animate-pulse">
                  {patients.filter((p) => p.severity === "CRITICO").length}{" "}
                  Críticos
                </Badge>
                <Badge className="bg-orange-500 text-white">
                  <Bell className="w-3 h-3 mr-1" />
                  Sistema de Alertas Activo
                </Badge>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    // Switch to alerts tab
                    const alertsTab = document.querySelector(
                      '[value="alerts"]',
                    ) as HTMLElement;
                    if (alertsTab) alertsTab.click();
                  }}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Ver Alertas
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {patients.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pacientes UCI
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {patients.filter((p) => p.severity === "CRITICO").length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Estado Crítico
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      patients.filter(
                        (p) => p.ventilator.status === "CONECTADO",
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Con Ventilador
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-muted-foreground">
                    Camas Disponibles
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">15</div>
                  <div className="text-sm text-muted-foreground">
                    Alertas Activas
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="monitoring" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger
                  value="monitoring"
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  Monitoreo
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Alertas
                </TabsTrigger>
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Gráficas
                </TabsTrigger>
                <TabsTrigger
                  value="ventilators"
                  className="flex items-center gap-2"
                >
                  <Wind className="w-4 h-4" />
                  Ventiladores
                </TabsTrigger>
                <TabsTrigger value="scores" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Scores
                </TabsTrigger>
                <TabsTrigger
                  value="interventions"
                  className="flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Intervenciones
                </TabsTrigger>
              </TabsList>

              <TabsContent value="monitoring" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {patients.map((patient) => (
                    <Card
                      key={patient.id}
                      className="hover:shadow-lg transition-shadow border-2"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">
                              {patient.patient.name}
                            </h3>
                          </div>
                          <Badge className={getSeverityColor(patient.severity)}>
                            {patient.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {patient.patient.bed} • {patient.patient.age} años •{" "}
                          {patient.condition}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Signos Vitales */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                              <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium">FC</span>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`font-bold ${getVitalStatus(patient.vitals.hr)}`}
                                >
                                  {patient.vitals.hr.value}{" "}
                                  {getTrendIcon(patient.vitals.hr.trend)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  lpm
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium">PA</span>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`font-bold ${getVitalStatus(patient.vitals.bp)}`}
                                >
                                  {patient.vitals.bp.systolic}/
                                  {patient.vitals.bp.diastolic}{" "}
                                  {getTrendIcon(patient.vitals.bp.trend)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  mmHg
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-medium">T°</span>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`font-bold ${getVitalStatus(patient.vitals.temp)}`}
                                >
                                  {patient.vitals.temp.value}{" "}
                                  {getTrendIcon(patient.vitals.temp.trend)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  °C
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 bg-cyan-50 rounded">
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-cyan-500" />
                                <span className="text-sm font-medium">
                                  SpO2
                                </span>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`font-bold ${getVitalStatus(patient.vitals.spo2)}`}
                                >
                                  {patient.vitals.spo2.value}{" "}
                                  {getTrendIcon(patient.vitals.spo2.trend)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  %
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                              <div className="flex items-center gap-2">
                                <Wind className="w-4 h-4 text-purple-500" />
                                <span className="text-sm font-medium">FR</span>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`font-bold ${getVitalStatus(patient.vitals.rr)}`}
                                >
                                  {patient.vitals.rr.value}{" "}
                                  {getTrendIcon(patient.vitals.rr.trend)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  rpm
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                              <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium">
                                  Glasgow
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-green-600">
                                  {patient.glasgow}/15
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ventilador */}
                        {patient.ventilator.status === "CONECTADO" && (
                          <div className="bg-blue-50 p-3 rounded">
                            <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <Wind className="w-4 h-4 text-blue-600" />
                              Ventilación Mecánica
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <strong>Modo:</strong> {patient.ventilator.mode}
                              </div>
                              <div>
                                <strong>FiO2:</strong> {patient.ventilator.fio2}
                                %
                              </div>
                              <div>
                                <strong>PEEP:</strong> {patient.ventilator.peep}{" "}
                                cmH2O
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Medicamentos */}
                        <div className="space-y-2">
                          <div className="font-semibold text-sm">
                            Medicamentos críticos:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {patient.medications.map((med, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {med}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              setSelectedPatientForChart(patient);
                              setShowCharts(true);
                            }}
                          >
                            Ver Gráficas
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            Alertas
                          </Button>
                        </div>

                        <div className="text-xs text-muted-foreground text-center">
                          Última actualización: {patient.lastUpdate}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <AlertsManager
                  patients={patients}
                  onAlertAction={(alertId, action) => {
                    console.log(`Alert ${alertId} ${action}`);
                  }}
                />
              </TabsContent>

              <TabsContent value="charts" className="space-y-6">
                {selectedPatientForChart ? (
                  <VitalSignsChart
                    patientId={selectedPatientForChart.id}
                    patientName={selectedPatientForChart.patient.name}
                    autoUpdate={true}
                  />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Selecciona un Paciente
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Haz clic en "Ver Gráficas" de cualquier paciente para
                        ver sus signos vitales en tiempo real
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {patients.map((patient) => (
                          <Card
                            key={patient.id}
                            className="p-4 cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
                            onClick={() => setSelectedPatientForChart(patient)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {patient.patient.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {patient.patient.bed}
                                </div>
                              </div>
                              <div className="ml-auto">
                                <BarChart3 className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="ventilators" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Ventiladores Activos */}
                  {[
                    {
                      id: "VENT-001",
                      patient: "Juan Pérez",
                      room: "UCI-A-03",
                      mode: "A/C",
                      fio2: 60,
                      peep: 8,
                      rr: 16,
                      tv: 480,
                      pip: 28,
                      compliance: 42,
                      status: "STABLE",
                      alarms: [],
                    },
                    {
                      id: "VENT-002",
                      patient: "María García",
                      room: "UCI-A-05",
                      mode: "SIMV",
                      fio2: 40,
                      peep: 5,
                      rr: 14,
                      tv: 420,
                      pip: 22,
                      compliance: 38,
                      status: "WARNING",
                      alarms: ["Presión alta"],
                    },
                    {
                      id: "VENT-003",
                      patient: "Carlos López",
                      room: "UCI-B-02",
                      mode: "PSV",
                      fio2: 35,
                      peep: 6,
                      rr: 18,
                      tv: 450,
                      pip: 25,
                      compliance: 45,
                      status: "CRITICAL",
                      alarms: ["Desconexión", "FiO2 bajo"],
                    },
                    {
                      id: "VENT-004",
                      patient: "Ana Rodríguez",
                      room: "UCI-B-07",
                      mode: "CPAP",
                      fio2: 30,
                      peep: 4,
                      rr: 12,
                      tv: 380,
                      pip: 18,
                      compliance: 48,
                      status: "STABLE",
                      alarms: [],
                    },
                  ].map((ventilator) => (
                    <Card
                      key={ventilator.id}
                      className={`p-4 border-l-4 ${
                        ventilator.status === "CRITICAL"
                          ? "border-red-500 bg-red-50"
                          : ventilator.status === "WARNING"
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-green-500 bg-green-50"
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-lg">
                              {ventilator.id}
                            </div>
                            <div className="font-medium">
                              {ventilator.patient}
                            </div>
                            <div className="text-sm text-gray-600">
                              {ventilator.room}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                ventilator.status === "CRITICAL"
                                  ? "destructive"
                                  : ventilator.status === "WARNING"
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {ventilator.status}
                            </Badge>
                            <div className="text-sm text-gray-600 mt-1">
                              Modo: {ventilator.mode}
                            </div>
                          </div>
                        </div>

                        {/* Parámetros Ventilatorios */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-2 bg-white rounded">
                            <div className="text-xs text-gray-600">FiO₂</div>
                            <div className="font-bold text-lg">
                              {ventilator.fio2}%
                            </div>
                          </div>
                          <div className="text-center p-2 bg-white rounded">
                            <div className="text-xs text-gray-600">PEEP</div>
                            <div className="font-bold text-lg">
                              {ventilator.peep}
                            </div>
                            <div className="text-xs">cmH₂O</div>
                          </div>
                          <div className="text-center p-2 bg-white rounded">
                            <div className="text-xs text-gray-600">FR</div>
                            <div className="font-bold text-lg">
                              {ventilator.rr}
                            </div>
                            <div className="text-xs">rpm</div>
                          </div>
                          <div className="text-center p-2 bg-white rounded">
                            <div className="text-xs text-gray-600">VT</div>
                            <div className="font-bold text-lg">
                              {ventilator.tv}
                            </div>
                            <div className="text-xs">ml</div>
                          </div>
                          <div className="text-center p-2 bg-white rounded">
                            <div className="text-xs text-gray-600">PIP</div>
                            <div className="font-bold text-lg">
                              {ventilator.pip}
                            </div>
                            <div className="text-xs">cmH₂O</div>
                          </div>
                          <div className="text-center p-2 bg-white rounded">
                            <div className="text-xs text-gray-600">Compl</div>
                            <div className="font-bold text-lg">
                              {ventilator.compliance}
                            </div>
                            <div className="text-xs">ml/cmH₂O</div>
                          </div>
                        </div>

                        {/* Alarmas */}
                        {ventilator.alarms.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-red-600">
                              Alarmas Activas:
                            </div>
                            {ventilator.alarms.map((alarm, idx) => (
                              <Badge
                                key={idx}
                                variant="destructive"
                                className="mr-2"
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {alarm}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Ajustar
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Gráficas
                          </Button>
                          <Button size="sm" variant="outline">
                            <Bell className="h-4 w-4 mr-2" />
                            Alarmas
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Panel de Control Central */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-blue-600" />
                      Panel de Control Central
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Estado General */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Estado General</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">
                              Ventiladores Activos
                            </span>
                            <span className="font-bold">4/8</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Estados Críticos</span>
                            <span className="font-bold text-red-600">1</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Alarmas Activas</span>
                            <span className="font-bold text-yellow-600">3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Mantenimiento</span>
                            <span className="font-bold">0</span>
                          </div>
                        </div>
                      </div>

                      {/* Configuraciones Rápidas */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Configuraciones</h4>
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            Protocolo COVID
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            Destete Estándar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            Ventilación Protectiva
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            Configuración Personalizada
                          </Button>
                        </div>
                      </div>

                      {/* Métricas en Tiempo Real */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Métricas Globales</h4>
                        <div className="space-y-2">
                          <div className="p-2 bg-blue-50 rounded">
                            <div className="text-xs text-gray-600">
                              FiO₂ Promedio
                            </div>
                            <div className="font-bold">46%</div>
                          </div>
                          <div className="p-2 bg-green-50 rounded">
                            <div className="text-xs text-gray-600">
                              PEEP Promedio
                            </div>
                            <div className="font-bold">5.8 cmH₂O</div>
                          </div>
                          <div className="p-2 bg-purple-50 rounded">
                            <div className="text-xs text-gray-600">
                              Compliance Promedio
                            </div>
                            <div className="font-bold">43.2 ml/cmH₂O</div>
                          </div>
                        </div>
                      </div>

                      {/* Alertas del Sistema */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Alertas del Sistema</h4>
                        <div className="space-y-2">
                          {[
                            {
                              type: "CRITICAL",
                              message: "VENT-003: Desconexión detectada",
                              time: "1 min",
                            },
                            {
                              type: "WARNING",
                              message: "VENT-002: Presión elevada",
                              time: "3 min",
                            },
                            {
                              type: "INFO",
                              message: "VENT-001: Parámetros ajustados",
                              time: "15 min",
                            },
                          ].map((alert, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded border-l-4 ${
                                alert.type === "CRITICAL"
                                  ? "border-red-500 bg-red-50"
                                  : alert.type === "WARNING"
                                    ? "border-yellow-500 bg-yellow-50"
                                    : "border-blue-500 bg-blue-50"
                              }`}
                            >
                              <div className="text-xs font-medium">
                                {alert.message}
                              </div>
                              <div className="text-xs text-gray-500">
                                {alert.time}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scores" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {patients.map((patient) => (
                    <Card key={patient.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {patient.patient.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded">
                            <div className="text-2xl font-bold text-blue-600">
                              {patient.apache}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              APACHE II
                            </div>
                            <div className="text-xs mt-1">
                              Mortalidad: {patient.apache * 2}%
                            </div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded">
                            <div className="text-2xl font-bold text-green-600">
                              {patient.glasgow}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Glasgow
                            </div>
                            <div className="text-xs mt-1">
                              {patient.glasgow >= 13
                                ? "Leve"
                                : patient.glasgow >= 9
                                  ? "Moderado"
                                  : "Severo"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="interventions" className="space-y-6">
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <Card key={patient.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {patient.patient.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="font-semibold">
                            Intervenciones activas:
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {patient.interventions.map(
                              (intervention, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="justify-center p-2"
                                >
                                  {intervention}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
