import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Filter,
  Calendar,
  User,
  Hospital,
  FileText,
  Clock,
  X,
  RotateCcw,
} from "lucide-react";

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    dateRange: { start: string; end: string };
    specialty: string;
    referringInstitution: string;
    referringPhysician: string;
    priority: string;
    status: string;
    hasAttachments: boolean | null;
    aiProcessed: boolean | null;
    ageRange: { min: number | null; max: number | null };
    gender: string;
  }) => void;
}

export default function AdvancedFilterModal({
  isOpen,
  onClose,
  onApplyFilters,
}: AdvancedFilterModalProps) {
  const [filters, setFilters] = useState({
    dateRange: { start: "", end: "" },
    specialty: "",
    referringInstitution: "",
    referringPhysician: "",
    priority: "",
    status: "",
    hasAttachments: null as boolean | null,
    aiProcessed: null as boolean | null,
    ageRange: { min: null as number | null, max: null as number | null },
    gender: "",
  });

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      dateRange: { start: "", end: "" },
      specialty: "",
      referringInstitution: "",
      referringPhysician: "",
      priority: "",
      status: "",
      hasAttachments: null,
      aiProcessed: null,
      ageRange: { min: null, max: null },
      gender: "",
    });
  };

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedFilter = (parentKey: string, childKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey as keyof typeof prev] as any,
        [childKey]: value
      }
    }));
  };

  const specialties = [
    "Cardiología",
    "Neurología", 
    "Ortopedia",
    "Ginecología",
    "Medicina Interna",
    "Pediatría",
    "Cirugía General",
    "Oncología",
    "Psiquiatría",
    "Dermatología"
  ];

  const institutions = [
    "EPS Sanitas",
    "EPS Compensar",
    "EPS Sura",
    "Nueva EPS",
    "Famisanar",
    "Salud Total",
    "Coomeva EPS",
    "Medimás",
    "Capital Salud",
    "Aliansalud"
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.specialty) count++;
    if (filters.referringInstitution) count++;
    if (filters.referringPhysician) count++;
    if (filters.priority) count++;
    if (filters.status) count++;
    if (filters.hasAttachments !== null) count++;
    if (filters.aiProcessed !== null) count++;
    if (filters.ageRange.min !== null || filters.ageRange.max !== null) count++;
    if (filters.gender) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-6 h-6 text-blue-600" />
              <DialogTitle className="text-xl font-bold text-gray-900">
                Filtros Avanzados
              </DialogTitle>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {getActiveFiltersCount()} filtros activos
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Date and Time Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                Fechas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="startDate">Fecha de inicio</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={filters.dateRange.start}
                  onChange={(e) => updateNestedFilter('dateRange', 'start', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha de fin</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={filters.dateRange.end}
                  onChange={(e) => updateNestedFilter('dateRange', 'end', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Información Médica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="specialty">Especialidad</Label>
                <select
                  id="specialty"
                  value={filters.specialty}
                  onChange={(e) => updateFilter('specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las especialidades</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <select
                  id="priority"
                  value={filters.priority}
                  onChange={(e) => updateFilter('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="nueva">Nueva</option>
                  <option value="en_revision">En revisión</option>
                  <option value="aceptada">Aceptada</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="info_adicional">Información adicional</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Referring Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hospital className="w-5 h-5" />
                Información de Remisión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="institution">Institución remitente</Label>
                <select
                  id="institution"
                  value={filters.referringInstitution}
                  onChange={(e) => updateFilter('referringInstitution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las instituciones</option>
                  {institutions.map(institution => (
                    <option key={institution} value={institution}>{institution}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="physician">Médico remitente</Label>
                <Input
                  id="physician"
                  placeholder="Nombre del médico remitente"
                  value={filters.referringPhysician}
                  onChange={(e) => updateFilter('referringPhysician', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Información del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Rango de edad</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Edad mínima"
                    value={filters.ageRange.min || ""}
                    onChange={(e) => updateNestedFilter('ageRange', 'min', e.target.value ? parseInt(e.target.value) : null)}
                  />
                  <Input
                    type="number"
                    placeholder="Edad máxima"
                    value={filters.ageRange.max || ""}
                    onChange={(e) => updateNestedFilter('ageRange', 'max', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="gender">Género</Label>
                <select
                  id="gender"
                  value={filters.gender}
                  onChange={(e) => updateFilter('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los géneros</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* System Filters */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5" />
                Filtros del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Archivos adjuntos</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="attachments"
                        checked={filters.hasAttachments === true}
                        onChange={() => updateFilter('hasAttachments', true)}
                      />
                      <span>Con archivos</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="attachments"
                        checked={filters.hasAttachments === false}
                        onChange={() => updateFilter('hasAttachments', false)}
                      />
                      <span>Sin archivos</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="attachments"
                        checked={filters.hasAttachments === null}
                        onChange={() => updateFilter('hasAttachments', null)}
                      />
                      <span>Todos</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label>Procesamiento IA</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="aiProcessed"
                        checked={filters.aiProcessed === true}
                        onChange={() => updateFilter('aiProcessed', true)}
                      />
                      <span>Procesado</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="aiProcessed"
                        checked={filters.aiProcessed === false}
                        onChange={() => updateFilter('aiProcessed', false)}
                      />
                      <span>No procesado</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="aiProcessed"
                        checked={filters.aiProcessed === null}
                        onChange={() => updateFilter('aiProcessed', null)}
                      />
                      <span>Todos</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpiar filtros
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleApply}>
            <Filter className="w-4 h-4 mr-2" />
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
