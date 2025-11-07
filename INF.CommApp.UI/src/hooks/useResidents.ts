// useResidents hook - React hook for resident management
// Provides state management and API integration for residents

import { useState, useEffect, useCallback } from 'react';
import { residentsService } from '../services/residents';
import { 
  Resident, 
  CreateResidentData, 
  UpdateResidentData, 
  ResidentFilters,
  ApiError 
} from '../types';

interface UseResidentsReturn {
  residents: Resident[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalResidents: number;
  statistics: {
    totalResidents: number;
    byCareLevelCounts: Record<string, number>;
    byFacilityCounts: Record<string, number>;
    averageAge: number;
    medicalAlertsCount: number;
  } | null;
  
  // Core CRUD operations
  fetchResidents: (filters?: ResidentFilters) => Promise<void>;
  getResident: (id: string) => Promise<Resident | null>;
  createResident: (data: CreateResidentData) => Promise<Resident | null>;
  updateResident: (id: string, data: UpdateResidentData) => Promise<Resident | null>;
  deleteResident: (id: string) => Promise<boolean>;
  
  // Additional operations
  uploadPhoto: (id: string, file: File) => Promise<string | null>;
  updateMedicalHistory: (id: string, medications: Resident['medications']) => Promise<boolean>;
  updateEmergencyContacts: (id: string, contacts: Resident['emergencyContacts']) => Promise<boolean>;
  updateMedicalAlerts: (id: string, alerts: Resident['medicalAlerts']) => Promise<boolean>;
  
  // Search operations
  searchByName: (name: string) => Promise<Resident[]>;
  searchByRoom: (roomNumber: string) => Promise<Resident[]>;
  
  // Statistics
  fetchStatistics: () => Promise<void>;
  
  // Utility methods
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export function useResidents(initialFilters: ResidentFilters = {}): UseResidentsReturn {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResidents, setTotalResidents] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<ResidentFilters>(initialFilters);
  const [statistics, setStatistics] = useState<UseResidentsReturn['statistics']>(null);

  const handleError = useCallback((err: unknown) => {
    const apiError = err as ApiError;
    const errorMessage = apiError.message || 'An unexpected error occurred';
    setError(errorMessage);
    console.error('Residents API Error:', apiError);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchResidents = useCallback(async (filters: ResidentFilters = {}) => {
    setLoading(true);
    setError(null);
    
    const mergedFilters = { ...currentFilters, ...filters };
    setCurrentFilters(mergedFilters);
    
    try {
      const response = await residentsService.getAll(mergedFilters);
      setResidents(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      setTotalResidents(response.total);
    } catch (err) {
      handleError(err);
      setResidents([]);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, handleError]);

  const getResident = useCallback(async (id: string): Promise<Resident | null> => {
    try {
      const response = await residentsService.getById(id);
      return response.data;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [handleError]);

  const createResident = useCallback(async (data: CreateResidentData): Promise<Resident | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await residentsService.create(data);
      const newResident = response.data;
      
      // Optimistically update the residents list
      setResidents(prev => [newResident, ...prev]);
      setTotalResidents(prev => prev + 1);
      
      return newResident;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateResident = useCallback(async (id: string, data: UpdateResidentData): Promise<Resident | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await residentsService.update(id, data);
      const updatedResident = response.data;
      
      // Optimistically update the residents list
      setResidents(prev => prev.map(resident => 
        resident.id === id ? updatedResident : resident
      ));
      
      return updatedResident;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const deleteResident = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await residentsService.delete(id);
      
      // Optimistically update the residents list
      setResidents(prev => prev.filter(resident => resident.id !== id));
      setTotalResidents(prev => prev - 1);
      
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const uploadPhoto = useCallback(async (id: string, file: File): Promise<string | null> => {
    try {
      const response = await residentsService.uploadPhoto(id, file);
      const photoUrl = response.data.photoUrl;
      
      // Update the resident in the list with the new photo URL
      setResidents(prev => prev.map(resident => 
        resident.id === id ? { ...resident, photo: photoUrl } : resident
      ));
      
      return photoUrl;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [handleError]);

  const updateMedicalHistory = useCallback(async (id: string, medications: Resident['medications']): Promise<boolean> => {
    try {
      await residentsService.updateMedicalHistory(id, medications);
      
      // Update the resident in the list
      setResidents(prev => prev.map(resident => 
        resident.id === id ? { ...resident, medications } : resident
      ));
      
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [handleError]);

  const updateEmergencyContacts = useCallback(async (id: string, contacts: Resident['emergencyContacts']): Promise<boolean> => {
    try {
      await residentsService.updateEmergencyContacts(id, contacts);
      
      // Update the resident in the list
      setResidents(prev => prev.map(resident => 
        resident.id === id ? { ...resident, emergencyContacts: contacts } : resident
      ));
      
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [handleError]);

  const updateMedicalAlerts = useCallback(async (id: string, alerts: Resident['medicalAlerts']): Promise<boolean> => {
    try {
      const response = await residentsService.updateMedicalAlerts(id, alerts);
      const updatedResident = response.data;
      
      // Update the resident in the list
      setResidents(prev => prev.map(resident => 
        resident.id === id ? updatedResident : resident
      ));
      
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [handleError]);

  const searchByName = useCallback(async (name: string): Promise<Resident[]> => {
    try {
      const response = await residentsService.searchByName(name);
      return response.data;
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  const searchByRoom = useCallback(async (roomNumber: string): Promise<Resident[]> => {
    try {
      const response = await residentsService.searchByRoom(roomNumber);
      return response.data;
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await residentsService.getStatistics();
      setStatistics(response.data);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const refreshData = useCallback(async () => {
    await fetchResidents(currentFilters);
    await fetchStatistics();
  }, [fetchResidents, fetchStatistics, currentFilters]);

  // Load initial data on mount
  useEffect(() => {
    fetchResidents(initialFilters);
    fetchStatistics();
  }, []); // Only run on mount

  return {
    residents,
    loading,
    error,
    totalPages,
    currentPage,
    totalResidents,
    statistics,
    
    // Core CRUD operations
    fetchResidents,
    getResident,
    createResident,
    updateResident,
    deleteResident,
    
    // Additional operations
    uploadPhoto,
    updateMedicalHistory,
    updateEmergencyContacts,
    updateMedicalAlerts,
    
    // Search operations
    searchByName,
    searchByRoom,
    
    // Statistics
    fetchStatistics,
    
    // Utility methods
    refreshData,
    clearError,
  };
}