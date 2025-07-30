import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Pill, 
  Activity, 
  UserMinus, 
  Video, 
  Siren,
  FileText,
  MessageSquare,
  Package,
  GraduationCap,
  BarChart3,
  Stethoscope,
  Calendar,
  Building,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Import all modal components
import PatientIdentificationModal from "@/components/modals/PatientIdentificationModal";
import NewAdmissionModal from "@/components/modals/NewAdmissionModal";
import NewPrescriptionModal from "@/components/modals/NewPrescriptionModal";
import PatientDischargeModal from "@/components/modals/PatientDischargeModal";
import TelemedicineSessionModal from "@/components/modals/TelemedicineSessionModal";
import EmergencyCodeModal from "@/components/modals/EmergencyCodeModal";
import VitalSignsModal from "@/components/modals/VitalSignsModal";
import DocumentsModal from "@/components/modals/DocumentsModal";

import { useMedicalData } from "@/context/MedicalDataContext";

const modalCategories = [
  {
    id: "patient-management",
    title: "Gestión de Pacientes",
    description: "Modales relacionados con el manejo de pacientes",
    color: "blue",
    modals: [
      {
        id: "patient-identification",
        title: "Identificación de Paciente",
        description: "Registro y validación de datos del paciente",
        icon: User,
        component: "PatientIdentificationModal",
        status: "completed",
        features: ["Validación en tiempo real", "Auto-guardado", "Carga de archivos", "Integración EPS"]
      },
      {
        id: "new-admission", 
        title: "Nueva Admisión",
        description: "Proceso completo de admisión hospitalaria",
        icon: Building,
        component: "NewAdmissionModal", 
        status: "completed",
        features: ["Búsqueda de pacientes", "Asignación de camas", "Validación médica", "Flujo paso a paso"]
      },
      {
        id: "patient-discharge",
        title: "Alta de Paciente", 
        description: "Proceso de alta médica y administrativa",
        icon: UserMinus,
        component: "PatientDischargeModal",
        status: "completed", 
        features: ["Validaciones médicas", "Liberación de camas", "Instrucciones de alta", "Seguimiento"]
      }
    ]
  },
  {
    id: "medical-care",
    title: "Atención Médica",
    description: "Modales para procedimientos médicos",
    color: "green", 
    modals: [
      {
        id: "new-prescription",
        title: "Nueva Prescripción",
        description: "Sistema completo de prescripción médica",
        icon: Pill,
        component: "NewPrescriptionModal",
        status: "completed",
        features: ["Base de datos de medicamentos", "Verificación de alergias", "Detección de interacciones", "Dosificación inteligente"]
      },
      {
        id: "vital-signs",
        title: "Signos Vitales",
        description: "Registro y monitoreo de signos vitales",
        icon: Activity,
        component: "VitalSignsModal",
        status: "completed",
        features: ["Cálculo automático IMC", "Validación de rangos", "Alertas médicas", "Histórico de registros"]
      },
      {
        id: "telemedicine",
        title: "Telemedicina",
        description: "Sesiones de consulta médica virtual",
        icon: Video,
        component: "TelemedicineSessionModal",
        status: "completed",
        features: ["Video llamadas", "Notas médicas", "Grabación de sesiones", "Integración con calendario"]
      }
    ]
  },
  {
    id: "emergency",
    title: "Emergencias",
    description: "Protocolos de emergencia y urgencias",
    color: "red",
    modals: [
      {
        id: "emergency-code",
        title: "Código de Emergencia", 
        description: "Activación de protocolos de emergencia",
        icon: Siren,
        component: "EmergencyCodeModal",
        status: "completed",
        features: ["Códigos estándar", "Notificación automática", "Protocolos de acción", "Seguimiento en tiempo real"]
      }
    ]
  },
  {
    id: "administration",
    title: "Administración",
    description: "Gestión administrativa y documentación",
    color: "purple",
    modals: [
      {
        id: "documents",
        title: "Gestión de Documentos",
        description: "Manejo de archivos y documentación médica",
        icon: FileText,
        component: "DocumentsModal",
        status: "completed",
        features: ["Carga de archivos", "Categorización", "Visualización", "Gestión avanzada"]
      }
    ]
  }
];

