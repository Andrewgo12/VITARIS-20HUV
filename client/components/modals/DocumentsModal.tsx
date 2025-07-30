import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  X,
  FileText,
  User,
  Phone,
  Download,
  Save,
  Send,
  Eye,
  Search,
  Filter,
  Archive,
  Share2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMedicalData } from "@/context/MedicalDataContext";
import { ResponsiveModalWrapper } from "@/components/ResponsiveModalWrapper";

interface DocumentsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  patientId?: string;
  mode?: "create" | "view" | "manage";
  onDocumentSaved?: (documents: any) => void;
}

const allowedFileTypes = [
  { extension: ".pdf", description: "PDF", icon: "📄" },
  { extension: ".doc", description: "Word", icon: "📝" },
  { extension: ".docx", description: "Word", icon: "📝" },
  { extension: ".jpg", description: "Imagen JPG", icon: "🖼️" },
  { extension: ".jpeg", description: "Imagen JPEG", icon: "🖼️" },
  { extension: ".png", description: "Imagen PNG", icon: "🖼️" },
  { extension: ".xlsx", description: "Excel", icon: "📊" },
  { extension: ".txt", description: "Texto", icon: "📄" },
];

const documentCategories = [
  {
    id: "historia_clinica",
    name: "Historia Clínica",
    description: "Historias clínicas previas",
    color: "bg-blue-100 text-blue-800",
    priority: "high",
  },
  {
    id: "examenes",
    name: "Exámenes de Laboratorio",
    description: "Hemograma, química sanguínea, serologías, orina",
    color: "bg-green-100 text-green-800",
    priority: "high",
  },
  {
    id: "imagenes",
    name: "Imágenes Diagnósticas",
    description: "Radiografías, TAC, Ecografías, Resonancias",
    color: "bg-purple-100 text-purple-800",
    priority: "high",
  },
  {
    id: "informes",
    name: "Informes Clínicos",
    description: "Informes médicos del último mes",
    color: "bg-orange-100 text-orange-800",
    priority: "medium",
  },
  {
    id: "fotografias",
    name: "Evidencia Fotográfica",
    description: "Heridas, lesiones, condiciones visibles",
    color: "bg-pink-100 text-pink-800",
    priority: "medium",
  },
  {
    id: "pruebas",
    name: "Pruebas Especiales",
    description: "Pruebas rápidas, COVID, marcadores específicos",
    color: "bg-yellow-100 text-yellow-800",
    priority: "medium",
  },
  {
    id: "identificacion",
    name: "Documentos de Identidad",
    description: "Cédula, carné EPS, autorizaciones",
    color: "bg-indigo-100 text-indigo-800",
    priority: "high",
  },
  {
    id: "otros",
    name: "Otros Documentos",
    description: "Documentos adicionales",
    color: "bg-gray-100 text-gray-800",
    priority: "low",
  },
];

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadDate: string;
  description?: string;
  file: File;
}

