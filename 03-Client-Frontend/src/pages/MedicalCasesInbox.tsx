import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Search,
  Filter,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  Hospital,
  ArrowLeft,
  RefreshCw,
  Download,
  Settings,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiService } from "@/services/api";
import { useNotifications } from "@/components/ui/notification-system";

// Import unique modals for this view
import QuickDecisionModal from "@/components/modals/medical-cases/QuickDecisionModal";
import BulkActionModal from "@/components/modals/medical-cases/BulkActionModal";
import AdvancedFilterModal from "@/components/modals/medical-cases/AdvancedFilterModal";

interface MedicalCase {
  id: string;
  patientName: string;
  documentNumber: string;
  age: number;
  gender: string;
  diagnosis: string;
  specialty: string;
  referringPhysician: string;
  referringInstitution: string;
  priority: 'alta' | 'media' | 'baja';
  status: 'nueva' | 'en_revision' | 'aceptada' | 'rechazada' | 'info_adicional';
  receivedDate: string;
  dueDate: string;
  attachments: number;
  aiExtracted: boolean;
}

export default function MedicalCasesInbox() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<MedicalCase[]>([]);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showQuickDecision, setShowQuickDecision] = useState(false);
  const [showBulkAction, setShowBulkAction] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    filterCases();
  }, [cases, searchTerm, statusFilter, priorityFilter]);

  const loadCases = async () => {
    setLoading(true);
    try {
      // Real API call to get medical cases
      const response = await apiService.getMedicalCases({
        status: statusFilter !== "todas" ? statusFilter : undefined,
        priority: priorityFilter !== "todas" ? priorityFilter : undefined
      });

      if (response.success && response.data) {
        setCases(response.data);
      } else {
        throw new Error(response.error || 'Failed to load medical cases');
      }
    } catch (error) {
      console.error('Error loading cases:', error);
      addNotification({
        type: 'error',
        message: 'Error cargando casos médicos. Por favor, intente nuevamente.'
      });

      // Fallback to empty array on error
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCases = () => {
    let filtered = cases;

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.documentNumber.includes(searchTerm) ||
        c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.referringPhysician.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "todas") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (priorityFilter !== "todas") {
      filtered = filtered.filter(c => c.priority === priorityFilter);
    }

    setFilteredCases(filtered);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nueva': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_revision': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'aceptada': return 'bg-green-100 text-green-800 border-green-200';
      case 'rechazada': return 'bg-red-100 text-red-800 border-red-200';
      case 'info_adicional': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nueva': return <FileText className="w-4 h-4" />;
      case 'en_revision': return <Clock className="w-4 h-4" />;
      case 'aceptada': return <CheckCircle className="w-4 h-4" />;
      case 'rechazada': return <XCircle className="w-4 h-4" />;
      case 'info_adicional': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  const handleQuickDecision = (medicalCase: MedicalCase) => {
    setSelectedCase(medicalCase);
    setShowQuickDecision(true);
  };

  const handleViewDetails = (caseId: string) => {
    navigate(`/vital-red/case-detail/${caseId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/vital-red/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900">
                    VITAL <span className="text-red-500 font-light">RED</span>
                  </h1>
                  <p className="text-xs text-gray-500">Bandeja de Casos Médicos</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => loadCases()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente, documento, diagnóstico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="todas">Todos los estados</option>
                  <option value="nueva">Nuevas</option>
                  <option value="en_revision">En revisión</option>
                  <option value="aceptada">Aceptadas</option>
                  <option value="rechazada">Rechazadas</option>
                  <option value="info_adicional">Info adicional</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="todas">Todas las prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>

                <Button variant="outline" onClick={() => setShowAdvancedFilter(true)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros avanzados
                </Button>
              </div>
            </div>

            {selectedCases.length > 0 && (
              <Button onClick={() => setShowBulkAction(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Acciones masivas ({selectedCases.length})
              </Button>
            )}
          </div>
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando casos médicos...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay casos médicos</h3>
                <p className="text-gray-600">No se encontraron casos que coincidan con los filtros aplicados.</p>
              </CardContent>
            </Card>
          ) : (
            filteredCases.map((medicalCase, index) => (
              <motion.div
                key={medicalCase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-shadow ${isOverdue(medicalCase.dueDate) ? 'border-red-200 bg-red-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedCases.includes(medicalCase.id)}
                          onChange={() => handleCaseSelect(medicalCase.id)}
                          className="mt-1 rounded border-gray-300"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {medicalCase.patientName}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>CC: {medicalCase.documentNumber}</span>
                                <span>{medicalCase.age} años</span>
                                <span>{medicalCase.gender === 'M' ? 'Masculino' : 'Femenino'}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(medicalCase.priority)}>
                                {medicalCase.priority.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(medicalCase.status)}>
                                {getStatusIcon(medicalCase.status)}
                                <span className="ml-1">
                                  {medicalCase.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Diagnóstico</p>
                              <p className="text-sm text-gray-600">{medicalCase.diagnosis}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Especialidad</p>
                              <p className="text-sm text-gray-600">{medicalCase.specialty}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Médico remitente</p>
                              <p className="text-sm text-gray-600">{medicalCase.referringPhysician}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Institución</p>
                              <p className="text-sm text-gray-600">{medicalCase.referringInstitution}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Recibido</p>
                              <p className="text-sm text-gray-600">{formatDate(medicalCase.receivedDate)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Vencimiento</p>
                              <p className={`text-sm ${isOverdue(medicalCase.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                {formatDate(medicalCase.dueDate)}
                                {isOverdue(medicalCase.dueDate) && (
                                  <span className="ml-2 text-red-500">VENCIDO</span>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                <span>{medicalCase.attachments} archivos</span>
                              </div>
                              {medicalCase.aiExtracted && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>IA procesada</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickDecision(medicalCase)}
                              >
                                Decisión rápida
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleViewDetails(medicalCase.id)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver detalles
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{cases.filter(c => c.status === 'nueva').length}</p>
              <p className="text-sm text-gray-600">Nuevas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{cases.filter(c => c.status === 'en_revision').length}</p>
              <p className="text-sm text-gray-600">En revisión</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{cases.filter(c => c.status === 'aceptada').length}</p>
              <p className="text-sm text-gray-600">Aceptadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{cases.filter(c => c.status === 'rechazada').length}</p>
              <p className="text-sm text-gray-600">Rechazadas</p>
            </div>
          </div>
        </div>
      </main>

      {/* Unique Modals for this view */}
      <QuickDecisionModal
        isOpen={showQuickDecision}
        onClose={() => setShowQuickDecision(false)}
        medicalCase={selectedCase}
        onDecision={(decision) => {
          console.log('Quick decision:', decision);
          setShowQuickDecision(false);
        }}
      />

      <BulkActionModal
        isOpen={showBulkAction}
        onClose={() => setShowBulkAction(false)}
        selectedCases={selectedCases}
        onAction={(action) => {
          console.log('Bulk action:', action);
          setShowBulkAction(false);
          setSelectedCases([]);
        }}
      />

      <AdvancedFilterModal
        isOpen={showAdvancedFilter}
        onClose={() => setShowAdvancedFilter(false)}
        onApplyFilters={(filters) => {
          console.log('Advanced filters:', filters);
          setShowAdvancedFilter(false);
        }}
      />
    </div>
  );
}
