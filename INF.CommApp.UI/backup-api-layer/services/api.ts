// Base API service for Valencia Assisted Living Dashboard
// Handles HTTP requests, authentication, and error handling

import { ApiResponse, PaginatedResponse, ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  private getAuthToken(): string | null {
    // TODO: Implement token retrieval from localStorage or auth context
    return localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || `HTTP error ${response.status}: ${response.statusText}`,
          code: errorData.code || response.status.toString(),
          details: errorData.details || {},
        };
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Network error: Unable to connect to server',
          code: 'NETWORK_ERROR',
          details: { originalError: error.message },
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Helper methods for common response patterns
  async getApiResponse<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.get<ApiResponse<T>>(endpoint, params);
  }

  async getPaginated<T>(endpoint: string, params?: Record<string, any>): Promise<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(endpoint, params);
  }

  async postApiResponse<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.post<ApiResponse<T>>(endpoint, data);
  }

  async putApiResponse<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.put<ApiResponse<T>>(endpoint, data);
  }

  async deleteApiResponse<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.delete<ApiResponse<T>>(endpoint);
  }

  // Upload file helper
  async uploadFile(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || `Upload failed: ${response.statusText}`,
        code: errorData.code || 'UPLOAD_ERROR',
        details: errorData.details || {},
      } as ApiError;
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get('/health');
  }
}

export const api = new ApiService();

// Export singleton instance and class for testing
export { ApiService };
export type { ApiError };