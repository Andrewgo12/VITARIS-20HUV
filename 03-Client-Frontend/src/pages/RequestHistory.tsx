import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  HeartPulse,
  ArrowLeft,
  History,
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiService } from "@/services/api";
import { useNotifications } from "@/components/ui/notification-system";

// Import unique modals for this view
import RequestTimelineModal from "@/components/modals/request-history/RequestTimelineModal";
import DecisionAnalysisModal from "@/components/modals/request-history/DecisionAnalysisModal";
import PerformanceReportModal from "@/components/modals/request-history/PerformanceReportModal";

interface HistoricalRequest {
  id: string;
  patientName: string;
  documentNumber: string;
  diagnosis: string;
  specialty: string;
  referringPhysician: string;
  referringInstitution: string;
  priority: 'alta' | 'media' | 'baja';
  finalDecision: 'aceptada' | 'rechazada';
  decisionDate: string;
  receivedDate: string;
  responseTime: string;
  evaluatorNotes: string;
  currentEvaluator: string;
}

export default function RequestHistory() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [requests, setRequests] = useState<HistoricalRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<HistoricalRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showRequestTimeline, setShowRequestTimeline] = useState(false);
  const [showDecisionAnalysis, setShowDecisionAnalysis] = useState(false);
  const [showPerformanceReport, setShowPerformanceReport] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HistoricalRequest | null>(null);

  useEffect(() => {
    loadRequestHistory();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, decisionFilter, priorityFilter, dateRange]);

  const loadRequestHistory = async () => {
    setLoading(true);
    try {
      // Real API call to get request history
      const params = {
        skip: 0,
        limit: 100,
        start_date: dateRange.start,
        end_date: dateRange.end,
        status: decisionFilter !== "todas" ? decisionFilter : undefined,
        patient_name: searchTerm || undefined
      };

      const response = await apiService.getRequestHistory(params);

      if (response.success && response.data) {
        // Convert API response to HistoricalRequest format
        const historicalRequests: HistoricalRequest[] = response.data.items.map((item: any) => ({
          id: `REQ-${item.id}`,
          patientName: item.patientName,
          documentNumber: item.patientDocument,
          diagnosis: item.diagnosis,
          specialty: item.specialty,
          referringPhysician: item.referringPhysician,
          referringInstitution: item.referringInstitution,
          priority: item.priority,
          finalDecision: item.status,
          decisionDate: item.updatedAt,
          receivedDate: item.createdAt,
          responseTime: item.responseTime,
          evaluatorNotes: item.notes || "Sin observaciones",
          currentEvaluator: item.evaluatedBy || "Sistema"
        }));

        setRequests(historicalRequests);

        // Load analytics data
        await loadAnalytics();

      } else {
        throw new Error(response.error || 'Failed to load request history');
      }
    } catch (error) {
      console.error('Error loading request history:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando historial',
        message: 'No se pudo cargar el historial de solicitudes.',
        priority: 'medium'
      });

      // Fallback to empty array
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const params = {
        start_date: dateRange.start,
        end_date: dateRange.end
      };

      const response = await apiService.getRequestAnalytics(params);

      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.documentNumber.includes(searchTerm) ||
        req.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.referringPhysician.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by decision
    if (decisionFilter !== "all") {
      filtered = filtered.filter(req => req.finalDecision === decisionFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(req => req.priority === priorityFilter);
    }

    // Filter by date range
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    filtered = filtered.filter(req => 
      new Date(req.decisionDate) >= startDate
    );

    setFilteredRequests(filtered);
  };

  const handleViewTimeline = (request: HistoricalRequest) => {
    setSelectedRequest(request);
    setShowRequestTimeline(true);
  };

  const handleAnalyzeDecision = (request: HistoricalRequest) => {
    setSelectedRequest(request);
    setShowDecisionAnalysis(true);
  };

  const handlePerformanceReport = () => {
    setShowPerformanceReport(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'aceptada': return 'bg-green-100 text-green-800 border-green-200';
      case 'rechazada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'aceptada': return <CheckCircle className="w-4 h-4" />;
      case 'rechazada': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
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

  const getStatistics = () => {
    const total = requests.length;
    const accepted = requests.filter(r => r.finalDecision === 'aceptada').length;
    const rejected = requests.filter(r => r.finalDecision === 'rechazada').length;
    const highPriority = requests.filter(r => r.priority === 'alta').length;
    
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    
    // Calculate average response time
    const totalMinutes = requests.reduce((sum, req) => {
      const [hours, minutes] = req.responseTime.split('h ');
      const h = parseInt(hours) || 0;
      const m = parseInt(minutes.replace('m', '')) || 0;
      return sum + (h * 60) + m;
    }, 0);
    const avgResponseTime = total > 0 ? Math.round(totalMinutes / total) : 0;
    const avgHours = Math.floor(avgResponseTime / 60);
    const avgMinutes = avgResponseTime % 60;

    return {
      total,
      accepted,
      rejected,
      highPriority,
      acceptanceRate,
      avgResponseTime: `${avgHours}h ${avgMinutes}m`
    };
  };

  const stats = getStatistics();

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
                  <p className="text-xs text-gray-500">Historial de Solicitudes</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => loadRequestHistory()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm" onClick={handlePerformanceReport}>
                <Download className="w-4 h-4 mr-2" />
                Reporte
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Total evaluadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              <p className="text-sm text-gray-600">Aceptadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-gray-600">Rechazadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.acceptanceRate}%</p>
              <p className="text-sm text-gray-600">Tasa aceptación</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.avgResponseTime}</p>
              <p className="text-sm text-gray-600">Tiempo promedio</p>
            </CardContent>
          </Card>
        </div>

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
                  value={decisionFilter}
                  onChange={(e) => setDecisionFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Todas las decisiones</option>
                  <option value="aceptada">Aceptadas</option>
                  <option value="rechazada">Rechazadas</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="7d">Últimos 7 días</option>
                  <option value="30d">Últimos 30 días</option>
                  <option value="90d">Últimos 90 días</option>
                  <option value="1y">Último año</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando historial de solicitudes...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
                <p className="text-gray-600">No se encontraron solicitudes que coincidan con los filtros aplicados.</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {request.patientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {request.patientName}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>ID: {request.id}</span>
                                <span>CC: {request.documentNumber}</span>
                                <span>Evaluado por: {request.currentEvaluator}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(request.priority)}>
                                {request.priority.toUpperCase()}
                              </Badge>
                              <Badge className={getDecisionColor(request.finalDecision)}>
                                {getDecisionIcon(request.finalDecision)}
                                <span className="ml-1">{request.finalDecision.toUpperCase()}</span>
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Diagnóstico</p>
                              <p className="text-sm text-gray-600">{request.diagnosis}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Especialidad</p>
                              <p className="text-sm text-gray-600">{request.specialty}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Médico remitente</p>
                              <p className="text-sm text-gray-600">{request.referringPhysician}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Institución</p>
                              <p className="text-sm text-gray-600">{request.referringInstitution}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Fecha de decisión</p>
                              <p className="text-sm text-gray-600">{formatDate(request.decisionDate)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Tiempo de respuesta</p>
                              <p className="text-sm text-gray-600">{request.responseTime}</p>
                            </div>
                          </div>

                          {request.evaluatorNotes && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-1">Observaciones del evaluador:</p>
                              <p className="text-sm text-gray-600 italic">"{request.evaluatorNotes}"</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Recibido: {formatDate(request.receivedDate)}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewTimeline(request)}
                              >
                                <History className="w-4 h-4 mr-2" />
                                Cronología
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAnalyzeDecision(request)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Analizar
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
      </main>

      {/* Unique Modals for this view */}
      <RequestTimelineModal
        isOpen={showRequestTimeline}
        onClose={() => setShowRequestTimeline(false)}
        request={selectedRequest}
      />

      <DecisionAnalysisModal
        isOpen={showDecisionAnalysis}
        onClose={() => setShowDecisionAnalysis(false)}
        request={selectedRequest}
      />

      <PerformanceReportModal
        isOpen={showPerformanceReport}
        onClose={() => setShowPerformanceReport(false)}
        requests={requests}
      />
    </div>
  );
}
