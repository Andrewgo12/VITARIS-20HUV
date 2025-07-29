import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Siren,
  Phone,
  MapPin,
  Clock,
  Users,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
  Bell,
  Activity,
  Heart,
  Flame,
  UserX,
  Building,
  Camera,
} from "lucide-react";

interface EmergencyCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCode?: string;
}

const emergencyCodes = [
  {
    code: "AZUL",
    name: "Código Azul",
    description: "Paro cardiorrespiratorio en adultos",
    icon: Heart,
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    priority: "critical",
    responseTime: "2-3 minutos",
    team: [
      "Médico intensivista",
      "Enfermera especializada",
      "Técnico en urgencias",
      "Anestesiólogo",
    ],
    protocol: [
      "Iniciar RCP básico inmediatamente",
      "Verificar vía aérea permeable",
      "Administrar oxígeno al 100%",
      "Establecer acceso venoso",
      "Monitoreo continuo",
      "Desfibrilación si es necesaria",
    ],
  },
  {
    code: "ROJO",
    name: "Código Rojo",
    description: "Incendio en las instalaciones",
    icon: Flame,
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    priority: "critical",
    responseTime: "1-2 minutos",
    team: [
      "Brigada de emergencias",
      "Seguridad",
      "Mantenimiento",
      "Personal de piso",
    ],
    protocol: [
      "Activar alarma de incendio",
      "Evacuar área afectada",
      "Cerrar puertas cortafuego",
      "Usar extintores apropiados",
      "Llamar a bomberos",
      "Verificar evacuación completa",
    ],
  },
  {
    code: "AMARILLO",
    name: "Código Amarillo",
    description: "Amenaza de bomba o paquete sospechoso",
    icon: AlertTriangle,
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    priority: "high",
    responseTime: "5 minutos",
    team: ["Seguridad", "Policía", "Administración", "Jefe de turno"],
    protocol: [
      "No tocar objeto sospechoso",
      "Evacuar área circundante",
      "Notificar a seguridad",
      "Llamar a autoridades",
      "Establecer perímetro",
      "Esperar escuadrón antibombas",
    ],
  },
  {
    code: "VERDE",
    name: "Código Verde",
    description: "Emergencia externa - Afluencia masiva",
    icon: Users,
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    priority: "high",
    responseTime: "10 minutos",
    team: [
      "Director médico",
      "Jefe de urgencias",
      "Personal adicional",
      "Administración",
    ],
    protocol: [
      "Activar protocolo de afluencia",
      "Preparar áreas adicionales",
      "Llamar personal de reserva",
      "Coordinar con emergencias",
      "Triaje avanzado",
      "Comunicación con autoridades",
    ],
  },
  {
    code: "NEGRO",
    name: "Código Negro",
    description: "Muerte sospechosa o violenta",
    icon: UserX,
    color: "bg-gray-800",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    priority: "high",
    responseTime: "5 minutos",
    team: ["Médico forense", "Seguridad", "Administración", "Autoridades"],
    protocol: [
      "Preservar escena del crimen",
      "No mover el cuerpo",
      "Limitar acceso al área",
      "Notificar a autoridades",
      "Documentar todo",
      "Esperar investigadores",
    ],
  },
  {
    code: "BLANCO",
    name: "Código Blanco",
    description: "Emergencia pediátrica",
    icon: Activity,
    color: "bg-white border-2 border-gray-400",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    priority: "critical",
    responseTime: "2 minutos",
    team: [
      "Pediatra",
      "Enfermera pediátrica",
      "Anestesiólogo pediátrico",
      "Técnico especializado",
    ],
    protocol: [
      "Evaluar vía aérea pediátrica",
      "Calcular dosis por peso",
      "Equipo pediátrico específico",
      "Contactar con padres",
      "Soporte emocional",
      "Monitoreo continuo",
    ],
  },
];

const locations = [
  "UCI Adultos",
  "UCI Pediátrica",
  "Urgencias",
  "Quirófano 1",
  "Quirófano 2",
  "Quirófano 3",
  "Sala de Partos",
  "Pediatría",
  "Medicina Interna",
  "Cardiología",
  "Neurología",
  "Cafetería",
  "Lobby Principal",
  "Estacionamiento",
  "Farmacia",
  "Laboratorio",
  "Imagenología",
];

