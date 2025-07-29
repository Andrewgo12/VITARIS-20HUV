import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Camera,
  Phone,
  PhoneOff,
  Share,
  FileText,
  Clock,
  User,
  Shield,
  Wifi,
  Settings,
  Volume2,
  VolumeX,
  MessageSquare,
  Send,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface TelemedicineSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sessionTypes = [
  "Consulta General", "Consulta Especializada", "Seguimiento",
  "Segunda Opinión", "Emergencia", "Educación al Paciente"
];

const connectionQualities = [
  { value: "excellent", label: "Excelente", color: "text-green-600" },
  { value: "good", label: "Buena", color: "text-yellow-600" },
  { value: "poor", label: "Deficiente", color: "text-red-600" },
];

export default function TelemedicineSessionModal({ open, onOpenChange }: TelemedicineSessionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const [sessionData, setSessionData] = useState({
    patientName: "",
    patientId: "",
    sessionType: "",
    duration: "30",
    scheduledTime: "",
    notes: "",
    recordSession: true,
    shareScreen: false,
    allowRecording: true,
    emergencyProtocol: false,
  });

  const [connectionState, setConnectionState] = useState({
    video: true,
    audio: true,
    quality: "good",
    bandwidth: 85,
    latency: 45,
  });

  const [chat, setChat] = useState([
    { id: 1, sender: "Dr. Martínez", message: "Bienvenido a la consulta virtual", time: "14:30", type: "doctor" },
    { id: 2, sender: "Paciente", message: "Gracias doctor", time: "14:31", type: "patient" },
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setSessionData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConnectionToggle = (field: string) => {
    setConnectionState(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleStartSession = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setSessionStarted(true);
      setCurrentStep(3);
    }, 3000);
  };

  const handleEndSession = () => {
    setSessionStarted(false);
    setIsConnected(false);
    setCurrentStep(4);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chat.length + 1,
        sender: "Dr. Martínez",
        message: newMessage,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        type: "doctor" as const,
      };
      setChat(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-700 flex items-center gap-2">
            <Video className="w-6 h-6" />
            Consulta de Telemedicina
          </DialogTitle>
          <DialogDescription>
            Configurar y gestionar sesión de telemedicina
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentStep.toString()} className="w-full">
          {/* Paso 1: Configuración de la Sesión */}
          <TabsContent value="1" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información de la Consulta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Nombre del Paciente *</Label>
                    <Input
                      id="patientName"
                      placeholder="Nombre completo"
                      value={sessionData.patientName}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId">ID del Paciente</Label>
                    <Input
                      id="patientId"
                      placeholder="P12345"
                      value={sessionData.patientId}
                      onChange={(e) => handleInputChange("patientId", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Consulta *</Label>
                    <Select onValueChange={(value) => handleInputChange("sessionType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duración Estimada</Label>
                    <Select
                      value={sessionData.duration}
                      onValueChange={(value) => handleInputChange("duration", value)}
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
                  <Label htmlFor="notes">Notas Pre-consulta</Label>
                  <Textarea
                    id="notes"
                    placeholder="Motivo de consulta, síntomas, información relevante..."
                    rows={3}
                    value={sessionData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Configuración de Sesión</h4>
                    <div className="flex items-center justify-between">
                      <Label>Grabar sesión</Label>
                      <Switch
                        checked={sessionData.recordSession}
                        onCheckedChange={(checked) => handleInputChange("recordSession", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Permitir grabación al paciente</Label>
                      <Switch
                        checked={sessionData.allowRecording}
                        onCheckedChange={(checked) => handleInputChange("allowRecording", checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Configuración de Seguridad</h4>
                    <div className="flex items-center justify-between">
                      <Label>Protocolo de emergencia</Label>
                      <Switch
                        checked={sessionData.emergencyProtocol}
                        onCheckedChange={(checked) => handleInputChange("emergencyProtocol", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Compartir pantalla</Label>
                      <Switch
                        checked={sessionData.shareScreen}
                        onCheckedChange={(checked) => handleInputChange("shareScreen", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paso 2: Prueba de Conexión */}
          <TabsContent value="2" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Prueba de Equipos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    {connectionState.video ? (
                      <div className="text-white text-center">
                        <Camera className="w-12 h-12 mx-auto mb-2" />
                        <p>Vista previa de cámara</p>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center">
                        <VideoOff className="w-12 h-12 mx-auto mb-2" />
                        <p>Cámara desactivada</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={connectionState.video ? "default" : "outline"}
                      onClick={() => handleConnectionToggle("video")}
                      className="flex items-center gap-2"
                    >
                      {connectionState.video ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      Video
                    </Button>
                    <Button
                      variant={connectionState.audio ? "default" : "outline"}
                      onClick={() => handleConnectionToggle("audio")}
                      className="flex items-center gap-2"
                    >
                      {connectionState.audio ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      Audio
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nivel de audio</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="w-5 h-5" />
                    Estado de Conexión
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Calidad de conexión</span>
                      <Badge className={connectionQualities.find(q => q.value === connectionState.quality)?.color}>
                        {connectionQualities.find(q => q.value === connectionState.quality)?.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ancho de banda</span>
                        <span className="text-sm">{connectionState.bandwidth}%</span>
                      </div>
                      <Progress value={connectionState.bandwidth} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Latencia</span>
                        <span className="text-sm">{connectionState.latency}ms</span>
                      </div>
                      <Progress value={100 - (connectionState.latency / 2)} className="h-2" />
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Conexión cifrada con protocolo HIPAA. Los datos están protegidos end-to-end.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>Servidor de región</Label>
                    <Select defaultValue="colombia">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colombia">Colombia - Bogotá</SelectItem>
                        <SelectItem value="usa">Estados Unidos - Miami</SelectItem>
                        <SelectItem value="brazil">Brasil - São Paulo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!isConnecting && !isConnected && (
                    <Button 
                      onClick={handleStartSession}
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                    >
                      Iniciar Sesión
                    </Button>
                  )}

                  {isConnecting && (
                    <div className="text-center space-y-2">
                      <div className="animate-spin w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-sm text-muted-foreground">Conectando...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Paso 3: Sesión Activa */}
          <TabsContent value="3" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Panel de Video Principal */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold">En vivo - {formatTime(sessionTime)}</span>
                      </div>
                      <Badge variant="secondary">{sessionData.sessionType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
                      <div className="text-white text-center">
                        <User className="w-16 h-16 mx-auto mb-2" />
                        <p className="text-lg">{sessionData.patientName}</p>
                        <p className="text-sm opacity-75">Paciente</p>
                      </div>
                      
                      {/* Vista en miniatura del doctor */}
                      <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <User className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">Dr. Martínez</p>
                        </div>
                      </div>
                    </div>

                    {/* Controles de la sesión */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Button
                        variant={connectionState.video ? "default" : "destructive"}
                        size="sm"
                        onClick={() => handleConnectionToggle("video")}
                      >
                        {connectionState.video ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant={connectionState.audio ? "default" : "destructive"}
                        size="sm"
                        onClick={() => handleConnectionToggle("audio")}
                      >
                        {connectionState.audio ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleEndSession}
                      >
                        <PhoneOff className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Información del paciente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Información del Paciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>ID:</strong> {sessionData.patientId}
                      </div>
                      <div>
                        <strong>Duración:</strong> {sessionData.duration} min
                      </div>
                      <div className="col-span-2">
                        <strong>Notas:</strong> {sessionData.notes}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Panel de Chat y Controles */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Chat de la Consulta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
                      {chat.map((message) => (
                        <div
                          key={message.id}
                          className={`p-2 rounded-lg text-sm ${
                            message.type === "doctor"
                              ? "bg-cyan-100 ml-4"
                              : "bg-gray-100 mr-4"
                          }`}
                        >
                          <div className="font-semibold text-xs">{message.sender}</div>
                          <div>{message.message}</div>
                          <div className="text-xs text-muted-foreground">{message.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Escribir mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={handleSendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Estado de la Sesión</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Calidad:</span>
                      <Badge variant="secondary">Excelente</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Grabación:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Activa</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Participantes:</span>
                      <span>2</span>
                    </div>
                  </CardContent>
                </Card>

                {sessionData.emergencyProtocol && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm text-red-600 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Protocolo de Emergencia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="destructive" size="sm" className="w-full">
                        Activar Emergencia
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Paso 4: Finalización */}
          <TabsContent value="4" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Sesión Finalizada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-cyan-600">{formatTime(sessionTime)}</div>
                    <div className="text-sm text-muted-foreground">Duración total</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">Excelente</div>
                    <div className="text-sm text-muted-foreground">Calidad de conexión</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">{chat.length}</div>
                    <div className="text-sm text-muted-foreground">Mensajes intercambiados</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sessionSummary">Resumen de la Consulta</Label>
                    <Textarea
                      id="sessionSummary"
                      placeholder="Resumen de la consulta, diagnóstico, plan de tratamiento..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="followUp">Plan de Seguimiento</Label>
                    <Textarea
                      id="followUp"
                      placeholder="Próximos pasos, citas de seguimiento, medicamentos..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Programar cita de seguimiento</Label>
                    <Switch />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Descargar Transcripción
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Descargar Grabación
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && currentStep !== 3 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Anterior
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {currentStep === 4 ? "Cerrar" : "Cancelar"}
            </Button>
            {currentStep === 1 && (
              <Button 
                onClick={() => setCurrentStep(2)} 
                className="bg-cyan-600 hover:bg-cyan-700"
                disabled={!sessionData.patientName || !sessionData.sessionType}
              >
                Siguiente
              </Button>
            )}
            {currentStep === 4 && (
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                Guardar Consulta
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
