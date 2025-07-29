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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageSquare,
  Phone,
  Video,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Paperclip,
  Image,
  FileText,
  Users,
  Bell,
  Search,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  MoreVertical,
  Settings,
} from "lucide-react";

interface TeamCommunicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'chat' | 'call' | 'alert' | 'conference';
}

const teams = [
  {
    id: "TEAM001",
    name: "Equipo UCI",
    members: [
      { id: "U001", name: "Dr. Carlos Mendoza", role: "Intensivista", status: "online", avatar: "" },
      { id: "U002", name: "Enf. María González", role: "Enfermera Jefe", status: "busy", avatar: "" },
      { id: "U003", name: "Dr. Luis Rodríguez", role: "Residente", status: "away", avatar: "" },
      { id: "U004", name: "Enf. Ana Martínez", role: "Enfermera", status: "online", avatar: "" },
    ],
    lastActivity: "Hace 2 minutos",
    unreadCount: 3,
  },
  {
    id: "TEAM002",
    name: "Urgencias",
    members: [
      { id: "U005", name: "Dra. Patricia Silva", role: "Urgencióloga", status: "online", avatar: "" },
      { id: "U006", name: "Dr. Roberto Castro", role: "Médico General", status: "offline", avatar: "" },
      { id: "U007", name: "Enf. Carmen López", role: "Triaje", status: "busy", avatar: "" },
    ],
    lastActivity: "Hace 15 minutos",
    unreadCount: 0,
  },
];

const messages = [
  {
    id: 1,
    sender: { id: "U001", name: "Dr. Carlos Mendoza", avatar: "" },
    content: "Paciente en cama 3 presenta taquicardia, necesito interconsulta cardiología",
    timestamp: "14:30",
    type: "text",
    priority: "high",
    read: true,
  },
  {
    id: 2,
    sender: { id: "U002", name: "Enf. María González", avatar: "" },
    content: "Ya contacté a cardiología, Dr. Ramírez estará en 15 minutos",
    timestamp: "14:32",
    type: "text",
    priority: "normal",
    read: true,
  },
  {
    id: 3,
    sender: { id: "U004", name: "Enf. Ana Martínez", avatar: "" },
    content: "Signos vitales actualizados en el sistema",
    timestamp: "14:35",
    type: "text",
    priority: "normal",
    read: false,
  },
];

const alertTypes = [
  { value: "emergency", label: "Emergencia", color: "bg-red-500" },
  { value: "urgent", label: "Urgente", color: "bg-orange-500" },
  { value: "important", label: "Importante", color: "bg-yellow-500" },
  { value: "info", label: "Informativo", color: "bg-blue-500" },
];

