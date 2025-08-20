import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import {
  HeartPulse,
  ArrowLeft,
  User,
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  MessageSquare,
  History,
  Settings,
  Paperclip,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiService } from "@/services/api";
import { useNotifications } from "@/components/ui/notification-system";

// Import unique modals for this view
import FileViewerModal from "@/components/modals/case-detail/FileViewerModal";
import ObservationEntryModal from "@/components/modals/case-detail/ObservationEntryModal";
import AdditionalInfoRequestModal from "@/components/modals/case-detail/AdditionalInfoRequestModal";
import CaseHistoryTimelineModal from "@/components/modals/case-detail/CaseHistoryTimelineModal";

interface ClinicalCase {
  id: string;
  patientName: string;
  documentNumber: string;
  age: number;
  gender: string;
  diagnosis: string;
  specialty: string;
  referringPhysician: string;
  referringInstitution: string;
  priority: 'alta' | 'media' | 'baja';
  status: 'nueva' | 'en_revision' | 'aceptada' | 'rechazada' | 'info_adicional';
  receivedDate: string;
  dueDate: string;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
  aiExtractedData: {
    processed: boolean;
    confidence: number;
    extractedFields: {
      symptoms: string[];
      vitalSigns: Record<string, string>;
      medications: string[];
      allergies: string[];
      medicalHistory: string[];
    };
  };
  patientDetails: {
    phone: string;
    email: string;
    address: string;
    emergencyContact: string;
    insurance: string;
    bloodType: string;
  };
  clinicalData: {
    symptoms: string;
    physicalExam: string;
    diagnosticTests: string;
    currentTreatment: string;
    reasonForReferral: string;
  };
}

