import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMedicalData } from "@/context/MedicalDataContext";
import type { TelemedicineSession } from "@/context/MedicalDataContext";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Phone,
  PhoneOff,
  Calendar,
  Clock,
  User,
  FileText,
  Camera,
  Settings,
  AlertTriangle,
  CheckCircle,
  Plus,
  X,
  Save,
  Loader2,
  Users,
  MessageSquare,
  Share,
  Download,
} from "lucide-react";

interface TelemedicineSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  sessionId?: string;
  mode?: "schedule" | "join" | "create";
}

const sessionTypes = [
  { value: "consultation", label: "Consulta médica", icon: User },
  { value: "follow-up", label: "Seguimiento", icon: Calendar },
  { value: "emergency", label: "Emergencia", icon: AlertTriangle },
  { value: "therapy", label: "Terapia", icon: FileText },
];

const platforms = [
  { value: "zoom", label: "Zoom", icon: Video },
  { value: "teams", label: "Microsoft Teams", icon: Monitor },
  { value: "custom", label: "Plataforma interna", icon: Settings },
];

const doctors = [
  {
    id: "DOC001",
    name: "Dr. García - Medicina General",
    specialty: "Medicina General",
  },
  { id: "DOC002", name: "Dr. López - Cardiología", specialty: "Cardiología" },
  { id: "DOC003", name: "Dr. Martínez - Neurología", specialty: "Neurología" },
  { id: "DOC004", name: "Dr. Silva - Pediatría", specialty: "Pediatría" },
];

