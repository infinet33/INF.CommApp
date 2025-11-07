// Central types file for Valencia Assisted Living Dashboard
// All interfaces and types for the healthcare system

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  photo?: string;
  roomNumber: string;
  age: number;
  dateOfBirth: string;
  careLevel: 'Independent' | 'Assisted' | 'Full Care';
  medicalAlerts: {
    fallRisk?: boolean;
    allergies?: boolean;
    dietaryRestrictions?: boolean;
    medicationAlerts?: boolean;
  };
  facility: string;
  primaryCareTeam: string;
  lastActivity?: string;
  gender: string;
  ssn?: string;
  medicalRecordNumber: string;
  phone: string;
  email: string;
  primaryPhysician: string;
  medicalConditions: string[];
  medications: Array<{ 
    name: string; 
    dosage: string; 
    frequency: string;
    prescribedBy?: string;
    startDate?: string;
    endDate?: string;
  }>;
  allergies: string[];
  dietaryRestrictions: string[];
  mobilityLevel: string;
  cognitiveStatus: string;
  admissionDate: string;
  roomType: string;
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
    isPrimary: boolean;
    address?: string;
  }>;
  insurance: {
    primary: string;
    secondary?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
  status: 'Active' | 'Inactive' | 'Discharged';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Care Coordinator' | 'Activities Director' | 'Dining Services Manager' | 'Nurse' | 'Administrator' | 'CNA' | 'Maintenance' | 'Housekeeping';
  status: 'Active' | 'Inactive' | 'On Leave';
  shift?: 'Day' | 'Evening' | 'Night' | 'Swing';
  department?: string;
  hireDate?: string;
  employeeId?: string;
  supervisor?: string;
  certifications?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  address?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'Home Health Agency' | 'Hospice' | 'Pharmacy' | 'Medical Equipment' | 'Therapy Services' | 'Transportation' | 'Lab Services' | 'Imaging' | 'Specialists' | 'Other';
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  contractNumber?: string;
  services?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
  };
  businessHours?: string;
  notes?: string;
  rating?: number;
  lastServiceDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Doctor' | 'Nurse Practitioner' | 'Physical Therapist' | 'Occupational Therapist' | 'Speech Therapist' | 'Social Worker' | 'Family Member';
  status: 'Active' | 'Inactive';
  organization?: string;
  specialty?: string;
  licenseNumber?: string;
  npiNumber?: string;
  address?: string;
  faxNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  notes?: string;
  lastLoginDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'staff' | 'home-health' | 'nurse' | 'hospice' | 'pharmacy' | 'doctor' | 'family' | 'administrator';
  text: string;
  timestamp: string;
  isRead?: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  messageType?: 'text' | 'urgent' | 'system' | 'appointment';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface Participant {
  id: string;
  name: string;
  role: 'staff' | 'home-health' | 'nurse' | 'hospice' | 'pharmacy' | 'doctor' | 'family' | 'administrator';
  avatar?: string;
  email?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Conversation {
  id: string;
  title?: string;
  residentId?: string;
  residentName?: string;
  participants: Participant[];
  lastMessage: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  tags?: string[];
}

export interface ConversationDetails extends Conversation {
  messages: Message[];
  totalMessages: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Search and Filter types
export interface ResidentFilters {
  search?: string;
  careLevel?: string;
  facility?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StaffFilters {
  search?: string;
  role?: string;
  department?: string;
  status?: string;
  shift?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface VendorFilters {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserFilters {
  search?: string;
  role?: string;
  organization?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ConversationFilters {
  search?: string;
  residentId?: string;
  participantId?: string;
  priority?: string;
  isArchived?: boolean;
  hasUnread?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Form types for create/update operations
export type CreateResidentData = Omit<Resident, 'id' | 'createdAt' | 'updatedAt' | 'lastActivity'>;
export type UpdateResidentData = Partial<CreateResidentData>;

export type CreateStaffData = Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStaffData = Partial<CreateStaffData>;

export type CreateVendorData = Omit<Vendor, 'id' | 'createdAt' | 'updatedAt' | 'lastServiceDate'>;
export type UpdateVendorData = Partial<CreateVendorData>;

export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginDate'>;
export type UpdateUserData = Partial<CreateUserData>;

export type CreateConversationData = {
  title?: string;
  residentId?: string;
  participantIds: string[];
  initialMessage: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  tags?: string[];
};

export type SendMessageData = {
  text: string;
  messageType?: 'text' | 'urgent' | 'system' | 'appointment';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
};