// Residents service - API calls for resident management
// Handles all CRUD operations for residents in the healthcare system

import { api } from './api';
import { 
  Resident, 
  CreateResidentData, 
  UpdateResidentData, 
  ResidentFilters,
  ApiResponse, 
  PaginatedResponse 
} from '../types';

class ResidentsService {
  private readonly endpoint = '/residents';

  async getAll(filters: ResidentFilters = {}): Promise<PaginatedResponse<Resident>> {
    const params: Record<string, string> = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.careLevel && filters.careLevel !== 'all') params.careLevel = filters.careLevel;
    if (filters.facility && filters.facility !== 'all') params.facility = filters.facility;
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.page) params.page = filters.page.toString();
    if (filters.pageSize) params.pageSize = filters.pageSize.toString();
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    return api.getPaginated<Resident>(this.endpoint, params);
  }

  async getById(id: string): Promise<ApiResponse<Resident>> {
    return api.getApiResponse<Resident>(`${this.endpoint}/${id}`);
  }

  async create(data: CreateResidentData): Promise<ApiResponse<Resident>> {
    return api.postApiResponse<Resident>(this.endpoint, data);
  }

  async update(id: string, data: UpdateResidentData): Promise<ApiResponse<Resident>> {
    return api.putApiResponse<Resident>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.deleteApiResponse<{ success: boolean }>(`${this.endpoint}/${id}`);
  }

  // Additional resident-specific methods
  async uploadPhoto(id: string, file: File): Promise<ApiResponse<{ photoUrl: string }>> {
    const response = await api.uploadFile(`${this.endpoint}/${id}/photo`, file);
    return {
      ...response,
      data: { photoUrl: response.data.url }
    };
  }

  async getMedicalHistory(id: string): Promise<ApiResponse<Resident['medications']>> {
    return api.getApiResponse<Resident['medications']>(`${this.endpoint}/${id}/medical-history`);
  }

  async updateMedicalHistory(id: string, medications: Resident['medications']): Promise<ApiResponse<Resident['medications']>> {
    return api.putApiResponse<Resident['medications']>(`${this.endpoint}/${id}/medical-history`, { medications });
  }

  async getEmergencyContacts(id: string): Promise<ApiResponse<Resident['emergencyContacts']>> {
    return api.getApiResponse<Resident['emergencyContacts']>(`${this.endpoint}/${id}/emergency-contacts`);
  }

  async updateEmergencyContacts(id: string, contacts: Resident['emergencyContacts']): Promise<ApiResponse<Resident['emergencyContacts']>> {
    return api.putApiResponse<Resident['emergencyContacts']>(`${this.endpoint}/${id}/emergency-contacts`, { emergencyContacts: contacts });
  }

  // Search methods
  async searchByName(name: string): Promise<ApiResponse<Resident[]>> {
    return api.getApiResponse<Resident[]>(`${this.endpoint}/search`, { name });
  }

  async searchByRoom(roomNumber: string): Promise<ApiResponse<Resident[]>> {
    return api.getApiResponse<Resident[]>(`${this.endpoint}/search`, { roomNumber });
  }

  // Care level methods
  async getByCareLevel(careLevel: Resident['careLevel']): Promise<PaginatedResponse<Resident>> {
    return api.getPaginated<Resident>(this.endpoint, { careLevel });
  }

  // Medical alerts
  async updateMedicalAlerts(id: string, alerts: Resident['medicalAlerts']): Promise<ApiResponse<Resident>> {
    return api.patch<ApiResponse<Resident>>(`${this.endpoint}/${id}/medical-alerts`, { medicalAlerts: alerts });
  }

  // Reports and statistics
  async getStatistics(): Promise<ApiResponse<{
    totalResidents: number;
    byCareLevelCounts: Record<string, number>;
    byFacilityCounts: Record<string, number>;
    averageAge: number;
    medicalAlertsCount: number;
  }>> {
    return api.getApiResponse(`${this.endpoint}/statistics`);
  }
}

export const residentsService = new ResidentsService();
export { ResidentsService };