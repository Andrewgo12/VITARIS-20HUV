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
  BarChart3,
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  FileText,
  User,
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

interface DecisionAnalysis {
  decisionFactors: {
    clinical: number;
    capacity: number;
    urgency: number;
    resources: number;
  };
  similarCases: {
    total: number;
    accepted: number;
    rejected: number;
    avgResponseTime: string;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    score: number;
  };
  recommendations: string[];
  qualityMetrics: {
    appropriateness: number;
    timeliness: number;
    documentation: number;
    overall: number;
  };
}

interface DecisionAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: HistoricalRequest | null;
}

export default function DecisionAnalysisModal({
  isOpen,
  onClose,
  request,
}: DecisionAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (request && isOpen) {
      loadAnalysis();
    }
  }, [request, isOpen]);

  if (!request) return null;

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      // Simulate AI-powered decision analysis
      const mockAnalysis: DecisionAnalysis = {
        decisionFactors: {
          clinical: request.finalDecision === 'aceptada' ? 85 : 45,
          capacity: request.finalDecision === 'aceptada' ? 70 : 30,
          urgency: request.priority === 'alta' ? 90 : request.priority === 'media' ? 60 : 30,
          resources: request.finalDecision === 'aceptada' ? 75 : 40,
        },
        similarCases: {
          total: 24,
          accepted: request.finalDecision === 'aceptada' ? 18 : 8,
          rejected: request.finalDecision === 'aceptada' ? 6 : 16,
          avgResponseTime: "3h 45m"
        },
        riskAssessment: {
          level: request.priority === 'alta' ? 'high' : request.priority === 'media' ? 'medium' : 'low',
          factors: request.finalDecision === 'aceptada' ? 
            ["Condición crítica", "Ventana terapéutica limitada", "Recursos especializados requeridos"] :
            ["Condición estable", "Manejo ambulatorio posible", "Recursos disponibles localmente"],
          score: request.priority === 'alta' ? 85 : request.priority === 'media' ? 60 : 35
        },
        recommendations: request.finalDecision === 'aceptada' ? [
          "Decisión apropiada basada en criterios clínicos",
          "Tiempo de respuesta dentro del estándar",
          "Documentación completa y justificada",
          "Seguimiento post-traslado recomendado"
        ] : [
          "Decisión justificada por estabilidad del paciente",
          "Alternativas de manejo local disponibles",
          "Comunicación clara con EPS remitente",
          "Monitoreo ambulatorio recomendado"
        ],
        qualityMetrics: {
          appropriateness: request.finalDecision === 'aceptada' ? 92 : 88,
          timeliness: calculateTimeliness(request.responseTime),
          documentation: request.evaluatorNotes.length > 50 ? 95 : 75,
          overall: 0
        }
      };

      // Calculate overall quality score
      mockAnalysis.qualityMetrics.overall = Math.round(
        (mockAnalysis.qualityMetrics.appropriateness + 
         mockAnalysis.qualityMetrics.timeliness + 
         mockAnalysis.qualityMetrics.documentation) / 3
      );

      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Error loading analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeliness = (responseTime: string): number => {
    const [hours] = responseTime.split('h ');
    const h = parseInt(hours) || 0;
    
    if (h <= 2) return 95;
    if (h <= 4) return 85;
    if (h <= 8) return 75;
    return 60;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Análisis de Decisión - {request.id}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Análisis detallado de la decisión médica tomada
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analizando decisión...</p>
            </div>
          ) : analysis ? (
            <>
              {/* Case Summary */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-900">Paciente:</span>
                      <p className="text-blue-800">{request.patientName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-900">Decisión:</span>
                      <Badge className={request.finalDecision === 'aceptada' ? 
                        'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {request.finalDecision === 'aceptada' ? 
                          <CheckCircle className="w-3 h-3 mr-1" /> : 
                          <XCircle className="w-3 h-3 mr-1" />}
                        {request.finalDecision.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium text-blue-900">Evaluador:</span>
                      <p className="text-blue-800">{request.currentEvaluator}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quality Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Métricas de Calidad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(analysis.qualityMetrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className={`w-16 h-16 rounded-full ${getScoreBackground(value)} flex items-center justify-center mx-auto mb-2`}>
                          <span className={`text-xl font-bold ${getScoreColor(value)}`}>
                            {value}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {key === 'appropriateness' ? 'Apropiada' :
                           key === 'timeliness' ? 'Oportuna' :
                           key === 'documentation' ? 'Documentada' :
                           'General'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Decision Factors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Factores de Decisión
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analysis.decisionFactors).map(([factor, score]) => (
                      <div key={factor} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-gray-700 capitalize">
                          {factor === 'clinical' ? 'Clínico' :
                           factor === 'capacity' ? 'Capacidad' :
                           factor === 'urgency' ? 'Urgencia' :
                           'Recursos'}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              score >= 80 ? 'bg-green-500' :
                              score >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-sm font-medium text-gray-900">
                          {score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Evaluación de Riesgo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 mb-4">
                    <Badge className={getRiskColor(analysis.riskAssessment.level)}>
                      {getRiskIcon(analysis.riskAssessment.level)}
                      <span className="ml-1">
                        Riesgo {analysis.riskAssessment.level === 'high' ? 'Alto' :
                                analysis.riskAssessment.level === 'medium' ? 'Medio' : 'Bajo'}
                      </span>
                    </Badge>
                    <div className="text-2xl font-bold text-gray-900">
                      {analysis.riskAssessment.score}/100
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Factores de riesgo identificados:</h4>
                    <ul className="space-y-1">
                      {analysis.riskAssessment.factors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Cases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Casos Similares
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{analysis.similarCases.total}</p>
                      <p className="text-sm text-gray-600">Total casos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{analysis.similarCases.accepted}</p>
                      <p className="text-sm text-gray-600">Aceptados</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{analysis.similarCases.rejected}</p>
                      <p className="text-sm text-gray-600">Rechazados</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{analysis.similarCases.avgResponseTime}</p>
                      <p className="text-sm text-gray-600">Tiempo promedio</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Tasa de aceptación:</strong> {' '}
                      {Math.round((analysis.similarCases.accepted / analysis.similarCases.total) * 100)}%
                      {' '}para casos similares de {request.specialty.toLowerCase()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recomendaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <p className="text-sm text-green-800">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis Summary */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Brain className="w-5 h-5" />
                    Resumen del Análisis IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-800">
                    El análisis automatizado indica que la decisión tomada fue{' '}
                    <strong>
                      {analysis.qualityMetrics.overall >= 85 ? 'altamente apropiada' :
                       analysis.qualityMetrics.overall >= 70 ? 'apropiada' : 'cuestionable'}
                    </strong>
                    {' '}basada en los criterios clínicos, capacidad hospitalaria y urgencia del caso. 
                    La documentación es {analysis.qualityMetrics.documentation >= 90 ? 'excelente' : 'adecuada'} 
                    {' '}y el tiempo de respuesta está {analysis.qualityMetrics.timeliness >= 85 ? 'dentro' : 'cerca'} 
                    {' '}de los estándares establecidos.
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error en el análisis</h3>
              <p className="text-gray-600">No se pudo cargar el análisis de la decisión.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
