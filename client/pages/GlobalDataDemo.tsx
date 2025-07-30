import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Database,
  ArrowLeft,
  Activity,
  Zap,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Monitor,
  Users,
  Pill,
  Calendar,
  Bed,
  FileText,
  TrendingUp,
  CheckCircle,
  Globe,
} from "lucide-react";
import { useMedicalData } from "@/context/MedicalDataContext";
import GlobalDataVisualization from "@/components/GlobalDataVisualization";

interface DataMovementDemo {
  id: string;
  sourceView: string;
  targetView: string;
  dataType: string;
  action: string;
  timestamp: string;
  status: "completed" | "in-progress" | "pending";
}

export default function GlobalDataDemo() {
  const navigate = useNavigate();
  const {
    patients,
    activePatients,
    vitalSigns,
    medications,
    appointments,
    getStatistics,
    saveToLocal,
  } = useMedicalData();

  const [dataMovements, setDataMovements] = useState<DataMovementDemo[]>([]);
  const [realTimeStats, setRealTimeStats] = useState(getStatistics());
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Initialize demo data movements
    const initialMovements: DataMovementDemo[] = [
      {
        id: "1",
        sourceView: "PatientIdentification",
        targetView: "ActivePatients",
        dataType: "Patient",
        action: "Nuevo paciente registrado",
        timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
        status: "completed",
      },
      {
        id: "2",
        sourceView: "ActivePatients",
        targetView: "ICUMonitoring",
        dataType: "VitalSigns",
        action: "Signos vitales actualizados",
        timestamp: new Date(Date.now() - 3 * 60000).toLocaleTimeString(),
        status: "completed",
      },
      {
        id: "3",
        sourceView: "PharmacyManagement",
        targetView: "PatientDetail",
        dataType: "Medication",
        action: "Nueva prescripción asignada",
        timestamp: new Date(Date.now() - 2 * 60000).toLocaleTimeString(),
        status: "completed",
      },
      {
        id: "4",
        sourceView: "AdmissionsManagement",
        targetView: "BedsManagement",
        dataType: "Bed",
        action: "Cama asignada a paciente",
        timestamp: new Date(Date.now() - 1 * 60000).toLocaleTimeString(),
        status: "in-progress",
      },
    ];

    setDataMovements(initialMovements);

    // Update stats every 5 seconds
    const statsInterval = setInterval(() => {
      setRealTimeStats(getStatistics());
    }, 5000);

    return () => clearInterval(statsInterval);
  }, [getStatistics]);

  const simulateDataMovement = () => {
    setIsSimulating(true);

    // Simulate new data movement
    const newMovement: DataMovementDemo = {
      id: Date.now().toString(),
      sourceView: "Telemedicine",
      targetView: "MedicalReports",
      dataType: "TelemedicineSession",
      action: "Sesión de telemedicina completada",
      timestamp: new Date().toLocaleTimeString(),
      status: "pending",
    };

    setDataMovements((prev) => [newMovement, ...prev.slice(0, 9)]);

    // Simulate progress
    setTimeout(() => {
      setDataMovements((prev) =>
        prev.map((movement) =>
          movement.id === newMovement.id
            ? { ...movement, status: "in-progress" as const }
            : movement,
        ),
      );
    }, 1000);

    setTimeout(() => {
      setDataMovements((prev) =>
        prev.map((movement) =>
          movement.id === newMovement.id
            ? { ...movement, status: "completed" as const }
            : movement,
        ),
      );
      setIsSimulating(false);
      saveToLocal(); // Auto-save changes
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "pending":
        return <Monitor className="w-4 h-4 text-yellow-500" />;
      default:
        return <Monitor className="w-4 h-4 text-gray-500" />;
    }
  };

  const getViewIcon = (viewName: string) => {
    const icons: Record<string, React.ReactNode> = {
      PatientIdentification: <Users className="w-4 h-4" />,
      ActivePatients: <Activity className="w-4 h-4" />,
      ICUMonitoring: <Monitor className="w-4 h-4" />,
      PharmacyManagement: <Pill className="w-4 h-4" />,
      AdmissionsManagement: <Bed className="w-4 h-4" />,
      BedsManagement: <Bed className="w-4 h-4" />,
      Telemedicine: <Globe className="w-4 h-4" />,
      MedicalReports: <FileText className="w-4 h-4" />,
      PatientDetail: <Eye className="w-4 h-4" />,
    };
    return icons[viewName] || <Database className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
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
              <h1 className="text-2xl font-bold text-gray-900">
                Demostración de Datos JSON Globales
              </h1>
              <p className="text-gray-600">
                Visualización en tiempo real del intercambio de datos entre
                todas las vistas médicas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={simulateDataMovement}
              disabled={isSimulating}
              className="flex items-center gap-2"
            >
              {isSimulating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              Simular Movimiento
            </Button>
          </div>
        </div>

        {/* Real-time Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pacientes</p>
                  <p className="text-xl font-bold text-blue-600">
                    {realTimeStats.totalPatients}
                  </p>
                </div>
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activos</p>
                  <p className="text-xl font-bold text-green-600">
                    {realTimeStats.activePatients}
                  </p>
                </div>
                <Activity className="w-6 h-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Camas</p>
                  <p className="text-xl font-bold text-purple-600">
                    {realTimeStats.availableBeds}
                  </p>
                </div>
                <Bed className="w-6 h-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Citas</p>
                  <p className="text-xl font-bold text-orange-600">
                    {realTimeStats.todaysAppointments}
                  </p>
                </div>
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Emergencias</p>
                  <p className="text-xl font-bold text-red-600">
                    {realTimeStats.emergencies}
                  </p>
                </div>
                <Monitor className="w-6 h-6 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock Bajo</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {realTimeStats.lowStockItems}
                  </p>
                </div>
                <Pill className="w-6 h-6 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="movements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="movements">Movimientos de Datos</TabsTrigger>
            <TabsTrigger value="visualization">
              Visualización Global
            </TabsTrigger>
            <TabsTrigger value="integration">Integración JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Movimientos de Datos en Tiempo Real
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Seguimiento en vivo del intercambio de información entre
                  vistas médicas
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataMovements.map((movement) => (
                    <Card key={movement.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(movement.status)}
                          <div className="flex items-center gap-2">
                            {getViewIcon(movement.sourceView)}
                            <span className="text-sm font-medium">
                              {movement.sourceView}
                            </span>
                          </div>
                          <div className="text-gray-400">→</div>
                          <div className="flex items-center gap-2">
                            {getViewIcon(movement.targetView)}
                            <span className="text-sm font-medium">
                              {movement.targetView}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            {movement.dataType}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {movement.timestamp}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        {movement.action}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visualization" className="space-y-4">
            <GlobalDataVisualization />
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Integración JSON del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Sistema Completamente Integrado:</strong> Todas las
                    vistas médicas almacenan y comparten información en formato
                    JSON para permitir movimientos rápidos de datos entre
                    diferentes módulos del sistema.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      ✅ Vistas Integradas
                    </h3>
                    <div className="space-y-2">
                      {[
                        "ActivePatients - Gestión de pacientes activos",
                        "ICUMonitoring - Monitoreo de cuidados intensivos",
                        "PharmacyManagement - Gestión de farmacia",
                        "AdmissionsManagement - Gestión de admisiones",
                        "BedsManagement - Gestión de camas",
                        "AppointmentsScheduler - Programación de citas",
                        "Telemedicine - Consultas virtuales",
                        "MedicalReports - Reportes médicos",
                        "TeamCommunication - Comunicación del equipo",
                        "MedicalEducation - Educación médica",
                        "VitalSignsMonitoring - Monitoreo de signos vitales",
                        "EmergencyProtocols - Protocolos de emergencia",
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      🔄 Flujos de Datos
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="font-medium text-blue-800">
                          Pacientes ↔ Signos Vitales
                        </div>
                        <div className="text-sm text-blue-600">
                          Intercambio automático de información vital entre
                          vistas
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="font-medium text-green-800">
                          Farmacia ↔ Prescripciones
                        </div>
                        <div className="text-sm text-green-600">
                          Sincronización de medicamentos y prescripciones
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="font-medium text-purple-800">
                          Admisiones ↔ Camas
                        </div>
                        <div className="text-sm text-purple-600">
                          Asignación automática y actualización de estados
                        </div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="font-medium text-orange-800">
                          Citas ↔ Telemedicina
                        </div>
                        <div className="text-sm text-orange-600">
                          Integración de consultas presenciales y virtuales
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    📄 Estructura JSON Global
                  </h4>
                  <pre className="text-xs overflow-x-auto">
                    {`{
  "patients": ${patients.length} registros,
  "vitalSigns": ${vitalSigns.length} registros,
  "medications": ${medications.length} registros,
  "appointments": ${appointments.length} registros,
  "inventory": datos de inventario,
  "beds": gestión de camas,
  "emergencies": protocolos de emergencia,
  "telemedicineSessions": sesiones virtuales,
  "reports": reportes médicos,
  "messages": comunicación del equipo,
  "educationModules": módulos educativos,
  "metadata": {
    "lastUpdate": "tiempo real",
    "syncStatus": "100%",
    "dataIntegrity": true
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