export default function TeamCommunicationModal({ 
  open, 
  onOpenChange, 
  mode = 'chat' 
}: TeamCommunicationModalProps) {
  const [activeTab, setActiveTab] = useState(mode);
  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const [newMessage, setNewMessage] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [callState, setCallState] = useState({
    muted: false,
    speakerOn: false,
    duration: 0,
  });
  
  const [alertData, setAlertData] = useState({
    type: "info",
    title: "",
    message: "",
    recipients: "all",
    escalation: false,
    autoClose: true,
    requireConfirmation: false,
  });

  const [conferenceData, setConferenceData] = useState({
    title: "",
    description: "",
    scheduledTime: "",
    duration: "30",
    participants: [] as string[],
    record: false,
    waitingRoom: true,
  });

  const currentTeam = teams.find(t => t.id === selectedTeam);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    setCallState({ muted: false, speakerOn: false, duration: 0 });
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallState({ muted: false, speakerOn: false, duration: 0 });
  };

  const handleSendAlert = () => {
    console.log("Sending alert:", alertData);
    onOpenChange(false);
  };

  const handleScheduleConference = () => {
    console.log("Scheduling conference:", conferenceData);
    onOpenChange(false);
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Comunicación de Equipo Médico
          </DialogTitle>
          <DialogDescription>
            Herramientas de comunicación segura para el equipo médico
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="call" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Llamadas
            </TabsTrigger>
            <TabsTrigger value="alert" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="conference" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videoconferencias
            </TabsTrigger>
          </TabsList>

          {/* Tab de Chat */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
              {/* Lista de equipos */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Equipos Médicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTeam === team.id 
                          ? "bg-purple-100 border-purple-300" 
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedTeam(team.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{team.name}</h4>
                        {team.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {team.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {team.lastActivity}
                      </p>
                      <div className="flex -space-x-1 mt-2">
                        {team.members.slice(0, 3).map((member) => (
                          <div key={member.id} className="relative">
                            <Avatar className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(member.status)} rounded-full border border-white`}></div>
                          </div>
                        ))}
                        {team.members.length > 3 && (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                            +{team.members.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Chat principal */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{currentTeam?.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  {/* Mensajes */}
                  <div className="flex-1 space-y-3 overflow-y-auto mb-4 max-h-64">
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {message.sender.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{message.sender.name}</span>
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            {message.priority === 'high' && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Urgente
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm bg-gray-100 p-2 rounded-lg">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de mensaje */}
                  <div className="flex gap-2">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Image className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Escribir mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Panel de miembros */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Miembros del Equipo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentTeam?.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(member.status)} rounded-full border border-white`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Phone className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab de Llamadas */}
          <TabsContent value="call" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5" />
                    Control de Llamadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isCallActive ? (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Phone className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Iniciar llamada de equipo</p>
                        <p className="text-sm text-muted-foreground">
                          Conectar con el equipo seleccionado
                        </p>
                      </div>
                      <Button onClick={handleStartCall} className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Llamar a {currentTeam?.name}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Phone className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">En llamada con {currentTeam?.name}</p>
                        <p className="text-lg font-mono">{formatCallDuration(callState.duration)}</p>
                      </div>
                      
                      <div className="flex justify-center gap-2">
                        <Button
                          variant={callState.muted ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => setCallState(prev => ({ ...prev, muted: !prev.muted }))}
                        >
                          {callState.muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant={callState.speakerOn ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCallState(prev => ({ ...prev, speakerOn: !prev.speakerOn }))}
                        >
                          {callState.speakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleEndCall}>
                          <PhoneOff className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Llamadas Recientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Equipo UCI</p>
                      <p className="text-xs text-muted-foreground">Hace 30 minutos • 5:32</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Dr. Roberto Castro</p>
                      <p className="text-xs text-muted-foreground">Hace 2 horas • Perdida</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab de Alertas */}
          <TabsContent value="alert" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Enviar Alerta al Equipo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Alerta</Label>
                    <Select
                      value={alertData.type}
                      onValueChange={(value) => setAlertData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {alertTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Destinatarios</Label>
                    <Select
                      value={alertData.recipients}
                      onValueChange={(value) => setAlertData(prev => ({ ...prev, recipients: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los equipos</SelectItem>
                        <SelectItem value="uci">Equipo UCI</SelectItem>
                        <SelectItem value="urgencias">Urgencias</SelectItem>
                        <SelectItem value="cirugía">Cirugía</SelectItem>
                        <SelectItem value="enfermería">Enfermería</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Título de la Alerta</Label>
                  <Input
                    placeholder="Título breve y descriptivo"
                    value={alertData.title}
                    onChange={(e) => setAlertData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mensaje</Label>
                  <Textarea
                    placeholder="Descripción detallada de la alerta..."
                    rows={4}
                    value={alertData.message}
                    onChange={(e) => setAlertData(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Escalación automática</Label>
                    <Switch
                      checked={alertData.escalation}
                      onCheckedChange={(checked) => setAlertData(prev => ({ ...prev, escalation: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Cierre automático</Label>
                    <Switch
                      checked={alertData.autoClose}
                      onCheckedChange={(checked) => setAlertData(prev => ({ ...prev, autoClose: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Requiere confirmación</Label>
                    <Switch
                      checked={alertData.requireConfirmation}
                      onCheckedChange={(checked) => setAlertData(prev => ({ ...prev, requireConfirmation: checked }))}
                    />
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Las alertas de emergencia activarán protocolos automáticos y notificarán a todo el personal de guardia.
                  </AlertDescription>
                </Alert>

                <Button onClick={handleSendAlert} className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Enviar Alerta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Videoconferencias */}
          <TabsContent value="conference" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Programar Videoconferencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título de la conferencia</Label>
                    <Input
                      placeholder="Junta médica matutina"
                      value={conferenceData.title}
                      onChange={(e) => setConferenceData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duración (minutos)</Label>
                    <Select
                      value={conferenceData.duration}
                      onValueChange={(value) => setConferenceData(prev => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="90">1.5 horas</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    placeholder="Agenda y objetivos de la conferencia..."
                    rows={3}
                    value={conferenceData.description}
                    onChange={(e) => setConferenceData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fecha y hora programada</Label>
                  <Input
                    type="datetime-local"
                    value={conferenceData.scheduledTime}
                    onChange={(e) => setConferenceData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Participantes</Label>
                  <div className="space-y-2">
                    {teams.map((team) => (
                      <div key={team.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-sm text-muted-foreground">{team.members.length} miembros</p>
                        </div>
                        <Switch />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Grabar sesión</Label>
                    <Switch
                      checked={conferenceData.record}
                      onCheckedChange={(checked) => setConferenceData(prev => ({ ...prev, record: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Sala de espera</Label>
                    <Switch
                      checked={conferenceData.waitingRoom}
                      onCheckedChange={(checked) => setConferenceData(prev => ({ ...prev, waitingRoom: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={handleScheduleConference} className="w-full">
                  <Video className="w-4 h-4 mr-2" />
                  Programar Conferencia
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
