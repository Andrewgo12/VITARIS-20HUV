import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock patient data
const mockPatients = [
  {
    id: 1,
    identificationType: "CC",
    identificationNumber: "12345678",
    fullName: "Juan Carlos Pérez González",
    eps: "NUEVA_EPS",
    age: 45,
    symptoms: "Dolor torácico agudo, dificultad respiratoria",
    urgencyLevel: "CRITICO",
    arrivalTime: "2024-01-15 14:30",
    status: "PENDING",
    vitals: { heartRate: "120", temperature: "38.5", bloodPressure: "160/95" },
  },
  {
    id: 2,
    identificationType: "CC",
    identificationNumber: "87654321",
    fullName: "María Elena Rodríguez Vargas",
    eps: "SANITAS",
    age: 32,
    symptoms: "Dolor abdominal severo, náuseas y vómito",
    urgencyLevel: "SEVERO",
    arrivalTime: "2024-01-15 15:15",
    status: "PENDING",
    vitals: { heartRate: "95", temperature: "37.8", bloodPressure: "140/85" },
  },
  {
    id: 3,
    identificationType: "CC",
    identificationNumber: "11223344",
    fullName: "Carlos Alberto Mendoza Silva",
    eps: "FAMISANAR",
    age: 58,
    symptoms: "Accidente de tránsito, posible fractura de fémur",
    urgencyLevel: "CRITICO",
    arrivalTime: "2024-01-15 16:00",
    status: "PENDING",
    vitals: { heartRate: "110", temperature: "36.8", bloodPressure: "150/90" },
  },
];

export default function HUVDashboard() {
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [priorityRating, setPriorityRating] = useState("");
  const [authorizationNotes, setAuthorizationNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const navigate = useNavigate();

  const handleAuthorize = (patientId: number, authorized: boolean) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, status: authorized ? "AUTHORIZED" : "REJECTED" }
          : p,
      ),
    );
  };

  const handleSetPriority = (patientId: number, priority: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, urgencyLevel: priority } : p,
      ),
    );
  };

  const getPriorityColor = (urgency: string) => {
    switch (urgency) {
      case "CRITICO":
        return "destructive";
      case "SEVERO":
        return "warning";
      case "MODERADO":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AUTHORIZED":
        return "success";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const filteredPatients =
    filterStatus === "ALL"
      ? patients
      : patients.filter((p) => p.status === filterStatus);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Dashboard Médico - HUV
            </h1>
            <p className="text-slate-600">Gestión de Remisiones EPS</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="bg-green-50 border-green-200 text-green-700"
            >
              Conectado: Dr. Sistema
            </Badge>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Label>Estado de Remisión</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="PENDING">Pendientes</SelectItem>
                  <SelectItem value="AUTHORIZED">Autorizados</SelectItem>
                  <SelectItem value="REJECTED">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              Total: <Badge variant="outline">{filteredPatients.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Lista de Pacientes - Remisiones EPS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-700">
                    Documento
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-700">
                    Nombre Completo
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-700">
                    EPS
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-700">
                    Edad
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-700">
                    Prioridad
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-700">
                    Llegada
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-700">
                    Estado
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr
                    key={patient.id}
                    className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  >
                    <td className="p-4">
                      <div className="font-mono text-sm">
                        <div className="font-medium">
                          {patient.identificationType}
                        </div>
                        <div className="text-slate-600">
                          {patient.identificationNumber}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">
                        {patient.fullName}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700"
                      >
                        {patient.eps}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">{patient.age} años</span>
                    </td>
                    <td className="p-4">
                      <Badge variant={getPriorityColor(patient.urgencyLevel)}>
                        {patient.urgencyLevel}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">
                          {patient.arrivalTime.split(" ")[1]}
                        </div>
                        <div className="text-slate-500">
                          {patient.arrivalTime.split(" ")[0]}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusColor(patient.status)}>
                        {patient.status === "PENDING"
                          ? "PENDIENTE"
                          : patient.status === "AUTHORIZED"
                            ? "AUTORIZADO"
                            : "RECHAZADO"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {/* View Details */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPatient(patient)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Información Completa del Paciente
                              </DialogTitle>
                            </DialogHeader>
                            {selectedPatient && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Documento</Label>
                                    <p className="font-mono">
                                      {selectedPatient.identificationType}{" "}
                                      {selectedPatient.identificationNumber}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Nombre</Label>
                                    <p className="font-medium">
                                      {selectedPatient.fullName}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>EPS</Label>
                                    <p>{selectedPatient.eps}</p>
                                  </div>
                                  <div>
                                    <Label>Edad</Label>
                                    <p>{selectedPatient.age} años</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Síntomas</Label>
                                  <p className="bg-slate-50 p-3 rounded">
                                    {selectedPatient.symptoms}
                                  </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label>Frecuencia Cardíaca</Label>
                                    <p className="font-mono">
                                      {selectedPatient.vitals.heartRate} lpm
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Temperatura</Label>
                                    <p className="font-mono">
                                      {selectedPatient.vitals.temperature}°C
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Presión Arterial</Label>
                                    <p className="font-mono">
                                      {selectedPatient.vitals.bloodPressure}{" "}
                                      mmHg
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Set Priority */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="warning">
                              <AlertTriangle className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Calificar Prioridad</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Label>Nivel de Prioridad</Label>
                              <Select
                                value={priorityRating}
                                onValueChange={setPriorityRating}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CRITICO">
                                    CRÍTICO - Requiere atención inmediata
                                  </SelectItem>
                                  <SelectItem value="SEVERO">
                                    SEVERO - Atención urgente
                                  </SelectItem>
                                  <SelectItem value="MODERADO">
                                    MODERADO - Puede esperar
                                  </SelectItem>
                                  <SelectItem value="LEVE">
                                    LEVE - No urgente
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                onClick={() => {
                                  if (priorityRating) {
                                    handleSetPriority(
                                      patient.id,
                                      priorityRating,
                                    );
                                    setPriorityRating("");
                                  }
                                }}
                                disabled={!priorityRating}
                                className="w-full"
                              >
                                Confirmar Prioridad
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Authorize/Reject */}
                        {patient.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleAuthorize(patient.id, true)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAuthorize(patient.id, false)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
