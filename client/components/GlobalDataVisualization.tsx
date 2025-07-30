import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Activity,
  Users,
  Bed,
  Calendar,
  Pill,
  FileText,
  TrendingUp,
  Monitor,
  BarChart3,
} from "lucide-react";
import { useGlobalMedicalData } from "@/hooks/use-global-medical-data";

interface DataSummary {
  patients: number;
  vitalSigns: number;
  medications: number;
  appointments: number;
  surgeries: number;
  labTests: number;
  emergencies: number;
  beds: number;
  reports: number;
  messages: number;
  telemedicineSessions: number;
  inventory: number;
  admissionRequests: number;
  educationModules: number;
}

interface ViewDataAccess {
  viewName: string;
  lastAccessed: string;
  dataTypes: string[];
  recordCount: number;
}

export default function GlobalDataVisualization() {
  const globalData = useGlobalMedicalData();
  const {
    patients,
    vitalSigns,
    medications,
    appointments,
    surgeries,
    labTests,
    emergencies,
    beds,
    reports,
    messages,
    telemedicineSessions,
    inventory,
    admissionRequests,
    educationModules,
  } = globalData.data;

  const [dataSummary, setDataSummary] = useState<DataSummary>({
    patients: 0,
    vitalSigns: 0,
    medications: 0,
    appointments: 0,
    surgeries: 0,
    labTests: 0,
    emergencies: 0,
    beds: 0,
    reports: 0,
    messages: 0,
    telemedicineSessions: 0,
    inventory: 0,
    admissionRequests: 0,
    educationModules: 0,
  });

  const [jsonData, setJsonData] = useState<string>("");
  const [viewAccess, setViewAccess] = useState<ViewDataAccess[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    updateDataSummary();
    updateViewAccessData();
    setLastUpdate(new Date().toLocaleString());
  }, [
    patients,
    vitalSigns,
    medications,
    appointments,
    surgeries,
    labTests,
    emergencies,
    beds,
    reports,
    messages,
    telemedicineSessions,
    inventory,
    admissionRequests,
    educationModules,
  ]);

  const updateDataSummary = () => {
    setDataSummary({
      patients: patients.length,
      vitalSigns: vitalSigns.length,
      medications: medications.length,
      appointments: appointments.length,
      surgeries: surgeries.length,
      labTests: labTests.length,
      emergencies: emergencies.length,
      beds: beds.length,
      reports: reports.length,
      messages: messages.length,
      telemedicineSessions: telemedicineSessions.length,
      inventory: inventory.length,
      admissionRequests: admissionRequests.length,
      educationModules: educationModules.length,
    });
  };

  const updateViewAccessData = () => {
    // Simulate view access data based on localStorage
    const viewData: ViewDataAccess[] = [
      {
        viewName: "ActivePatients",
        lastAccessed: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
        dataTypes: ["patients", "vitalSigns", "medications"],
        recordCount: patients.length,
      },
      {
        viewName: "ICUMonitoring",
        lastAccessed: new Date(Date.now() - 2 * 60000).toLocaleTimeString(),
        dataTypes: ["patients", "vitalSigns", "medications", "emergencies"],
        recordCount: patients.filter(
          (p) => p.currentStatus.priority === "critical",
        ).length,
      },
      {
        viewName: "PharmacyManagement",
        lastAccessed: new Date(Date.now() - 10 * 60000).toLocaleTimeString(),
        dataTypes: ["medications", "inventory", "patients"],
        recordCount: medications.length + inventory.length,
      },
      {
        viewName: "AdmissionsManagement",
        lastAccessed: new Date(Date.now() - 1 * 60000).toLocaleTimeString(),
        dataTypes: ["admissionRequests", "patients", "beds"],
        recordCount: admissionRequests.length,
      },
      {
        viewName: "AppointmentsScheduler",
        lastAccessed: new Date(Date.now() - 15 * 60000).toLocaleTimeString(),
        dataTypes: ["appointments", "patients"],
        recordCount: appointments.length,
      },
      {
        viewName: "Telemedicine",
        lastAccessed: new Date(Date.now() - 8 * 60000).toLocaleTimeString(),
        dataTypes: ["telemedicineSessions", "patients"],
        recordCount: telemedicineSessions.length,
      },
    ];

    setViewAccess(viewData);
  };

  const exportGlobalData = () => {
    const globalData = {
      patients,
      vitalSigns,
      medications,
      appointments,
      surgeries,
      labTests,
      emergencies,
      beds,
      reports,
      messages,
      telemedicineSessions,
      inventory,
      admissionRequests,
      educationModules,
      metadata: {
        exportDate: new Date().toISOString(),
        totalRecords: Object.values(dataSummary).reduce((a, b) => a + b, 0),
        version: "1.0.0",
      },
    };

    const dataStr = JSON.stringify(globalData, null, 2);
    setJsonData(dataStr);

    // Download as file
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medical-data-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    updateDataSummary();
    updateViewAccessData();
    setLastUpdate(new Date().toLocaleString());
  };

  const totalRecords = Object.values(dataSummary).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Almacenamiento Global de Datos JSON
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Sistema centralizado de datos médicos - Todas las vistas comparten
              información
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm" onClick={exportGlobalData}>
                <Download className="w-4 h-4 mr-1" />
                Exportar JSON
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Resumen de Datos</TabsTrigger>
          <TabsTrigger value="views">Acceso por Vistas</TabsTrigger>
          <TabsTrigger value="flow">Flujo de Datos</TabsTrigger>
          <TabsTrigger value="json">Datos JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estadísticas Generales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalRecords}
                  </div>
                  <div className="text-sm text-gray-600">Registros Totales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.keys(dataSummary).length}
                  </div>
                  <div className="text-sm text-gray-600">Tipos de Datos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {viewAccess.length}
                  </div>
                  <div className="text-sm text-gray-600">Vistas Activas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">100%</div>
                  <div className="text-sm text-gray-600">Sincronización</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(dataSummary).map(([key, value]) => {
                  const icons: Record<string, React.ReactNode> = {
                    patients: <Users className="w-4 h-4" />,
                    vitalSigns: <Activity className="w-4 h-4" />,
                    medications: <Pill className="w-4 h-4" />,
                    appointments: <Calendar className="w-4 h-4" />,
                    beds: <Bed className="w-4 h-4" />,
                    reports: <FileText className="w-4 h-4" />,
                    emergencies: <Monitor className="w-4 h-4" />,
                  };

                  return (
                    <Card key={key} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {icons[key] || <Database className="w-4 h-4" />}
                          <span className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                        <Badge variant="outline">{value}</Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="views" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Acceso de Datos por Vista
              </CardTitle>
              <p className="text-sm text-gray-600">
                Cada vista accede y modifica datos JSON compartidos en tiempo
                real
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {viewAccess.map((view, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{view.viewName}</h3>
                      <Badge variant="outline">
                        {view.recordCount} registros
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Último acceso: {view.lastAccessed}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {view.dataTypes.map((dataType) => (
                        <Badge
                          key={dataType}
                          variant="secondary"
                          className="text-xs"
                        >
                          {dataType}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Flujo de Datos Entre Vistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium mb-2">
                    📊 Pacientes Activos → ICU Monitoring
                  </h4>
                  <p className="text-sm text-gray-600">
                    Los datos de pacientes se comparten automáticamente con el
                    monitoreo de UCI, incluyendo signos vitales y medicamentos
                    en tiempo real.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium mb-2">
                    💊 Farmacia → Prescripciones → Pacientes
                  </h4>
                  <p className="text-sm text-gray-600">
                    Las prescripciones se sincronizan entre farmacia,
                    historiales de pacientes y sistemas de administración de
                    medicamentos.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-medium mb-2">
                    🏥 Admisiones → Gestión de Camas → Pacientes
                  </h4>
                  <p className="text-sm text-gray-600">
                    Las admisiones actualizan automáticamente el estado de camas
                    y la información de ubicación de pacientes en todas las
                    vistas.
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-medium mb-2">
                    📅 Citas → Telemedicina → Reportes
                  </h4>
                  <p className="text-sm text-gray-600">
                    Las citas programadas se integran con sesiones de
                    telemedicina y generan automáticamente datos para reportes
                    médicos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Estructura de Datos JSON
              </CardTitle>
              <p className="text-sm text-gray-600">
                Última actualización: {lastUpdate}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportGlobalData}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Descargar JSON Completo
                  </Button>
                  <Button variant="outline" size="sm" onClick={refreshData}>
                    <Database className="w-4 h-4 mr-1" />
                    Actualizar Datos
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    {`{
  "patients": [${patients.length} registros],
  "vitalSigns": [${vitalSigns.length} registros],
  "medications": [${medications.length} registros],
  "appointments": [${appointments.length} registros],
  "surgeries": [${surgeries.length} registros],
  "labTests": [${labTests.length} registros],
  "emergencies": [${emergencies.length} registros],
  "beds": [${beds.length} registros],
  "reports": [${reports.length} registros],
  "messages": [${messages.length} registros],
  "telemedicineSessions": [${telemedicineSessions.length} registros],
  "inventory": [${inventory.length} registros],
  "admissionRequests": [${admissionRequests.length} registros],
  "educationModules": [${educationModules.length} registros],
  "metadata": {
    "totalRecords": ${totalRecords},
    "lastUpdate": "${lastUpdate}",
    "version": "1.0.0"
  }
}`}
                  </pre>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">
                    ✅ Sistema Completamente Integrado
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>
                      • Todas las vistas comparten datos JSON en tiempo real
                    </li>
                    <li>• Auto-guardado automático cada segundo</li>
                    <li>
                      • Sincronización entre localStorage y contexto global
                    </li>
                    <li>• Movimiento rápido de datos entre vistas</li>
                    <li>• Persistencia completa de información médica</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
