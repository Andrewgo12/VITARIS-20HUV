import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  Paperclip,
  Download,
  Eye,
  Search,
  Filter,
  Star,
  Archive,
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  Print,
  Share2,
  Brain,
  Zap,
  FileText,
  Image,
  Video,
  FileSpreadsheet,
  FileImage,
  FilePdf,
  FileCode,
  FileAudio,
  Calendar,
  User,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus,
  Minus,
  RotateCw,
  Maximize2,
  Minimize2,
  Settings,
  RefreshCw,
  Send,
  Save,
  Tag,
  Hash,
  MapPin,
  Phone,
  Globe,
  Camera,
  Mic,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  UserCheck,
  ClipboardList,
  BarChart3,
  TrendingUp,
  Layers,
  Database,
  Cloud,
  Lock,
  Unlock,
  ScanLine,
  Sparkles,
  Wand2,
  Target,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Award,
  Flag,
  Bookmark,
  Link,
  ExternalLink,
  Copy,
  Scissors,
  Paste,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  MoreVertical,
  X,
  Check,
  AlertCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react';

// Tipos para el análisis de IA
interface AIAnalysis {
  summary: string;
  keyPoints: string[];
  medicalTerms: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  sentiment: 'positive' | 'neutral' | 'negative' | 'urgent';
  categories: string[];
  suggestedActions: string[];
  relatedPatients?: string[];
  confidenceScore: number;
  extractedData: {
    dates: string[];
    names: string[];
    medications: string[];
    diagnoses: string[];
    procedures: string[];
    locations: string[];
    phoneNumbers: string[];
    emails: string[];
  };
}

// Tipos para archivos adjuntos
interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  mimeType: string;
  isImage: boolean;
  isPdf: boolean;
  isDocument: boolean;
  aiAnalysis?: {
    content: string;
    entities: string[];
    medicalInfo: string[];
    summary: string;
  };
  thumbnail?: string;
  previewAvailable: boolean;
}

// Tipos para correos electrónicos
interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: {
    name: string;
    email: string;
  };
  to: Array<{
    name: string;
    email: string;
  }>;
  cc?: Array<{
    name: string;
    email: string;
  }>;
  bcc?: Array<{
    name: string;
    email: string;
  }>;
  date: string;
  body: string;
  htmlBody: string;
  attachments: Attachment[];
  labels: string[];
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  priority: 'low' | 'normal' | 'high';
  aiAnalysis?: AIAnalysis;
  medicalRelevance: number; // 0-100
  patientRelated: boolean;
  isEncrypted: boolean;
  hasSignature: boolean;
}

