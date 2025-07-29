import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Download,
  Calendar as CalendarIcon,
  Users,
  Activity,
  DollarSign,
  Clock,
  Filter,
  Settings,
  Eye,
  Share,
  Mail,
  Printer,
  Database,
  CheckCircle,
} from "lucide-react";

interface ReportGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reportTypes = [
  {
    id: "clinical",
    name: "Reportes Clínicos",
    description: "Indicadores de calidad, morbimortalidad, resultados de tratamiento",
    icon: Activity,
    templates: [
      "Morbimortalidad mensual",
      "Indicadores de calidad",
      "Complicaciones quirúrgicas",
      "Seguimiento de protocolos",
      "Satisfacción del paciente",
    ]
  },
  {
    id: "operational",
    name: "Reportes Operacionales",
    description: "Eficiencia de recursos, tiempos de espera, utilización",
    icon: Users,
    templates: [
      "Ocupación de camas",
      "Tiempos de espera",
      "Flujo de pacientes",
      "Utilización de equipos",
      "Productividad del personal",
    ]
  },
  {
    id: "financial",
    name: "Reportes Financieros",
    description: "Costos, facturación, rentabilidad por departamento",
    icon: DollarSign,
    templates: [
      "Costos por paciente",
      "Facturación por especialidad",
      "Análisis de rentabilidad",
      "Presupuesto departamental",
      "Proyecciones financieras",
    ]
  },
  {
    id: "statistical",
    name: "Reportes Estadísticos",
    description: "Análisis de tendencias, comparativos, métricas de desempeño",
    icon: BarChart3,
    templates: [
      "Tendencias epidemiológicas",
      "Comparativo anual",
      "Benchmarking",
      "Análisis predictivo",
      "Dashboard ejecutivo",
    ]
  },
];

const departments = [
  "Todos los departamentos",
  "UCI",
  "Urgencias",
  "Cirugía",
  "Medicina Interna",
  "Pediatría",
  "Ginecología",
  "Cardiología",
  "Neurología",
  "Farmacia",
  "Laboratorio",
  "Imagenología",
];

const formats = [
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "excel", label: "Excel", icon: Database },
  { value: "csv", label: "CSV", icon: Database },
  { value: "word", label: "Word", icon: FileText },
];

