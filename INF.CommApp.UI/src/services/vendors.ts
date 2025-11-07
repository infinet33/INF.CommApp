// Vendors service - API calls for vendor management
import { api } from './api';
import { Vendor, CreateVendorData, UpdateVendorData, VendorFilters, ApiResponse, PaginatedResponse } from '../types';

class VendorsService {
  private readonly endpoint = '/vendors';

  async getAll(filters: VendorFilters = {}): Promise<PaginatedResponse<Vendor>> {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.type && filters.type !== 'all') params.type = filters.type;
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.page) params.page = filters.page.toString();
    if (filters.pageSize) params.pageSize = filters.pageSize.toString();
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    return api.getPaginated<Vendor>(this.endpoint, params);
  }

  async getById(id: string): Promise<ApiResponse<Vendor>> {
    return api.getApiResponse<Vendor>(`${this.endpoint}/${id}`);
  }

  async create(data: CreateVendorData): Promise<ApiResponse<Vendor>> {
    return api.postApiResponse<Vendor>(this.endpoint, data);
  }

  async update(id: string, data: UpdateVendorData): Promise<ApiResponse<Vendor>> {
    return api.putApiResponse<Vendor>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.deleteApiResponse<{ success: boolean }>(`${this.endpoint}/${id}`);
  }

  async getByType(type: Vendor['type']): Promise<PaginatedResponse<Vendor>> {
    return api.getPaginated<Vendor>(this.endpoint, { type });
  }

  async searchByName(name: string): Promise<ApiResponse<Vendor[]>> {
    return api.getApiResponse<Vendor[]>(`${this.endpoint}/search`, { name });
  }

  async getStatistics(): Promise<ApiResponse<{
    totalVendors: number;
    byTypeCounts: Record<string, number>;
    activeVendorsCount: number;
    averageRating: number;
  }>> {
    return api.getApiResponse(`${this.endpoint}/statistics`);
  }
}

export const vendorsService = new VendorsService();
export { VendorsService };