// Datos mock para demostración
const mockEmails: GmailMessage[] = [
  {
    id: 'email-001',
    threadId: 'thread-001',
    subject: 'Urgente: Resultados de laboratorio - Paciente Juan Pérez',
    from: {
      name: 'Dr. María González',
      email: 'maria.gonzalez@laboratoriohv.com'
    },
    to: [
      {
        name: 'Dr. Carlos Ruiz',
        email: 'carlos.ruiz@huvalle.com'
      }
    ],
    cc: [
      {
        name: 'Enfermería UCI',
        email: 'uci@huvalle.com'
      }
    ],
    date: '2024-01-22T14:30:00Z',
    body: `Dr. Ruiz,

Adjunto los resultados de laboratorio del paciente Juan Pérez (ID: PAT-001).

RESULTADOS CRÍTICOS:
- Hemoglobina: 6.2 g/dL (Valor crítico - Normal: 13.5-17.5)
- Leucocitos: 18,500/µL (Elevado - Normal: 4,500-11,000)
- Creatinina: 3.2 mg/dL (Elevada - Normal: 0.7-1.3)
- Glucosa: 350 mg/dL (Muy elevada - Normal: 70-110)

RECOMENDACIONES INMEDIATAS:
1. Transfusión sanguínea urgente
2. Ajuste de insulina
3. Evaluación nefrológica
4. Hemocultivos de control

Por favor, revisar inmediatamente. El paciente requiere atención prioritaria.

Saludos,
Dra. María González
Laboratorio Clínico HUV`,
    htmlBody: `<div style="font-family: Arial, sans-serif;">
      <p>Dr. Ruiz,</p>
      <p>Adjunto los resultados de laboratorio del paciente <strong>Juan Pérez</strong> (ID: PAT-001).</p>
      <h3 style="color: #dc2626;">RESULTADOS CRÍTICOS:</h3>
      <ul>
        <li><strong>Hemoglobina:</strong> 6.2 g/dL <span style="color: #dc2626;">(Valor crítico - Normal: 13.5-17.5)</span></li>
        <li><strong>Leucocitos:</strong> 18,500/µL <span style="color: #ea580c;">(Elevado - Normal: 4,500-11,000)</span></li>
        <li><strong>Creatinina:</strong> 3.2 mg/dL <span style="color: #ea580c;">(Elevada - Normal: 0.7-1.3)</span></li>
        <li><strong>Glucosa:</strong> 350 mg/dL <span style="color: #dc2626;">(Muy elevada - Normal: 70-110)</span></li>
      </ul>
      <h3 style="color: #1f2937;">RECOMENDACIONES INMEDIATAS:</h3>
      <ol>
        <li>Transfusión sanguínea urgente</li>
        <li>Ajuste de insulina</li>
        <li>Evaluación nefrológica</li>
        <li>Hemocultivos de control</li>
      </ol>
      <p style="color: #dc2626; font-weight: bold;">Por favor, revisar inmediatamente. El paciente requiere atención prioritaria.</p>
      <p>Saludos,<br>Dra. María González<br>Laboratorio Clínico HUV</p>
    </div>`,
    attachments: [
      {
        id: 'att-001',
        name: 'Hemograma_JuanPerez_220124.pdf',
        type: 'application/pdf',
        size: '1.2 MB',
        url: '/attachments/hemograma-001.pdf',
        mimeType: 'application/pdf',
        isImage: false,
        isPdf: true,
        isDocument: true,
        previewAvailable: true,
        aiAnalysis: {
          content: 'Hemograma completo con valores críticos de hemoglobina, leucocitos elevados, función renal comprometida',
          entities: ['Juan Pérez', 'Hemoglobina 6.2 g/dL', 'Leucocitos 18,500/µL', 'Creatinina 3.2 mg/dL'],
          medicalInfo: ['Anemia severa', 'Leucocitosis', 'Insuficiencia renal', 'Diabetes descompensada'],
          summary: 'Resultados críticos que requieren intervención médica inmediata'
        }
      },
      {
        id: 'att-002',
        name: 'Quimica_Sanguinea_220124.pdf',
        type: 'application/pdf',
        size: '890 KB',
        url: '/attachments/quimica-001.pdf',
        mimeType: 'application/pdf',
        isImage: false,
        isPdf: true,
        isDocument: true,
        previewAvailable: true,
        aiAnalysis: {
          content: 'Panel metabólico básico con alteraciones significativas en glucosa y función renal',
          entities: ['Glucosa 350 mg/dL', 'Creatinina 3.2 mg/dL', 'BUN elevado'],
          medicalInfo: ['Hiperglucemia severa', 'Insuficiencia renal aguda', 'Desequilibrio electrolítico'],
          summary: 'Panel metabólico con múltiples alteraciones críticas'
        }
      }
    ],
    labels: ['URGENT', 'MEDICAL', 'LAB_RESULTS'],
    isRead: false,
    isStarred: true,
    isImportant: true,
    priority: 'high',
    medicalRelevance: 95,
    patientRelated: true,
    isEncrypted: true,
    hasSignature: true,
    aiAnalysis: {
      summary: 'Correo médico urgente con resultados de laboratorio críticos que requieren atención inmediata para el paciente Juan Pérez.',
      keyPoints: [
        'Resultados críticos de laboratorio',
        'Hemoglobina severamente baja (6.2 g/dL)',
        'Leucocitosis significativa',
        'Función renal comprometida',
        'Diabetes descompensada',
        'Recomendaciones de tratamiento urgente'
      ],
      medicalTerms: ['Hemoglobina', 'Leucocitos', 'Creatinina', 'Glucosa', 'Transfusión', 'Insulina', 'Nefrología', 'Hemocultivos'],
      urgencyLevel: 'critical',
      sentiment: 'urgent',
      categories: ['Laboratorio', 'Resultados Críticos', 'Urgente', 'Paciente'],
      suggestedActions: [
        'Transfusión sanguínea inmediata',
        'Ajuste de protocolo de insulina',
        'Interconsulta nefrología urgente',
        'Seguimiento cada 6 horas',
        'Notificar a familia'
      ],
      relatedPatients: ['PAT-001 - Juan Pérez'],
      confidenceScore: 98,
      extractedData: {
        dates: ['2024-01-22'],
        names: ['Juan Pérez', 'Dr. Carlos Ruiz', 'Dra. María González'],
        medications: ['Insulina'],
        diagnoses: ['Anemia severa', 'Leucocitosis', 'Insuficiencia renal', 'Diabetes'],
        procedures: ['Transfusión sanguínea', 'Hemocultivos', 'Evaluación nefrológica'],
        locations: ['UCI', 'Laboratorio Clínico HUV'],
        phoneNumbers: [],
        emails: ['maria.gonzalez@laboratoriohv.com', 'carlos.ruiz@huvalle.com', 'uci@huvalle.com']
      }
    }
  },
  {
    id: 'email-002',
    threadId: 'thread-002',
    subject: 'Programaci��n de cirugía - Ana López - 25/01/2024',
    from: {
      name: 'Coordinación Quirúrgica',
      email: 'quirofanos@huvalle.com'
    },
    to: [
      {
        name: 'Dr. Roberto Martínez',
        email: 'roberto.martinez@huvalle.com'
      }
    ],
    cc: [
      {
        name: 'Anestesiología',
        email: 'anestesia@huvalle.com'
      }
    ],
    date: '2024-01-23T09:15:00Z',
    body: `Dr. Martínez,

Confirmamos la programación quirúrgica para la paciente Ana López:

DATOS DEL PROCEDIMIENTO:
- Paciente: Ana López (ID: PAT-002)
- Procedimiento: Apendicectomía laparoscópica
- Fecha: 25 de enero de 2024
- Hora: 08:00 AM
- Quirófano: 3
- Duración estimada: 90 minutos
- Anestesiólogo: Dr. Fernando Silva
- Instrumentista: Enf. Patricia Gómez

PREPARACIÓN PREOPERATORIA:
- Ayuno de 12 horas
- Profilaxis antibiótica: Cefazolina 1g IV
- Consentimiento informado firmado
- Estudios preoperatorios completos

NOTAS ESPECIALES:
- Paciente alérgica a la penicilina
- Historia de asma bronquial
- Solicitar cama en recuperación

Por favor confirmar disponibilidad.

Coordinación Quirúrgica
Hospital Universitario del Valle`,
    htmlBody: '',
    attachments: [
      {
        id: 'att-003',
        name: 'Consentimiento_Informado_AnaLopez.pdf',
        type: 'application/pdf',
        size: '650 KB',
        url: '/attachments/consentimiento-001.pdf',
        mimeType: 'application/pdf',
        isImage: false,
        isPdf: true,
        isDocument: true,
        previewAvailable: true,
        aiAnalysis: {
          content: 'Consentimiento informado para apendicectomía laparoscópica con información completa de riesgos',
          entities: ['Ana López', 'Apendicectomía laparoscópica', 'Dr. Roberto Martínez'],
          medicalInfo: ['Cirugía mínimamente invasiva', 'Riesgos quirúrgicos', 'Beneficios del procedimiento'],
          summary: 'Documento legal completo para autorización quirúrgica'
        }
      },
      {
        id: 'att-004',
        name: 'Estudios_Preoperatorios_AnaLopez.pdf',
        type: 'application/pdf',
        size: '2.1 MB',
        url: '/attachments/preop-001.pdf',
        mimeType: 'application/pdf',
        isImage: false,
        isPdf: true,
        isDocument: true,
        previewAvailable: true,
        aiAnalysis: {
          content: 'Estudios preoperatorios completos incluyendo laboratorios, ECG y radiografía de tórax',
          entities: ['Ana López', 'ECG normal', 'Radiografía de tórax', 'Hemograma normal'],
          medicalInfo: ['Función cardiaca normal', 'Función pulmonar adecuada', 'Perfil quirúrgico aceptable'],
          summary: 'Evaluación preoperatoria satisfactoria para cirugía programada'
        }
      }
    ],
    labels: ['SURGERY', 'SCHEDULED', 'MEDICAL'],
    isRead: true,
    isStarred: false,
    isImportant: true,
    priority: 'normal',
    medicalRelevance: 85,
    patientRelated: true,
    isEncrypted: false,
    hasSignature: true,
    aiAnalysis: {
      summary: 'Correo de coordinación quirúrgica para programar apendicectomía laparoscópica de Ana López.',
      keyPoints: [
        'Cirugía programada para el 25/01/2024',
        'Apendicectomía laparoscópica',
        'Paciente con alergia a penicilina',
        'Historia de asma bronquial',
        'Estudios preoperatorios completos',
        'Equipo quirúrgico asignado'
      ],
      medicalTerms: ['Apendicectomía', 'Laparoscópica', 'Profilaxis', 'Cefazolina', 'Anestesiólogo', 'Preoperatorio'],
      urgencyLevel: 'medium',
      sentiment: 'neutral',
      categories: ['Cirugía', 'Programación', 'Coordinación'],
      suggestedActions: [
        'Confirmar disponibilidad quirófano',
        'Verificar preparación paciente',
        'Coordinar con anestesiología',
        'Reservar cama recuperación',
        'Confirmar equipo quirúrgico'
      ],
      relatedPatients: ['PAT-002 - Ana López'],
      confidenceScore: 92,
      extractedData: {
        dates: ['25 de enero de 2024', '08:00 AM'],
        names: ['Ana López', 'Dr. Roberto Martínez', 'Dr. Fernando Silva', 'Enf. Patricia Gómez'],
        medications: ['Cefazolina', 'Penicilina'],
        diagnoses: ['Apendicitis', 'Asma bronquial'],
        procedures: ['Apendicectomía laparoscópica', 'Anestesia general'],
        locations: ['Quirófano 3', 'Recuperación'],
        phoneNumbers: [],
        emails: ['quirofanos@huvalle.com', 'roberto.martinez@huvalle.com', 'anestesia@huvalle.com']
      }
    }
  }
];

