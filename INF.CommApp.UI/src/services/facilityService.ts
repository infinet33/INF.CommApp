import { Facility } from '../types/facility';
import alcLogo from '../assets/alc-logo.svg';

// Mock facility data that would typically come from an API
export const mockFacility: Facility = {
  id: 'alc-cottonwood-001',
  name: 'Valencia Assisted Living of Cottonwood',
  shortName: 'ALC Cottonwood',
  logo: alcLogo,
  address: {
    street: '1234 Valencia Drive',
    city: 'Cottonwood',
    state: 'Arizona',
    zipCode: '86326',
    country: 'United States'
  },
  contact: {
    phone: '(928) 634-7755',
    email: 'info@valenciaassisted.com',
    website: 'https://valenciaassisted.com',
    emergencyContact: '(928) 634-7755'
  },
  settings: {
    theme: 'light',
    primaryColor: '#5A8FA3',
    secondaryColor: '#A4B494',
    timezone: 'America/Phoenix',
    language: 'en-US',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  },
  established: new Date('2018-03-15'),
  licenseNumber: 'AZ-ALF-2018-001234',
  capacity: 120,
  description: 'Valencia Assisted Living of Cottonwood provides exceptional care and comfortable living for seniors in a beautiful Arizona setting.'
};

// Simulate API call to get facility data
export const getFacilityData = async (): Promise<Facility> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockFacility;
};

// Hook for using facility data
export const useFacility = () => {
  // In a real app, this would use React Query or similar
  // For now, we'll just return the mock data
  return {
    facility: mockFacility,
    isLoading: false,
    error: null
  };
};