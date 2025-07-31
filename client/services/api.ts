import { SYSTEM_CONFIG } from '../config/system';

// API Base URL
const API_BASE_URL = SYSTEM_CONFIG.api.baseUrl;

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    permissions: string[];
    department: string;
  };
}

export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  phone?: string;
  email?: string;
  status: string;
  vitalSigns?: {
    heartRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
    lastUpdated: Date;
  };
}

export interface VitalSigns {
  patientId: string;
  patientName: string;
  documentNumber: string;
  vitalSigns: {
    heartRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
    lastUpdated: Date;
  };
}

export interface Notification {
  id: string;
  type: 'emergency' | 'warning' | 'info' | 'success' | 'appointment' | 'message' | 'vital_signs' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// API Client Class
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('vitaris_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('vitaris_token', this.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('vitaris_token');
    }
  }

  async verifyToken(): Promise<ApiResponse<{ user: LoginResponse['user'] }>> {
    return this.request('/auth/verify-token');
  }

  // Patient methods
  async getPatients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<{ patients: Patient[]; pagination: any }>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/patients${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  async getPatient(id: string): Promise<ApiResponse<{ patient: Patient }>> {
    return this.request(`/patients/${id}`);
  }

  async createPatient(patient: Partial<Patient>): Promise<ApiResponse<{ patient: Patient }>> {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<ApiResponse<{ patient: Patient }>> {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
  }

  // Medical methods
  async getVitalSigns(): Promise<ApiResponse<{ vitalSigns: VitalSigns[]; timestamp: Date; totalPatients: number }>> {
    return this.request('/medical/vital-signs');
  }

  async getMetrics(): Promise<ApiResponse<any>> {
    return this.request('/medical/metrics');
  }

  async getAdmissions(): Promise<ApiResponse<any>> {
    return this.request('/medical/admissions');
  }

  async getSurgeries(): Promise<ApiResponse<any>> {
    return this.request('/medical/surgeries');
  }

  // Notification methods
  async getNotifications(params?: {
    unreadOnly?: boolean;
    limit?: number;
    type?: string;
  }): Promise<ApiResponse<{ notifications: Notification[]; unreadCount: number; total: number }>> {
    const searchParams = new URLSearchParams();
    
    if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type);

    const queryString = searchParams.toString();
    const endpoint = `/notifications${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse> {
    return this.request(`/notifications/${id}/read`, { method: 'PUT' });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse> {
    return this.request('/notifications/read-all', { method: 'PUT' });
  }

  // Appointment methods
  async getAppointments(): Promise<ApiResponse<any>> {
    return this.request('/appointments');
  }

  // Pharmacy methods
  async getMedications(): Promise<ApiResponse<any>> {
    return this.request('/pharmacy/medications');
  }

  // User methods
  async getUsers(): Promise<ApiResponse<any>> {
    return this.request('/users');
  }

  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('/users/profile');
  }

  // System methods
  async getSystemMetrics(): Promise<ApiResponse<any>> {
    return this.request('/system/metrics');
  }

  async getSystemHealth(): Promise<ApiResponse<any>> {
    return this.request('/health', { method: 'GET' });
  }

  // Reports methods
  async getDashboardReports(): Promise<ApiResponse<any>> {
    return this.request('/reports/dashboard');
  }

  // Emergency alerts methods
  async getEmergencyAlerts(): Promise<ApiResponse<any>> {
    return this.request('/medical/emergency-alerts');
  }

  // Laboratory and imaging methods
  async getLabsAndImaging(): Promise<ApiResponse<any>> {
    return this.request('/medical/labs-imaging');
  }

  // Telemedicine methods
  async getTelemedicineSessions(): Promise<ApiResponse<any>> {
    return this.request('/medical/telemedicine');
  }

  async createTelemedicineSession(session: any): Promise<ApiResponse<any>> {
    return this.request('/medical/telemedicine', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  }

  // Inventory methods
  async getInventory(): Promise<ApiResponse<any>> {
    return this.request('/inventory');
  }

  async updateInventoryItem(id: string, item: any): Promise<ApiResponse<any>> {
    return this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  // Billing methods
  async getBilling(): Promise<ApiResponse<any>> {
    return this.request('/billing');
  }

  async createBill(bill: any): Promise<ApiResponse<any>> {
    return this.request('/billing', {
      method: 'POST',
      body: JSON.stringify(bill),
    });
  }

  async updateBill(id: string, bill: any): Promise<ApiResponse<any>> {
    return this.request(`/billing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bill),
    });
  }

  // Quality metrics methods
  async getQualityMetrics(): Promise<ApiResponse<any>> {
    return this.request('/quality/metrics');
  }

  // Audit logs methods
  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.action) searchParams.append('action', params.action);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const queryString = searchParams.toString();
    const endpoint = `/audit/logs${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  // Advanced patient methods
  async updatePatientVitalSigns(id: string, vitalSigns: any): Promise<ApiResponse<any>> {
    return this.request(`/patients/${id}/vital-signs`, {
      method: 'PUT',
      body: JSON.stringify(vitalSigns),
    });
  }

  async addPatientNote(id: string, note: { content: string; isPrivate?: boolean }): Promise<ApiResponse<any>> {
    return this.request(`/patients/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async getPatientHistory(id: string): Promise<ApiResponse<any>> {
    return this.request(`/patients/${id}/history`);
  }

  async searchPatients(query: string, type?: 'name' | 'document' | 'email' | 'phone'): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    if (type) searchParams.append('type', type);

    return this.request(`/patients/search?${searchParams.toString()}`);
  }

  // Advanced appointment methods
  async createAppointment(appointment: any): Promise<ApiResponse<any>> {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }

  async updateAppointment(id: string, appointment: any): Promise<ApiResponse<any>> {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
  }

  async cancelAppointment(id: string, reason: string): Promise<ApiResponse<any>> {
    return this.request(`/appointments/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  // Advanced user methods
  async createUser(user: any): Promise<ApiResponse<any>> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: any): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deactivateUser(id: string): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}/deactivate`, {
      method: 'PUT',
    });
  }

  async resetUserPassword(id: string): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}/reset-password`, {
      method: 'POST',
    });
  }

  // System configuration methods
  async getSystemConfig(): Promise<ApiResponse<any>> {
    return this.request('/system/config');
  }

  async updateSystemConfig(config: any): Promise<ApiResponse<any>> {
    return this.request('/system/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async createBackup(): Promise<ApiResponse<any>> {
    return this.request('/system/backup', {
      method: 'POST',
    });
  }

  async restoreBackup(backupId: string): Promise<ApiResponse<any>> {
    return this.request('/system/restore', {
      method: 'POST',
      body: JSON.stringify({ backupId }),
    });
  }

  // File upload methods
  async uploadFile(file: File, type: 'patient' | 'user' | 'system'): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/files/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    });
  }

  async deleteFile(fileId: string): Promise<ApiResponse<any>> {
    return this.request(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual methods for convenience
export const authApi = {
  login: (credentials: LoginRequest) => apiClient.login(credentials),
  logout: () => apiClient.logout(),
  verifyToken: () => apiClient.verifyToken(),
};

export const patientsApi = {
  getAll: (params?: Parameters<typeof apiClient.getPatients>[0]) => apiClient.getPatients(params),
  getById: (id: string) => apiClient.getPatient(id),
  create: (patient: Partial<Patient>) => apiClient.createPatient(patient),
  update: (id: string, patient: Partial<Patient>) => apiClient.updatePatient(id, patient),
};

export const medicalApi = {
  getVitalSigns: () => apiClient.getVitalSigns(),
  getMetrics: () => apiClient.getMetrics(),
  getAdmissions: () => apiClient.getAdmissions(),
  getSurgeries: () => apiClient.getSurgeries(),
};

export const notificationsApi = {
  getAll: (params?: Parameters<typeof apiClient.getNotifications>[0]) => apiClient.getNotifications(params),
  markAsRead: (id: string) => apiClient.markNotificationAsRead(id),
  markAllAsRead: () => apiClient.markAllNotificationsAsRead(),
};

export const systemApi = {
  getMetrics: () => apiClient.getSystemMetrics(),
  getHealth: () => apiClient.getSystemHealth(),
  getConfig: () => apiClient.getSystemConfig(),
  updateConfig: (config: any) => apiClient.updateSystemConfig(config),
  createBackup: () => apiClient.createBackup(),
  restoreBackup: (backupId: string) => apiClient.restoreBackup(backupId),
};

export const emergencyApi = {
  getAlerts: () => apiClient.getEmergencyAlerts(),
};

export const labsApi = {
  getLabsAndImaging: () => apiClient.getLabsAndImaging(),
};

export const telemedicineApi = {
  getSessions: () => apiClient.getTelemedicineSessions(),
  createSession: (session: any) => apiClient.createTelemedicineSession(session),
};

export const inventoryApi = {
  getAll: () => apiClient.getInventory(),
  updateItem: (id: string, item: any) => apiClient.updateInventoryItem(id, item),
};

export const billingApi = {
  getAll: () => apiClient.getBilling(),
  create: (bill: any) => apiClient.createBill(bill),
  update: (id: string, bill: any) => apiClient.updateBill(id, bill),
};

export const qualityApi = {
  getMetrics: () => apiClient.getQualityMetrics(),
};

export const auditApi = {
  getLogs: (params?: Parameters<typeof apiClient.getAuditLogs>[0]) => apiClient.getAuditLogs(params),
};

export const filesApi = {
  upload: (file: File, type: 'patient' | 'user' | 'system') => apiClient.uploadFile(file, type),
  delete: (fileId: string) => apiClient.deleteFile(fileId),
};

// Enhanced exports with all methods
export const enhancedPatientsApi = {
  ...patientsApi,
  updateVitalSigns: (id: string, vitalSigns: any) => apiClient.updatePatientVitalSigns(id, vitalSigns),
  addNote: (id: string, note: { content: string; isPrivate?: boolean }) => apiClient.addPatientNote(id, note),
  getHistory: (id: string) => apiClient.getPatientHistory(id),
  search: (query: string, type?: 'name' | 'document' | 'email' | 'phone') => apiClient.searchPatients(query, type),
};

export const enhancedAppointmentsApi = {
  getAll: () => apiClient.getAppointments(),
  create: (appointment: any) => apiClient.createAppointment(appointment),
  update: (id: string, appointment: any) => apiClient.updateAppointment(id, appointment),
  cancel: (id: string, reason: string) => apiClient.cancelAppointment(id, reason),
};

export const enhancedUsersApi = {
  getAll: () => apiClient.getUsers(),
  getProfile: () => apiClient.getUserProfile(),
  create: (user: any) => apiClient.createUser(user),
  update: (id: string, user: any) => apiClient.updateUser(id, user),
  deactivate: (id: string) => apiClient.deactivateUser(id),
  resetPassword: (id: string) => apiClient.resetUserPassword(id),
};

// Complete API interface
export const vitarisApi = {
  auth: authApi,
  patients: enhancedPatientsApi,
  medical: medicalApi,
  notifications: notificationsApi,
  appointments: enhancedAppointmentsApi,
  users: enhancedUsersApi,
  system: systemApi,
  emergency: emergencyApi,
  labs: labsApi,
  telemedicine: telemedicineApi,
  inventory: inventoryApi,
  billing: billingApi,
  quality: qualityApi,
  audit: auditApi,
  files: filesApi,
};

// Type definitions for better TypeScript support
export interface VitarisApiClient {
  auth: typeof authApi;
  patients: typeof enhancedPatientsApi;
  medical: typeof medicalApi;
  notifications: typeof notificationsApi;
  appointments: typeof enhancedAppointmentsApi;
  users: typeof enhancedUsersApi;
  system: typeof systemApi;
  emergency: typeof emergencyApi;
  labs: typeof labsApi;
  telemedicine: typeof telemedicineApi;
  inventory: typeof inventoryApi;
  billing: typeof billingApi;
  quality: typeof qualityApi;
  audit: typeof auditApi;
  files: typeof filesApi;
}

// Default export
export default apiClient;