export default function ModalSystemDemo() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  
  const { patients, activePatients, getStatistics } = useMedicalData();
  const stats = getStatistics();

  const openModal = (modalId: string, patientId?: string) => {
    setActiveModal(modalId);
    if (patientId) setSelectedPatientId(patientId);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPatientId("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-yellow-500"; 
      case "pending": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in-progress": return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Modales Médicos - VITAL RED
          </h1>
          <p className="text-gray-600">
            Demostración completa del sistema de modales integrado con gestión de datos médicos
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pacientes Totales</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
                </div>
                <User className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pacientes Activos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activePatients}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Camas Disponibles</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.availableBeds}</p>
                </div>
                <Building className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Citas Hoy</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.todaysAppointments}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Emergencias</p>
                  <p className="text-2xl font-bold text-red-600">{stats.emergencies}</p>
                </div>
                <Siren className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="modals" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="modals">Sistema de Modales</TabsTrigger>
            <TabsTrigger value="patients">Pacientes de Prueba</TabsTrigger>
          </TabsList>

          <TabsContent value="modals" className="space-y-8">
            {modalCategories.map((category) => (
              <div key={category.id}>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.modals.map((modal) => {
                    const StatusIcon = getStatusIcon(modal.status);
                    return (
                      <Card key={modal.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                                <modal.icon className={`w-5 h-5 text-${category.color}-600`} />
                              </div>
                              <CardTitle className="text-lg">{modal.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(modal.status)}`} />
                              <StatusIcon className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-600">{modal.description}</p>
                          
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase">Características</p>
                            <div className="flex flex-wrap gap-1">
                              {modal.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              onClick={() => openModal(modal.id)}
                              className="flex-1"
                              disabled={modal.status === "pending"}
                            >
                              Abrir Modal
                            </Button>
                            {(modal.id === "new-prescription" || 
                              modal.id === "patient-discharge" || 
                              modal.id === "telemedicine" ||
                              modal.id === "new-admission") && activePatients.length > 0 && (
                              <Button 
                                variant="outline"
                                onClick={() => openModal(modal.id, activePatients[0].id)}
                                size="sm"
                              >
                                Con Paciente
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pacientes Disponibles para Pruebas</CardTitle>
              </CardHeader>
              <CardContent>
                {activePatients.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay pacientes activos</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Use el modal de "Identificación de Paciente" para crear nuevos pacientes
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activePatients.map((patient) => (
                      <Card key={patient.id} className="border-2">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{patient.personalInfo.fullName}</h3>
                              <Badge variant="outline">Activo</Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><strong>ID:</strong> {patient.id}</p>
                              <p><strong>Edad:</strong> {patient.personalInfo.age} años</p>
                              <p><strong>Habitación:</strong> {patient.currentStatus.room || "No asignada"}</p>
                              <p><strong>Médico:</strong> {patient.currentStatus.assignedDoctor}</p>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openModal("new-prescription", patient.id)}
                              >
                                <Pill className="w-4 h-4 mr-1" />
                                Recetar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openModal("patient-discharge", patient.id)}
                              >
                                <UserMinus className="w-4 h-4 mr-1" />
                                Alta
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal Instances */}
        <PatientIdentificationModal
          isOpen={activeModal === "patient-identification"}
          onClose={closeModal}
          mode="create"
          onPatientCreated={(patient) => {
            console.log("Paciente creado:", patient);
            closeModal();
          }}
        />

        <NewAdmissionModal
          isOpen={activeModal === "new-admission"}
          onClose={closeModal}
          patientId={selectedPatientId}
          onAdmissionCreated={(admission) => {
            console.log("Admisión creada:", admission);
            closeModal();
          }}
        />

        <NewPrescriptionModal
          open={activeModal === "new-prescription"}
          onOpenChange={closeModal}
          patientId={selectedPatientId}
          onPrescriptionCreated={(prescription) => {
            console.log("Prescripción creada:", prescription);
            closeModal();
          }}
        />

        <PatientDischargeModal
          isOpen={activeModal === "patient-discharge"}
          onClose={closeModal}
          patientId={selectedPatientId}
          onDischargeCompleted={(discharge) => {
            console.log("Alta completada:", discharge);
            closeModal();
          }}
        />

        <TelemedicineSessionModal
          isOpen={activeModal === "telemedicine"}
          onClose={closeModal}
          patientId={selectedPatientId}
          mode="create"
        />

        <EmergencyCodeModal
          open={activeModal === "emergency-code"}
          onOpenChange={closeModal}
        />

        <VitalSignsModal
          isOpen={activeModal === "vital-signs"}
          onClose={closeModal}
          patientId={selectedPatientId}
          mode="create"
          onVitalSignsCreated={(vitals) => {
            console.log("Signos vitales registrados:", vitals);
            closeModal();
          }}
        />

        <DocumentsModal
          isOpen={activeModal === "documents"}
          onClose={closeModal}
          patientId={selectedPatientId}
          mode="create"
          onDocumentSaved={(documents) => {
            console.log("Documentos guardados:", documents);
            closeModal();
          }}
        />
      </div>
    </div>
  );
}
