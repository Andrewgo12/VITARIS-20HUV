import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  FileText,
  Mail,
  Zap,
  Eye,
  Download,
  Search,
  Filter,
  Sparkles,
  Target,
  Activity,
  Stethoscope,
  UserCheck,
  ClipboardList,
  Paperclip,
  Shield,
  Lock,
  Star,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Database,
  Settings,
  Info,
  HelpCircle,
  Lightbulb,
  TrendingUp,
  BarChart3,
  PieChart,
  FileBarChart,
  Archive,
  Clock,
  Calendar,
  User,
  Tag,
  Hash,
  Globe,
  Cloud,
  Layers,
  Grid,
  Maximize2,
  ZoomIn,
  RotateCw,
  Printer,
  Share2,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Heart,
  Monitor,
  Wifi,
  Cpu,
  HardDrive,
  MemoryStick,
} from "lucide-react";

const DocumentsHub: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Centro de Documentos y Análisis IA
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas avanzadas de inteligencia artificial para el
              procesamiento, análisis y gestión de documentos médicos en el
              sistema VITARIS
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Badge className="bg-blue-100 text-blue-800">IA Médica</Badge>
              <Badge className="bg-green-100 text-green-800">
                An��lisis Avanzado
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                Procesamiento Inteligente
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Herramientas principales */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Gmail AI */}
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 group">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Brain className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Gmail AI Médico</CardTitle>
                    <p className="text-blue-100 mt-1">
                      Análisis inteligente de correos electrónicos
                    </p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  IA Avanzada
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  Capacidades Principales
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Visualización individual</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Análisis de adjuntos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Vista PDF-like</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Extracción de datos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Términos médicos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Urgencia automática</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  Funciones de IA
                </h4>

                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        Análisis Médico
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Identifica automáticamente términos médicos, diagnósticos,
                      medicamentos y procedimientos
                    </p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">
                        Evaluación de Urgencia
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Clasifica automáticamente el nivel de urgencia basado en
                      el contenido médico
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserCheck className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">
                        Relación con Pacientes
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Conecta automáticamente correos con registros de pacientes
                      existentes
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <Paperclip className="h-4 w-4 mr-2 text-gray-600" />
                  Procesamiento de Adjuntos
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-red-50 p-2 rounded">
                    <FileText className="h-4 w-4 mx-auto text-red-600 mb-1" />
                    <span className="text-xs">PDFs</span>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <FileBarChart className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <span className="text-xs">Imágenes</span>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <Archive className="h-4 w-4 mx-auto text-green-600 mb-1" />
                    <span className="text-xs">Documentos</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link to="/medical/gmail-ai">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group">
                    <Mail className="h-5 w-5 mr-2" />
                    Abrir Gmail AI
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* PDF Viewer */}
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 group">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white pb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Visor PDF Médico</CardTitle>
                    <p className="text-purple-100 mt-1">
                      Visualización avanzada de documentos
                    </p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  Profesional
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-purple-600" />
                  Características Avanzadas
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Zoom inteligente</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Rotación de documentos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Navegación por páginas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Marcadores automáticos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Búsqueda en texto</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Modo pantalla completa</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-purple-600" />
                  Herramientas de Visualización
                </h4>

                <div className="space-y-3">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <ZoomIn className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">
                        Control de Zoom
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Zoom desde 25% hasta 300% con controles precisos para una
                      visualización óptima
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Grid className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        Ayudas Visuales
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Cuadrícula, reglas y alto contraste para facilitar la
                      lectura médica
                    </p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Search className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">
                        Búsqueda Avanzada
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Búsqueda en tiempo real dentro del documento con resaltado
                      automático
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <Share2 className="h-4 w-4 mr-2 text-gray-600" />
                  Acciones Disponibles
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <Print className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                    <span className="text-xs">Imprimir</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <Download className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                    <span className="text-xs">Descargar</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <Share2 className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                    <span className="text-xs">Compartir</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <Save className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                    <span className="text-xs">Guardar</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link to="/medical/pdf-viewer">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white group">
                    <FileText className="h-5 w-5 mr-2" />
                    Abrir Visor PDF
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sección de estadísticas */}
        <div className="bg-white rounded-lg border shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Estadísticas del Sistema
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-3">
                <Mail className="h-8 w-8 mx-auto text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
              <p className="text-sm text-gray-600">Correos analizados</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-3">
                <FileText className="h-8 w-8 mx-auto text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">1,523</p>
              <p className="text-sm text-gray-600">PDFs procesados</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-3">
                <UserCheck className="h-8 w-8 mx-auto text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">98.5%</p>
              <p className="text-sm text-gray-600">Precisión IA</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-lg mb-3">
                <Clock className="h-8 w-8 mx-auto text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">45 seg</p>
              <p className="text-sm text-gray-600">Tiempo promedio</p>
            </div>
          </div>
        </div>

        {/* Sección de características comparativas */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Comparación de Herramientas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Característica
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-blue-700">
                    Gmail AI
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-purple-700">
                    PDF Viewer
                  </th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">Análisis de IA</td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="h-5 w-5 bg-gray-300 rounded mx-auto"></div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">
                    Procesamiento de adjuntos
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="h-5 w-5 bg-gray-300 rounded mx-auto"></div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">
                    Vista PDF optimizada
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">
                    Controles de zoom avanzados
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">
                    Búsqueda en contenido
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-700">
                    Navegación por miniaturas
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="h-5 w-5 bg-gray-300 rounded mx-auto"></div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">
                    Extracción de datos médicos
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="h-5 w-5 bg-gray-300 rounded mx-auto"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección de ayuda y recursos */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-blue-800">
                <BookOpen className="h-5 w-5 mr-2" />
                Documentación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 mb-4">
                Guías completas para usar todas las funciones de análisis de
                documentos
              </p>
              <Button
                variant="outline"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Ver Gu��as
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-purple-800">
                <HelpCircle className="h-5 w-5 mr-2" />
                Soporte Técnico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-700 mb-4">
                Asistencia especializada para problemas técnicos y configuración
              </p>
              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Contactar Soporte
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-green-800">
                <Lightbulb className="h-5 w-5 mr-2" />
                Mejores Prácticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700 mb-4">
                Consejos y recomendaciones para optimizar el uso de las
                herramientas
              </p>
              <Button
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-100"
              >
                Ver Consejos
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer con accesos rápidos */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/medical/gmail-ai">
              <Button
                variant="outline"
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Mail className="h-4 w-4 mr-2" />
                Gmail AI
              </Button>
            </Link>
            <Link to="/medical/pdf-viewer">
              <Button
                variant="outline"
                className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF Viewer
              </Button>
            </Link>
            <Link to="/huv-dashboard">
              <Button
                variant="outline"
                className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                <Monitor className="h-4 w-4 mr-2" />
                Dashboard Principal
              </Button>
            </Link>
            <Link to="/system">
              <Button
                variant="outline"
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <Settings className="h-4 w-4 mr-2" />
                Sistema
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsHub;
