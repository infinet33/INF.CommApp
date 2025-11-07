export interface FacilityAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FacilitySettings {
  theme: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export interface FacilityContact {
  phone: string;
  email: string;
  website?: string;
  emergencyContact: string;
}

export interface Facility {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  address: FacilityAddress;
  contact: FacilityContact;
  settings: FacilitySettings;
  established: Date;
  licenseNumber: string;
  capacity: number;
  description: string;
}