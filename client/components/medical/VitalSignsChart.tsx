import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import {
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Maximize2,
} from "lucide-react";

interface VitalSignsChartProps {
  patientId: string;
  patientName: string;
  initialData?: any;
  autoUpdate?: boolean;
}

interface VitalData {
  timestamp: string;
  hr: number;
  systolic: number;
  diastolic: number;
  temp: number;
  spo2: number;
  rr: number;
}

const VITAL_RANGES = {
  hr: { min: 60, max: 100, critical: { min: 50, max: 120 } },
  systolic: { min: 90, max: 140, critical: { min: 80, max: 180 } },
  diastolic: { min: 60, max: 90, critical: { min: 50, max: 110 } },
  temp: { min: 36.1, max: 37.5, critical: { min: 35, max: 39 } },
  spo2: { min: 95, max: 100, critical: { min: 90, max: 100 } },
  rr: { min: 12, max: 20, critical: { min: 8, max: 30 } },
};

export default function VitalSignsChart({
  patientId,
  patientName,
  initialData,
  autoUpdate = true,
}: VitalSignsChartProps) {
  const [isRunning, setIsRunning] = useState(autoUpdate);
  const [timeRange, setTimeRange] = useState("1h");
  const [selectedVital, setSelectedVital] = useState("all");
  const [data, setData] = useState<VitalData[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate initial mock data
  const generateInitialData = () => {
    const now = new Date();
    const dataPoints = [];

    for (let i = 59; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000);
      dataPoints.push({
        timestamp: timestamp.toISOString(),
        hr: 70 + Math.random() * 20 + Math.sin(i * 0.1) * 10,
        systolic: 120 + Math.random() * 20 + Math.sin(i * 0.15) * 15,
        diastolic: 80 + Math.random() * 10 + Math.sin(i * 0.12) * 8,
        temp: 36.5 + Math.random() * 1 + Math.sin(i * 0.05) * 0.5,
        spo2: 96 + Math.random() * 4,
        rr: 16 + Math.random() * 6 + Math.sin(i * 0.08) * 3,
      });
    }

    return dataPoints;
  };

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else {
      setData(generateInitialData());
    }
  }, [initialData]);

  // Simulate real-time data updates
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const newDataPoint: VitalData = {
          timestamp: new Date().toISOString(),
          hr: 70 + Math.random() * 30 + Math.sin(Date.now() * 0.001) * 15,
          systolic:
            120 + Math.random() * 30 + Math.sin(Date.now() * 0.0015) * 20,
          diastolic:
            80 + Math.random() * 15 + Math.sin(Date.now() * 0.0012) * 10,
          temp: 36.5 + Math.random() * 2 + Math.sin(Date.now() * 0.0005) * 1,
          spo2: 94 + Math.random() * 6,
          rr: 14 + Math.random() * 8 + Math.sin(Date.now() * 0.0008) * 4,
        };

        setData((prevData) => {
          const maxPoints =
            timeRange === "1h" ? 60 : timeRange === "6h" ? 360 : 1440;
          const newData = [...prevData, newDataPoint];
          return newData.slice(-maxPoints);
        });

        // Check for alerts
        const newAlerts: string[] = [];
        if (
          newDataPoint.hr < VITAL_RANGES.hr.critical.min ||
          newDataPoint.hr > VITAL_RANGES.hr.critical.max
        ) {
          newAlerts.push(`FC crítica: ${newDataPoint.hr.toFixed(0)} lpm`);
        }
        if (
          newDataPoint.systolic < VITAL_RANGES.systolic.critical.min ||
          newDataPoint.systolic > VITAL_RANGES.systolic.critical.max
        ) {
          newAlerts.push(
            `PA sistólica crítica: ${newDataPoint.systolic.toFixed(0)} mmHg`,
          );
        }
        if (newDataPoint.spo2 < VITAL_RANGES.spo2.critical.min) {
          newAlerts.push(`SpO2 crítica: ${newDataPoint.spo2.toFixed(0)}%`);
        }
        if (
          newDataPoint.temp < VITAL_RANGES.temp.critical.min ||
          newDataPoint.temp > VITAL_RANGES.temp.critical.max
        ) {
          newAlerts.push(
            `Temperatura crítica: ${newDataPoint.temp.toFixed(1)}°C`,
          );
        }

        setAlerts(newAlerts);
      }, 5000); // Update every 5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRange]);

  const getLatestValue = (vital: keyof VitalData) => {
    if (data.length === 0) return 0;
    return data[data.length - 1][vital];
  };

  const getTrend = (vital: keyof VitalData) => {
    if (data.length < 2) return "stable";
    const latest = data[data.length - 1][vital];
    const previous = data[data.length - 2][vital];
    if (latest > previous * 1.05) return "up";
    if (latest < previous * 0.95) return "down";
    return "stable";
  };

  const isValueCritical = (vital: keyof VitalData, value: number) => {
    const range = VITAL_RANGES[vital as keyof typeof VITAL_RANGES];
    if (!range) return false;
    return value < range.critical.min || value > range.critical.max;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-red-500" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-blue-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const vitalSignsConfig = [
    {
      key: "hr",
      name: "Frecuencia Cardíaca",
      unit: "lpm",
      color: "#ef4444",
      icon: Heart,
      field: "hr",
    },
    {
      key: "bp",
      name: "Presión Arterial",
      unit: "mmHg",
      color: "#3b82f6",
      icon: Activity,
      field: "systolic",
    },
    {
      key: "temp",
      name: "Temperatura",
      unit: "°C",
      color: "#f59e0b",
      icon: Thermometer,
      field: "temp",
    },
    {
      key: "spo2",
      name: "Saturación O2",
      unit: "%",
      color: "#10b981",
      icon: Droplets,
      field: "spo2",
    },
    {
      key: "rr",
      name: "Frecuencia Respiratoria",
      unit: "rpm",
      color: "#8b5cf6",
      icon: Wind,
      field: "rr",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{formatTimestamp(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}:{" "}
              {typeof entry.value === "number"
                ? entry.value.toFixed(1)
                : entry.value}
              {entry.name === "PA"
                ? " mmHg"
                : entry.name === "FC"
                  ? " lpm"
                  : entry.name === "Temp"
                    ? "°C"
                    : entry.name === "SpO2"
                      ? "%"
                      : entry.name === "FR"
                        ? " rpm"
                        : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className={`transition-all duration-300 ${isExpanded ? "fixed inset-4 z-50 bg-white" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Monitor de Signos Vitales - {patientName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Actualización en tiempo real • Paciente ID: {patientId}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" /> Pausar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" /> Iniciar
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setData(generateInitialData());
                setAlerts([]);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Período:</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="6h">6h</SelectItem>
                <SelectItem value="24h">24h</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Vista:</label>
            <Select value={selectedVital} onValueChange={setSelectedVital}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="hr">Frecuencia Cardíaca</SelectItem>
                <SelectItem value="bp">Presión Arterial</SelectItem>
                <SelectItem value="temp">Temperatura</SelectItem>
                <SelectItem value="spo2">Saturación O2</SelectItem>
                <SelectItem value="rr">Frecuencia Respiratoria</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            />
            <span className="text-sm text-muted-foreground">
              {isRunning ? "En vivo" : "Pausado"}
            </span>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mt-2 space-y-1">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  {alert}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Current Values */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {vitalSignsConfig.map((vital) => {
            const IconComponent = vital.icon;
            const currentValue =
              vital.key === "bp"
                ? `${getLatestValue("systolic").toFixed(0)}/${getLatestValue("diastolic").toFixed(0)}`
                : getLatestValue(vital.field as keyof VitalData).toFixed(
                    vital.key === "temp" ? 1 : 0,
                  );
            const trend = getTrend(vital.field as keyof VitalData);
            const isCritical =
              vital.key === "bp"
                ? isValueCritical("systolic", getLatestValue("systolic")) ||
                  isValueCritical("diastolic", getLatestValue("diastolic"))
                : isValueCritical(
                    vital.field as keyof VitalData,
                    getLatestValue(vital.field as keyof VitalData),
                  );

            return (
              <Card
                key={vital.key}
                className={`p-3 ${isCritical ? "border-red-500 bg-red-50" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent
                    className="w-4 h-4"
                    style={{ color: vital.color }}
                  />
                  {getTrendIcon(trend)}
                </div>
                <div className="space-y-1">
                  <div
                    className={`text-lg font-bold ${isCritical ? "text-red-600" : ""}`}
                  >
                    {currentValue}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {vital.name}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {vital.unit}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {selectedVital === "all" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Heart Rate */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Frecuencia Cardíaca
                </h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatTimestamp}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine
                        y={VITAL_RANGES.hr.min}
                        stroke="#22c55e"
                        strokeDasharray="2 2"
                      />
                      <ReferenceLine
                        y={VITAL_RANGES.hr.max}
                        stroke="#22c55e"
                        strokeDasharray="2 2"
                      />
                      <ReferenceLine
                        y={VITAL_RANGES.hr.critical.min}
                        stroke="#ef4444"
                        strokeDasharray="2 2"
                      />
                      <ReferenceLine
                        y={VITAL_RANGES.hr.critical.max}
                        stroke="#ef4444"
                        strokeDasharray="2 2"
                      />
                      <Area
                        type="monotone"
                        dataKey="hr"
                        stroke="#ef4444"
                        fill="#fef2f2"
                        strokeWidth={2}
                        name="FC"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Blood Pressure */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Presión Arterial
                </h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatTimestamp}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="systolic"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        name="Sistólica"
                      />
                      <Line
                        type="monotone"
                        dataKey="diastolic"
                        stroke="#1d4ed8"
                        strokeWidth={2}
                        dot={false}
                        name="Diastólica"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Temperature */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  Temperatura
                </h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatTimestamp}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine
                        y={VITAL_RANGES.temp.min}
                        stroke="#22c55e"
                        strokeDasharray="2 2"
                      />
                      <ReferenceLine
                        y={VITAL_RANGES.temp.max}
                        stroke="#22c55e"
                        strokeDasharray="2 2"
                      />
                      <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="#f59e0b"
                        fill="#fef3c7"
                        strokeWidth={2}
                        name="Temp"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SpO2 */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-green-500" />
                  Saturación de Oxígeno
                </h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatTimestamp}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis domain={[90, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine
                        y={VITAL_RANGES.spo2.critical.min}
                        stroke="#ef4444"
                        strokeDasharray="2 2"
                      />
                      <Area
                        type="monotone"
                        dataKey="spo2"
                        stroke="#10b981"
                        fill="#d1fae5"
                        strokeWidth={2}
                        name="SpO2"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            // Single vital view - larger chart
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  {selectedVital === "hr" && (
                    <>
                      <ReferenceLine
                        y={VITAL_RANGES.hr.min}
                        stroke="#22c55e"
                        strokeDasharray="2 2"
                      />
                      <ReferenceLine
                        y={VITAL_RANGES.hr.max}
                        stroke="#22c55e"
                        strokeDasharray="2 2"
                      />
                      <ReferenceLine
                        y={VITAL_RANGES.hr.critical.min}
                        stroke="#ef4444"
                        strokeDasharray="2 2"
                      />
                      <ReferenceLine
                        y={VITAL_RANGES.hr.critical.max}
                        stroke="#ef4444"
                        strokeDasharray="2 2"
                      />
                      <Area
                        type="monotone"
                        dataKey="hr"
                        stroke="#ef4444"
                        fill="#fef2f2"
                        strokeWidth={3}
                        name="FC"
                      />
                    </>
                  )}
                  {selectedVital === "bp" && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="systolic"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Sistólica"
                      />
                      <Line
                        type="monotone"
                        dataKey="diastolic"
                        stroke="#1d4ed8"
                        strokeWidth={3}
                        name="Diastólica"
                      />
                    </>
                  )}
                  {selectedVital === "temp" && (
                    <>
                      <ReferenceLine
                        y={VITAL_RANGES.temp.min}
                        stroke="#22c55e"
                        strokeDasharray="2 2"
                      />
                      <ReferenceLine
                        y={VITAL_RANGES.temp.max}
                        stroke="#22c55e"
                        strokeDasharray="2 2"
                      />
                      <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="#f59e0b"
                        fill="#fef3c7"
                        strokeWidth={3}
                        name="Temp"
                      />
                    </>
                  )}
                  {selectedVital === "spo2" && (
                    <>
                      <ReferenceLine
                        y={VITAL_RANGES.spo2.critical.min}
                        stroke="#ef4444"
                        strokeDasharray="2 2"
                      />
                      <Area
                        type="monotone"
                        dataKey="spo2"
                        stroke="#10b981"
                        fill="#d1fae5"
                        strokeWidth={3}
                        name="SpO2"
                      />
                    </>
                  )}
                  {selectedVital === "rr" && (
                    <>
                      <ReferenceLine
                        y={VITAL_RANGES.rr.min}
                        stroke="#22c55e"
                        strokeDasharray="2 2"
                      />
                      <ReferenceLine
                        y={VITAL_RANGES.rr.max}
                        stroke="#22c55e"
                        strokeDasharray="2 2"
                      />
                      <Area
                        type="monotone"
                        dataKey="rr"
                        stroke="#8b5cf6"
                        fill="#f3e8ff"
                        strokeWidth={3}
                        name="FR"
                      />
                    </>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <div>
            Última actualización:{" "}
            {data.length > 0
              ? formatTimestamp(data[data.length - 1].timestamp)
              : "N/A"}
          </div>
          <div>Puntos de datos: {data.length} | Intervalo: 5s</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Normal
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            Crítico
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
