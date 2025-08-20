/**
 * API Service for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { toast } from '@/components/ui/use-toast';

// Types
interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'medical_evaluator' | 'administrator';
  permissions: string[];
}

interface MedicalCase {
  id: string;
  patientName: string;
  patientId: string;
  diagnosis: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  submittedDate: string;
  evaluatorId?: string;
  notes?: string;
}

interface EmailData {
  id: string;
  subject: string;
  sender: string;
  receivedAt: string;
  status: 'pending' | 'processed' | 'error';
  patientName?: string;
  diagnosis?: string;
  attachments: number;
}

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';
const GMAIL_API_URL = 'http://localhost:8001';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: 'Error de API',
        description: errorMessage,
        variant: 'destructive',
      });

      return {
        data: null,
        success: false,
        error: errorMessage,
      };
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // Medical Cases
  async getMedicalCases(filters?: {
    status?: string;
    urgency?: string;
    evaluator?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<MedicalCase[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `/medical-cases${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<MedicalCase[]>(endpoint);
  }

  async getMedicalCase(id: string): Promise<ApiResponse<MedicalCase>> {
    return this.request<MedicalCase>(`/medical-cases/${id}`);
  }

  async updateMedicalCase(id: string, updates: Partial<MedicalCase>): Promise<ApiResponse<MedicalCase>> {
    return this.request<MedicalCase>(`/medical-cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async approveMedicalCase(id: string, notes?: string): Promise<ApiResponse<MedicalCase>> {
    return this.request<MedicalCase>(`/medical-cases/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async rejectMedicalCase(id: string, reason: string): Promise<ApiResponse<MedicalCase>> {
    return this.request<MedicalCase>(`/medical-cases/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Request History
  async getRequestHistory(filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `/requests/history${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<any[]>(endpoint);
  }

  // User Management
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users');
  }

  async createUser(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/dashboard/stats');
  }

  // Gmail Integration API
  async getGmailEmails(filters?: {
    status?: string;
    limit?: number;
    is_referral?: boolean;
  }): Promise<ApiResponse<EmailData[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }

    const endpoint = `${GMAIL_API_URL}/emails${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<EmailData[]>(endpoint);
  }

  async getGmailEmailDetails(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`${GMAIL_API_URL}/emails/${id}`);
  }

  async getGmailStatistics(): Promise<ApiResponse<any>> {
    return this.request<any>(`${GMAIL_API_URL}/statistics`);
  }

  async triggerGmailSync(): Promise<ApiResponse<any>> {
    return this.request<any>(`${GMAIL_API_URL}/service/sync`, {
      method: 'POST',
    });
  }

  async getGmailServiceStatus(): Promise<ApiResponse<any>> {
    return this.request<any>(`${GMAIL_API_URL}/service/status`);
  }

  // Referrals
  async getReferrals(filters?: {
    status?: string;
    specialty?: string;
    priority?: string;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `${GMAIL_API_URL}/referrals${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<any[]>(endpoint);
  }

  async updateReferral(id: string, updates: any): Promise<ApiResponse<any>> {
    return this.request<any>(`${GMAIL_API_URL}/referrals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Patients
  async getPatients(search?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const endpoint = `${GMAIL_API_URL}/patients${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<any[]>(endpoint);
  }

  async getPatientDetails(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`${GMAIL_API_URL}/patients/${id}`);
  }

  // File uploads
  async uploadFile(file: File, type: string): Promise<ApiResponse<{ url: string; id: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request<{ url: string; id: string }>('/files/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
      },
    });
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/notifications');
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  // Statistics
  async getStatistics(): Promise<ApiResponse<any>> {
    return this.request('/statistics');
  }

  // Medical Cases
  async getMedicalCases(params?: {
    status?: string;
    priority?: string;
    skip?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.priority) searchParams.append('priority', params.priority);
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const url = `/medical-cases${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.request(url);
  }

  async getMedicalCase(caseId: string): Promise<ApiResponse<any>> {
    return this.request(`/medical-cases/${caseId}`);
  }

  async updateMedicalCase(caseId: string, updates: any): Promise<ApiResponse<any>> {
    return this.request(`/medical-cases/${caseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async approveMedicalCase(caseId: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/medical-cases/${caseId}/approve`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async rejectMedicalCase(caseId: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/medical-cases/${caseId}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Users
  async getUsers(params?: {
    skip?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const url = `/users${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.request(url);
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: number, userData: any): Promise<ApiResponse<any>> {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Request History
  async getRequestHistory(params?: {
    skip?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    status?: string;
    patient_name?: string;
    referring_physician?: string;
    institution?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.patient_name) searchParams.append('patient_name', params.patient_name);
    if (params?.referring_physician) searchParams.append('referring_physician', params.referring_physician);
    if (params?.institution) searchParams.append('institution', params.institution);

    const url = `/request-history${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.request(url);
  }

  async getRequestAnalytics(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);

    const url = `/request-history/analytics${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.request(url);
  }

  // Admin Panel
  async getAdminDashboard(): Promise<ApiResponse<any>> {
    return this.request('/admin/dashboard');
  }

  async getAuditLogs(params?: {
    skip?: number;
    limit?: number;
    user_id?: number;
    action?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.user_id) searchParams.append('user_id', params.user_id.toString());
    if (params?.action) searchParams.append('action', params.action);
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);

    const url = `/admin/audit-logs${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.request(url);
  }

  // System Configuration
  async getSystemConfiguration(): Promise<ApiResponse<any>> {
    return this.request('/system/configuration');
  }

  async updateSystemConfiguration(config: any): Promise<ApiResponse<any>> {
    return this.request('/system/configuration', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async testSystemConnections(): Promise<ApiResponse<any>> {
    return this.request('/system/test-connection', {
      method: 'POST',
    });
  }

  // Backup Management
  async getBackups(): Promise<ApiResponse<any>> {
    return this.request('/backups');
  }

  async createBackup(backupData: any): Promise<ApiResponse<any>> {
    return this.request('/backups/create', {
      method: 'POST',
      body: JSON.stringify(backupData),
    });
  }

  async deleteBackup(backupId: string): Promise<ApiResponse<any>> {
    return this.request(`/backups/${backupId}`, {
      method: 'DELETE',
    });
  }

  async restoreBackup(backupId: string): Promise<ApiResponse<any>> {
    return this.request(`/backups/${backupId}/restore`, {
      method: 'POST',
    });
  }

  // Email Monitor
  async getEmails(params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);

    const url = `/emails${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.request(url);
  }

  async processEmails(): Promise<ApiResponse<any>> {
    return this.request('/emails/process', {
      method: 'POST',
    });
  }

  async retryEmailProcessing(emailId: string): Promise<ApiResponse<any>> {
    return this.request(`/emails/${emailId}/retry`, {
      method: 'POST',
    });
  }

  // Gmail Configuration
  async getGmailConfig(): Promise<ApiResponse<any>> {
    return this.request('/gmail/config');
  }

  async updateGmailConfig(config: any): Promise<ApiResponse<any>> {
    return this.request('/gmail/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async testGmailConnection(): Promise<ApiResponse<any>> {
    return this.request('/gmail/test-connection', {
      method: 'POST',
    });
  }

  // Additional methods for production readiness
  async verifyToken(): Promise<ApiResponse<any>> {
    return this.request('/auth/verify');
  }

  async getEmailDetail(emailId: string): Promise<ApiResponse<any>> {
    return this.request(`/emails/${emailId}`);
  }

  async createTemplate(templateData: any): Promise<ApiResponse<any>> {
    return this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateTemplate(templateId: string, templateData: any): Promise<ApiResponse<any>> {
    return this.request(`/templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  async deleteTemplate(templateId: string): Promise<ApiResponse<any>> {
    return this.request(`/templates/${templateId}`, {
      method: 'DELETE',
    });
  }

  async createConfigBackup(backupData: any): Promise<ApiResponse<any>> {
    return this.request('/system/config-backup', {
      method: 'POST',
      body: JSON.stringify(backupData),
    });
  }

  async restoreConfigBackup(backupId: string): Promise<ApiResponse<any>> {
    return this.request(`/system/config-backup/${backupId}/restore`, {
      method: 'POST',
    });
  }

  async getBackupSchedule(): Promise<ApiResponse<any>> {
    return this.request('/backups/schedule');
  }

  async updateBackupSchedule(scheduleData: any): Promise<ApiResponse<any>> {
    return this.request('/backups/schedule', {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  }

  // OAuth2 Configuration
  async getOAuth2Config(): Promise<ApiResponse<any>> {
    return this.request('/oauth2/config');
  }

  async updateOAuth2Config(config: any): Promise<ApiResponse<any>> {
    return this.request('/oauth2/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async testOAuth2Connection(): Promise<ApiResponse<any>> {
    return this.request('/oauth2/test-connection', {
      method: 'POST',
    });
  }

  // Navigation and User Info
  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request('/auth/verify');
  }

  // Additional Template Methods
  async getTemplates(): Promise<ApiResponse<any>> {
    return this.request('/templates');
  }

  // Additional System Methods
  async getSystemHealth(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }

  async getSystemStatus(): Promise<ApiResponse<any>> {
    return this.request('/api/system/status');
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export types
export type {
  ApiResponse,
  LoginCredentials,
  User,
  MedicalCase,
  EmailData,
};

export default apiService;
