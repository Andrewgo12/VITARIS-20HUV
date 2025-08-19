import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
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
import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Download,
  Print,
  Share2,
  Bookmark,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Home,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Settings,
  Info,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  FileType,
  Hash,
  Layers,
  Grid,
  ScanLine,
  Contrast,
  Sun,
  Moon,
  Monitor,
  RefreshCw,
  Save,
  FolderOpen,
  Archive,
  Tag,
  Star,
  Heart,
  Plus,
  Minus,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

// Tipos para el documento PDF
interface PDFDocument {
  id: string;
  name: string;
  type: 'medical-record' | 'lab-result' | 'imaging' | 'prescription' | 'consent' | 'discharge' | 'surgery-note';
  size: string;
  pages: number;
  dateCreated: string;
  dateModified: string;
  author: string;
  status: 'active' | 'archived' | 'pending' | 'approved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  patient?: {
    id: string;
    name: string;
    age: number;
    gender: string;
  };
  department: string;
  tags: string[];
  version: string;
  isEncrypted: boolean;
  isSignatureRequired: boolean;
  hasWatermark: boolean;
}

// Documentos de ejemplo
const mockDocuments: PDFDocument[] = [
  {
    id: 'doc-001',
    name: 'Historia Clínica - Juan Pérez',
    type: 'medical-record',
    size: '2.4 MB',
    pages: 15,
    dateCreated: '2024-01-15',
    dateModified: '2024-01-20',
    author: 'Dr. María González',
    status: 'active',
    priority: 'medium',
    patient: {
      id: 'pat-001',
      name: 'Juan Pérez',
      age: 45,
      gender: 'Masculino'
    },
    department: 'Medicina Interna',
    tags: ['diabetes', 'hipertensión', 'seguimiento'],
    version: '1.2',
    isEncrypted: true,
    isSignatureRequired: true,
    hasWatermark: true
  },
  {
    id: 'doc-002',
    name: 'Resultado de Laboratorio - Hemograma',
    type: 'lab-result',
    size: '1.2 MB',
    pages: 3,
    dateCreated: '2024-01-22',
    dateModified: '2024-01-22',
    author: 'Lab Central',
    status: 'approved',
    priority: 'high',
    patient: {
      id: 'pat-002',
      name: 'Ana López',
      age: 32,
      gender: 'Femenino'
    },
    department: 'Laboratorio',
    tags: ['hemograma', 'urgente', 'anemia'],
    version: '1.0',
    isEncrypted: true,
    isSignatureRequired: false,
    hasWatermark: false
  },
  {
    id: 'doc-003',
    name: 'Resonancia Magnética - Rodilla',
    type: 'imaging',
    size: '5.8 MB',
    pages: 8,
    dateCreated: '2024-01-18',
    dateModified: '2024-01-19',
    author: 'Dr. Carlos Ruiz',
    status: 'active',
    priority: 'medium',
    patient: {
      id: 'pat-003',
      name: 'Pedro Martínez',
      age: 28,
      gender: 'Masculino'
    },
    department: 'Radiología',
    tags: ['rmn', 'rodilla', 'deportivo', 'lesión'],
    version: '1.1',
    isEncrypted: true,
    isSignatureRequired: true,
    hasWatermark: true
  }
];

