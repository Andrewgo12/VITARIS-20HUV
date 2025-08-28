"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUniversalData } from "@/app/hooks/useUniversalData"
import {
  Users,
  Heart,
  Bed,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Activity,
  MapPin,
  Pill,
  FileText,
  Phone,
  Edit,
  Thermometer,
  Gauge,
  Wind,
  Stethoscope,
} from "lucide-react"

export default function HospitalizadosPage() {
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null)
  const [wardFilter, setWardFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Usar el hook universal para obtener datos de hospitalización
  const {
    data: hospitalizationData,
    loading,
    error,
    refreshData: refresh
  } = useUniversalData('/api/hospitalization-data', {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    ward: wardFilter !== 'all' ? wardFilter : undefined,
    search: searchTerm || undefined
  })

  const admissions = (hospitalizationData as any)?.admissions || []
  const statistics = (hospitalizationData as any)?.statistics || {}
  const metadata = (hospitalizationData as any)?.metadata || {}

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Admitted': return 'bg-blue-100 text-blue-800'
      case 'Discharged': return 'bg-green-100 text-green-800'
      case 'Transferred': return 'bg-yellow-100 text-yellow-800'
      case 'Pending Discharge': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para obtener el color del badge según la prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Estadísticas generales
  const totalAdmissions = admissions.length
  const currentlyAdmitted = admissions.filter((a: any) => a.status === 'Admitted').length
  const criticalPatients = admissions.filter((a: any) => a.priority === 'Critical').length
  const averageStay = statistics.average_stay || 0
  const occupancyRate = statistics.occupancy_rate || 0

  // Agrupar admisiones por sala/ward
  const wardGroups = admissions.reduce((groups: any, admission: any) => {
    const ward = admission.ward || 'Sin asignar'
    if (!groups[ward]) {
      groups[ward] = []
    }
    groups[ward].push(admission)
    return groups
  }, {})

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando datos de hospitalización...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pacientes Hospitalizados</h1>
            <p className="text-muted-foreground">
              {metadata.source && (
                <span className="inline-flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  Datos desde: {metadata.source}
                </span>
              )}
            </p>
          </div>
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Admisiones</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAdmissions}</div>
              <p className="text-xs text-muted-foreground">
                {currentlyAdmitted} actualmente hospitalizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Críticos</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalPatients}</div>
              <p className="text-xs text-muted-foreground">
                Requieren atención inmediata
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Tasa de ocupación hospitalaria
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estancia Promedio</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageStay.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Días promedio de hospitalización
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por paciente, ID o diagnóstico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Admitted">Hospitalizado</SelectItem>
                  <SelectItem value="Discharged">Dado de alta</SelectItem>
                  <SelectItem value="Transferred">Transferido</SelectItem>
                  <SelectItem value="Pending Discharge">Alta pendiente</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="Critical">Crítico</SelectItem>
                  <SelectItem value="High">Alto</SelectItem>
                  <SelectItem value="Medium">Medio</SelectItem>
                  <SelectItem value="Low">Bajo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={wardFilter} onValueChange={setWardFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las salas</SelectItem>
                  {Object.keys(wardGroups).map((ward) => (
                    <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de admisiones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {admissions.map((admission: any) => (
            <Card key={admission.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{admission.patientName}</CardTitle>
                    <CardDescription>ID: {admission.id}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(admission.status)}>
                      {admission.status}
                    </Badge>
                    <Badge className={getPriorityColor(admission.priority)}>
                      {admission.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Habitación {admission.roomNumber} - Cama {admission.bedNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <span>{admission.ward}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{admission.diagnosis}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Ingreso: {new Date(admission.admissionDate).toLocaleDateString()}</span>
                  </div>
                  {admission.estimatedStay && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Calendar className="h-4 w-4" />
                      <span>Estancia estimada: {admission.estimatedStay} días</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedAdmission(admission)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalles de Hospitalización: {admission.patientName}</DialogTitle>
                      </DialogHeader>
                      {selectedAdmission && (
                        <Tabs defaultValue="general" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="medical">Médico</TabsTrigger>
                            <TabsTrigger value="vitals">Signos Vitales</TabsTrigger>
                            <TabsTrigger value="billing">Facturación</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="general" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Información del Paciente</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Nombre:</strong> {selectedAdmission.patientName}</p>
                                  <p><strong>ID Admisión:</strong> {selectedAdmission.id}</p>
                                  <p><strong>Habitación:</strong> {selectedAdmission.roomNumber}</p>
                                  <p><strong>Cama:</strong> {selectedAdmission.bedNumber}</p>
                                  <p><strong>Sala:</strong> {selectedAdmission.ward}</p>
                                  <p><strong>Médico Tratante:</strong> {selectedAdmission.attendingPhysician}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Fechas y Duración</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Fecha de Ingreso:</strong> {new Date(selectedAdmission.admissionDate).toLocaleDateString()}</p>
                                  {selectedAdmission.dischargeDate && (
                                    <p><strong>Fecha de Alta:</strong> {new Date(selectedAdmission.dischargeDate).toLocaleDateString()}</p>
                                  )}
                                  <p><strong>Estancia Estimada:</strong> {selectedAdmission.estimatedStay} días</p>
                                  {selectedAdmission.actualStay && (
                                    <p><strong>Estancia Real:</strong> {selectedAdmission.actualStay} días</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="medical" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Diagnóstico y Tratamiento</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Motivo de Ingreso:</strong> {selectedAdmission.admissionReason}</p>
                                  <p><strong>Diagnóstico:</strong> {selectedAdmission.diagnosis}</p>
                                </div>
                                
                                <h4 className="font-semibold mb-2 mt-4">Medicamentos</h4>
                                <div className="space-y-2">
                                  {selectedAdmission.medications?.map((med: any, index: number) => (
                                    <div key={index} className="border rounded p-2 text-sm">
                                      <p><strong>{med.name}</strong> - {med.dosage}</p>
                                      <p className="text-muted-foreground">{med.frequency}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Procedimientos</h4>
                                <div className="space-y-2">
                                  {selectedAdmission.procedures?.map((proc: any, index: number) => (
                                    <div key={index} className="border rounded p-2 text-sm">
                                      <div className="flex justify-between items-start">
                                        <p><strong>{proc.name}</strong></p>
                                        <Badge variant="outline">{proc.status}</Badge>
                                      </div>
                                      <p className="text-muted-foreground">
                                        {new Date(proc.date).toLocaleDateString()} - Dr. {proc.doctor}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="vitals" className="space-y-4">
                            <h4 className="font-semibold">Signos Vitales</h4>
                            <p className="text-sm text-muted-foreground">
                              Última actualización: {new Date(selectedAdmission.vitalSigns?.lastUpdated).toLocaleString()}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="border rounded p-3 text-center">
                                <Gauge className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                                <p className="text-sm font-medium">Presión Arterial</p>
                                <p className="text-lg font-bold">{selectedAdmission.vitalSigns?.bloodPressure}</p>
                              </div>
                              <div className="border rounded p-3 text-center">
                                <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                                <p className="text-sm font-medium">Frecuencia Cardíaca</p>
                                <p className="text-lg font-bold">{selectedAdmission.vitalSigns?.heartRate}</p>
                              </div>
                              <div className="border rounded p-3 text-center">
                                <Thermometer className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                                <p className="text-sm font-medium">Temperatura</p>
                                <p className="text-lg font-bold">{selectedAdmission.vitalSigns?.temperature}</p>
                              </div>
                              <div className="border rounded p-3 text-center">
                                <Wind className="h-6 w-6 mx-auto mb-2 text-green-500" />
                                <p className="text-sm font-medium">Saturación O2</p>
                                <p className="text-lg font-bold">{selectedAdmission.vitalSigns?.oxygenSaturation}</p>
                              </div>
                              <div className="border rounded p-3 text-center">
                                <Activity className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                                <p className="text-sm font-medium">Frecuencia Respiratoria</p>
                                <p className="text-lg font-bold">{selectedAdmission.vitalSigns?.respiratoryRate}</p>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="billing" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Información de Costos</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Costo Diario:</strong> ${selectedAdmission.dailyCost?.toLocaleString()}</p>
                                  <p><strong>Costo Total:</strong> ${selectedAdmission.totalCost?.toLocaleString()}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Información del Seguro</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Proveedor:</strong> {selectedAdmission.insurance?.provider}</p>
                                  <p><strong>Cobertura:</strong> {selectedAdmission.insurance?.coverage}</p>
                                  <p><strong>Pre-autorización:</strong> {selectedAdmission.insurance?.preAuthorization}</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {admissions.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-8">
              <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron hospitalizaciones</h3>
              <p className="text-muted-foreground">
                {error ? 'Error cargando datos. Usando datos por defecto.' : 'Intenta ajustar los filtros de búsqueda.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
