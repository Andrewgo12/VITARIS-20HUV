/**
 * Supervision Panel for VITAL RED - Administrator View
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  Users,
  Clock,
  TrendingUp,
  Download,
  Filter,
  Search,
  ArrowLeft,
  BarChart3,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { apiService } from "@/services/api";
import { useNotifications } from "@/components/ui/notification-system";

interface SupervisionStats {
  totalEvaluators: number;
  activeEvaluators: number;
  totalDecisions: number;
  averageResponseTime: number;
  approvalRate: number;
  rejectionRate: number;
}

interface EvaluatorPerformance {
  id: string;
  name: string;
  email: string;
  totalCases: number;
  approvedCases: number;
  rejectedCases: number;
  averageTime: number;
  lastActivity: string;
  status: 'active' | 'inactive';
}

interface DecisionHistory {
  id: string;
  caseId: string;
  patientName: string;
  evaluatorName: string;
  decision: 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  responseTime: number;
  notes?: string;
}

const SupervisionPanel: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SupervisionStats>({
    totalEvaluators: 0,
    activeEvaluators: 0,
    totalDecisions: 0,
    averageResponseTime: 0,
    approvalRate: 0,
    rejectionRate: 0,
  });
  const [evaluators, setEvaluators] = useState<EvaluatorPerformance[]>([]);
  const [decisions, setDecisions] = useState<DecisionHistory[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedEvaluator, setSelectedEvaluator] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSupervisionData();
  }, [selectedPeriod, selectedEvaluator]);

  const loadSupervisionData = async () => {
    setLoading(true);
    try {
      // Real API call to get admin dashboard data
      const dashboardResponse = await apiService.getAdminDashboard();

      if (dashboardResponse.success && dashboardResponse.data) {
        const data = dashboardResponse.data;

        // Convert to SupervisionStats format
        const supervisionStats: SupervisionStats = {
          totalEvaluators: data.userStats.evaluators,
          activeEvaluators: data.userStats.active,
          totalDecisions: data.systemActivity.recentReferrals,
          averageResponseTime: parseFloat(data.systemActivity.avgResponseTime.replace('h', '')) || 0,
          approvalRate: 75.0, // TODO: Calculate from real data
          rejectionRate: 25.0, // TODO: Calculate from real data
        };

        setStats(supervisionStats);

        // Load users data for evaluators
        const usersResponse = await apiService.getUsers();
        if (usersResponse.success && usersResponse.data) {
          const evaluatorUsers = usersResponse.data.filter((user: any) =>
            user.role === 'medical_evaluator'
          );

          const evaluatorPerformance: EvaluatorPerformance[] = evaluatorUsers.map((user: any) => ({
            id: user.id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            totalCases: user.casesAssigned || 0,
            approvedCases: user.casesCompleted || 0,
            rejectedCases: (user.casesAssigned || 0) - (user.casesCompleted || 0),
            averageTime: parseFloat(user.avgResponseTime?.replace('h', '').replace('m', '')) || 0,
            lastActivity: user.lastLogin,
            status: user.isActive ? 'active' : 'inactive',
          }));

          setEvaluators(evaluatorPerformance);
        }

        // Load recent decisions from request history
        const historyResponse = await apiService.getRequestHistory({ limit: 20 });
        if (historyResponse.success && historyResponse.data) {
          const recentDecisions: DecisionHistory[] = historyResponse.data.items.map((item: any) => ({
            id: item.id,
            caseId: `CASE-${item.id}`,
            patientName: item.patientName,
            evaluatorName: item.evaluatedBy || 'Sistema',
            decision: item.status === 'aceptada' ? 'approved' : 'rejected',
            priority: item.priority,
            timestamp: item.updatedAt,
            responseTime: parseFloat(item.responseTime?.replace('h', '')) || 0,
            notes: item.notes || 'Sin observaciones',
          }));

          setDecisions(recentDecisions);
        }

      } else {
        throw new Error(dashboardResponse.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading supervision data:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando datos',
        message: 'No se pudieron cargar los datos de supervisión.',
        priority: 'medium'
      });

      // Set empty data on error
      setStats({
        totalEvaluators: 0,
        activeEvaluators: 0,
        totalDecisions: 0,
        averageResponseTime: 0,
        approvalRate: 0,
        rejectionRate: 0,
      });
      setEvaluators([]);
      setDecisions([]);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Implementation for exporting supervision report
    console.log('Exporting supervision report...');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionColor = (decision: string) => {
    return decision === 'approved' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const filteredDecisions = decisions.filter(decision =>
    (selectedEvaluator === 'all' || decision.evaluatorName.includes(selectedEvaluator)) &&
    (searchTerm === '' || 
     decision.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     decision.caseId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de supervisión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/vital-red/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Supervisión</h1>
                <p className="text-gray-600">Monitoreo de decisiones médicas y rendimiento</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Hoy</SelectItem>
                  <SelectItem value="7d">7 días</SelectItem>
                  <SelectItem value="30d">30 días</SelectItem>
                  <SelectItem value="90d">90 días</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportReport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Evaluadores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeEvaluators}/{stats.totalEvaluators}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Decisiones</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDecisions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tasa Aprobación</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approvalRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluator Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Rendimiento por Evaluador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evaluador</TableHead>
                  <TableHead>Total Casos</TableHead>
                  <TableHead>Aprobados</TableHead>
                  <TableHead>Rechazados</TableHead>
                  <TableHead>Tiempo Promedio</TableHead>
                  <TableHead>Última Actividad</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluators.map((evaluator) => (
                  <TableRow key={evaluator.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{evaluator.name}</div>
                        <div className="text-sm text-gray-500">{evaluator.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{evaluator.totalCases}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        {evaluator.approvedCases}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800">
                        {evaluator.rejectedCases}
                      </Badge>
                    </TableCell>
                    <TableCell>{evaluator.averageTime}h</TableCell>
                    <TableCell>
                      {format(new Date(evaluator.lastActivity), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge className={evaluator.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {evaluator.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Decision History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Historial de Decisiones
            </CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente o caso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={selectedEvaluator} onValueChange={setSelectedEvaluator}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por evaluador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los evaluadores</SelectItem>
                  {evaluators.map((evaluator) => (
                    <SelectItem key={evaluator.id} value={evaluator.name}>
                      {evaluator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Caso</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Evaluador</TableHead>
                  <TableHead>Decisión</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Tiempo Respuesta</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDecisions.map((decision) => (
                  <TableRow key={decision.id}>
                    <TableCell className="font-medium">{decision.caseId}</TableCell>
                    <TableCell>{decision.patientName}</TableCell>
                    <TableCell>{decision.evaluatorName}</TableCell>
                    <TableCell>
                      <Badge className={getDecisionColor(decision.decision)}>
                        {decision.decision === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(decision.priority)}>
                        {decision.priority === 'critical' ? 'Crítica' :
                         decision.priority === 'high' ? 'Alta' :
                         decision.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </TableCell>
                    <TableCell>{decision.responseTime}h</TableCell>
                    <TableCell>
                      {format(new Date(decision.timestamp), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupervisionPanel;
