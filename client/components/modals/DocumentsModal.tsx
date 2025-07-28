import { useForm } from '@/context/FormContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, User, Phone, Download, Save, Send } from 'lucide-react';
import { useState } from 'react';

const allowedFileTypes = [
  { extension: '.pdf', description: 'PDF' },
  { extension: '.doc', description: 'Word' },
  { extension: '.docx', description: 'Word' },
  { extension: '.jpg', description: 'Imagen JPG' },
  { extension: '.jpeg', description: 'Imagen JPEG' },
  { extension: '.png', description: 'Imagen PNG' },
];

const documentCategories = [
  { id: 'historia_clinica', name: 'Historia Clínica', description: 'Historias clínicas previas' },
  { id: 'examenes', name: 'Exámenes de Laboratorio', description: 'Hemograma, química sanguínea, serologías, orina' },
  { id: 'imagenes', name: 'Imágenes Diagnósticas', description: 'Radiografías, TAC, Ecografías' },
  { id: 'informes', name: 'Informes Clínicos', description: 'Informes del último mes' },
  { id: 'fotografias', name: 'Evidencia Fotográfica', description: 'Heridas, lesiones, condiciones visibles' },
  { id: 'pruebas', name: 'Pruebas Especiales', description: 'Pruebas rápidas, COVID, otros' },
];

export default function DocumentsModal() {
  const { formData, dispatch, nextStep, prevStep } = useForm();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(formData.documents.attachments4 || []);
  const [dragOver, setDragOver] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_DOCUMENTS', payload: { [field]: value } });
  };

  const handleFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return allowedFileTypes.some(type => type.extension === extension);
    });

    if (validFiles.length !== fileArray.length) {
      alert('Algunos archivos no tienen un formato válido y fueron omitidos.');
    }

    const updatedFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(updatedFiles);
    dispatch({ type: 'UPDATE_DOCUMENTS', payload: { attachments4: updatedFiles } });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    dispatch({ type: 'UPDATE_DOCUMENTS', payload: { attachments4: updatedFiles } });
  };

  const getFileIcon = (fileName: string) => {
    const extension = '.' + fileName.split('.').pop()?.toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(extension)) {
      return '🖼️';
    } else if (['.pdf'].includes(extension)) {
      return '📄';
    } else if (['.doc', '.docx'].includes(extension)) {
      return '📝';
    }
    return '📎';
  };

  const getFileCategory = (fileName: string) => {
    const name = fileName.toLowerCase();
    if (name.includes('historia') || name.includes('clinica')) return 'historia_clinica';
    if (name.includes('examen') || name.includes('laboratorio') || name.includes('hemograma')) return 'examenes';
    if (name.includes('rx') || name.includes('tac') || name.includes('eco')) return 'imagenes';
    if (name.includes('informe')) return 'informes';
    if (name.includes('foto') || name.includes('imagen')) return 'fotografias';
    return 'pruebas';
  };

  const isValid = () => {
    return formData.documents.professionalName.trim() !== '' && 
           formData.documents.professionalPosition.trim() !== '' &&
           formData.documents.professionalPhone.trim() !== '';
  };

  const handleSaveForm = () => {
    // Save form logic would go here
    alert('Formulario guardado localmente');
  };

  const handleSendForm = () => {
    if (isValid()) {
      nextStep();
    }
  };

  const handleDownloadPDF = () => {
    // Generate PDF logic would go here
    alert('Función de descarga PDF pendiente de implementación');
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-medical-blue/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-medical-green/10 border-b">
        <CardTitle className="flex items-center gap-3 text-primary">
          <Upload className="w-6 h-6" />
          Paso 4: Documentos de Soporte y Observaciones
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Adjunte toda la documentación que pueda apoyar la valoración médica inmediata
        </p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Professional Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Profesional que Diligencia</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professionalName">Nombre Completo *</Label>
              <Input
                id="professionalName"
                type="text"
                placeholder="Nombre del profesional"
                value={formData.documents.professionalName}
                onChange={(e) => handleInputChange('professionalName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalPosition">Cargo *</Label>
              <Input
                id="professionalPosition"
                type="text"
                placeholder="Médico, Enfermero, etc."
                value={formData.documents.professionalPosition}
                onChange={(e) => handleInputChange('professionalPosition', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalPhone">Teléfono Directo *</Label>
              <Input
                id="professionalPhone"
                type="tel"
                placeholder="Número de contacto"
                value={formData.documents.professionalPhone}
                onChange={(e) => handleInputChange('professionalPhone', e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
        </div>

        {/* Additional Observations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-medical-blue" />
            <h3 className="text-lg font-semibold">Observaciones Adicionales EPS</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalObservations">Observaciones Clínicas *</Label>
            <Textarea
              id="additionalObservations"
              placeholder="Información adicional relevante para el HUV, recomendaciones especiales, contexto del caso..."
              value={formData.documents.additionalObservations}
              onChange={(e) => handleInputChange('additionalObservations', e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* File Upload Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-medical-green" />
            <h3 className="text-lg font-semibold">Archivos de Soporte Médico</h3>
          </div>
          
          {/* Document Categories Guide */}
          <div className="bg-medical-light/30 p-4 rounded-lg">
            <p className="text-sm font-medium mb-3">Tipos de documentos permitidos:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documentCategories.map((category) => (
                <div key={category.id} className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drag and Drop Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Múltiples archivos permitidos. Formatos: {allowedFileTypes.map(t => t.description).join(', ')}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Tamaño máximo: 10MB por archivo
            </p>
            <input
              type="file"
              multiple
              accept={allowedFileTypes.map(t => t.extension).join(',')}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="documents-file-upload"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('documents-file-upload')?.click()}
              className="mt-2"
            >
              Seleccionar Archivos
            </Button>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Archivos adjuntados ({uploadedFiles.length})
                </p>
                <Badge variant="outline">
                  Total: {(uploadedFiles.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                </Badge>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {uploadedFiles.map((file, index) => {
                  const category = documentCategories.find(cat => cat.id === getFileCategory(file.name));
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{getFileIcon(file.name)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                            {category && (
                              <Badge variant="outline" className="text-xs">
                                {category.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            className="order-1 sm:order-none"
          >
            Anterior: Signos Vitales
          </Button>
          
          <div className="flex gap-2 flex-1 justify-end">
            <Button
              variant="outline"
              onClick={handleSaveForm}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </Button>
            
            <Button
              onClick={handleSendForm}
              disabled={!isValid()}
              className="flex items-center gap-2 px-6"
            >
              <Send className="w-4 h-4" />
              Enviar al HUV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
