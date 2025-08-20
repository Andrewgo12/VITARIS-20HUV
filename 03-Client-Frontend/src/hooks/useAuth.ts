/**
 * Authentication Hook for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type AuthState } from '@/services/auth';
import { ROUTES } from '@/utils/constants';
import { toast } from '@/components/ui/use-toast';

interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  isMedicalEvaluator: () => boolean;
  isAdministrator: () => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      setAuthState(state);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.login({ email, password });
      
      if (result.success) {
        toast({
          title: 'Inicio de sesión exitoso',
          description: 'Bienvenido a VITAL RED',
        });
        
        // Redirect based on user role
        const user = authService.currentUser;
        if (user?.role === 'administrator') {
          navigate(ROUTES.DASHBOARD);
        } else if (user?.role === 'medical_evaluator') {
          navigate(ROUTES.MEDICAL_CASES);
        } else {
          navigate(ROUTES.DASHBOARD);
        }
        
        return true;
      } else {
        toast({
          title: 'Error de autenticación',
          description: result.error || 'Credenciales inválidas',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor',
        variant: 'destructive',
      });
      return false;
    }
  }, [navigate]);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
      
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión exitosamente',
      });
      
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      await authService.refreshUser();
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, []);

  // Role and permission checks
  const hasRole = useCallback((role: string): boolean => {
    return authService.hasRole(role);
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    return authService.hasPermission(permission);
  }, []);

  const canAccessRoute = useCallback((route: string): boolean => {
    return authService.canAccessRoute(route);
  }, []);

  const isMedicalEvaluator = useCallback((): boolean => {
    return authService.isMedicalEvaluator();
  }, []);

  const isAdministrator = useCallback((): boolean => {
    return authService.isAdministrator();
  }, []);

  return {
    ...authState,
    login,
    logout,
    refreshUser,
    hasRole,
    hasPermission,
    canAccessRoute,
    isMedicalEvaluator,
    isAdministrator,
  };
};

export default useAuth;
