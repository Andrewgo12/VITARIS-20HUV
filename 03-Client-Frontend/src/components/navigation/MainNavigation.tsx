/**
 * Main Navigation Component - VITAL RED
 * Componente de navegación principal con control de roles
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  FileText,
  Users,
  History,
  Settings,
  Shield,
  Database,
  Mail,
  MailOpen,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  requiredRole?: string;
  adminOnly?: boolean;
  badge?: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

const MainNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const response = await apiService.verifyToken();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/vital-red/dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'medical-cases',
      label: 'Casos Médicos',
      path: '/vital-red/medical-cases',
      icon: <FileText className="w-5 h-5" />,
      requiredRole: 'medical_evaluator',
      badge: '3'
    },
    {
      id: 'request-history',
      label: 'Historial',
      path: '/vital-red/request-history',
      icon: <History className="w-5 h-5" />
    },
    {
      id: 'email-monitor',
      label: 'Monitor Emails',
      path: '/vital-red/email-monitor',
      icon: <Mail className="w-5 h-5" />
    },
    {
      id: 'user-management',
      label: 'Usuarios',
      path: '/vital-red/user-management',
      icon: <Users className="w-5 h-5" />,
      adminOnly: true
    },
    {
      id: 'supervision',
      label: 'Supervisión',
      path: '/vital-red/supervision',
      icon: <Shield className="w-5 h-5" />,
      adminOnly: true
    },
    {
      id: 'system-config',
      label: 'Configuración',
      path: '/vital-red/system-config',
      icon: <Settings className="w-5 h-5" />,
      adminOnly: true
    },
    {
      id: 'backup-management',
      label: 'Respaldos',
      path: '/vital-red/backup-management',
      icon: <Database className="w-5 h-5" />,
      adminOnly: true
    },
    {
      id: 'email-config',
      label: 'Config. Gmail',
      path: '/vital-red/email-config',
      icon: <MailOpen className="w-5 h-5" />,
      adminOnly: true
    }
  ];

  const hasPermission = (item: NavigationItem): boolean => {
    if (!user) return false;
    
    // Administrators have access to everything
    if (user.role === 'administrator') return true;
    
    // Check admin-only items
    if (item.adminOnly) return false;
    
    // Check specific role requirements
    if (item.requiredRole && user.role !== item.requiredRole) return false;
    
    return true;
  };

  const getVisibleItems = (): NavigationItem[] => {
    return navigationItems.filter(hasPermission);
  };

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('vital_red_token');
    localStorage.removeItem('vital_red_user');
    navigate('/login');
  };

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'administrator': return 'Administrador';
      case 'medical_evaluator': return 'Evaluador Médico';
      case 'viewer': return 'Visualizador';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case 'administrator': return 'bg-red-100 text-red-800';
      case 'medical_evaluator': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return null; // Don't show navigation if user is not loaded
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-lg"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
        w-64 border-r border-gray-200
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">VR</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">VITAL RED</h1>
              <p className="text-xs text-gray-600">Hospital Universitaria ESE</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </Badge>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-2">
          {getVisibleItems().map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false); // Close mobile menu
              }}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
                ${isActiveRoute(item.path)
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              VITAL RED v2.0.0
            </p>
            <p className="text-xs text-gray-400">
              Hospital Universitaria ESE
            </p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MainNavigation;
