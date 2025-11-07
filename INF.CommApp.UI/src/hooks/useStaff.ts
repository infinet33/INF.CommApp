// useStaff hook - React hook for staff management
// Provides state management and API integration for staff members

import { useState, useEffect, useCallback } from 'react';
import { staffService } from '../services/staff';
import { 
  StaffMember, 
  CreateStaffData, 
  UpdateStaffData, 
  StaffFilters,
  ApiError 
} from '../types';

interface UseStaffReturn {
  staff: StaffMember[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalStaff: number;
  statistics: {
    totalStaff: number;
    byRoleCounts: Record<string, number>;
    byDepartmentCounts: Record<string, number>;
    byShiftCounts: Record<string, number>;
    activeStaffCount: number;
    certificationExpiringCount: number;
  } | null;
  
  // Core CRUD operations
  fetchStaff: (filters?: StaffFilters) => Promise<void>;
  getStaffMember: (id: string) => Promise<StaffMember | null>;
  createStaffMember: (data: CreateStaffData) => Promise<StaffMember | null>;
  updateStaffMember: (id: string, data: UpdateStaffData) => Promise<StaffMember | null>;
  deleteStaffMember: (id: string) => Promise<boolean>;
  
  // Additional operations
  updateStatus: (id: string, status: StaffMember['status']) => Promise<boolean>;
  updateCertifications: (id: string, certifications: string[]) => Promise<boolean>;
  
  // Search operations
  searchByName: (name: string) => Promise<StaffMember[]>;
  getByRole: (role: StaffMember['role']) => Promise<StaffMember[]>;
  getByDepartment: (department: string) => Promise<StaffMember[]>;
  getByShift: (shift: StaffMember['shift']) => Promise<StaffMember[]>;
  
  // Schedule management
  getSchedule: (id: string, startDate: string, endDate: string) => Promise<any[] | null>;
  updateSchedule: (id: string, schedule: any[]) => Promise<boolean>;
  
  // Performance tracking
  getPerformanceMetrics: (id: string) => Promise<any | null>;
  
  // Statistics
  fetchStatistics: () => Promise<void>;
  
  // Utility methods
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export function useStaff(initialFilters: StaffFilters = {}): UseStaffReturn {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStaff, setTotalStaff] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<StaffFilters>(initialFilters);
  const [statistics, setStatistics] = useState<UseStaffReturn['statistics']>(null);

  const handleError = useCallback((err: unknown) => {
    const apiError = err as ApiError;
    const errorMessage = apiError.message || 'An unexpected error occurred';
    setError(errorMessage);
    console.error('Staff API Error:', apiError);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchStaff = useCallback(async (filters: StaffFilters = {}) => {
    setLoading(true);
    setError(null);
    
    const mergedFilters = { ...currentFilters, ...filters };
    setCurrentFilters(mergedFilters);
    
    try {
      const response = await staffService.getAll(mergedFilters);
      setStaff(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      setTotalStaff(response.total);
    } catch (err) {
      handleError(err);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, handleError]);

  const getStaffMember = useCallback(async (id: string): Promise<StaffMember | null> => {
    try {
      const response = await staffService.getById(id);
      return response.data;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [handleError]);

  const createStaffMember = useCallback(async (data: CreateStaffData): Promise<StaffMember | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await staffService.create(data);
      const newStaffMember = response.data;
      
      // Optimistically update the staff list
      setStaff(prev => [newStaffMember, ...prev]);
      setTotalStaff(prev => prev + 1);
      
      return newStaffMember;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateStaffMember = useCallback(async (id: string, data: UpdateStaffData): Promise<StaffMember | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await staffService.update(id, data);
      const updatedStaffMember = response.data;
      
      // Optimistically update the staff list
      setStaff(prev => prev.map(member => 
        member.id === id ? updatedStaffMember : member
      ));
      
      return updatedStaffMember;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const deleteStaffMember = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await staffService.delete(id);
      
      // Optimistically update the staff list
      setStaff(prev => prev.filter(member => member.id !== id));
      setTotalStaff(prev => prev - 1);
      
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateStatus = useCallback(async (id: string, status: StaffMember['status']): Promise<boolean> => {
    try {
      const response = await staffService.updateStatus(id, status);
      const updatedStaffMember = response.data;
      
      // Update the staff member in the list
      setStaff(prev => prev.map(member => 
        member.id === id ? updatedStaffMember : member
      ));
      
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [handleError]);

  const updateCertifications = useCallback(async (id: string, certifications: string[]): Promise<boolean> => {
    try {
      const response = await staffService.updateCertifications(id, certifications);
      const updatedStaffMember = response.data;
      
      // Update the staff member in the list
      setStaff(prev => prev.map(member => 
        member.id === id ? updatedStaffMember : member
      ));
      
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [handleError]);

  const searchByName = useCallback(async (name: string): Promise<StaffMember[]> => {
    try {
      const response = await staffService.searchByName(name);
      return response.data;
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  const getByRole = useCallback(async (role: StaffMember['role']): Promise<StaffMember[]> => {
    try {
      const response = await staffService.getByRole(role);
      return response.data;
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  const getByDepartment = useCallback(async (department: string): Promise<StaffMember[]> => {
    try {
      const response = await staffService.getByDepartment(department);
      return response.data;
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  const getByShift = useCallback(async (shift: StaffMember['shift']): Promise<StaffMember[]> => {
    try {
      const response = await staffService.getByShift(shift);
      return response.data;
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  const getSchedule = useCallback(async (id: string, startDate: string, endDate: string): Promise<any[] | null> => {
    try {
      const response = await staffService.getSchedule(id, startDate, endDate);
      return response.data;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [handleError]);

  const updateSchedule = useCallback(async (id: string, schedule: any[]): Promise<boolean> => {
    try {
      await staffService.updateSchedule(id, schedule);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [handleError]);

  const getPerformanceMetrics = useCallback(async (id: string): Promise<any | null> => {
    try {
      const response = await staffService.getPerformanceMetrics(id);
      return response.data;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [handleError]);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await staffService.getStatistics();
      setStatistics(response.data);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const refreshData = useCallback(async () => {
    await fetchStaff(currentFilters);
    await fetchStatistics();
  }, [fetchStaff, fetchStatistics, currentFilters]);

  // Load initial data on mount
  useEffect(() => {
    fetchStaff(initialFilters);
    fetchStatistics();
  }, []); // Only run on mount

  return {
    staff,
    loading,
    error,
    totalPages,
    currentPage,
    totalStaff,
    statistics,
    
    // Core CRUD operations
    fetchStaff,
    getStaffMember,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    
    // Additional operations
    updateStatus,
    updateCertifications,
    
    // Search operations
    searchByName,
    getByRole,
    getByDepartment,
    getByShift,
    
    // Schedule management
    getSchedule,
    updateSchedule,
    
    // Performance tracking
    getPerformanceMetrics,
    
    // Statistics
    fetchStatistics,
    
    // Utility methods
    refreshData,
    clearError,
  };
}