const GmailAI: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<GmailMessage | null>(null);
  const [emails, setEmails] = useState<GmailMessage[]>(mockEmails);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'individual' | 'pdf-like'>('individual');
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showAttachments, setShowAttachments] = useState(true);
  const [selectedTab, setSelectedTab] = useState('content');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Estados para modales
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const emailRef = useRef<HTMLDivElement>(null);

  // Simular procesamiento de IA
  const processEmailWithAI = async (email: GmailMessage) => {
    setAiProcessing(true);
    setAiProgress(0);

    const interval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAiProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simular análisis de IA más profundo
    setTimeout(() => {
      setEmails(prev => prev.map(e => 
        e.id === email.id 
          ? { ...e, aiAnalysis: { ...e.aiAnalysis!, confidenceScore: 99 } }
          : e
      ));
    }, 2000);
  };

  // Función para obtener ícono según tipo de archivo
  const getAttachmentIcon = (attachment: Attachment) => {
    if (attachment.isPdf) return <FilePdf className="h-4 w-4" />;
    if (attachment.isImage) return <FileImage className="h-4 w-4" />;
    if (attachment.mimeType.includes('spreadsheet')) return <FileSpreadsheet className="h-4 w-4" />;
    if (attachment.mimeType.includes('audio')) return <FileAudio className="h-4 w-4" />;
    if (attachment.mimeType.includes('video')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  // Función para obtener color de urgencia
  const getUrgencyColor = (level: AIAnalysis['urgencyLevel']) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Seleccionar primer email por defecto
  useEffect(() => {
    if (!selectedEmail && emails.length > 0) {
      setSelectedEmail(emails[0]);
    }
  }, [emails, selectedEmail]);

  // Procesar email con IA cuando se selecciona
  useEffect(() => {
    if (selectedEmail && !selectedEmail.aiAnalysis) {
      processEmailWithAI(selectedEmail);
    }
  }, [selectedEmail]);

  if (!selectedEmail) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Mail className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">No hay correos disponibles</h2>
          <p className="text-gray-500 mt-2">Conecta tu cuenta de Gmail para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Gmail AI - VITARIS</h1>
                <Badge className="bg-blue-100 text-blue-800">
                  IA Médica Avanzada
                </Badge>
              </div>
              {selectedEmail.aiAnalysis && (
                <Badge className={getUrgencyColor(selectedEmail.aiAnalysis.urgencyLevel)}>
                  {selectedEmail.aiAnalysis.urgencyLevel.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Selector de email */}
              <Select
                value={selectedEmail.id}
                onValueChange={(value) => {
                  const email = emails.find(e => e.id === value);
                  if (email) setSelectedEmail(email);
                }}
              >
                <SelectTrigger className="w-80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emails.map((email) => (
                    <SelectItem key={email.id} value={email.id}>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{email.subject}</span>
                        {email.isImportant && <Star className="h-3 w-3 text-yellow-500" />}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Controles de vista */}
              <div className="flex items-center space-x-1">
                <Button
                  variant={viewMode === 'individual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('individual')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Individual
                </Button>
                <Button
                  variant={viewMode === 'pdf-like' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('pdf-like')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  PDF-like
                </Button>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex h-screen">
          {/* Panel de IA (izquierdo) */}
          {showAIPanel && !isFullscreen && (
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Análisis de IA</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIPanel(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {aiProcessing && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">Procesando con IA...</span>
                    </div>
                    <Progress value={aiProgress} className="h-2" />
                  </div>
                )}

                {selectedEmail.aiAnalysis && (
                  <div className="space-y-4">
                    {/* Resumen de IA */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                          Resumen Inteligente
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-700">{selectedEmail.aiAnalysis.summary}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-gray-500">Confianza:</span>
                          <Progress 
                            value={selectedEmail.aiAnalysis.confidenceScore} 
                            className="ml-2 h-1 flex-1" 
                          />
                          <span className="text-xs text-gray-500 ml-2">
                            {selectedEmail.aiAnalysis.confidenceScore}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Puntos clave */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center">
                          <Target className="h-4 w-4 mr-2 text-green-600" />
                          Puntos Clave
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-1">
                          {selectedEmail.aiAnalysis.keyPoints.map((point, index) => (
                            <li key={index} className="text-xs text-gray-700 flex items-start">
                              <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Términos médicos */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center">
                          <Stethoscope className="h-4 w-4 mr-2 text-blue-600" />
                          Términos Médicos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1">
                          {selectedEmail.aiAnalysis.medicalTerms.map((term, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {term}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Acciones sugeridas */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                          Acciones Sugeridas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {selectedEmail.aiAnalysis.suggestedActions.map((action, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-xs text-gray-700">{action}</span>
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Datos extraídos */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center">
                          <Database className="h-4 w-4 mr-2 text-purple-600" />
                          Datos Extraídos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Tabs defaultValue="names" className="space-y-2">
                          <TabsList className="grid w-full grid-cols-4 h-8">
                            <TabsTrigger value="names" className="text-xs">Nombres</TabsTrigger>
                            <TabsTrigger value="meds" className="text-xs">Medicamentos</TabsTrigger>
                            <TabsTrigger value="dates" className="text-xs">Fechas</TabsTrigger>
                            <TabsTrigger value="dx" className="text-xs">Diagnósticos</TabsTrigger>
                          </TabsList>
                          <TabsContent value="names" className="space-y-1">
                            {selectedEmail.aiAnalysis.extractedData.names.map((name, index) => (
                              <Badge key={index} variant="secondary" className="text-xs mr-1">
                                <User className="h-2 w-2 mr-1" />
                                {name}
                              </Badge>
                            ))}
                          </TabsContent>
                          <TabsContent value="meds" className="space-y-1">
                            {selectedEmail.aiAnalysis.extractedData.medications.map((med, index) => (
                              <Badge key={index} variant="secondary" className="text-xs mr-1">
                                <Pill className="h-2 w-2 mr-1" />
                                {med}
                              </Badge>
                            ))}
                          </TabsContent>
                          <TabsContent value="dates" className="space-y-1">
                            {selectedEmail.aiAnalysis.extractedData.dates.map((date, index) => (
                              <Badge key={index} variant="secondary" className="text-xs mr-1">
                                <Calendar className="h-2 w-2 mr-1" />
                                {date}
                              </Badge>
                            ))}
                          </TabsContent>
                          <TabsContent value="dx" className="space-y-1">
                            {selectedEmail.aiAnalysis.extractedData.diagnoses.map((dx, index) => (
                              <Badge key={index} variant="secondary" className="text-xs mr-1">
                                <ClipboardList className="h-2 w-2 mr-1" />
                                {dx}
                              </Badge>
                            ))}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Área principal del correo */}
          <div className="flex-1 flex flex-col">
            {/* Barra de herramientas del correo */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {!showAIPanel && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAIPanel(true)}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      IA
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={() => setShowReplyModal(true)}>
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowReplyModal(true)}>
                    <ReplyAll className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowReplyModal(true)}>
                    <Forward className="h-4 w-4" />
                  </Button>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  <Button variant="outline" size="sm">
                    <Print className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  {viewMode === 'pdf-like' && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setZoomLevel(prev => Math.max(prev - 25, 50))}
                        disabled={zoomLevel <= 50}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600 min-w-16 text-center">
                        {zoomLevel}%
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setZoomLevel(prev => Math.min(prev + 25, 200))}
                        disabled={zoomLevel >= 200}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAttachments(!showAttachments)}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Adjuntos ({selectedEmail.attachments.length})
                  </Button>
                </div>
              </div>
            </div>

            {/* Contenido del correo */}
            <div className="flex-1 overflow-auto">
              {viewMode === 'pdf-like' ? (
                // Vista tipo PDF
                <div className="flex justify-center p-8 bg-gray-100">
                  <div
                    ref={emailRef}
                    className="bg-white shadow-lg max-w-4xl w-full"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'top center',
                    }}
                  >
                    {/* Header estilo PDF */}
                    <div className="border-b-2 border-blue-600 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">VITARIS - Sistema Hospitalario</h1>
                          <p className="text-sm text-gray-600">Correo Electrónico Médico</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Fecha de procesamiento</p>
                          <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Información del correo */}
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">De:</Label>
                          <p className="text-sm">{selectedEmail.from.name} &lt;{selectedEmail.from.email}&gt;</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Fecha:</Label>
                          <p className="text-sm">{new Date(selectedEmail.date).toLocaleString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Para:</Label>
                          <p className="text-sm">
                            {selectedEmail.to.map(t => `${t.name} <${t.email}>`).join(', ')}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Prioridad:</Label>
                          <Badge className={getUrgencyColor(selectedEmail.aiAnalysis?.urgencyLevel || 'low')}>
                            {selectedEmail.priority}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Asunto:</Label>
                        <p className="text-lg font-medium">{selectedEmail.subject}</p>
                      </div>

                      {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">CC:</Label>
                          <p className="text-sm">
                            {selectedEmail.cc.map(c => `${c.name} <${c.email}>`).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Contenido del correo */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Contenido del Mensaje</h3>
                      {selectedEmail.htmlBody ? (
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }}
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {selectedEmail.body}
                        </pre>
                      )}
                    </div>

                    {/* Análisis de IA en PDF */}
                    {selectedEmail.aiAnalysis && (
                      <>
                        <Separator />
                        <div className="p-6 bg-blue-50">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Brain className="h-5 w-5 mr-2 text-blue-600" />
                            Análisis de Inteligencia Artificial
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2">Resumen:</h4>
                              <p className="text-sm text-gray-700">{selectedEmail.aiAnalysis.summary}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Nivel de Urgencia:</h4>
                              <Badge className={getUrgencyColor(selectedEmail.aiAnalysis.urgencyLevel)}>
                                {selectedEmail.aiAnalysis.urgencyLevel.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Puntos Clave:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {selectedEmail.aiAnalysis.keyPoints.map((point, index) => (
                                <li key={index} className="text-sm text-gray-700">{point}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Acciones Recomendadas:</h4>
                            <ol className="list-decimal list-inside space-y-1">
                              {selectedEmail.aiAnalysis.suggestedActions.map((action, index) => (
                                <li key={index} className="text-sm text-gray-700">{action}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Adjuntos en PDF */}
                    {selectedEmail.attachments.length > 0 && (
                      <>
                        <Separator />
                        <div className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Archivos Adjuntos</h3>
                          <div className="space-y-3">
                            {selectedEmail.attachments.map((attachment) => (
                              <div key={attachment.id} className="border rounded p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    {getAttachmentIcon(attachment)}
                                    <div>
                                      <p className="font-medium">{attachment.name}</p>
                                      <p className="text-sm text-gray-600">{attachment.size}</p>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                                {attachment.aiAnalysis && (
                                  <div className="mt-3 pt-3 border-t">
                                    <h5 className="text-sm font-medium text-gray-700 mb-1">Análisis IA:</h5>
                                    <p className="text-xs text-gray-600">{attachment.aiAnalysis.summary}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Footer del PDF */}
                    <div className="border-t bg-gray-50 p-4 text-center">
                      <p className="text-xs text-gray-500">
                        Documento generado por VITARIS Gmail AI - {new Date().toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Hospital Universitario del Valle - Sistema de Análisis Inteligente
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Vista individual normal
                <div className="p-6">
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="content">Contenido</TabsTrigger>
                      <TabsTrigger value="attachments">
                        Adjuntos ({selectedEmail.attachments.length})
                      </TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                      <TabsTrigger value="analysis">Análisis IA</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-6">
                      {/* Información del correo */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{selectedEmail.subject}</span>
                            <div className="flex items-center space-x-2">
                              {selectedEmail.isImportant && (
                                <Badge variant="destructive">Importante</Badge>
                              )}
                              {selectedEmail.isEncrypted && (
                                <Badge variant="outline">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Cifrado
                                </Badge>
                              )}
                              {selectedEmail.patientRelated && (
                                <Badge variant="secondary">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Relacionado con paciente
                                </Badge>
                              )}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">De:</Label>
                              <p className="text-sm">{selectedEmail.from.name} &lt;{selectedEmail.from.email}&gt;</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Fecha:</Label>
                              <p className="text-sm">{new Date(selectedEmail.date).toLocaleString()}</p>
                            </div>
                            <div className="col-span-2">
                              <Label className="text-sm font-medium text-gray-700">Para:</Label>
                              <p className="text-sm">
                                {selectedEmail.to.map(t => `${t.name} <${t.email}>`).join(', ')}
                              </p>
                            </div>
                            {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                              <div className="col-span-2">
                                <Label className="text-sm font-medium text-gray-700">CC:</Label>
                                <p className="text-sm">
                                  {selectedEmail.cc.map(c => `${c.name} <${c.email}>`).join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Contenido del correo */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Contenido del Mensaje</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedEmail.htmlBody ? (
                            <div 
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }}
                            />
                          ) : (
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                              {selectedEmail.body}
                            </pre>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="attachments" className="space-y-4">
                      {selectedEmail.attachments.length > 0 ? (
                        <div className="grid gap-4">
                          {selectedEmail.attachments.map((attachment) => (
                            <Card key={attachment.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    {getAttachmentIcon(attachment)}
                                    <div>
                                      <p className="font-medium">{attachment.name}</p>
                                      <p className="text-sm text-gray-600">{attachment.size} - {attachment.type}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4 mr-1" />
                                      Ver
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Download className="h-4 w-4 mr-1" />
                                      Descargar
                                    </Button>
                                  </div>
                                </div>
                                
                                {attachment.aiAnalysis && (
                                  <div className="mt-4 pt-4 border-t">
                                    <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                                      <Brain className="h-4 w-4 mr-2 text-blue-600" />
                                      Análisis IA del Archivo
                                    </h5>
                                    <p className="text-sm text-gray-600 mb-2">{attachment.aiAnalysis.summary}</p>
                                    <div className="space-y-2">
                                      <div>
                                        <Label className="text-xs font-medium text-gray-500">Entidades extraídas:</Label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {attachment.aiAnalysis.entities.map((entity, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                              {entity}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-xs font-medium text-gray-500">Información médica:</Label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {attachment.aiAnalysis.medicalInfo.map((info, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                              <Stethoscope className="h-2 w-2 mr-1" />
                                              {info}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Paperclip className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No hay archivos adjuntos en este correo</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="headers" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Headers del Correo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 font-mono text-xs">
                            <div><span className="font-bold">Message-ID:</span> &lt;{selectedEmail.id}@huvalle.com&gt;</div>
                            <div><span className="font-bold">From:</span> {selectedEmail.from.name} &lt;{selectedEmail.from.email}&gt;</div>
                            <div><span className="font-bold">To:</span> {selectedEmail.to.map(t => `${t.name} <${t.email}>`).join(', ')}</div>
                            <div><span className="font-bold">Subject:</span> {selectedEmail.subject}</div>
                            <div><span className="font-bold">Date:</span> {selectedEmail.date}</div>
                            <div><span className="font-bold">Content-Type:</span> text/html; charset=UTF-8</div>
                            <div><span className="font-bold">X-Priority:</span> {selectedEmail.priority}</div>
                            <div><span className="font-bold">X-Medical-Relevance:</span> {selectedEmail.medicalRelevance}%</div>
                            {selectedEmail.isEncrypted && (
                              <div><span className="font-bold">X-Encryption:</span> AES-256</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-4">
                      {selectedEmail.aiAnalysis ? (
                        <div className="space-y-4">
                          {/* Resumen y métricas */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                  <Target className="h-5 w-5 text-green-600" />
                                  <div>
                                    <p className="text-sm font-medium">Confianza IA</p>
                                    <p className="text-lg font-bold">{selectedEmail.aiAnalysis.confidenceScore}%</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                  <Activity className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <p className="text-sm font-medium">Relevancia Médica</p>
                                    <p className="text-lg font-bold">{selectedEmail.medicalRelevance}%</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                                  <div>
                                    <p className="text-sm font-medium">Urgencia</p>
                                    <Badge className={getUrgencyColor(selectedEmail.aiAnalysis.urgencyLevel)}>
                                      {selectedEmail.aiAnalysis.urgencyLevel}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Análisis detallado */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                                Análisis Completo de IA
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div>
                                <Label className="font-medium text-gray-700">Resumen:</Label>
                                <p className="text-gray-700 mt-1">{selectedEmail.aiAnalysis.summary}</p>
                              </div>

                              <div>
                                <Label className="font-medium text-gray-700">Puntos Clave:</Label>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                  {selectedEmail.aiAnalysis.keyPoints.map((point, index) => (
                                    <li key={index} className="text-gray-700">{point}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <Label className="font-medium text-gray-700">Términos Médicos Identificados:</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedEmail.aiAnalysis.medicalTerms.map((term, index) => (
                                    <Badge key={index} variant="outline">
                                      <Stethoscope className="h-3 w-3 mr-1" />
                                      {term}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <Label className="font-medium text-gray-700">Acciones Recomendadas:</Label>
                                <div className="space-y-2 mt-2">
                                  {selectedEmail.aiAnalysis.suggestedActions.map((action, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                      <span className="text-gray-700">{action}</span>
                                      <Button variant="ghost" size="sm">
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {selectedEmail.aiAnalysis.relatedPatients && (
                                <div>
                                  <Label className="font-medium text-gray-700">Pacientes Relacionados:</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedEmail.aiAnalysis.relatedPatients.map((patient, index) => (
                                      <Badge key={index} variant="secondary">
                                        <UserCheck className="h-3 w-3 mr-1" />
                                        {patient}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Análisis de IA en proceso...</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modales */}

        {/* Modal de Compartir */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-blue-600" />
                Compartir Correo
              </DialogTitle>
              <DialogDescription>
                Comparte este análisis de correo con tu equipo médico
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="share-email">Enviar a (Email):</Label>
                <Input id="share-email" placeholder="doctor@huvalle.com" />
              </div>
              <div>
                <Label htmlFor="share-message">Mensaje adicional:</Label>
                <Textarea
                  id="share-message"
                  placeholder="Revisar urgentemente este análisis..."
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-ai" className="rounded" />
                <Label htmlFor="include-ai" className="text-sm">
                  Incluir análisis de IA
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-attachments" className="rounded" />
                <Label htmlFor="include-attachments" className="text-sm">
                  Incluir archivos adjuntos
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowShareModal(false)}>
                Cancelar
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Configuración */}
        <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-600" />
                Configuración de Gmail AI
              </DialogTitle>
              <DialogDescription>
                Personaliza el comportamiento del análisis de IA
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Análisis Automático</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Procesar correos automáticamente</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Detectar urgencia médica</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Extraer términos médicos</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Relacionar con pacientes</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Notificaciones</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Correos de alta urgencia</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Nuevos términos médicos</Label>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Análisis completado</Label>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Privacidad</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Cifrado end-to-end</Label>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Retención de datos</Label>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 días</SelectItem>
                        <SelectItem value="30">30 días</SelectItem>
                        <SelectItem value="90">90 días</SelectItem>
                        <SelectItem value="365">1 año</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
                Cancelar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Ayuda */}
        <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                Ayuda - Gmail AI Médico
              </DialogTitle>
              <DialogDescription>
                Guía completa para usar todas las funciones de Gmail AI
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <Tabs defaultValue="features" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="features">Funciones</TabsTrigger>
                  <TabsTrigger value="shortcuts">Atajos</TabsTrigger>
                  <TabsTrigger value="tips">Consejos</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="features" className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        Análisis de IA
                      </h4>
                      <p className="text-sm text-blue-800">
                        El sistema analiza automáticamente cada correo para identificar contenido médico,
                        evaluar urgencia y extraer información relevante.
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Procesamiento de Adjuntos
                      </h4>
                      <p className="text-sm text-green-800">
                        Los archivos adjuntos se procesan automáticamente para extraer información médica,
                        incluyendo PDFs, imágenes y documentos.
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Vista PDF-like
                      </h4>
                      <p className="text-sm text-purple-800">
                        Visualiza correos en formato similar a PDF para una mejor presentación
                        e impresión de documentos médicos.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="shortcuts" className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Cambiar a vista PDF</span>
                      <Badge variant="outline">Ctrl + P</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Pantalla completa</span>
                      <Badge variant="outline">F11</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Buscar en correo</span>
                      <Badge variant="outline">Ctrl + F</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Responder</span>
                      <Badge variant="outline">R</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Archivar</span>
                      <Badge variant="outline">E</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tips" className="space-y-3">
                  <div className="space-y-3">
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Tip:</strong> El análisis de IA es más preciso cuando los correos contienen
                        términos médicos específicos y están bien estructurados.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Tip:</strong> Usa la vista PDF-like para presentaciones y documentación
                        oficial del análisis de correos.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Tip:</strong> Los archivos adjuntos se procesan automáticamente,
                        pero puedes hacer clic en "Procesar con IA" para un análisis más profundo.
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>

                <TabsContent value="faq" className="space-y-3">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">¿Qué tan preciso es el análisis de IA?</h4>
                      <p className="text-sm text-gray-600">
                        El sistema tiene una precisión del 98.5% en la identificación de contenido médico
                        y 96.8% en la evaluación de urgencia.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">¿Se almacenan los datos de los correos?</h4>
                      <p className="text-sm text-gray-600">
                        Los datos se procesan localmente y se cifran. Solo se almacenan metadatos
                        necesarios para el análisis según la configuración de retención.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">¿Puedo personalizar las categorías médicas?</h4>
                      <p className="text-sm text-gray-600">
                        Sí, puedes agregar términos médicos personalizados y ajustar las categorías
                        desde la configuración avanzada.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowHelpModal(false)}>
                Entendido
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Respuesta */}
        <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Reply className="h-5 w-5 mr-2 text-blue-600" />
                Responder Correo
              </DialogTitle>
              <DialogDescription>
                Para: {selectedEmail.from.name} &lt;{selectedEmail.from.email}&gt;
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reply-subject">Asunto:</Label>
                <Input
                  id="reply-subject"
                  defaultValue={`Re: ${selectedEmail.subject}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reply-cc">CC:</Label>
                  <Input
                    id="reply-cc"
                    placeholder="emails adicionales..."
                  />
                </div>
                <div>
                  <Label htmlFor="reply-priority">Prioridad:</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="reply-body">Mensaje:</Label>
                <Textarea
                  id="reply-body"
                  rows={10}
                  placeholder="Escribe tu respuesta aquí..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Adjuntar archivo
                </Button>
                <Button variant="outline" size="sm">
                  <Brain className="h-4 w-4 mr-2" />
                  Sugerir respuesta con IA
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar borrador
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReplyModal(false)}>
                Cancelar
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default GmailAI;
