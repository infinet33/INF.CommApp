import { createContext, useContext, ReactNode } from 'react';
import { Facility } from '../types/facility';
import { mockFacility } from '../services/facilityService';

interface FacilityContextType {
  facility: Facility;
  isLoading: boolean;
  error: string | null;
}

const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

interface FacilityProviderProps {
  children: ReactNode;
}

export function FacilityProvider({ children }: FacilityProviderProps) {
  // In a real application, this would fetch from an API
  // For now, we'll use the mock data
  const facilityData: FacilityContextType = {
    facility: mockFacility,
    isLoading: false,
    error: null
  };

  return (
    <FacilityContext.Provider value={facilityData}>
      {children}
    </FacilityContext.Provider>
  );
}

export function useFacilityContext() {
  const context = useContext(FacilityContext);
  if (context === undefined) {
    throw new Error('useFacilityContext must be used within a FacilityProvider');
  }
  return context;
}

// Export the hook for backward compatibility
export { useFacilityContext as useFacility };