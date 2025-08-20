/**
 * Protected Route Component - VITAL RED
 * Componente para proteger rutas con autenticación y control de roles
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiService } from '@/services/api';
import { useNotifications } from '@/components/ui/notification-system';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'administrator' | 'medical_evaluator' | 'viewer';
  adminOnly?: boolean;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  adminOnly = false
}) => {
  const location = useLocation();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('vital_red_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await apiService.verifyToken();
      
      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData);
        setIsAuthenticated(true);
        
        // Check if user is active
        if (!userData.isActive) {
          addNotification({
            type: 'warning',
            title: 'Cuenta desactivada',
            message: 'Su cuenta ha sido desactivada. Contacte al administrador.',
            priority: 'high'
          });
          handleLogout();
          return;
        }

        // Check role requirements
        if (adminOnly && userData.role !== 'administrator') {
          addNotification({
            type: 'warning',
            title: 'Acceso denegado',
            message: 'Esta sección requiere permisos de administrador.',
            priority: 'medium'
          });
          setLoading(false);
          return;
        }

        if (requiredRole && userData.role !== requiredRole && userData.role !== 'administrator') {
          addNotification({
            type: 'warning',
            title: 'Acceso denegado',
            message: `Esta sección requiere rol: ${getRoleDisplayName(requiredRole)}.`,
            priority: 'medium'
          });
          setLoading(false);
          return;
        }

      } else {
        // Token is invalid
        handleLogout();
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vital_red_token');
    localStorage.removeItem('vital_red_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'administrator': return 'Administrador';
      case 'medical_evaluator': return 'Evaluador Médico';
      case 'viewer': return 'Visualizador';
      default: return role;
    }
  };

  const hasRequiredPermissions = () => {
    if (!user) return false;
    
    // Administrators have access to everything
    if (user.role === 'administrator') return true;
    
    // Check admin-only routes
    if (adminOnly) return false;
    
    // Check specific role requirements
    if (requiredRole && user.role !== requiredRole) return false;
    
    return true;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Verificando autenticación...
          </h2>
          <p className="text-gray-600">
            Por favor espere mientras verificamos sus credenciales
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Authenticated but insufficient permissions
  if (!hasRequiredPermissions()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 mb-4">
              No tiene permisos suficientes para acceder a esta sección.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-800">
                    Permisos requeridos:
                  </p>
                  <p className="text-sm text-yellow-700">
                    {adminOnly 
                      ? 'Administrador' 
                      : requiredRole 
                        ? getRoleDisplayName(requiredRole)
                        : 'Usuario autenticado'
                    }
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Su rol actual: {getRoleDisplayName(user?.role || '')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated and authorized - render children
  return <>{children}</>;
};

export default ProtectedRoute;
