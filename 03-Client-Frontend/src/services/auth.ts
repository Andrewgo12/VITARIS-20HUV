/**
 * Authentication Service for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { apiService, type User, type LoginCredentials } from './api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthListener = (state: AuthState) => void;

class AuthService {
  private state: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  };

  private listeners: AuthListener[] = [];

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        
        // Verify token is still valid
        const response = await apiService.getCurrentUser();
        
        if (response.success && response.data) {
          this.setState({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Token is invalid, clear storage
          this.clearAuth();
        }
      } else {
        this.setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.clearAuth();
    }
  }

  private setState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }

  // Public methods
  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    this.setState({ isLoading: true });

    try {
      const response = await apiService.login(credentials);

      if (response.success && response.data) {
        this.setState({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        this.setState({ isLoading: false });
        return { 
          success: false, 
          error: response.error || 'Error de autenticación' 
        };
      }
    } catch (error) {
      this.setState({ isLoading: false });
      return { 
        success: false, 
        error: 'Error de conexión' 
      };
    }
  }

  async logout(): Promise<void> {
    this.setState({ isLoading: true });
    
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async refreshUser(): Promise<void> {
    if (!this.state.isAuthenticated) return;

    try {
      const response = await apiService.getCurrentUser();
      
      if (response.success && response.data) {
        this.setState({ user: response.data });
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        // Token might be invalid
        this.clearAuth();
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }

  // Getters
  get currentUser(): User | null {
    return this.state.user;
  }

  get isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  get isLoading(): boolean {
    return this.state.isLoading;
  }

  get token(): string | null {
    return this.state.token;
  }

  // Role-based access control
  hasRole(role: string): boolean {
    return this.state.user?.role === role;
  }

  hasPermission(permission: string): boolean {
    return this.state.user?.permissions?.includes(permission) || false;
  }

  isMedicalEvaluator(): boolean {
    return this.hasRole('medical_evaluator');
  }

  isAdministrator(): boolean {
    return this.hasRole('administrator');
  }

  // Route access control
  canAccessRoute(route: string): boolean {
    if (!this.isAuthenticated) return false;

    const user = this.currentUser;
    if (!user) return false;

    // Define route permissions
    const routePermissions: Record<string, string[]> = {
      '/vital-red/dashboard': ['medical_evaluator', 'administrator'],
      '/vital-red/medical-cases': ['medical_evaluator', 'administrator'],
      '/vital-red/case-detail': ['medical_evaluator', 'administrator'],
      '/vital-red/request-history': ['medical_evaluator', 'administrator'],
      '/vital-red/user-management': ['administrator'],
      '/vital-red/email-monitor': ['administrator'],
      '/vital-red/email-config': ['administrator'],
    };

    const allowedRoles = routePermissions[route];
    if (!allowedRoles) return true; // Public route

    return allowedRoles.includes(user.role);
  }

  // Event listeners
  subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    
    // Immediately call with current state
    listener(this.state);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Utility methods
  getAuthHeader(): Record<string, string> {
    if (this.token) {
      return { Authorization: `Bearer ${this.token}` };
    }
    return {};
  }

  isTokenExpired(): boolean {
    if (!this.token) return true;

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  async ensureAuthenticated(): Promise<boolean> {
    if (!this.isAuthenticated) return false;
    
    if (this.isTokenExpired()) {
      this.clearAuth();
      return false;
    }

    return true;
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export types
export type { AuthState, AuthListener };

export default authService;
