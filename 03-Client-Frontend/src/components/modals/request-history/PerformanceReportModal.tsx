import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  X,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  Activity,
} from "lucide-react";

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

interface PerformanceMetrics {
  totalCases: number;
  acceptedCases: number;
  rejectedCases: number;
  acceptanceRate: number;
  avgResponseTime: string;
  avgResponseTimeMinutes: number;
  casesByPriority: {
    alta: number;
    media: number;
    baja: number;
  };
  casesBySpecialty: Record<string, number>;
  casesByInstitution: Record<string, number>;
  responseTimeDistribution: {
    under1h: number;
    under4h: number;
    under8h: number;
    over8h: number;
  };
  qualityScores: {
    timeliness: number;
    appropriateness: number;
    documentation: number;
    overall: number;
  };
  trends: {
    casesThisMonth: number;
    casesLastMonth: number;
    responseTimeThisMonth: number;
    responseTimeLastMonth: number;
    acceptanceRateThisMonth: number;
    acceptanceRateLastMonth: number;
  };
}

interface PerformanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: HistoricalRequest[];
}

export default function PerformanceReportModal({
  isOpen,
  onClose,
  requests,
}: PerformanceReportModalProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'trends'>('summary');

  useEffect(() => {
    if (isOpen) {
      calculateMetrics();
    }
  }, [isOpen, requests]);

  const calculateMetrics = async () => {
    setLoading(true);
    try {
      // Calculate performance metrics from the requests data
      const totalCases = requests.length;
      const acceptedCases = requests.filter(r => r.finalDecision === 'aceptada').length;
      const rejectedCases = totalCases - acceptedCases;
      const acceptanceRate = totalCases > 0 ? Math.round((acceptedCases / totalCases) * 100) : 0;

      // Calculate average response time
      const totalMinutes = requests.reduce((sum, req) => {
        const [hours, minutes] = req.responseTime.split('h ');
        const h = parseInt(hours) || 0;
        const m = parseInt(minutes.replace('m', '')) || 0;
        return sum + (h * 60) + m;
      }, 0);
      const avgResponseTimeMinutes = totalCases > 0 ? Math.round(totalMinutes / totalCases) : 0;
      const avgHours = Math.floor(avgResponseTimeMinutes / 60);
      const avgMinutes = avgResponseTimeMinutes % 60;
      const avgResponseTime = `${avgHours}h ${avgMinutes}m`;

      // Cases by priority
      const casesByPriority = {
        alta: requests.filter(r => r.priority === 'alta').length,
        media: requests.filter(r => r.priority === 'media').length,
        baja: requests.filter(r => r.priority === 'baja').length,
      };

      // Cases by specialty
      const casesBySpecialty: Record<string, number> = {};
      requests.forEach(req => {
        casesBySpecialty[req.specialty] = (casesBySpecialty[req.specialty] || 0) + 1;
      });

      // Cases by institution
      const casesByInstitution: Record<string, number> = {};
      requests.forEach(req => {
        casesByInstitution[req.referringInstitution] = (casesByInstitution[req.referringInstitution] || 0) + 1;
      });

      // Response time distribution
      const responseTimeDistribution = {
        under1h: 0,
        under4h: 0,
        under8h: 0,
        over8h: 0,
      };

      requests.forEach(req => {
        const [hours] = req.responseTime.split('h ');
        const h = parseInt(hours) || 0;
        
        if (h < 1) responseTimeDistribution.under1h++;
        else if (h < 4) responseTimeDistribution.under4h++;
        else if (h < 8) responseTimeDistribution.under8h++;
        else responseTimeDistribution.over8h++;
      });

      // Quality scores (simulated based on data)
      const qualityScores = {
        timeliness: avgResponseTimeMinutes <= 240 ? 90 : avgResponseTimeMinutes <= 480 ? 75 : 60,
        appropriateness: acceptanceRate >= 70 ? 85 : acceptanceRate >= 50 ? 75 : 65,
        documentation: requests.filter(r => r.evaluatorNotes.length > 50).length / totalCases * 100,
        overall: 0,
      };
      qualityScores.overall = Math.round((qualityScores.timeliness + qualityScores.appropriateness + qualityScores.documentation) / 3);

      // Trends (simulated - in real app would compare with previous periods)
      const trends = {
        casesThisMonth: totalCases,
        casesLastMonth: Math.round(totalCases * (0.8 + Math.random() * 0.4)),
        responseTimeThisMonth: avgResponseTimeMinutes,
        responseTimeLastMonth: Math.round(avgResponseTimeMinutes * (0.9 + Math.random() * 0.2)),
        acceptanceRateThisMonth: acceptanceRate,
        acceptanceRateLastMonth: Math.round(acceptanceRate * (0.9 + Math.random() * 0.2)),
      };

      const calculatedMetrics: PerformanceMetrics = {
        totalCases,
        acceptedCases,
        rejectedCases,
        acceptanceRate,
        avgResponseTime,
        avgResponseTimeMinutes,
        casesByPriority,
        casesBySpecialty,
        casesByInstitution,
        responseTimeDistribution,
        qualityScores,
        trends,
      };

      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error('Error calculating metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!metrics) return;

    const reportData = {
      generatedAt: new Date().toISOString(),
      period: "Histórico",
      summary: {
        totalCases: metrics.totalCases,
        acceptedCases: metrics.acceptedCases,
        rejectedCases: metrics.rejectedCases,
        acceptanceRate: `${metrics.acceptanceRate}%`,
        avgResponseTime: metrics.avgResponseTime,
      },
      qualityScores: metrics.qualityScores,
      trends: metrics.trends,
      distribution: {
        byPriority: metrics.casesByPriority,
        bySpecialty: metrics.casesBySpecialty,
        byInstitution: metrics.casesByInstitution,
        responseTime: metrics.responseTimeDistribution,
      }
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_rendimiento_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Reporte de Rendimiento
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Análisis detallado del rendimiento del evaluador
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportReport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selector */}
          <div className="flex gap-2">
            {['summary', 'detailed', 'trends'].map((type) => (
              <Button
                key={type}
                variant={reportType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setReportType(type as any)}
              >
                {type === 'summary' ? 'Resumen' :
                 type === 'detailed' ? 'Detallado' : 'Tendencias'}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Generando reporte...</p>
            </div>
          ) : metrics ? (
            <>
              {reportType === 'summary' && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{metrics.totalCases}</p>
                        <p className="text-sm text-gray-600">Total casos</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{metrics.acceptedCases}</p>
                        <p className="text-sm text-gray-600">Aceptados</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">{metrics.acceptanceRate}%</p>
                        <p className="text-sm text-gray-600">Tasa aceptación</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-orange-600">{metrics.avgResponseTime}</p>
                        <p className="text-sm text-gray-600">Tiempo promedio</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quality Scores */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Puntuaciones de Calidad
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {Object.entries(metrics.qualityScores).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className={`w-16 h-16 rounded-full ${getScoreBackground(value)} flex items-center justify-center mx-auto mb-2`}>
                              <span className={`text-xl font-bold ${getScoreColor(value)}`}>
                                {Math.round(value)}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {key === 'timeliness' ? 'Oportunidad' :
                               key === 'appropriateness' ? 'Apropiada' :
                               key === 'documentation' ? 'Documentación' :
                               'General'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error en el reporte</h3>
              <p className="text-gray-600">No se pudo generar el reporte de rendimiento.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
