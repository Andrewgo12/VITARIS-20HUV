/**
 * Template Management Modal - VITAL RED
 * Modal para gestionar plantillas de formularios médicos y reportes
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Download,
  Upload,
  Eye
} from 'lucide-react';
import { apiService } from '@/services/api';
import { useNotifications } from '@/components/ui/notification-system';

interface TemplateManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Template {
  id: string;
  name: string;
  type: 'medical_form' | 'report' | 'email';
  description: string;
  content: string;
  fields: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  usageCount: number;
}

const TemplateManagementModal: React.FC<TemplateManagementModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editMode, setEditMode] = useState<'create' | 'edit' | 'view'>('view');
  const [formData, setFormData] = useState({
    name: '',
    type: 'medical_form' as Template['type'],
    description: '',
    content: '',
    fields: [] as string[]
  });

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // Mock data - replace with real API call
      const mockTemplates: Template[] = [
        {
          id: '1',
          name: 'Formulario de Referencia Cardiología',
          type: 'medical_form',
          description: 'Plantilla estándar para referencias de cardiología',
          content: `
            <form>
              <field name="patient_name" type="text" required="true" label="Nombre del Paciente" />
              <field name="patient_document" type="text" required="true" label="Documento" />
              <field name="diagnosis" type="textarea" required="true" label="Diagnóstico" />
              <field name="urgency" type="select" options="alta,media,baja" label="Urgencia" />
              <field name="referring_physician" type="text" required="true" label="Médico Remitente" />
            </form>
          `,
          fields: ['patient_name', 'patient_document', 'diagnosis', 'urgency', 'referring_physician'],
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-18T14:30:00Z',
          isActive: true,
          usageCount: 156
        },
        {
          id: '2',
          name: 'Reporte de Evaluación Médica',
          type: 'report',
          description: 'Plantilla para reportes de evaluación de casos',
          content: `
            <report>
              <section name="patient_info">
                <field name="patient_name" />
                <field name="case_id" />
                <field name="evaluation_date" />
              </section>
              <section name="evaluation">
                <field name="decision" />
                <field name="notes" />
                <field name="recommendations" />
              </section>
            </report>
          `,
          fields: ['patient_name', 'case_id', 'evaluation_date', 'decision', 'notes', 'recommendations'],
          createdAt: '2025-01-10T09:00:00Z',
          updatedAt: '2025-01-16T11:20:00Z',
          isActive: true,
          usageCount: 89
        },
        {
          id: '3',
          name: 'Email de Notificación Urgente',
          type: 'email',
          description: 'Plantilla para emails de casos urgentes',
          content: `
            <email>
              <subject>URGENTE: Caso médico requiere evaluación inmediata</subject>
              <body>
                Estimado Dr. {{evaluator_name}},
                
                Se ha recibido un caso médico urgente que requiere su evaluación inmediata:
                
                Paciente: {{patient_name}}
                Diagnóstico: {{diagnosis}}
                Institución remitente: {{referring_institution}}
                
                Por favor acceda al sistema para evaluar este caso.
                
                Saludos,
                Sistema VITAL RED
              </body>
            </email>
          `,
          fields: ['evaluator_name', 'patient_name', 'diagnosis', 'referring_institution'],
          createdAt: '2025-01-12T16:00:00Z',
          updatedAt: '2025-01-17T09:45:00Z',
          isActive: true,
          usageCount: 234
        }
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando plantillas',
        message: 'No se pudieron cargar las plantillas.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setEditMode('create');
    setFormData({
      name: '',
      type: 'medical_form',
      description: '',
      content: '',
      fields: []
    });
    setSelectedTemplate(null);
  };

  const handleEditTemplate = (template: Template) => {
    setEditMode('edit');
    setFormData({
      name: template.name,
      type: template.type,
      description: template.description,
      content: template.content,
      fields: template.fields
    });
    setSelectedTemplate(template);
  };

  const handleSaveTemplate = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      addNotification({
        type: 'warning',
        title: 'Campos requeridos',
        message: 'Por favor complete el nombre y contenido de la plantilla.',
        priority: 'medium'
      });
      return;
    }

    setLoading(true);
    try {
      const templateData = {
        ...formData,
        fields: extractFieldsFromContent(formData.content)
      };

      if (editMode === 'create') {
        const response = await apiService.createTemplate(templateData);
        if (response.success) {
          addNotification({
            type: 'success',
            title: 'Plantilla creada',
            message: 'La plantilla se ha creado exitosamente.',
            priority: 'medium'
          });
        }
      } else {
        const response = await apiService.updateTemplate(selectedTemplate!.id, templateData);
        if (response.success) {
          addNotification({
            type: 'success',
            title: 'Plantilla actualizada',
            message: 'La plantilla se ha actualizado exitosamente.',
            priority: 'medium'
          });
        }
      }

      await loadTemplates();
      setEditMode('view');
    } catch (error) {
      console.error('Error saving template:', error);
      addNotification({
        type: 'warning',
        title: 'Error guardando plantilla',
        message: 'No se pudo guardar la plantilla.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta plantilla?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.deleteTemplate(templateId);
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Plantilla eliminada',
          message: 'La plantilla se ha eliminado exitosamente.',
          priority: 'medium'
        });
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      addNotification({
        type: 'warning',
        title: 'Error eliminando plantilla',
        message: 'No se pudo eliminar la plantilla.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const extractFieldsFromContent = (content: string): string[] => {
    const fieldRegex = /name="([^"]+)"/g;
    const fields: string[] = [];
    let match;
    
    while ((match = fieldRegex.exec(content)) !== null) {
      if (!fields.includes(match[1])) {
        fields.push(match[1]);
      }
    }
    
    return fields;
  };

  const getTypeLabel = (type: Template['type']) => {
    switch (type) {
      case 'medical_form': return 'Formulario Médico';
      case 'report': return 'Reporte';
      case 'email': return 'Email';
      default: return type;
    }
  };

  const getTypeBadgeColor = (type: Template['type']) => {
    switch (type) {
      case 'medical_form': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Gestión de Plantillas
          </DialogTitle>
          <DialogDescription>
            Administrar plantillas de formularios médicos, reportes y emails
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="list" className="flex-1 overflow-hidden">
          <TabsList>
            <TabsTrigger value="list">Lista de Plantillas</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4 overflow-y-auto max-h-96">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Plantillas Disponibles</h3>
              <Button onClick={handleCreateTemplate}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Plantilla
              </Button>
            </div>

            <div className="grid gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge className={getTypeBadgeColor(template.type)}>
                          {getTypeLabel(template.type)}
                        </Badge>
                        {template.isActive && (
                          <Badge variant="outline" className="text-green-600">
                            Activa
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Campos: {template.fields.length}</span>
                        <span>Usos: {template.usageCount}</span>
                        <span>Actualizada: {new Date(template.updatedAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4">
            {editMode !== 'view' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="templateName">Nombre de la Plantilla</Label>
                    <Input
                      id="templateName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nombre de la plantilla"
                    />
                  </div>
                  <div>
                    <Label htmlFor="templateType">Tipo</Label>
                    <select
                      id="templateType"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Template['type'] })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="medical_form">Formulario Médico</option>
                      <option value="report">Reporte</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="templateDescription">Descripción</Label>
                  <Textarea
                    id="templateDescription"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción de la plantilla"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="templateContent">Contenido de la Plantilla</Label>
                  <Textarea
                    id="templateContent"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Contenido XML/HTML de la plantilla"
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {editMode !== 'view' && (
            <Button onClick={handleSaveTemplate} disabled={loading}>
              Guardar Plantilla
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateManagementModal;
