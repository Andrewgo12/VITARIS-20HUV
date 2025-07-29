import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  showBackButton?: boolean;
  onBack?: () => void;
  loading?: boolean;
}

// Auto-generate breadcrumbs based on current path
const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/', icon: Home }
  ];

  const pathMap: Record<string, string> = {
    'system': 'Sistema',
    'medical': 'Módulos Médicos',
    'admissions': 'Gestión de Admisiones',
    'icu-monitoring': 'Monitoreo UCI',
    'emergency-protocols': 'Protocolos de Emergencia',
    'surgeries': 'Cirugías Programadas',
    'labs-imaging': 'Laboratorio e Imágenes',
    'pharmacy': 'Farmacia',
    'consultations': 'Consultas',
    'telemedicine': 'Telemedicina',
    'reports': 'Reportes Médicos',
    'team-communication': 'Comunicación del Equipo',
    'appointments': 'Citas Médicas',
    'education': 'Educación Médica',
    'huv-dashboard': 'Dashboard HUV',
    'huv-dashboard-advanced': 'Dashboard Avanzado',
    'patient': 'Paciente',
    'medical-tools': 'Herramientas Médicas',
    'eps-form': 'Formulario EPS',
    'login': 'Iniciar Sesión',
    'profile': 'Perfil de Usuario',
    'settings': 'Configuración',
    'demo': 'Demostración',
    'flowchart': 'Diagramas de Flujo',
    'frontend': 'Frontend',
    'backend': 'Backend'
  };

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      href: currentPath,
      current: index === pathSegments.length - 1
    });
  });

  return breadcrumbs;
};

export default function BreadcrumbNavigation({ 
  items, 
  showBackButton = true, 
  onBack,
  loading = false 
}: BreadcrumbNavigationProps) {
  const location = useLocation();
  
  // Use provided items or auto-generate from path
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname);
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border" aria-label="Breadcrumb">
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mr-2 h-8 w-8 p-0"
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      {loading && (
        <div className="flex items-center space-x-2 mr-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-xs">Cargando...</span>
        </div>
      )}
      
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const IconComponent = item.icon;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
              )}
              
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100"
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span 
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
                    isLast 
                      ? 'text-foreground font-medium bg-blue-50 border border-blue-200' 
                      : 'text-muted-foreground'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Specialized breadcrumb for medical sections
export function MedicalBreadcrumb({ 
  currentSection, 
  patientName, 
  loading = false 
}: { 
  currentSection: string; 
  patientName?: string;
  loading?: boolean;
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Sistema Médico', href: '/system' },
    { label: 'Módulos Médicos', href: '/medical' },
  ];

  if (patientName) {
    items.push({ label: `Paciente: ${patientName}`, current: false });
  }

  items.push({ label: currentSection, current: true });

  return <BreadcrumbNavigation items={items} loading={loading} />;
}

// Hook for programmatic breadcrumb management
export function useBreadcrumb() {
  const location = useLocation();
  
  const getCurrentBreadcrumbs = () => {
    return generateBreadcrumbsFromPath(location.pathname);
  };
  
  const getPageTitle = () => {
    const breadcrumbs = getCurrentBreadcrumbs();
    const currentPage = breadcrumbs[breadcrumbs.length - 1];
    return currentPage?.label || 'Vital Red';
  };
  
  return {
    getCurrentBreadcrumbs,
    getPageTitle,
  };
}
