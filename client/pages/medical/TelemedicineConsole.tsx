import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/components/ui/notification-system';
import { telemedicineApi } from '@/services/api';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  Users,
  Calendar,
  Clock,
  User,
  FileText,
  Camera,
  Settings,
  Share,
  MessageSquare,
  Heart,
  Activity,
  Thermometer,
  Stethoscope,
  Pill,
  RefreshCw,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TelemedicineSession {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scheduledDate: Date;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow_up' | 'emergency' | 'second_opinion';
  platform: string;
  notes?: string;
  recordingEnabled?: boolean;
  participants?: string[];
}

const TelemedicineConsole: React.FC = () => {
  const [sessions, setSessions] = useState<TelemedicineSession[]>([]);
  const [activeSession, setActiveSession] = useState<TelemedicineSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await telemedicineApi.getSessions();
      
      if (response.success) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      console.error('Error fetching telemedicine sessions:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar las sesiones de telemedicina',
        priority: 'high'
      });
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (session: TelemedicineSession) => {
    try {
      setActiveSession(session);
      setConnectionStatus('connecting');
      
      // Simulate connection process
      setTimeout(() => {
        setConnectionStatus('connected');
        addNotification({
          type: 'success',
          title: 'Sesión Iniciada',
          message: `Conectado con ${session.patientName}`,
          priority: 'medium'
        });
      }, 2000);

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error de Conexión',
        message: 'No se pudo iniciar la sesión de telemedicina',
        priority: 'high'
      });
    }
  };

  const endSession = () => {
    if (activeSession) {
      setConnectionStatus('disconnected');
      setActiveSession(null);
      setIsRecording(false);
      
      addNotification({
        type: 'info',
        title: 'Sesión Finalizada',
        message: 'La consulta de telemedicina ha terminado',
        priority: 'medium'
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    addNotification({
      type: 'info',
      title: isVideoEnabled ? 'Video Desactivado' : 'Video Activado',
      message: `Cámara ${isVideoEnabled ? 'apagada' : 'encendida'}`,
      priority: 'low'
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    addNotification({
      type: 'info',
      title: isAudioEnabled ? 'Audio Desactivado' : 'Audio Activado',
      message: `Micrófono ${isAudioEnabled ? 'silenciado' : 'activado'}`,
      priority: 'low'
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    addNotification({
      type: 'info',
      title: isRecording ? 'Grabación Detenida' : 'Grabación Iniciada',
      message: `La sesión ${isRecording ? 'ya no se está grabando' : 'se está grabando'}`,
      priority: 'medium'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Stethoscope className="w-4 h-4" />;
      case 'follow_up': return <Heart className="w-4 h-4" />;
      case 'emergency': return <Activity className="w-4 h-4" />;
      case 'second_opinion': return <Users className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando consola de telemedicina...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consola de Telemedicina</h1>
          <p className="text-gray-600">Consultas médicas virtuales en tiempo real</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
          <Button size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Nueva Sesión
          </Button>
        </div>
      </div>

      {/* Active Session */}
      {activeSession && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Video className="w-5 h-5 mr-2 text-blue-600" />
                Sesión Activa - {activeSession.patientName}
              </div>
              <Badge className={connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {connectionStatus === 'connected' ? 'Conectado' : 'Conectando...'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Area */}
              <div className="lg:col-span-2">
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                  {connectionStatus === 'connected' ? (
                    <div className="text-white text-center">
                      <Monitor className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Video Llamada Activa</p>
                      <p className="text-sm opacity-75">Simulación de video en tiempo real</p>
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <RefreshCw className="w-16 h-16 mx-auto mb-4 animate-spin" />
                      <p className="text-lg">Conectando...</p>
                    </div>
                  )}
                  
                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center bg-red-600 text-white px-2 py-1 rounded">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      REC
                    </div>
                  )}
                  
                  {/* Connection Status */}
                  <div className="absolute top-4 right-4">
                    <Badge className={connectionStatus === 'connected' ? 'bg-green-600' : 'bg-yellow-600'}>
                      {connectionStatus === 'connected' ? 'HD' : '...'}
                    </Badge>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    variant={isVideoEnabled ? "default" : "destructive"}
                    size="lg"
                    onClick={toggleVideo}
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant={isAudioEnabled ? "default" : "destructive"}
                    size="lg"
                    onClick={toggleAudio}
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="lg"
                    onClick={toggleRecording}
                  >
                    {isRecording ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  
                  <Button variant="outline" size="lg">
                    <Share className="w-5 h-5" />
                  </Button>
                  
                  <Button variant="outline" size="lg">
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={endSession}
                  >
                    <PhoneOff className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Session Info */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información del Paciente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{activeSession.patientName}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{activeSession.duration} minutos</span>
                    </div>
                    <div className="flex items-center">
                      {getTypeIcon(activeSession.type)}
                      <span className="ml-2 capitalize">{activeSession.type}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Signos Vitales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-red-500" />
                        <span>Frecuencia Cardíaca</span>
                      </div>
                      <span className="font-medium">72 bpm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Presión Arterial</span>
                      </div>
                      <span className="font-medium">120/80</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Thermometer className="w-4 h-4 mr-2 text-orange-500" />
                        <span>Temperatura</span>
                      </div>
                      <span className="font-medium">36.5°C</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notas de la Sesión</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="Escribir notas de la consulta..."
                      className="w-full h-24 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button size="sm" className="mt-2 w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Guardar Notas
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Sesiones de Telemedicina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    {getTypeIcon(session.type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{session.patientName}</h3>
                    <p className="text-sm text-gray-600">
                      Dr. {session.doctorName} • {session.duration} min
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.scheduledDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(session.status)}>
                    {session.status === 'scheduled' && 'Programada'}
                    {session.status === 'in_progress' && 'En Progreso'}
                    {session.status === 'completed' && 'Completada'}
                    {session.status === 'cancelled' && 'Cancelada'}
                  </Badge>
                  
                  {session.status === 'scheduled' && (
                    <Button
                      size="sm"
                      onClick={() => startSession(session)}
                      disabled={activeSession !== null}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Iniciar
                    </Button>
                  )}
                  
                  {session.status === 'in_progress' && session.id === activeSession?.id && (
                    <Button size="sm" variant="destructive" onClick={endSession}>
                      <PhoneOff className="w-4 h-4 mr-2" />
                      Finalizar
                    </Button>
                  )}
                  
                  {session.status === 'completed' && (
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Notas
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelemedicineConsole;