export default function TelemedicineSessionModal({
  isOpen,
  onClose,
  patientId,
  sessionId,
  mode = "create",
}: TelemedicineSessionModalProps) {
  const [currentTab, setCurrentTab] = useState("details");
  const [isLoading, setIsLoading] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const {
    activePatients,
    scheduleTelemedicine,
    updateTelemedicine,
    telemedicineSessions,
    getPatient,
  } = useMedicalData();

  const [sessionData, setSessionData] = useState({
    patientId: patientId || "",
    doctorId: "",
    doctorName: "",
    sessionType: "" as
      | "consultation"
      | "follow-up"
      | "emergency"
      | "therapy"
      | "",
    scheduledDate: "",
    duration: "30",
    platform: "" as "zoom" | "teams" | "custom" | "",
    sessionUrl: "",
    notes: "",
    reason: "",
    urgency: "normal" as "normal" | "urgent" | "emergency",
    recordingUrl: "",
    prescriptions: [] as string[],
    followUpRequired: false,
    followUpDate: "",
  });

  const [sessionNotes, setSessionNotes] = useState({
    symptoms: "",
    diagnosis: "",
    treatment: "",
    recommendations: "",
    nextSteps: "",
  });

  const selectedPatient = patientId ? getPatient(patientId) : null;
  const existingSession = sessionId
    ? telemedicineSessions.find((s) => s.id === sessionId)
    : null;

  useEffect(() => {
    if (existingSession) {
      setSessionData({
        patientId: existingSession.patientId,
        doctorId: existingSession.doctorId,
        doctorName: existingSession.doctorName,
        sessionType: existingSession.sessionType,
        scheduledDate: existingSession.scheduledDate.split("T")[0],
        duration: existingSession.duration.toString(),
        platform: existingSession.platform,
        sessionUrl: existingSession.sessionUrl || "",
        notes: existingSession.notes || "",
        reason: "",
        urgency: "normal",
        recordingUrl: existingSession.recordingUrl || "",
        prescriptions: existingSession.prescriptions || [],
        followUpRequired: false,
        followUpDate: "",
      });
    }
  }, [existingSession]);

  useEffect(() => {
    let interval: number;
    if (callInProgress) {
      interval = window.setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [callInProgress]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSessionData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNotesChange = (field: string, value: string) => {
    setSessionNotes((prev) => ({ ...prev, [field]: value }));
  };

  const validateSession = () => {
    const newErrors: Record<string, string> = {};

    if (!sessionData.patientId) newErrors.patientId = "Paciente es requerido";
    if (!sessionData.doctorId) newErrors.doctorId = "Médico es requerido";
    if (!sessionData.sessionType)
      newErrors.sessionType = "Tipo de sesión es requerido";
    if (!sessionData.scheduledDate)
      newErrors.scheduledDate = "Fecha es requerida";
    if (!sessionData.platform) newErrors.platform = "Plataforma es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleScheduleSession = async () => {
    if (!validateSession()) {
      toast({
        title: "Errores en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newSession: Omit<TelemedicineSession, "id"> = {
        patientId: sessionData.patientId,
        doctorId: sessionData.doctorId,
        doctorName: sessionData.doctorName,
        sessionType: sessionData.sessionType as
          | "consultation"
          | "follow-up"
          | "emergency"
          | "therapy",
        scheduledDate: new Date(
          `${sessionData.scheduledDate}T${new Date().toTimeString().split(" ")[0]}`,
        ).toISOString(),
        duration: parseInt(sessionData.duration),
        status: "scheduled",
        platform: sessionData.platform as "zoom" | "teams" | "custom",
        sessionUrl:
          sessionData.sessionUrl ||
          `https://${sessionData.platform}.com/session/${Date.now()}`,
        notes: sessionData.notes,
      };

      scheduleTelemedicine(newSession);

      toast({
        title: "Sesión programada exitosamente",
        description: `Se ha programado la sesión para ${selectedPatient?.personalInfo.fullName}`,
      });

      onClose();
    } catch (error) {
      console.error("Error scheduling session:", error);
      toast({
        title: "Error al programar sesión",
        description: "Ocurrió un error al programar la sesión de telemedicina",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCall = () => {
    setCallInProgress(true);
    setSessionTime(0);
    if (sessionId) {
      updateTelemedicine(sessionId, { status: "in-progress" });
    }
    toast({
      title: "Sesión iniciada",
      description: "La sesión de telemedicina ha comenzado",
    });
  };

  const handleEndCall = async () => {
    setCallInProgress(false);
    if (sessionId) {
      updateTelemedicine(sessionId, {
        status: "completed",
        notes: Object.values(sessionNotes)
          .filter((note) => note.trim())
          .join("\n\n"),
      });
    }

    toast({
      title: "Sesión finalizada",
      description: `Sesión completada en ${formatTime(sessionTime)}`,
    });

    setCurrentTab("notes");
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toast({
      description: `Cámara ${!isVideoEnabled ? "activada" : "desactivada"}`,
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast({
      description: `Micrófono ${!isAudioEnabled ? "activado" : "desactivado"}`,
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      description: `Compartir pantalla ${!isScreenSharing ? "activado" : "desactivado"}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            {mode === "schedule"
              ? "Programar Sesión de Telemedicina"
              : mode === "join"
                ? "Unirse a Sesión"
                : "Gestión de Telemedicina"}
          </DialogTitle>
        </DialogHeader>

        {callInProgress ? (
          /* Video Call Interface */
          <div className="space-y-6">
            {/* Call Header */}
            <Card className="border-green-500 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-semibold">Sesión en curso</span>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {formatTime(sessionTime)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedPatient?.personalInfo.fullName}
                    </Badge>
                    <Badge variant="outline">{sessionData.sessionType}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
                      {isVideoEnabled ? (
                        <div className="text-white text-center">
                          <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Video del paciente</p>
                        </div>
                      ) : (
                        <div className="text-white text-center">
                          <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Cámara desactivada</p>
                        </div>
                      )}

                      {/* Controls Overlay */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        <Button
                          size="sm"
                          variant={isVideoEnabled ? "default" : "destructive"}
                          onClick={toggleVideo}
                        >
                          {isVideoEnabled ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <VideoOff className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant={isAudioEnabled ? "default" : "destructive"}
                          onClick={toggleAudio}
                        >
                          {isAudioEnabled ? (
                            <Mic className="w-4 h-4" />
                          ) : (
                            <MicOff className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant={isScreenSharing ? "default" : "outline"}
                          onClick={toggleScreenShare}
                        >
                          <Monitor className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleEndCall}
                        >
                          <PhoneOff className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Patient Info Panel */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Información del Paciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedPatient && (
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Nombre:</strong>{" "}
                          {selectedPatient.personalInfo.fullName}
                        </p>
                        <p>
                          <strong>Edad:</strong>{" "}
                          {selectedPatient.personalInfo.age} años
                        </p>
                        <p>
                          <strong>Sexo:</strong>{" "}
                          {selectedPatient.personalInfo.sex}
                        </p>
                        <p>
                          <strong>Teléfono:</strong>{" "}
                          {selectedPatient.contactInfo.phone}
                        </p>
                        {selectedPatient.personalInfo.allergies &&
                          selectedPatient.personalInfo.allergies.length > 0 && (
                            <div>
                              <strong className="text-red-600">
                                Alergias:
                              </strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedPatient.personalInfo.allergies.map(
                                  (allergy, index) => (
                                    <Badge
                                      key={index}
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      {allergy}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Notas rápidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Notas durante la consulta..."
                      rows={4}
                      value={sessionNotes.symptoms}
                      onChange={(e) =>
                        handleNotesChange("symptoms", e.target.value)
                      }
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* Scheduling/Configuration Interface */
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="notes">Notas médicas</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Información de la sesión
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Paciente *</Label>
                      {patientId ? (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium">
                            {selectedPatient?.personalInfo.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedPatient?.personalInfo.age} años •{" "}
                            {selectedPatient?.personalInfo.sex}
                          </p>
                        </div>
                      ) : (
                        <Select
                          value={sessionData.patientId}
                          onValueChange={(value) =>
                            handleInputChange("patientId", value)
                          }
                        >
                          <SelectTrigger
                            className={errors.patientId ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Seleccionar paciente" />
                          </SelectTrigger>
                          <SelectContent>
                            {activePatients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.personalInfo.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {errors.patientId && (
                        <p className="text-red-500 text-sm">
                          {errors.patientId}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Médico *</Label>
                      <Select
                        value={sessionData.doctorId}
                        onValueChange={(value) => {
                          const doctor = doctors.find((d) => d.id === value);
                          handleInputChange("doctorId", value);
                          handleInputChange("doctorName", doctor?.name || "");
                        }}
                      >
                        <SelectTrigger
                          className={errors.doctorId ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Seleccionar médico" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.doctorId && (
                        <p className="text-red-500 text-sm">
                          {errors.doctorId}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de sesión *</Label>
                      <Select
                        value={sessionData.sessionType}
                        onValueChange={(value) =>
                          handleInputChange("sessionType", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.sessionType ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {sessionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="w-4 h-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.sessionType && (
                        <p className="text-red-500 text-sm">
                          {errors.sessionType}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fecha *</Label>
                        <Input
                          type="date"
                          value={sessionData.scheduledDate}
                          onChange={(e) =>
                            handleInputChange("scheduledDate", e.target.value)
                          }
                          className={
                            errors.scheduledDate ? "border-red-500" : ""
                          }
                        />
                        {errors.scheduledDate && (
                          <p className="text-red-500 text-sm">
                            {errors.scheduledDate}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Duración (minutos)</Label>
                        <Select
                          value={sessionData.duration}
                          onValueChange={(value) =>
                            handleInputChange("duration", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutos</SelectItem>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="45">45 minutos</SelectItem>
                            <SelectItem value="60">1 hora</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Motivo de la consulta</Label>
                      <Textarea
                        placeholder="Describir el motivo de la consulta..."
                        rows={3}
                        value={sessionData.reason}
                        onChange={(e) =>
                          handleInputChange("reason", e.target.value)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Configuración técnica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Plataforma *</Label>
                      <Select
                        value={sessionData.platform}
                        onValueChange={(value) =>
                          handleInputChange("platform", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.platform ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Seleccionar plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map((platform) => (
                            <SelectItem
                              key={platform.value}
                              value={platform.value}
                            >
                              <div className="flex items-center gap-2">
                                <platform.icon className="w-4 h-4" />
                                {platform.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.platform && (
                        <p className="text-red-500 text-sm">
                          {errors.platform}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>URL de la sesión (opcional)</Label>
                      <Input
                        placeholder="https://..."
                        value={sessionData.sessionUrl}
                        onChange={(e) =>
                          handleInputChange("sessionUrl", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Urgencia</Label>
                      <Select
                        value={sessionData.urgency}
                        onValueChange={(value) =>
                          handleInputChange("urgency", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                          <SelectItem value="emergency">Emergencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {sessionId && (
                      <div className="pt-4 border-t">
                        <div className="flex gap-2">
                          <Button
                            onClick={handleStartCall}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Iniciar sesión
                          </Button>
                          <Button variant="outline">
                            <Share className="w-4 h-4 mr-2" />
                            Compartir enlace
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Notas médicas de la sesión
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Síntomas reportados</Label>
                        <Textarea
                          placeholder="Síntomas que reporta el paciente..."
                          rows={3}
                          value={sessionNotes.symptoms}
                          onChange={(e) =>
                            handleNotesChange("symptoms", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Diagnóstico</Label>
                        <Textarea
                          placeholder="Diagnóstico médico..."
                          rows={3}
                          value={sessionNotes.diagnosis}
                          onChange={(e) =>
                            handleNotesChange("diagnosis", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tratamiento</Label>
                        <Textarea
                          placeholder="Plan de tratamiento..."
                          rows={3}
                          value={sessionNotes.treatment}
                          onChange={(e) =>
                            handleNotesChange("treatment", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Recomendaciones</Label>
                        <Textarea
                          placeholder="Recomendaciones para el paciente..."
                          rows={3}
                          value={sessionNotes.recommendations}
                          onChange={(e) =>
                            handleNotesChange("recommendations", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Próximos pasos</Label>
                        <Textarea
                          placeholder="Seguimiento y próximos pasos..."
                          rows={3}
                          value={sessionNotes.nextSteps}
                          onChange={(e) =>
                            handleNotesChange("nextSteps", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Requiere seguimiento</Label>
                          <input
                            type="checkbox"
                            checked={sessionData.followUpRequired}
                            onChange={(e) =>
                              handleInputChange(
                                "followUpRequired",
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4"
                          />
                        </div>
                        {sessionData.followUpRequired && (
                          <Input
                            type="date"
                            value={sessionData.followUpDate}
                            onChange={(e) =>
                              handleInputChange("followUpDate", e.target.value)
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración avanzada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      La configuración avanzada incluye opciones de grabación,
                      compartir pantalla y integración con historias clínicas.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Grabar sesión</Label>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Permitir compartir pantalla</Label>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Integrar con historia clínica</Label>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Footer Actions */}
        {!callInProgress && (
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>

            <div className="flex gap-2">
              {sessionId ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleStartCall}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Iniciar sesión
                  </Button>
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleScheduleSession}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Calendar className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Programando..." : "Programar sesión"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
