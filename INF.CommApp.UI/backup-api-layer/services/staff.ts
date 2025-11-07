// Staff service - API calls for staff management
// Handles all CRUD operations for staff members in the healthcare system

import { api } from './api';
import { 
  StaffMember, 
  CreateStaffData, 
  UpdateStaffData, 
  StaffFilters,
  ApiResponse, 
  PaginatedResponse 
} from '../types';

class StaffService {
  private readonly endpoint = '/staff';

  async getAll(filters: StaffFilters = {}): Promise<PaginatedResponse<StaffMember>> {
    const params: Record<string, string> = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.role && filters.role !== 'all') params.role = filters.role;
    if (filters.department && filters.department !== 'all') params.department = filters.department;
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.shift && filters.shift !== 'all') params.shift = filters.shift;
    if (filters.page) params.page = filters.page.toString();
    if (filters.pageSize) params.pageSize = filters.pageSize.toString();
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    return api.getPaginated<StaffMember>(this.endpoint, params);
  }

  async getById(id: string): Promise<ApiResponse<StaffMember>> {
    return api.getApiResponse<StaffMember>(`${this.endpoint}/${id}`);
  }

  async create(data: CreateStaffData): Promise<ApiResponse<StaffMember>> {
    return api.postApiResponse<StaffMember>(this.endpoint, data);
  }

  async update(id: string, data: UpdateStaffData): Promise<ApiResponse<StaffMember>> {
    return api.putApiResponse<StaffMember>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.deleteApiResponse<{ success: boolean }>(`${this.endpoint}/${id}`);
  }

  // Staff-specific methods
  async getByRole(role: StaffMember['role']): Promise<PaginatedResponse<StaffMember>> {
    return api.getPaginated<StaffMember>(this.endpoint, { role });
  }

  async getByDepartment(department: string): Promise<PaginatedResponse<StaffMember>> {
    return api.getPaginated<StaffMember>(this.endpoint, { department });
  }

  async getByShift(shift: StaffMember['shift']): Promise<PaginatedResponse<StaffMember>> {
    return api.getPaginated<StaffMember>(this.endpoint, { shift });
  }

  async updateStatus(id: string, status: StaffMember['status']): Promise<ApiResponse<StaffMember>> {
    return api.patch<ApiResponse<StaffMember>>(`${this.endpoint}/${id}/status`, { status });
  }

  async updateCertifications(id: string, certifications: string[]): Promise<ApiResponse<StaffMember>> {
    return api.patch<ApiResponse<StaffMember>>(`${this.endpoint}/${id}/certifications`, { certifications });
  }

  // Search methods
  async searchByName(name: string): Promise<ApiResponse<StaffMember[]>> {
    return api.getApiResponse<StaffMember[]>(`${this.endpoint}/search`, { name });
  }

  // Schedule management
  async getSchedule(id: string, startDate: string, endDate: string): Promise<ApiResponse<any[]>> {
    return api.getApiResponse<any[]>(`${this.endpoint}/${id}/schedule`, { startDate, endDate });
  }

  async updateSchedule(id: string, schedule: any[]): Promise<ApiResponse<any[]>> {
    return api.putApiResponse<any[]>(`${this.endpoint}/${id}/schedule`, { schedule });
  }

  // Reports and statistics
  async getStatistics(): Promise<ApiResponse<{
    totalStaff: number;
    byRoleCounts: Record<string, number>;
    byDepartmentCounts: Record<string, number>;
    byShiftCounts: Record<string, number>;
    activeStaffCount: number;
    certificationExpiringCount: number;
  }>> {
    return api.getApiResponse(`${this.endpoint}/statistics`);
  }

  // Performance tracking
  async getPerformanceMetrics(id: string): Promise<ApiResponse<{
    attendanceRate: number;
    patientSatisfactionScore: number;
    completedTraining: number;
    totalTraining: number;
    lastReviewDate: string;
    nextReviewDate: string;
  }>> {
    return api.getApiResponse(`${this.endpoint}/${id}/performance`);
  }
}

export const staffService = new StaffService();
export { StaffService };