const PDFViewer: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<PDFDocument>(mockDocuments[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(selectedDocument.pages);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const viewerRef = useRef<HTMLDivElement>(null);

  // Simulación de carga de documento
  const loadDocument = async (docId: string) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  useEffect(() => {
    loadDocument(selectedDocument.id);
  }, [selectedDocument.id]);

  // Funciones de control
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  };

  const handleRotateClockwise = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleRotateCounterclockwise = () => {
    setRotation(prev => (prev - 90 + 360) % 360);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const getDocumentTypeIcon = (type: PDFDocument['type']) => {
    switch (type) {
      case 'medical-record': return <FileText className="h-4 w-4" />;
      case 'lab-result': return <ScanLine className="h-4 w-4" />;
      case 'imaging': return <Monitor className="h-4 w-4" />;
      case 'prescription': return <Heart className="h-4 w-4" />;
      case 'consent': return <CheckCircle className="h-4 w-4" />;
      case 'discharge': return <Home className="h-4 w-4" />;
      case 'surgery-note': return <Layers className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: PDFDocument['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: PDFDocument['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TooltipProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header del Visor */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getDocumentTypeIcon(selectedDocument.type)}
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedDocument.name}
                </h1>
                <Badge className={getStatusColor(selectedDocument.status)}>
                  {selectedDocument.status}
                </Badge>
                <Badge className={getPriorityColor(selectedDocument.priority)}>
                  {selectedDocument.priority}
                </Badge>
              </div>
              {selectedDocument.isEncrypted && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-blue-600">
                      <FileType className="h-3 w-3 mr-1" />
                      Cifrado
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Documento cifrado y protegido</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {selectedDocument.isSignatureRequired && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-purple-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Firma Requerida
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Requiere firma digital</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Selector de documento */}
              <Select
                value={selectedDocument.id}
                onValueChange={(value) => {
                  const doc = mockDocuments.find(d => d.id === value);
                  if (doc) setSelectedDocument(doc);
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockDocuments.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      <div className="flex items-center space-x-2">
                        {getDocumentTypeIcon(doc.type)}
                        <span className="truncate">{doc.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Botón de modo oscuro */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                  >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cambiar modo de visualización</p>
                </TooltipContent>
              </Tooltip>

              {/* Botón de pantalla completa */}
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

        <div className="flex">
          {/* Panel lateral izquierdo */}
          <div className={`${isFullscreen ? 'hidden' : 'w-80'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
            {/* Información del documento */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Paciente:</span>
                  <span className="text-sm font-medium">{selectedDocument.patient?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha:</span>
                  <span className="text-sm">{selectedDocument.dateCreated}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Versión:</span>
                  <span className="text-sm">{selectedDocument.version}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Archive className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tamaño:</span>
                  <span className="text-sm">{selectedDocument.size}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3">
                <Label className="text-xs text-gray-500 dark:text-gray-400">Etiquetas:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedDocument.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Controles de navegación */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                {/* Búsqueda */}
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-medium">Buscar en documento</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Buscar texto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filtros */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Filtros y herramientas</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {showFilters && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={showGrid ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowGrid(!showGrid)}
                        >
                          <Grid className="h-4 w-4 mr-1" />
                          Cuadrícula
                        </Button>
                        <Button
                          variant={showRuler ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowRuler(!showRuler)}
                        >
                          <ScanLine className="h-4 w-4 mr-1" />
                          Regla
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Contrast className="h-4 w-4 mr-2" />
                        Alto contraste
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Miniaturas y marcadores */}
            <div className="flex-1 overflow-hidden">
              <div className="p-4">
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant={showThumbnails ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setShowThumbnails(true);
                      setShowBookmarks(false);
                    }}
                  >
                    <Layers className="h-4 w-4 mr-1" />
                    Miniaturas
                  </Button>
                  <Button
                    variant={showBookmarks ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setShowBookmarks(true);
                      setShowThumbnails(false);
                    }}
                  >
                    <Bookmark className="h-4 w-4 mr-1" />
                    Marcadores
                  </Button>
                </div>

                <ScrollArea className="h-96">
                  {showThumbnails && (
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <div
                          key={pageNum}
                          className={`relative border-2 rounded cursor-pointer hover:border-blue-500 ${
                            currentPage === pageNum ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          <div className="aspect-[3/4] bg-white dark:bg-gray-700 rounded flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="absolute bottom-1 left-1 right-1 text-center">
                            <span className="text-xs bg-black bg-opacity-75 text-white px-1 rounded">
                              {pageNum}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showBookmarks && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <Bookmark className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Diagnóstico principal</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <Bookmark className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Tratamiento recomendado</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <Bookmark className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Seguimiento</span>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Área principal del visor */}
          <div className="flex-1 flex flex-col">
            {/* Barra de herramientas */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Controles de página */}
                  <div className="flex items-center space-x-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleFirstPage}>
                          <SkipBack className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Primera página</p></TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage <= 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Página anterior</p></TooltipContent>
                    </Tooltip>

                    <div className="flex items-center space-x-2 px-3">
                      <Input
                        type="number"
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (page >= 1 && page <= totalPages) {
                            setCurrentPage(page);
                          }
                        }}
                        className="w-16 text-center"
                        min={1}
                        max={totalPages}
                      />
                      <span className="text-sm text-gray-500">de {totalPages}</span>
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage >= totalPages}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Página siguiente</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleLastPage}>
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Última página</p></TooltipContent>
                    </Tooltip>
                  </div>

                  <Separator orientation="vertical" className="h-6" />

                  {/* Controles de zoom */}
                  <div className="flex items-center space-x-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 25}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Alejar</p></TooltipContent>
                    </Tooltip>

                    <Select
                      value={zoomLevel.toString()}
                      onValueChange={(value) => setZoomLevel(parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="50">50%</SelectItem>
                        <SelectItem value="75">75%</SelectItem>
                        <SelectItem value="100">100%</SelectItem>
                        <SelectItem value="125">125%</SelectItem>
                        <SelectItem value="150">150%</SelectItem>
                        <SelectItem value="200">200%</SelectItem>
                        <SelectItem value="300">300%</SelectItem>
                      </SelectContent>
                    </Select>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 300}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Acercar</p></TooltipContent>
                    </Tooltip>
                  </div>

                  <Separator orientation="vertical" className="h-6" />

                  {/* Controles de rotación */}
                  <div className="flex items-center space-x-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleRotateCounterclockwise}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Rotar sentido antihorario</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleRotateClockwise}>
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Rotar sentido horario</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Herramientas adicionales */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Herramientas
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Herramientas</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Modo lectura
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Contrast className="h-4 w-4 mr-2" />
                        Alto contraste
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Grid className="h-4 w-4 mr-2" />
                        Mostrar cuadrícula
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ScanLine className="h-4 w-4 mr-2" />
                        Mostrar regla
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Acciones principales */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Guardar</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Print className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Imprimir</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Descargar</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Compartir</p></TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Área del documento */}
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <RefreshCw className="h-12 w-12 animate-spin text-blue-500" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Cargando documento...
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {selectedDocument.name}
                    </p>
                  </div>
                  <div className="w-64">
                    <Progress value={loadingProgress} className="h-2" />
                    <p className="text-xs text-center text-gray-500 mt-1">
                      {loadingProgress}% completado
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div
                    ref={viewerRef}
                    className="relative bg-white dark:bg-gray-800 shadow-lg"
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                      transformOrigin: 'center',
                      width: '800px',
                      minHeight: '1000px',
                    }}
                  >
                    {/* Simulación del contenido del PDF */}
                    <div className="p-8 space-y-6">
                      <div className="text-center border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedDocument.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Página {currentPage} de {totalPages}
                        </p>
                        {selectedDocument.hasWatermark && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                            <span className="text-6xl font-bold text-gray-500 transform rotate-45">
                              VITARIS
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Paciente: {selectedDocument.patient?.name}</p>
                            <p className="text-sm text-gray-500">
                              {selectedDocument.patient?.age} años - {selectedDocument.patient?.gender}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">Fecha del documento</p>
                            <p className="text-sm text-gray-500">{selectedDocument.dateCreated}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="font-medium">Departamento</p>
                            <p className="text-sm text-gray-500">{selectedDocument.department}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Contenido del documento:</h3>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <p>Este es un ejemplo del contenido que aparecería en un documento PDF médico real.</p>
                            <p>En un visor PDF funcional, aquí se renderizaría el contenido real del archivo PDF.</p>
                            <p>El sistema VITARIS permite visualizar todos los tipos de documentos médicos de forma segura y eficiente.</p>
                          </div>
                        </div>

                        {showGrid && (
                          <div 
                            className="absolute inset-0 pointer-events-none opacity-20"
                            style={{
                              backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                              backgroundSize: '20px 20px'
                            }}
                          />
                        )}

                        {showRuler && (
                          <>
                            <div className="absolute top-0 left-0 right-0 h-4 bg-yellow-100 border-b border-yellow-300">
                              {Array.from({ length: 40 }, (_, i) => (
                                <div
                                  key={i}
                                  className="absolute border-l border-yellow-400"
                                  style={{ left: `${i * 20}px`, height: '100%' }}
                                />
                              ))}
                            </div>
                            <div className="absolute top-0 bottom-0 left-0 w-4 bg-yellow-100 border-r border-yellow-300">
                              {Array.from({ length: 50 }, (_, i) => (
                                <div
                                  key={i}
                                  className="absolute border-t border-yellow-400"
                                  style={{ top: `${i * 20}px`, width: '100%' }}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Barra de estado */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>Zoom: {zoomLevel}%</span>
                  <span>Página: {currentPage}/{totalPages}</span>
                  <span>Rotación: {rotation}°</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>Versión: {selectedDocument.version}</span>
                  <span>Tamaño: {selectedDocument.size}</span>
                  {selectedDocument.isEncrypted && (
                    <span className="text-blue-600">🔒 Cifrado</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PDFViewer;
