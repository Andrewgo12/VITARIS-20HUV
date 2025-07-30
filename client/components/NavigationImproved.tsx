import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut, 
  Home, 
  ChevronDown,
  Bell,
  HeartPulse,
  Stethoscope,
  Hospital,
  Activity,
  Users,
  Calendar,
  FileText,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationImprovedProps {
  userName?: string;
  userRole?: string;
  showFullNav?: boolean;
  notifications?: number;
}

const NavigationImproved: React.FC<NavigationImprovedProps> = ({ 
  userName = "Usuario Médico", 
  userRole = "Especialista",
  showFullNav = true,
  notifications = 0
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const quickAccess = [
    {
      icon: Stethoscope,
      label: "Dashboard Médico",
      path: "/medical-dashboard-improved",
      color: "text-blue-600"
    },
    {
      icon: Hospital,
      label: "Dashboard HUV",
      path: "/huv-dashboard",
      color: "text-emerald-600"
    },
    {
      icon: Users,
      label: "Pacientes",
      path: "/medical/active-patients",
      color: "text-purple-600"
    },
    {
      icon: Calendar,
      label: "Citas",
      path: "/medical/appointments",
      color: "text-amber-600"
    },
    {
      icon: Activity,
      label: "Emergencias",
      path: "/medical/emergency-protocols",
      color: "text-red-600"
    },
    {
      icon: FileText,
      label: "Reportes",
      path: "/medical/reports",
      color: "text-slate-600"
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  if (!showFullNav) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => handleNavigation('/')}
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Inicio
        </Button>
      </div>
    );
  }

  return (
    <nav className="flex items-center justify-between w-full">
      {/* Brand */}
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => handleNavigation('/')}
      >
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <HeartPulse className="w-6 h-6 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-foreground">Vital Red</h1>
          <p className="text-xs text-muted-foreground">Sistema Médico</p>
        </div>
      </div>

      {/* Quick Navigation - Hidden on mobile */}
      <div className="hidden lg:flex items-center gap-1">
        {quickAccess.slice(0, 4).map((item) => {
          const isActive = isActivePath(item.path);
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "gap-2 transition-all duration-200",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4",
                isActive ? "text-white" : item.color
              )} />
              <span className="hidden xl:block">{item.label}</span>
            </Button>
          );
        })}
        
        {/* More menu for additional items */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              Más
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {quickAccess.slice(4).map((item) => (
              <DropdownMenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="gap-2 cursor-pointer"
              >
                <item.icon className={cn("w-4 h-4", item.color)} />
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side - Notifications & User Menu */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="outline" size="sm" className="relative gap-2">
          <Bell className="w-4 h-4" />
          {notifications > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs min-w-[1.25rem] h-5">
              {notifications > 9 ? '9+' : notifications}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-10">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium">{userName}</div>
                <div className="text-xs text-muted-foreground">{userRole}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            {/* User Info Header */}
            <div className="px-3 py-2 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                  {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-foreground">{userName}</div>
                  <div className="text-sm text-muted-foreground">{userRole}</div>
                </div>
              </div>
            </div>

            {/* Quick Access - Mobile */}
            <div className="lg:hidden">
              <div className="px-3 py-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Acceso Rápido
                </div>
                {quickAccess.slice(0, 3).map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="gap-2 cursor-pointer py-2"
                  >
                    <item.icon className={cn("w-4 h-4", item.color)} />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
            </div>

            {/* Standard Menu Items */}
            <DropdownMenuItem
              onClick={() => handleNavigation('/profile')}
              className="gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              Mi Perfil
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleNavigation('/settings')}
              className="gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Configuración
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavigationImproved;
