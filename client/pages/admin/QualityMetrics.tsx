import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/components/ui/notification-system';
import { qualityApi } from '@/services/api';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Users,
  Heart,
  Clock,
  Shield,
  Star,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Thermometer,
  Stethoscope,
  UserCheck,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface QualityMetrics {
  patientSatisfaction: {
    overall: number;
    nursing: number;
    medical: number;
    facilities: number;
    food: number;
  };
  clinicalIndicators: {
    mortalityRate: number;
    readmissionRate: number;
    infectionRate: number;
    averageLengthOfStay: number;
  };
  staffMetrics: {
    nursePatientRatio: number;
    physicianAvailability: number;
    staffSatisfaction: number;
    turnoverRate: number;
  };
  operationalMetrics: {
    bedOccupancyRate: number;
    emergencyWaitTime: number;
    surgeryOnTimeRate: number;
    dischargeEfficiency: number;
  };
}

const QualityMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchQualityMetrics();
  }, [selectedPeriod, selectedDepartment]);

  const fetchQualityMetrics = async () => {
    try {
      setLoading(true);
      const response = await qualityApi.getMetrics();
      
      if (response.success) {
        setMetrics(response.data);
      }
    } catch (error) {
      console.error('Error fetching quality metrics:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar las métricas de calidad',
        priority: 'high'
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number, isInverted: boolean = false) => {
    if (isInverted) {
      if (score <= 2) return 'text-green-600';
      if (score <= 5) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (score >= 90) return 'text-green-600';
      if (score >= 70) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getProgressColor = (score: number, isInverted: boolean = false) => {
    if (isInverted) {
      if (score <= 2) return 'bg-green-500';
      if (score <= 5) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      if (score >= 90) return 'bg-green-500';
      if (score >= 70) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  const getTrendIcon = (current: number, target: number, isInverted: boolean = false) => {
    const isGood = isInverted ? current < target : current > target;
    if (Math.abs(current - target) < 0.1) return <Minus className="w-4 h-4 text-gray-500" />;
    return isGood ? 
      <ArrowUp className="w-4 h-4 text-green-500" /> : 
      <ArrowDown className="w-4 h-4 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando métricas de calidad...</span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-lg text-gray-600">No se pudieron cargar las métricas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Métricas de Calidad</h1>
          <p className="text-gray-600">Indicadores de calidad y rendimiento hospitalario</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este año</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchQualityMetrics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfacción General</p>
                <p className={`text-2xl font-bold ${getScoreColor(metrics.patientSatisfaction.overall)}`}>
                  {metrics.patientSatisfaction.overall}%
                </p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(metrics.patientSatisfaction.overall, 90)}
                <Star className="w-8 h-8 text-yellow-500 ml-2" />
              </div>
            </div>
            <Progress 
              value={metrics.patientSatisfaction.overall} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa de Mortalidad</p>
                <p className={`text-2xl font-bold ${getScoreColor(metrics.clinicalIndicators.mortalityRate, true)}`}>
                  {metrics.clinicalIndicators.mortalityRate}%
                </p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(metrics.clinicalIndicators.mortalityRate, 3, true)}
                <Heart className="w-8 h-8 text-red-500 ml-2" />
              </div>
            </div>
            <Progress 
              value={metrics.clinicalIndicators.mortalityRate * 10} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ocupación de Camas</p>
                <p className={`text-2xl font-bold ${getScoreColor(metrics.operationalMetrics.bedOccupancyRate)}`}>
                  {metrics.operationalMetrics.bedOccupancyRate}%
                </p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(metrics.operationalMetrics.bedOccupancyRate, 85)}
                <Activity className="w-8 h-8 text-blue-500 ml-2" />
              </div>
            </div>
            <Progress 
              value={metrics.operationalMetrics.bedOccupancyRate} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfacción del Personal</p>
                <p className={`text-2xl font-bold ${getScoreColor(metrics.staffMetrics.staffSatisfaction)}`}>
                  {metrics.staffMetrics.staffSatisfaction}%
                </p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(metrics.staffMetrics.staffSatisfaction, 85)}
                <Users className="w-8 h-8 text-green-500 ml-2" />
              </div>
            </div>
            <Progress 
              value={metrics.staffMetrics.staffSatisfaction} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="patient-satisfaction" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patient-satisfaction">Satisfacción del Paciente</TabsTrigger>
          <TabsTrigger value="clinical-indicators">Indicadores Clínicos</TabsTrigger>
          <TabsTrigger value="staff-metrics">Métricas del Personal</TabsTrigger>
          <TabsTrigger value="operational">Métricas Operacionales</TabsTrigger>
        </TabsList>

        <TabsContent value="patient-satisfaction">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Satisfacción General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.patientSatisfaction.overall}%
                </div>
                <Progress value={metrics.patientSatisfaction.overall} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 90% | Actual: {metrics.patientSatisfaction.overall}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-blue-500" />
                  Atención de Enfermería
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.patientSatisfaction.nursing}%
                </div>
                <Progress value={metrics.patientSatisfaction.nursing} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 92% | Actual: {metrics.patientSatisfaction.nursing}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2 text-green-500" />
                  Atención Médica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.patientSatisfaction.medical}%
                </div>
                <Progress value={metrics.patientSatisfaction.medical} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 90% | Actual: {metrics.patientSatisfaction.medical}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-500" />
                  Instalaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.patientSatisfaction.facilities}%
                </div>
                <Progress value={metrics.patientSatisfaction.facilities} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 85% | Actual: {metrics.patientSatisfaction.facilities}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-orange-500" />
                  Alimentación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.patientSatisfaction.food}%
                </div>
                <Progress value={metrics.patientSatisfaction.food} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 80% | Actual: {metrics.patientSatisfaction.food}%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clinical-indicators">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Tasa de Mortalidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.clinicalIndicators.mortalityRate}%
                </div>
                <Progress value={metrics.clinicalIndicators.mortalityRate * 10} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: &lt;3% | Actual: {metrics.clinicalIndicators.mortalityRate}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 text-blue-500" />
                  Tasa de Readmisión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.clinicalIndicators.readmissionRate}%
                </div>
                <Progress value={metrics.clinicalIndicators.readmissionRate} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: &lt;10% | Actual: {metrics.clinicalIndicators.readmissionRate}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                  Tasa de Infección
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.clinicalIndicators.infectionRate}%
                </div>
                <Progress value={metrics.clinicalIndicators.infectionRate * 10} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: &lt;2% | Actual: {metrics.clinicalIndicators.infectionRate}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-500" />
                  Estancia Promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.clinicalIndicators.averageLengthOfStay} días
                </div>
                <Progress value={metrics.clinicalIndicators.averageLengthOfStay * 10} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: &lt;5 días | Actual: {metrics.clinicalIndicators.averageLengthOfStay} días
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff-metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Ratio Enfermera-Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  1:{metrics.staffMetrics.nursePatientRatio}
                </div>
                <Progress value={100 - (metrics.staffMetrics.nursePatientRatio * 10)} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 1:4 | Actual: 1:{metrics.staffMetrics.nursePatientRatio}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-green-500" />
                  Disponibilidad Médica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.staffMetrics.physicianAvailability}%
                </div>
                <Progress value={metrics.staffMetrics.physicianAvailability} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 95% | Actual: {metrics.staffMetrics.physicianAvailability}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Satisfacción del Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.staffMetrics.staffSatisfaction}%
                </div>
                <Progress value={metrics.staffMetrics.staffSatisfaction} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 85% | Actual: {metrics.staffMetrics.staffSatisfaction}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
                  Tasa de Rotación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.staffMetrics.turnoverRate}%
                </div>
                <Progress value={metrics.staffMetrics.turnoverRate} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: &lt;15% | Actual: {metrics.staffMetrics.turnoverRate}%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Ocupación de Camas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.operationalMetrics.bedOccupancyRate}%
                </div>
                <Progress value={metrics.operationalMetrics.bedOccupancyRate} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 85% | Actual: {metrics.operationalMetrics.bedOccupancyRate}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-red-500" />
                  Tiempo de Espera Emergencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.operationalMetrics.emergencyWaitTime} min
                </div>
                <Progress value={100 - metrics.operationalMetrics.emergencyWaitTime} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: &lt;30 min | Actual: {metrics.operationalMetrics.emergencyWaitTime} min
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Cirugías a Tiempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.operationalMetrics.surgeryOnTimeRate}%
                </div>
                <Progress value={metrics.operationalMetrics.surgeryOnTimeRate} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 95% | Actual: {metrics.operationalMetrics.surgeryOnTimeRate}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                  Eficiencia de Altas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center mb-4">
                  {metrics.operationalMetrics.dischargeEfficiency}%
                </div>
                <Progress value={metrics.operationalMetrics.dischargeEfficiency} className="mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Meta: 90% | Actual: {metrics.operationalMetrics.dischargeEfficiency}%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityMetrics;