const frequencies = [
  { value: "once", label: "Una vez" },
  { value: "daily", label: "Diario" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensual" },
  { value: "quarterly", label: "Trimestral" },
  { value: "yearly", label: "Anual" },
];

export default function ReportGeneratorModal({ open, onOpenChange }: ReportGeneratorModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [reportConfig, setReportConfig] = useState({
    title: "",
    description: "",
    departments: [] as string[],
    dateRange: {
      start: new Date(),
      end: new Date(),
    },
    format: "pdf",
    includeCharts: true,
    includeComments: false,
    confidential: true,
    watermark: true,
    schedule: {
      enabled: false,
      frequency: "monthly",
      recipients: [] as string[],
    },
    filters: {
      patientAge: { min: "", max: "" },
      admissionType: "all",
      severity: "all",
      insurance: "all",
    },
  });

  const currentReportType = reportTypes.find(type => type.id === selectedType);

  const handleDepartmentChange = (department: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      departments: checked
        ? [...prev.departments, department]
        : prev.departments.filter(d => d !== department)
    }));
  };

  const handleFilterChange = (filterType: string, value: any) => {
    setReportConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: value,
      }
    }));
  };

  const handleScheduleChange = (field: string, value: any) => {
    setReportConfig(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value,
      }
    }));
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simular progreso de generación
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setCurrentStep(4);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Generador de Reportes Médicos
          </DialogTitle>
          <DialogDescription>
            Crear reportes personalizados con análisis clínicos, operacionales y financieros
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center space-x-2 ${
                  step <= currentStep ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                <span className="text-sm font-medium">
                  {step === 1 && "Tipo"}
                  {step === 2 && "Configuración"}
                  {step === 3 && "Filtros"}
                  {step === 4 && "Resultado"}
                </span>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Tabs value={currentStep.toString()} className="w-full">
          {/* Paso 1: Selección de Tipo de Reporte */}
          <TabsContent value="1" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Seleccionar Tipo de Reporte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedType === type.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <type.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{type.name}</h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {type.description}
                          </p>
                          {selectedType === type.id && (
                            <CheckCircle className="w-6 h-6 text-blue-600 mt-2" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedType && currentReportType && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Plantillas Disponibles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentReportType.templates.map((template, index) => (
                          <div
                            key={index}
                            className={`p-3 border rounded cursor-pointer transition-colors ${
                              selectedTemplate === template
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{template}</span>
                              {selectedTemplate === template && (
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paso 2: Configuración del Reporte */}
          <TabsContent value="2" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuración General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título del Reporte</Label>
                    <Input
                      placeholder="Ingrese el título del reporte"
                      value={reportConfig.title}
                      onChange={(e) => setReportConfig(prev => ({ 
                        ...prev, 
                        title: e.target.value 
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      placeholder="Descripción opcional del reporte"
                      rows={3}
                      value={reportConfig.description}
                      onChange={(e) => setReportConfig(prev => ({ 
                        ...prev, 
                        description: e.target.value 
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Formato de Exportación</Label>
                    <Select
                      value={reportConfig.format}
                      onValueChange={(value) => setReportConfig(prev => ({ 
                        ...prev, 
                        format: value 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            <div className="flex items-center gap-2">
                              <format.icon className="w-4 h-4" />
                              {format.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Incluir gráficos</Label>
                      <Switch
                        checked={reportConfig.includeCharts}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ 
                          ...prev, 
                          includeCharts: checked 
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Incluir comentarios</Label>
                      <Switch
                        checked={reportConfig.includeComments}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ 
                          ...prev, 
                          includeComments: checked 
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Documento confidencial</Label>
                      <Switch
                        checked={reportConfig.confidential}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ 
                          ...prev, 
                          confidential: checked 
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Marca de agua</Label>
                      <Switch
                        checked={reportConfig.watermark}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ 
                          ...prev, 
                          watermark: checked 
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Período y Departamentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha de inicio</Label>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date > new Date()}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de fin</Label>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date > new Date()}
                        className="rounded-md border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Departamentos a incluir</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {departments.map((dept) => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox
                            id={dept}
                            checked={reportConfig.departments.includes(dept)}
                            onCheckedChange={(checked) => 
                              handleDepartmentChange(dept, checked as boolean)
                            }
                          />
                          <Label htmlFor={dept} className="text-sm">{dept}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Programación Automática (Opcional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Generar reporte automáticamente</Label>
                  <Switch
                    checked={reportConfig.schedule.enabled}
                    onCheckedChange={(checked) => handleScheduleChange("enabled", checked)}
                  />
                </div>

                {reportConfig.schedule.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Frecuencia</Label>
                      <Select
                        value={reportConfig.schedule.frequency}
                        onValueChange={(value) => handleScheduleChange("frequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencies.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Destinatarios de email</Label>
                      <Input
                        placeholder="emails separados por comas"
                        onChange={(e) => handleScheduleChange("recipients", e.target.value.split(","))}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paso 3: Filtros Avanzados */}
          <TabsContent value="3" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros Avanzados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Filtros de Paciente</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Edad mínima</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={reportConfig.filters.patientAge.min}
                          onChange={(e) => handleFilterChange("patientAge", {
                            ...reportConfig.filters.patientAge,
                            min: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Edad máxima</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={reportConfig.filters.patientAge.max}
                          onChange={(e) => handleFilterChange("patientAge", {
                            ...reportConfig.filters.patientAge,
                            max: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de admisión</Label>
                      <Select
                        value={reportConfig.filters.admissionType}
                        onValueChange={(value) => handleFilterChange("admissionType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="emergency">Urgencias</SelectItem>
                          <SelectItem value="scheduled">Programadas</SelectItem>
                          <SelectItem value="elective">Electivas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Filtros Clínicos</h4>
                    
                    <div className="space-y-2">
                      <Label>Nivel de severidad</Label>
                      <Select
                        value={reportConfig.filters.severity}
                        onValueChange={(value) => handleFilterChange("severity", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="low">Bajo</SelectItem>
                          <SelectItem value="medium">Medio</SelectItem>
                          <SelectItem value="high">Alto</SelectItem>
                          <SelectItem value="critical">Crítico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de seguro</Label>
                      <Select
                        value={reportConfig.filters.insurance}
                        onValueChange={(value) => handleFilterChange("insurance", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="public">Público</SelectItem>
                          <SelectItem value="private">Privado</SelectItem>
                          <SelectItem value="particular">Particular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Resumen de la Configuración</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Tipo:</strong> {currentReportType?.name}
                    </div>
                    <div>
                      <strong>Plantilla:</strong> {selectedTemplate}
                    </div>
                    <div>
                      <strong>Formato:</strong> {reportConfig.format.toUpperCase()}
                    </div>
                    <div>
                      <strong>Departamentos:</strong> {reportConfig.departments.length || "Ninguno"}
                    </div>
                    <div>
                      <strong>Período:</strong> {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Programado:</strong> {reportConfig.schedule.enabled ? "Sí" : "No"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paso 4: Generación y Resultado */}
          <TabsContent value="4" className="space-y-6">
            {isGenerating ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 animate-spin" />
                    Generando Reporte...
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p>Procesando datos y generando reporte</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{generationProgress}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Reporte Generado Exitosamente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-blue-600">156</div>
                      <div className="text-sm text-muted-foreground">Registros procesados</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-600">2.3 MB</div>
                      <div className="text-sm text-muted-foreground">Tamaño del archivo</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-sm text-muted-foreground">Páginas generadas</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Descargar Reporte
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Vista Previa
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Enviar por Email
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Share className="w-4 h-4" />
                      Compartir
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Printer className="w-4 h-4" />
                      Imprimir
                    </Button>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Información del Reporte</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
                      <div><strong>Título:</strong> {reportConfig.title}</div>
                      <div><strong>Formato:</strong> {reportConfig.format.toUpperCase()}</div>
                      <div><strong>Generado:</strong> {new Date().toLocaleString()}</div>
                      <div><strong>Plantilla:</strong> {selectedTemplate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && !isGenerating && (
              <Button variant="outline" onClick={handlePrevious}>
                Anterior
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {currentStep === 4 ? "Cerrar" : "Cancelar"}
            </Button>
            {currentStep < 3 && (
              <Button 
                onClick={handleNext} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={
                  (currentStep === 1 && (!selectedType || !selectedTemplate)) ||
                  (currentStep === 2 && !reportConfig.title)
                }
              >
                Siguiente
              </Button>
            )}
            {currentStep === 3 && !isGenerating && (
              <Button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generar Reporte
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
