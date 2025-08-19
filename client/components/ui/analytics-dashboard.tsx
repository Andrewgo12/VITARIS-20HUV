import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Heart,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  Percent,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Maximize2,
} from 'lucide-react';

// Tipos para métricas
export interface Metric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  unit?: string;
  format?: 'number' | 'percentage' | 'currency' | 'time';
  trend?: 'up' | 'down' | 'stable';
  target?: number;
  category: string;
  description?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

// Datos mock para analytics
const mockMetrics: Metric[] = [
  {
    id: 'total_patients',
    name: 'Total Pacientes',
    value: 1247,
    previousValue: 1180,
    format: 'number',
    trend: 'up',
    category: 'Pacientes',
    description: 'Número total de pacientes registrados'
  },
  {
    id: 'active_cases',
    name: 'Casos Activos',
    value: 324,
    previousValue: 298,
    format: 'number',
    trend: 'up',
    category: 'Pacientes',
    description: 'Pacientes actualmente hospitalizados'
  },
  {
    id: 'bed_occupancy',
    name: 'Ocupación de Camas',
    value: 87.5,
    previousValue: 82.3,
    unit: '%',
    format: 'percentage',
    trend: 'up',
    target: 85,
    category: 'Recursos',
    description: 'Porcentaje de ocupación de camas'
  },
  {
    id: 'avg_stay',
    name: 'Estancia Promedio',
    value: 4.2,
    previousValue: 4.8,
    unit: 'días',
    format: 'number',
    trend: 'down',
    target: 4.0,
    category: 'Eficiencia',
    description: 'Días promedio de hospitalización'
  },
  {
    id: 'patient_satisfaction',
    name: 'Satisfacción del Paciente',
    value: 92.3,
    previousValue: 89.1,
    unit: '%',
    format: 'percentage',
    trend: 'up',
    target: 90,
    category: 'Calidad',
    description: 'Índice de satisfacción del paciente'
  },
  {
    id: 'emergency_response',
    name: 'Tiempo Respuesta Emergencias',
    value: 8.5,
    previousValue: 9.2,
    unit: 'min',
    format: 'time',
    trend: 'down',
    target: 10,
    category: 'Emergencias',
    description: 'Tiempo promedio de respuesta en emergencias'
  }
];

const mockChartData = {
  admissions: [
    { name: 'Ene', value: 120, previous: 110 },
    { name: 'Feb', value: 135, previous: 125 },
    { name: 'Mar', value: 148, previous: 140 },
    { name: 'Abr', value: 142, previous: 135 },
    { name: 'May', value: 156, previous: 148 },
    { name: 'Jun', value: 163, previous: 155 },
  ],
  departments: [
    { name: 'Medicina Interna', value: 35, color: '#8884d8' },
    { name: 'Cardiología', value: 25, color: '#82ca9d' },
    { name: 'Neurología', value: 20, color: '#ffc658' },
    { name: 'Pediatría', value: 15, color: '#ff7300' },
    { name: 'Otros', value: 5, color: '#00ff00' },
  ],
  vitals: [
    { time: '00:00', hr: 72, bp_sys: 120, bp_dia: 80, temp: 36.5 },
    { time: '04:00', hr: 68, bp_sys: 118, bp_dia: 78, temp: 36.3 },
    { time: '08:00', hr: 75, bp_sys: 125, bp_dia: 82, temp: 36.7 },
    { time: '12:00', hr: 78, bp_sys: 128, bp_dia: 85, temp: 36.8 },
    { time: '16:00', hr: 74, bp_sys: 122, bp_dia: 81, temp: 36.6 },
    { time: '20:00', hr: 70, bp_sys: 119, bp_dia: 79, temp: 36.4 },
  ]
};

// Componente de métrica individual
const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => {
  const formatValue = (value: number, format?: string, unit?: string) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP'
        }).format(value);
      case 'time':
        return `${value.toFixed(1)} ${unit || 'min'}`;
      default:
        return `${value.toLocaleString()} ${unit || ''}`;
    }
  };

  const calculateChange = () => {
    if (!metric.previousValue) return null;
    const change = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      isNegative: change < 0
    };
  };

  const change = calculateChange();
  const isOnTarget = metric.target ? 
    (metric.format === 'time' ? metric.value <= metric.target : metric.value >= metric.target) : 
    true;

  return (
    <Card className={`${!isOnTarget ? 'border-yellow-300 bg-yellow-50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
        <div className="flex items-center gap-1">
          {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
          {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
          {!isOnTarget && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(metric.value, metric.format, metric.unit)}
        </div>
        
        {change && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {change.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={change.isPositive ? 'text-green-600' : 'text-red-600'}>
              {change.value}%
            </span>
            <span>vs período anterior</span>
          </div>
        )}

        {metric.target && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Meta: {formatValue(metric.target, metric.format, metric.unit)}</span>
              <span>{((metric.value / metric.target) * 100).toFixed(0)}%</span>
            </div>
            <Progress 
              value={(metric.value / metric.target) * 100} 
              className="h-1"
            />
          </div>
        )}

        {metric.description && (
          <p className="text-xs text-muted-foreground mt-2">
            {metric.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Componente principal del dashboard de analytics
const AnalyticsDashboard: React.FC<{
  title?: string;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}> = ({
  title = "Analytics Dashboard",
  timeRange = "7d",
  onTimeRangeChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['all', ...Array.from(new Set(mockMetrics.map(m => m.category)))];
  const filteredMetrics = selectedCategory === 'all' 
    ? mockMetrics 
    : mockMetrics.filter(m => m.category === selectedCategory);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">
            Métricas y análisis en tiempo real del sistema hospitalario
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Último día</SelectItem>
              <SelectItem value="7d">Última semana</SelectItem>
              <SelectItem value="30d">Último mes</SelectItem>
              <SelectItem value="90d">Últimos 3 meses</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="flex gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Todas' : category}
            <Badge variant="secondary" className="ml-2">
              {category === 'all' ? mockMetrics.length : mockMetrics.filter(m => m.category === category).length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">
            <LineChartIcon className="h-4 w-4 mr-2" />
            Tendencias
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Distribución
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <BarChart3 className="h-4 w-4 mr-2" />
            Comparación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Admisiones por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockChartData.admissions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Actual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previous" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Anterior"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Signos Vitales Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockChartData.vitals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="hr" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8"
                      name="Frecuencia Cardíaca"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={mockChartData.departments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockChartData.departments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparación Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockChartData.admissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Actual" />
                  <Bar dataKey="previous" fill="#82ca9d" name="Anterior" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
export { AnalyticsDashboard };