export default function DocumentsModal({
  isOpen = false,
  onClose,
  patientId,
  mode = "create",
  onDocumentSaved,
}: DocumentsModalProps) {
  const { toast } = useToast();
  const { patients, activePatients, saveToLocal } = useMedicalData();

  // Form state
  const [formData, setFormData] = useState({
    patientId: patientId || "",
    professionalName: "",
    professionalPosition: "",
    professionalPhone: "",
    additionalObservations: "",
    documentType: "medical_evaluation",
    priority: "medium",
  });

  const [uploadedFiles, setUploadedFiles] = useState<DocumentFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field errors when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: DocumentFile[] = [];

    fileArray.forEach((file) => {
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType = allowedFileTypes.some((type) => type.extension === extension);
      
      if (!isValidType) {
        toast({
          title: "Archivo no válido",
          description: `El archivo ${file.name} no tiene un formato permitido`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Archivo muy grande",
          description: `El archivo ${file.name} excede el límite de 10MB`,
          variant: "destructive",
        });
        return;
      }

      const documentFile: DocumentFile = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: extension,
        category: getFileCategory(file.name),
        uploadDate: new Date().toISOString(),
        file: file,
      };

      validFiles.push(documentFile);
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      toast({
        title: "Archivos cargados",
        description: `Se cargaron ${validFiles.length} archivo(s) exitosamente`,
      });
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "Archivo eliminado",
      description: "El archivo ha sido eliminado de la lista",
    });
  };

  const updateFileDescription = (fileId: string, description: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, description } : file
      )
    );
  };

  const updateFileCategory = (fileId: string, category: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, category } : file
      )
    );
  };

  const getFileCategory = (fileName: string): string => {
    const name = fileName.toLowerCase();
    if (name.includes("historia") || name.includes("clinica")) return "historia_clinica";
    if (name.includes("examen") || name.includes("laboratorio") || name.includes("hemograma")) return "examenes";
    if (name.includes("rx") || name.includes("tac") || name.includes("eco") || name.includes("resonancia")) return "imagenes";
    if (name.includes("informe") || name.includes("reporte")) return "informes";
    if (name.includes("foto") || name.includes("imagen")) return "fotografias";
    if (name.includes("cedula") || name.includes("carnet") || name.includes("eps")) return "identificacion";
    if (name.includes("covid") || name.includes("prueba")) return "pruebas";
    return "otros";
  };

  const getFileIcon = (fileName: string): string => {
    const extension = "." + fileName.split(".").pop()?.toLowerCase();
    const fileType = allowedFileTypes.find(type => type.extension === extension);
    return fileType?.icon || "📎";
  };

  const getCategoryInfo = (categoryId: string) => {
    return documentCategories.find(cat => cat.id === categoryId) || documentCategories[documentCategories.length - 1];
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const required = ["patientId", "professionalName", "professionalPosition", "professionalPhone"];

    required.forEach(field => {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData].toString().trim() === "") {
        errors[field] = "Este campo es obligatorio";
      }
    });

    if (uploadedFiles.length === 0) {
      errors.files = "Debe adjuntar al menos un archivo";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create document record for medical data context
      const documentData = {
        id: `document_${Date.now()}`,
        patientId: formData.patientId,
        type: formData.documentType,
        title: `Documentos médicos - ${new Date().toLocaleDateString()}`,
        createdBy: formData.professionalName,
        createdDate: new Date().toISOString(),
        priority: formData.priority,
        observations: formData.additionalObservations,
        professionalInfo: {
          name: formData.professionalName,
          position: formData.professionalPosition,
          phone: formData.professionalPhone,
        },
        files: uploadedFiles.map(file => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          category: file.category,
          description: file.description,
          uploadDate: file.uploadDate,
          url: URL.createObjectURL(file.file), // In real app, this would be uploaded to server
        })),
        status: "completed",
        totalFiles: uploadedFiles.length,
        totalSize: uploadedFiles.reduce((total, file) => total + file.size, 0),
      };

      // Save to localStorage (in real app, this would go to server)
      const existingDocuments = JSON.parse(localStorage.getItem('medical_documents') || '[]');
      existingDocuments.push(documentData);
      localStorage.setItem('medical_documents', JSON.stringify(existingDocuments));

      // Auto-save medical data
      saveToLocal();

      toast({
        title: "Documentos guardados",
        description: `Se guardaron ${uploadedFiles.length} documento(s) exitosamente`,
      });

      // Call callback if provided
      if (onDocumentSaved) {
        onDocumentSaved(documentData);
      }

      // Close modal
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving documents:", error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar los documentos",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    // In real app, this would generate a PDF report
    toast({
      title: "Generando PDF",
      description: "El reporte PDF se está generando...",
    });
    // Simulate PDF generation
    setTimeout(() => {
      toast({
        title: "PDF generado",
        description: "El reporte PDF ha sido generado exitosamente",
      });
    }, 2000);
  };

  // Filter files based on search and category
  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get file statistics
  const fileStats = {
    total: uploadedFiles.length,
    totalSize: uploadedFiles.reduce((total, file) => total + file.size, 0),
    byCategory: documentCategories.map(category => ({
      ...category,
      count: uploadedFiles.filter(file => file.category === category.id).length,
    })),
  };

  // Get selected patient info
  const selectedPatient = patients.find(p => p.id === formData.patientId);

  const modalContent = (
    <Card className="max-w-6xl w-full max-h-[95vh] overflow-y-auto">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardTitle className="flex items-center gap-3">
          <FileText className="w-6 h-6" />
          Gestión de Documentos Médicos
        </CardTitle>
        <p className="text-orange-100 text-sm">
          Adjunte toda la documentación que pueda apoyar la valoración médica inmediata
        </p>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Patient Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Información del Paciente</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Paciente *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => handleInputChange("patientId", value)}
                disabled={!!patientId}
              >
                <SelectTrigger className={fieldErrors.patientId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {activePatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.personalInfo.fullName} - {patient.personalInfo.identificationNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.patientId && (
                <p className="text-red-500 text-sm">{fieldErrors.patientId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de Documentación</Label>
              <Select
                value={formData.documentType}
                onValueChange={(value) => handleInputChange("documentType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical_evaluation">Evaluación Médica</SelectItem>
                  <SelectItem value="lab_results">Resultados de Laboratorio</SelectItem>
                  <SelectItem value="diagnostic_images">Imágenes Diagnósticas</SelectItem>
                  <SelectItem value="medical_history">Historia Clínica</SelectItem>
                  <SelectItem value="referral">Remisión</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Patient Info Display */}
          {selectedPatient && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Paciente:</span> {selectedPatient.personalInfo.fullName}
                </div>
                <div>
                  <span className="font-medium">Edad:</span> {selectedPatient.personalInfo.age} años
                </div>
                <div>
                  <span className="font-medium">EPS:</span> {selectedPatient.epsInfo.eps}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Profesional que Documenta</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professionalName">Nombre Completo *</Label>
              <Input
                id="professionalName"
                type="text"
                placeholder="Nombre del profesional"
                value={formData.professionalName}
                onChange={(e) => handleInputChange("professionalName", e.target.value)}
                className={fieldErrors.professionalName ? "border-red-500" : ""}
              />
              {fieldErrors.professionalName && (
                <p className="text-red-500 text-sm">{fieldErrors.professionalName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalPosition">Cargo *</Label>
              <Input
                id="professionalPosition"
                type="text"
                placeholder="Médico, Enfermero, etc."
                value={formData.professionalPosition}
                onChange={(e) => handleInputChange("professionalPosition", e.target.value)}
                className={fieldErrors.professionalPosition ? "border-red-500" : ""}
              />
              {fieldErrors.professionalPosition && (
                <p className="text-red-500 text-sm">{fieldErrors.professionalPosition}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalPhone">Teléfono Directo *</Label>
              <Input
                id="professionalPhone"
                type="tel"
                placeholder="Número de contacto"
                value={formData.professionalPhone}
                onChange={(e) => handleInputChange("professionalPhone", e.target.value)}
                className={`font-mono ${fieldErrors.professionalPhone ? "border-red-500" : ""}`}
              />
              {fieldErrors.professionalPhone && (
                <p className="text-red-500 text-sm">{fieldErrors.professionalPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Document Categories Guide */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Archive className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Categorías de Documentos</h3>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm font-medium mb-3">Tipos de documentos permitidos:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documentCategories.slice(0, 6).map((category) => (
                <div key={category.id} className="flex items-start gap-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${category.color}`}>
                    {category.priority === "high" ? "🔴" : category.priority === "medium" ? "🟡" : "🟢"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-xs text-gray-600">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Archivos de Soporte Médico</h3>
            {fileStats.total > 0 && (
              <Badge variant="outline">
                {fileStats.total} archivo(s) - {(fileStats.totalSize / 1024 / 1024).toFixed(2)} MB
              </Badge>
            )}
          </div>

          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? "border-orange-500 bg-orange-50" 
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Múltiples archivos permitidos. Formatos: {allowedFileTypes.map(t => t.description).join(", ")}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Tamaño máximo: 10MB por archivo
            </p>
            <input
              type="file"
              multiple
              accept={allowedFileTypes.map((t) => t.extension).join(",")}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="documents-file-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("documents-file-upload")?.click()}
              className="mt-2"
            >
              Seleccionar Archivos
            </Button>
          </div>

          {fieldErrors.files && (
            <p className="text-red-500 text-sm">{fieldErrors.files}</p>
          )}

          {/* File Management */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar archivos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {documentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} ({fileStats.byCategory.find(c => c.id === category.id)?.count || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Files List */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {filteredFiles.map((file) => {
                  const category = getCategoryInfo(file.category);
                  return (
                    <div
                      key={file.id}
                      className="flex items-start gap-4 p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="text-3xl">{getFileIcon(file.name)}</div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{file.name}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                          <Badge className={`text-xs ${category.color}`}>
                            {category.name}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(file.uploadDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`desc-${file.id}`} className="text-xs">Descripción</Label>
                            <Input
                              id={`desc-${file.id}`}
                              type="text"
                              placeholder="Descripción del documento"
                              value={file.description || ""}
                              onChange={(e) => updateFileDescription(file.id, e.target.value)}
                              className="text-xs h-8"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`cat-${file.id}`} className="text-xs">Categoría</Label>
                            <Select 
                              value={file.category} 
                              onValueChange={(value) => updateFileCategory(file.id, value)}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {documentCategories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredFiles.length === 0 && uploadedFiles.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2" />
                    <p>No se encontraron archivos con los filtros aplicados</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Observations */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Observaciones Adicionales</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="additionalObservations">Observaciones Clínicas</Label>
              <Textarea
                id="additionalObservations"
                placeholder="Información adicional relevante para el HUV, recomendaciones especiales, contexto del caso..."
                value={formData.additionalObservations}
                onChange={(e) => handleInputChange("additionalObservations", e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad del Caso</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Baja - Documentación de rutina</SelectItem>
                  <SelectItem value="medium">🟡 Media - Evaluación estándar</SelectItem>
                  <SelectItem value="high">🔴 Alta - Requiere atención prioritaria</SelectItem>
                  <SelectItem value="critical">🚨 Crítica - Emergencia médica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <div className="flex gap-2">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            )}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                localStorage.setItem('documents_draft', JSON.stringify({ formData, files: uploadedFiles }));
                toast({
                  title: "Progreso guardado",
                  description: "Los datos han sido guardados localmente",
                });
              }}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Progreso
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </Button>
          </div>

          <div className="flex gap-2 sm:ml-auto">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6"
            >
              {isSubmitting ? (
                <>Guardando...</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Guardar Documentos
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ResponsiveModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Gestión de Documentos Médicos"
    >
      {modalContent}
    </ResponsiveModalWrapper>
  );
}
