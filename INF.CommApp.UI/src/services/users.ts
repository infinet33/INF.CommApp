// Users service - API calls for external care provider management
import { api } from './api';
import { User, CreateUserData, UpdateUserData, UserFilters, ApiResponse, PaginatedResponse } from '../types';

class UsersService {
  private readonly endpoint = '/users';

  async getAll(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.role && filters.role !== 'all') params.role = filters.role;
    if (filters.organization && filters.organization !== 'all') params.organization = filters.organization;
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.page) params.page = filters.page.toString();
    if (filters.pageSize) params.pageSize = filters.pageSize.toString();
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    return api.getPaginated<User>(this.endpoint, params);
  }

  async getById(id: string): Promise<ApiResponse<User>> {
    return api.getApiResponse<User>(`${this.endpoint}/${id}`);
  }

  async create(data: CreateUserData): Promise<ApiResponse<User>> {
    return api.postApiResponse<User>(this.endpoint, data);
  }

  async update(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return api.putApiResponse<User>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.deleteApiResponse<{ success: boolean }>(`${this.endpoint}/${id}`);
  }

  async getByRole(role: User['role']): Promise<PaginatedResponse<User>> {
    return api.getPaginated<User>(this.endpoint, { role });
  }

  async searchByName(name: string): Promise<ApiResponse<User[]>> {
    return api.getApiResponse<User[]>(`${this.endpoint}/search`, { name });
  }

  async getStatistics(): Promise<ApiResponse<{
    totalUsers: number;
    byRoleCounts: Record<string, number>;
    activeUsersCount: number;
    recentLoginCount: number;
  }>> {
    return api.getApiResponse(`${this.endpoint}/statistics`);
  }
}

export const usersService = new UsersService();
export { UsersService };