export default function EmergencyCodeModal({
  open,
  onOpenChange,
  preselectedCode = "",
}: EmergencyCodeModalProps) {
  const [selectedCode, setSelectedCode] = useState(preselectedCode);
  const [activationData, setActivationData] = useState({
    location: "",
    description: "",
    reportedBy: "",
    contactNumber: "",
    patientsInvolved: "",
    immediateActions: "",
    assistanceNeeded: false,
    confirmed: false,
  });

  const [isActivating, setIsActivating] = useState(false);
  const [activationProgress, setActivationProgress] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [activationTime, setActivationTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [teamResponses, setTeamResponses] = useState<Record<string, boolean>>(
    {},
  );
  const [protocolProgress, setProtocolProgress] = useState<
    Record<number, boolean>
  >({});
  const [notifications, setNotifications] = useState<string[]>([]);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimeouts = useRef<NodeJS.Timeout[]>([]);

  const selectedEmergencyCode = emergencyCodes.find(
    (code) => code.code === selectedCode,
  );

  useEffect(() => {
    if (preselectedCode) {
      setSelectedCode(preselectedCode);
    }
  }, [preselectedCode]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setActivationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleActivateCode = () => {
    setIsActivating(true);
    setActivationProgress(0);
    setActivationTime(new Date());

    // Simular proceso de activación
    const interval = setInterval(() => {
      setActivationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsActivating(false);
          setIsActivated(true);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleDeactivateCode = () => {
    setIsActivated(false);
    setActivationTime(null);
    setActivationProgress(0);
    onOpenChange(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-700 flex items-center gap-2">
            <Siren className="w-6 h-6" />
            Sistema de Códigos de Emergencia
          </DialogTitle>
          <DialogDescription>
            Activación y gestión de protocolos de emergencia hospitalaria
          </DialogDescription>
        </DialogHeader>

        {!isActivated ? (
          <div className="space-y-6">
            {/* Selección de código de emergencia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Seleccionar Código de Emergencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {emergencyCodes.map((code) => (
                    <div
                      key={code.code}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedCode === code.code
                          ? `border-current ${code.textColor} ${code.bgColor}`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedCode(code.code)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-10 h-10 ${code.color} rounded-lg flex items-center justify-center`}
                        >
                          <code.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{code.name}</h3>
                          <Badge
                            variant={
                              code.priority === "critical"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {code.priority === "critical" ? "CRÍTICO" : "ALTO"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {code.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Respuesta: {code.responseTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detalles del código seleccionado */}
            {selectedEmergencyCode && (
              <Card>
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 ${selectedEmergencyCode.textColor}`}
                  >
                    <selectedEmergencyCode.icon className="w-5 h-5" />
                    Protocolo: {selectedEmergencyCode.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Equipo de Respuesta
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {selectedEmergencyCode.team.map((member, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Protocolo de Acción
                      </h4>
                      <ol className="space-y-1 text-sm">
                        {selectedEmergencyCode.protocol.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formulario de activación */}
            {selectedCode && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Información de la Emergencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ubicación de la emergencia *</Label>
                      <Select
                        value={activationData.location}
                        onValueChange={(value) =>
                          handleInputChange("location", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Reportado por *</Label>
                      <Input
                        placeholder="Nombre del reportante"
                        value={activationData.reportedBy}
                        onChange={(e) =>
                          handleInputChange("reportedBy", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Número de contacto</Label>
                      <Input
                        placeholder="Extensión o número directo"
                        value={activationData.contactNumber}
                        onChange={(e) =>
                          handleInputChange("contactNumber", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Pacientes involucrados</Label>
                      <Input
                        placeholder="Número estimado de afectados"
                        value={activationData.patientsInvolved}
                        onChange={(e) =>
                          handleInputChange("patientsInvolved", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción de la emergencia *</Label>
                    <Textarea
                      placeholder="Descripción detallada de la situación de emergencia..."
                      rows={3}
                      value={activationData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Acciones inmediatas tomadas</Label>
                    <Textarea
                      placeholder="Describir las acciones ya realizadas antes de la activación del código..."
                      rows={2}
                      value={activationData.immediateActions}
                      onChange={(e) =>
                        handleInputChange("immediateActions", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Solicitar asistencia adicional</Label>
                    <Switch
                      checked={activationData.assistanceNeeded}
                      onCheckedChange={(checked) =>
                        handleInputChange("assistanceNeeded", checked)
                      }
                    />
                  </div>

                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>ADVERTENCIA:</strong> La activación de un código
                      de emergencia desplegará todos los recursos hospitalarios
                      necesarios. Confirme que la situación requiere respuesta
                      de emergencia antes de proceder.
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="confirmed"
                      checked={activationData.confirmed}
                      onChange={(e) =>
                        handleInputChange("confirmed", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <Label htmlFor="confirmed" className="text-sm">
                      Confirmo que esta es una emergencia real que requiere
                      activación del código
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Proceso de activación */}
            {isActivating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Zap className="w-5 h-5 animate-pulse" />
                    Activando Código de Emergencia...
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-red-600">
                      {selectedEmergencyCode?.name}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso de activación</span>
                        <span>{activationProgress}%</span>
                      </div>
                      <Progress value={activationProgress} className="h-3" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Notificando equipos de emergencia y activando
                      protocolos...
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Estado activo de emergencia */
          <div className="space-y-6">
            <Card className="border-red-500 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Siren className="w-6 h-6 animate-pulse" />
                  CÓDIGO {selectedEmergencyCode?.code} ACTIVO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-600">
                      {activationTime && formatTime(activationTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Hora de activación
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {activationData.location}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ubicación
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      EN CURSO
                    </div>
                    <div className="text-sm text-muted-foreground">Estado</div>
                  </div>
                </div>

                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Protocolo activado:</strong>{" "}
                    {selectedEmergencyCode?.description}
                    <br />
                    <strong>Reportado por:</strong> {activationData.reportedBy}
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Descripción de la emergencia:
                  </h4>
                  <p className="text-sm">{activationData.description}</p>

                  {activationData.immediateActions && (
                    <>
                      <h4 className="font-semibold mt-3 mb-2">
                        Acciones tomadas:
                      </h4>
                      <p className="text-sm">
                        {activationData.immediateActions}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contactar Equipo
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Documentar
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Ubicación
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeactivateCode}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Desactivar Código
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Equipo de Respuesta Notificado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedEmergencyCode?.team.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-green-50 rounded"
                      >
                        <span className="text-sm">{member}</span>
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Notificado
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Protocolo en Ejecución
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedEmergencyCode?.protocol
                      .slice(0, 4)
                      .map((step, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-blue-50 rounded"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {!isActivated && !isActivating && (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {!isActivated && !isActivating && selectedCode && (
              <Button
                onClick={handleActivateCode}
                className="bg-red-600 hover:bg-red-700"
                disabled={
                  !activationData.location ||
                  !activationData.description ||
                  !activationData.reportedBy ||
                  !activationData.confirmed
                }
              >
                <Siren className="w-4 h-4 mr-2" />
                ACTIVAR CÓDIGO DE EMERGENCIA
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
