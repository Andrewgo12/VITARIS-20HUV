import React, { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/components/ui/notification-system";

// Import only available utilities
import { useResponsive } from "@/utils/responsive";

import { withLazyLoading, preloadComponent } from "@/utils/performance";

import { useKeyboardNavigation, ensureContrast } from "@/utils/accessibility";

import {
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Eye,
  Cpu,
  MemoryStick,
  Activity,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

// Lazy loaded component to demonstrate withLazyLoading
const LazyDemoComponent = withLazyLoading(() =>
  Promise.resolve({
    default: () => (
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="font-bold text-green-800">
          Componente Cargado Dinámicamente
        </h3>
        <p className="text-green-600">
          Este componente se cargó usando lazy loading
        </p>
      </div>
    ),
  }),
);

const CompleteUtilitiesDemo: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showLazyComponent, setShowLazyComponent] = useState(false);
  const { addNotification } = useNotifications();

  // === PERFORMANCE UTILITIES - ALL USED ===
  usePerformanceTracking("CompleteUtilitiesDemo");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const memoryUsage = useMemoryUsage();
  const fps = useFPS();
  const intersectionRef = React.useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(intersectionRef);

  React.useEffect(() => {
    if (isIntersecting) {
      announce("Sección visible en pantalla");
    }
  }, [isIntersecting, announce]);
  const virtualizedItems = useVirtualization(100, 50, 400); // 100 items, 50px height each, 400px container
  useMemoryCleanup([searchTerm, isPlaying, volume]);

  // === RESPONSIVE UTILITIES - ALL USED ===
  const { isMobile, isTablet, isDesktop, screenSize } = useResponsive();
  const medicalResponsive = useMedicalResponsive();
  const gridConfig = getResponsiveGrid(isMobile);
  const tableConfig = getResponsiveTableConfig();
  const textSize = getResponsiveTextSize(isMobile, isTablet);
  const spacing = getResponsiveSpacing(screenSize);
  const cardLayout = getMedicalCardLayout(isMobile);
  const navigation = getResponsiveNavigation(isMobile);
  const dashboardLayout = getMedicalDashboardLayout(screenSize);
  const imageSize = getResponsiveImageSize(isMobile, isTablet);

  // === ACCESSIBILITY UTILITIES - ALL USED ===
  const { announce, setLiveRegion } = useScreenReader();
  const { focusFirst, focusLast, trapFocus, saveFocus, restoreFocus } =
    useAccessibility();
  const keyboardNav = useKeyboardNavigation();
  const focusManagement = useFocusManagement();
  const modalAccessibility = useModalAccessibility();
  const mainAriaAttributes = generateAriaAttributes("main");
  const demoAriaLabel = getMedicalAriaLabel(
    "demo",
    "Demostración Completa de Utilidades",
  );
  const contrastEnsured = ensureContrast("#000000", "#ffffff");

  // Preload components on mount
  useEffect(() => {
    preloadComponent(() => import("./HUVDashboard"));
    preloadComponent(() => import("./PatientDetailView"));
  }, []);

  // Announce search changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      announce(`Buscando: ${debouncedSearchTerm}`);
      setLiveRegion(`Resultados de búsqueda para: ${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm, announce, setLiveRegion]);

  const handlePlayPause = () => {
    const performanceResult = measurePerformance(() => {
      setIsPlaying(!isPlaying);
      announce(isPlaying ? "Reproducción pausada" : "Reproducción iniciada");
    });
    console.log("Play/Pause performance:", performanceResult);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    announce(`Volumen ajustado a ${newVolume}%`);
  };

  const handleFocusDemo = () => {
    saveFocus();
    focusFirst();
    announce("Enfocando primer elemento");
  };

  const handleTrapFocusDemo = () => {
    trapFocus();
    announce("Foco atrapado en esta sección");
  };

  const handleRestoreFocus = () => {
    restoreFocus();
    announce("Foco restaurado");
  };

  const handleKeyboardNavDemo = () => {
    keyboardNav.enable();
    announce("Navegación por teclado habilitada");
  };

  const showLazyDemo = () => {
    setShowLazyComponent(true);
    announce("Cargando componente dinámico");
  };

  return (
    <AccessibilityProvider>
      <div
        className={`container mx-auto space-y-6 ${spacing} ${textSize}`}
        style={{ ...dashboardLayout, ...cardLayout }}
        {...mainAriaAttributes}
        aria-label={demoAriaLabel}
        ref={intersectionRef}
      >
        <SkipLink href="#main-content" />

        {/* Header with Performance Monitor */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Demostración Completa de Utilidades
            </h1>
            <ResponsiveText
              mobile="Demo de todas las utilidades"
              tablet="Demostración de utilidades del sistema"
              desktop="Demostración completa de todas las utilidades implementadas"
            />
          </div>
          <PerformanceMonitor />
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Métricas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${gridConfig}`}>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span>Uso de Memoria: {memoryUsage.toFixed(2)} MB</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span>FPS: {fps}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-500" />
                <span>
                  Búsqueda Debounced: {debouncedSearchTerm || "Ninguna"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-orange-500" />
                <span>
                  Items Virtualizados: {virtualizedItems.visibleItems.length}/
                  {virtualizedItems.totalItems}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                <span>
                  Contraste: {contrastEnsured ? "Válido" : "Inválido"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-500" />
              Demostración Responsiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant={isMobile ? "default" : "outline"}>
                  <Smartphone className="w-4 h-4 mr-1" />
                  Móvil
                </Badge>
                <Badge variant={isTablet ? "default" : "outline"}>
                  <Tablet className="w-4 h-4 mr-1" />
                  Tablet
                </Badge>
                <Badge variant={isDesktop ? "default" : "outline"}>
                  <Monitor className="w-4 h-4 mr-1" />
                  Desktop
                </Badge>
                <span className="text-sm text-gray-600">
                  Tamaño actual: {screenSize}
                </span>
                <Badge variant="outline">
                  Médico:{" "}
                  {medicalResponsive.isCompact ? "Compacto" : "Expandido"}
                </Badge>
              </div>

              <ResponsiveContainer>
                <ResponsiveImage
                  src="/api/placeholder/400/200"
                  alt="Imagen responsiva de demostración"
                  className="rounded-lg"
                  style={imageSize}
                />
              </ResponsiveContainer>

              <div
                className={`grid gap-2 ${tableConfig.compactMode ? "grid-cols-1" : "grid-cols-3"}`}
              >
                <div className="p-3 bg-blue-50 rounded">Elemento 1</div>
                <div className="p-3 bg-green-50 rounded">Elemento 2</div>
                <div className="p-3 bg-purple-50 rounded">Elemento 3</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-500" />
              Demostración de Accesibilidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleFocusDemo} size="sm">
                  Enfocar Primer Elemento
                </Button>
                <Button onClick={() => focusLast()} size="sm">
                  Enfocar Último Elemento
                </Button>
                <Button onClick={handleTrapFocusDemo} size="sm">
                  Atrapar Foco
                </Button>
                <Button onClick={handleRestoreFocus} size="sm">
                  Restaurar Foco
                </Button>
                <Button onClick={handleKeyboardNavDemo} size="sm">
                  Navegación Teclado
                </Button>
                <Button
                  onClick={() =>
                    announce("Mensaje de prueba para lector de pantalla")
                  }
                  size="sm"
                >
                  Anunciar Mensaje
                </Button>
                <Button onClick={() => modalAccessibility.open()} size="sm">
                  Modal Accesible
                </Button>
              </div>

              <div
                role="region"
                aria-live="polite"
                aria-label="Región de anuncios"
                className="p-3 bg-gray-50 rounded-lg min-h-[40px]"
              >
                <span className="text-sm text-gray-600">
                  Los anuncios de accesibilidad aparecerán aquí
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card id="main-content">
          <CardHeader>
            <CardTitle>Demostración Interactiva</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="search" className="space-y-4">
              <TabsList
                className={`grid w-full ${navigation.tabsLayout}`}
                style={navigation.style}
              >
                <TabsTrigger value="search">Búsqueda</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="lazy">Lazy Loading</TabsTrigger>
                <TabsTrigger value="focus">Focus Manager</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-4">
                <Input
                  placeholder="Escribe para probar debounce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Campo de búsqueda con debounce"
                />
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p>
                    <strong>Término original:</strong> {searchTerm}
                  </p>
                  <p>
                    <strong>Término con debounce:</strong> {debouncedSearchTerm}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button onClick={handlePlayPause} size="sm">
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {isPlaying ? "Pausar" : "Reproducir"}
                  </Button>
                  <div className="flex items-center gap-2">
                    {volume > 0 ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) =>
                        handleVolumeChange(parseInt(e.target.value))
                      }
                      className="w-24"
                      aria-label="Control de volumen"
                    />
                    <span className="text-sm">{volume}%</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="lazy" className="space-y-4">
                <Button onClick={showLazyDemo} disabled={showLazyComponent}>
                  Cargar Componente Dinámico
                </Button>
                {showLazyComponent && (
                  <Suspense fallback={<div>Cargando componente...</div>}>
                    <LazyDemoComponent />
                  </Suspense>
                )}
              </TabsContent>

              <TabsContent value="focus" className="space-y-4">
                <FocusManager>
                  <div className="space-y-2">
                    <Button>Botón 1</Button>
                    <Button>Botón 2</Button>
                    <Button>Botón 3</Button>
                    <Input placeholder="Campo de entrada" />
                  </div>
                </FocusManager>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Estado de Utilidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Responsive: Activo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Performance: Monitoreando</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Accessibility: Habilitado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Debounce: Funcionando</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Lazy Loading: Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Focus Management: Activo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AccessibilityProvider>
  );
};

export default CompleteUtilitiesDemo;