export default function ClinicalCaseDetail() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { addNotification } = useNotifications();
  const [clinicalCase, setClinicalCase] = useState<ClinicalCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState<'alta' | 'media' | 'baja'>('media');

  // Modal states
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [showObservationEntry, setShowObservationEntry] = useState(false);
  const [showAdditionalInfoRequest, setShowAdditionalInfoRequest] = useState(false);
  const [showCaseHistoryTimeline, setShowCaseHistoryTimeline] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    loadCaseDetails();
  }, [caseId]);

  const loadCaseDetails = async () => {
    setLoading(true);
    try {
      if (!caseId) {
        throw new Error('Case ID is required');
      }

      // Real API call to get medical case details
      const response = await apiService.getMedicalCase(caseId);

      if (response.success && response.data) {
        const caseData = response.data;

        // Convert API response to ClinicalCase format
        const clinicalCase: ClinicalCase = {
          id: caseData.id,
          patientName: caseData.patientName,
          documentNumber: caseData.documentNumber,
          age: caseData.age,
          gender: caseData.gender,
          diagnosis: caseData.diagnosis,
          specialty: caseData.specialty,
          referringPhysician: caseData.referringPhysician,
          referringInstitution: caseData.referringInstitution,
          priority: caseData.priority,
          status: caseData.status,
          receivedDate: caseData.receivedDate,
          dueDate: caseData.dueDate,
          attachments: caseData.attachments || [],
          aiExtractedData: caseData.aiExtractedData || {
            processed: caseData.aiExtracted || false,
            confidence: 0,
            extractedFields: {}
          },
          patientDetails: caseData.patientDetails || {},
          clinicalData: {
            symptoms: caseData.medicalHistory || "",
            physicalExam: "",
            diagnosticTests: "",
            currentTreatment: caseData.currentTreatment || "",
            reasonForReferral: caseData.reasonForReferral || ""
          }
        };

        setClinicalCase(clinicalCase);
        setSelectedPriority(clinicalCase.priority);

      } else {
        throw new Error(response.error || 'Failed to load case details');
      }
    } catch (error) {
      console.error('Error loading case details:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando caso',
        message: 'No se pudo cargar los detalles del caso médico.',
        priority: 'medium'
      });

      // Navigate back to cases list on error
      navigate('/vital-red/medical-cases');
    } finally {
      setLoading(false);
    }
  };

  const handleFileView = (file: any) => {
    setSelectedFile(file);
    setShowFileViewer(true);
  };

  const handleAcceptCase = async () => {
    if (!clinicalCase) return;

    try {
      const response = await apiService.approveMedicalCase(clinicalCase.id, {
        notes: `Caso aceptado con prioridad ${selectedPriority}`,
        priority: selectedPriority
      });

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Caso aceptado',
          message: 'El caso médico ha sido aceptado exitosamente.',
          priority: 'medium'
        });

        // Update case status locally
        setClinicalCase(prev => prev ? { ...prev, status: 'aceptada' } : null);

        // Navigate back to cases list
        setTimeout(() => {
          navigate('/vital-red/medical-cases');
        }, 2000);
      } else {
        throw new Error(response.error || 'Failed to approve case');
      }
    } catch (error) {
      console.error('Error accepting case:', error);
      addNotification({
        type: 'warning',
        title: 'Error',
        message: 'No se pudo aceptar el caso. Intente nuevamente.',
        priority: 'medium'
      });
    }
  };

  const handleRejectCase = async () => {
    if (!clinicalCase) return;

    const reason = prompt('Ingrese la razón del rechazo:');
    if (!reason) return;

    try {
      const response = await apiService.rejectMedicalCase(clinicalCase.id, {
        reason: reason
      });

      if (response.success) {
        addNotification({
          type: 'info',
          title: 'Caso rechazado',
          message: 'El caso médico ha sido rechazado.',
          priority: 'medium'
        });

        // Update case status locally
        setClinicalCase(prev => prev ? { ...prev, status: 'rechazada' } : null);

        // Navigate back to cases list
        setTimeout(() => {
          navigate('/vital-red/medical-cases');
        }, 2000);
      } else {
        throw new Error(response.error || 'Failed to reject case');
      }
    } catch (error) {
      console.error('Error rejecting case:', error);
      addNotification({
        type: 'warning',
        title: 'Error',
        message: 'No se pudo rechazar el caso. Intente nuevamente.',
        priority: 'medium'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nueva': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_revision': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'aceptada': return 'bg-green-100 text-green-800 border-green-200';
      case 'rechazada': return 'bg-red-100 text-red-800 border-red-200';
      case 'info_adicional': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del caso...</p>
        </div>
      </div>
    );
  }

  if (!clinicalCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Caso no encontrado</h3>
          <p className="text-gray-600 mb-4">El caso médico solicitado no existe o no está disponible.</p>
          <Button onClick={() => navigate('/vital-red/medical-cases')}>
            Volver a la bandeja
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/vital-red/medical-cases')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la bandeja
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900">
                    VITAL <span className="text-red-500 font-light">RED</span>
                  </h1>
                  <p className="text-xs text-gray-500">Detalle de Caso Clínico</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowCaseHistoryTimeline(true)}>
                <History className="w-4 h-4 mr-2" />
                Historial
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Patient and Case Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {clinicalCase.patientName}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>CC: {clinicalCase.documentNumber}</span>
                      <span>{clinicalCase.age} años</span>
                      <span>{clinicalCase.gender === 'M' ? 'Masculino' : 'Femenino'}</span>
                      <span>Tipo de sangre: {clinicalCase.patientDetails.bloodType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(clinicalCase.priority)}>
                      Prioridad: {clinicalCase.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(clinicalCase.status)}>
                      {clinicalCase.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Teléfono:</span>
                    <p className="text-gray-600">{clinicalCase.patientDetails.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{clinicalCase.patientDetails.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Dirección:</span>
                    <p className="text-gray-600">{clinicalCase.patientDetails.address}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Contacto de emergencia:</span>
                    <p className="text-gray-600">{clinicalCase.patientDetails.emergencyContact}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Seguro médico:</span>
                    <p className="text-gray-600">{clinicalCase.patientDetails.insurance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Información Clínica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Diagnóstico presuntivo</h4>
                  <p className="text-gray-700">{clinicalCase.diagnosis}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Motivo de consulta y síntomas</h4>
                  <p className="text-gray-700">{clinicalCase.clinicalData.symptoms}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Examen físico</h4>
                  <p className="text-gray-700">{clinicalCase.clinicalData.physicalExam}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pruebas diagnósticas</h4>
                  <p className="text-gray-700">{clinicalCase.clinicalData.diagnosticTests}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tratamiento actual</h4>
                  <p className="text-gray-700">{clinicalCase.clinicalData.currentTreatment}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Motivo de remisión</h4>
                  <p className="text-gray-700">{clinicalCase.clinicalData.reasonForReferral}</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Extracted Data */}
            {clinicalCase.aiExtractedData.processed && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Brain className="w-5 h-5" />
                    Datos Extraídos por IA
                    <Badge className="bg-green-200 text-green-800">
                      Confianza: {clinicalCase.aiExtractedData.confidence}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">Síntomas identificados</h4>
                      <div className="flex flex-wrap gap-1">
                        {clinicalCase.aiExtractedData.extractedFields.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="outline" className="bg-white text-green-700 border-green-300">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">Signos vitales</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(clinicalCase.aiExtractedData.extractedFields.vitalSigns).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-green-700">{key}:</span>
                            <span className="text-green-800 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">Medicamentos</h4>
                      <div className="flex flex-wrap gap-1">
                        {clinicalCase.aiExtractedData.extractedFields.medications.map((med, index) => (
                          <Badge key={index} variant="outline" className="bg-white text-green-700 border-green-300">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">Antecedentes</h4>
                      <div className="flex flex-wrap gap-1">
                        {clinicalCase.aiExtractedData.extractedFields.medicalHistory.map((history, index) => (
                          <Badge key={index} variant="outline" className="bg-white text-green-700 border-green-300">
                            {history}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  {clinicalCase.aiExtractedData.extractedFields.allergies.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">⚠️ Alergias</h4>
                      <div className="flex flex-wrap gap-1">
                        {clinicalCase.aiExtractedData.extractedFields.allergies.map((allergy, index) => (
                          <Badge key={index} className="bg-red-100 text-red-800 border-red-300">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5" />
                  Archivos Adjuntos ({clinicalCase.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clinicalCase.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleFileView(file)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <Badge variant="outline">{file.type}</Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1 truncate">{file.name}</h4>
                      <p className="text-sm text-gray-600">{file.size}</p>
                      <Button size="sm" variant="outline" className="w-full mt-3">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver archivo
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions and Info */}
          <div className="space-y-6">
            {/* Case Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Información del Caso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Especialidad requerida</span>
                  <p className="text-gray-900">{clinicalCase.specialty}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Médico remitente</span>
                  <p className="text-gray-900">{clinicalCase.referringPhysician}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Institución</span>
                  <p className="text-gray-900">{clinicalCase.referringInstitution}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Fecha de recepción</span>
                  <p className="text-gray-900">{formatDate(clinicalCase.receivedDate)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Fecha límite</span>
                  <p className="text-gray-900">{formatDate(clinicalCase.dueDate)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Priority Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Asignar Prioridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['alta', 'media', 'baja'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setSelectedPriority(priority as any)}
                      className={`w-full p-3 rounded-lg border-2 transition-all ${
                        selectedPriority === priority
                          ? getPriorityColor(priority) + ' border-current'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="font-medium capitalize">{priority}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleAcceptCase}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aceptar Traslado
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleRejectCase}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rechazar Traslado
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowAdditionalInfoRequest(true)}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Solicitar Información
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowObservationEntry(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Añadir Observaciones
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Unique Modals for this view */}
      <FileViewerModal
        isOpen={showFileViewer}
        onClose={() => setShowFileViewer(false)}
        file={selectedFile}
      />

      <ObservationEntryModal
        isOpen={showObservationEntry}
        onClose={() => setShowObservationEntry(false)}
        caseId={clinicalCase.id}
        onSave={(observation) => {
          console.log('Observation saved:', observation);
          setShowObservationEntry(false);
        }}
      />

      <AdditionalInfoRequestModal
        isOpen={showAdditionalInfoRequest}
        onClose={() => setShowAdditionalInfoRequest(false)}
        caseId={clinicalCase.id}
        referringPhysician={clinicalCase.referringPhysician}
        onSend={(request) => {
          console.log('Additional info request sent:', request);
          setShowAdditionalInfoRequest(false);
        }}
      />

      <CaseHistoryTimelineModal
        isOpen={showCaseHistoryTimeline}
        onClose={() => setShowCaseHistoryTimeline(false)}
        caseId={clinicalCase.id}
      />
    </div>
  );
}
