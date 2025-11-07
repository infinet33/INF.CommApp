# GitHub Copilot Integration Guide
## Valencia Assisted Living Dashboard - API Layer Development

---

## 🎯 Purpose

This guide provides everything GitHub Copilot needs to build the API integration layer for the Valencia Assisted Living Dashboard. Each section includes:
- Screen workflows and user interactions
- Hook patterns ready for API connection
- Service layer templates
- Copilot prompts for code generation

---

## 📋 Table of Contents

1. [Residents Module](#residents-module)
2. [Staff Module](#staff-module)
3. [Vendors Module](#vendors-module)
4. [Users Module](#users-module)
5. [Messaging Module](#messaging-module)
6. [Setup Instructions](#setup-instructions)

---

# Residents Module

## Screen Overview

**File:** `/components/ResidentsPage.tsx`

### User Workflow

1. **View Residents Grid**
   - User lands on page → sees grid of resident cards
   - Grid shows: photo, name, room, care level, medical alerts
   - Default: 12 residents per page with pagination

2. **Search & Filter**
   - User types in search box → filters by name, room number, or care level
   - User selects care level filter → shows only matching residents
   - Results update in real-time

3. **View Details**
   - User clicks resident card → modal opens with full profile
   - Modal shows: demographics, medical info, medications, emergency contacts
   - User can close modal or click Edit

4. **Add Resident**
   - User clicks "Add Resident" button → modal opens
   - User fills form (12+ fields including emergency contacts)
   - User clicks Save → new resident appears in grid

5. **Edit Resident**
   - User clicks Edit in details modal → switches to edit mode
   - User updates fields → clicks Save Changes
   - Modal closes → grid updates with new data

6. **Delete Resident**
   - User clicks Delete → confirmation dialog appears
   - User confirms → resident removed from grid

### Data Model

```typescript
interface Resident {
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
  gender: string;
  ssn?: string;
  medicalRecordNumber: string;
  phone: string;
  email: string;
  primaryPhysician: string;
  medicalConditions: string[];
  medications: Array<{ name: string; dosage: string; frequency: string }>;
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
  }>;
  insurance: {
    primary: string;
    secondary?: string;
  };
  status: 'Active' | 'Inactive';
}
```

### API Endpoints Required

```typescript
// GET /api/residents?page=1&pageSize=12&search=&careLevel=all
// Response: { data: Resident[], total: number, page: number, pageSize: number }

// GET /api/residents/:id
// Response: { data: Resident }

// POST /api/residents
// Body: Omit<Resident, 'id'>
// Response: { data: Resident }

// PUT /api/residents/:id
// Body: Partial<Resident>
// Response: { data: Resident }

// DELETE /api/residents/:id
// Response: { success: boolean }
```

---

## Hook Implementation Template

**Create:** `/hooks/useResidents.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';

interface Resident {
  // Copy interface from above
}

interface UseResidentsReturn {
  residents: Resident[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchResidents: (params?: { search?: string; careLevel?: string; page?: number }) => Promise<void>;
  getResident: (id: string) => Promise<Resident | null>;
  createResident: (data: Omit<Resident, 'id'>) => Promise<Resident | null>;
  updateResident: (id: string, data: Partial<Resident>) => Promise<Resident | null>;
  deleteResident: (id: string) => Promise<boolean>;
}

export function useResidents(): UseResidentsReturn {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Copilot: Implement fetchResidents function
  // - Make GET request to /api/residents with query params
  // - Handle loading state (setLoading)
  // - Handle error state (setError)
  // - Update residents state with response data
  // - Update totalPages based on response
  const fetchResidents = useCallback(async (params?: { search?: string; careLevel?: string; page?: number }) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      // const response = await fetch(`/api/residents?${new URLSearchParams(params)}`);
      // const data = await response.json();
      // setResidents(data.data);
      // setTotalPages(Math.ceil(data.total / data.pageSize));
      // setCurrentPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch residents');
    } finally {
      setLoading(false);
    }
  }, []);

  // Copilot: Implement getResident function
  // - Make GET request to /api/residents/:id
  // - Return single resident or null on error
  const getResident = useCallback(async (id: string): Promise<Resident | null> => {
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resident');
      return null;
    }
  }, []);

  // Copilot: Implement createResident function
  // - Make POST request to /api/residents with data
  // - On success, add new resident to residents array
  // - Return new resident or null on error
  const createResident = useCallback(async (data: Omit<Resident, 'id'>): Promise<Resident | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      // const response = await fetch('/api/residents', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // const result = await response.json();
      // setResidents([...residents, result.data]);
      // return result.data;
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resident');
      return null;
    } finally {
      setLoading(false);
    }
  }, [residents]);

  // Copilot: Implement updateResident function
  // - Make PUT request to /api/residents/:id with data
  // - On success, update resident in residents array
  // - Return updated resident or null on error
  const updateResident = useCallback(async (id: string, data: Partial<Resident>): Promise<Resident | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      // const response = await fetch(`/api/residents/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // const result = await response.json();
      // setResidents(residents.map(r => r.id === id ? result.data : r));
      // return result.data;
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resident');
      return null;
    } finally {
      setLoading(false);
    }
  }, [residents]);

  // Copilot: Implement deleteResident function
  // - Make DELETE request to /api/residents/:id
  // - On success, remove resident from residents array
  // - Return success boolean
  const deleteResident = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      // await fetch(`/api/residents/${id}`, { method: 'DELETE' });
      // setResidents(residents.filter(r => r.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resident');
      return false;
    } finally {
      setLoading(false);
    }
  }, [residents]);

  // Load initial data
  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  return {
    residents,
    loading,
    error,
    totalPages,
    currentPage,
    fetchResidents,
    getResident,
    createResident,
    updateResident,
    deleteResident,
  };
}
```

---

## Copilot Prompts for Residents Module

### Prompt 1: Create Residents Service
```
Create a service file at /services/residents.ts that:
- Exports a residentsService object with methods: getAll, getById, create, update, delete
- Each method makes a fetch request to the appropriate endpoint
- getAll accepts optional query params: search, careLevel, page, pageSize
- All methods handle errors and return typed responses
- Use the Resident interface from /types/index.ts
```

### Prompt 2: Implement useResidents Hook
```
Complete the useResidents hook at /hooks/useResidents.ts by:
- Implementing all TODO comments with actual API calls
- Using the residentsService from /services/residents.ts
- Properly handling loading and error states
- Updating the residents array optimistically for create/update/delete
- Adding proper TypeScript types for all parameters and returns
```

### Prompt 3: Integrate Hook into ResidentsPage
```
Update /components/ResidentsPage.tsx to:
- Import and use the useResidents hook instead of local state
- Replace useState for residents with data from the hook
- Use fetchResidents when search/filter changes
- Use createResident in handleAddResident function
- Use updateResident in handleEditResident function
- Use deleteResident in handleDeleteResident function
- Show loading spinner when loading is true
- Display error message when error is not null
```

---

# Staff Module

## Screen Overview

**File:** `/components/StaffPage.tsx`

### User Workflow

1. **View Staff Table**
   - User lands on page → sees table of staff members
   - Table shows: name, role, department, contact info, status
   - Rows are clickable for quick actions

2. **Search & Filter**
   - User types in search box → filters by name, email, or department
   - User selects role filter → shows only matching staff
   - Results update in real-time

3. **Add Staff**
   - User clicks "Add Staff Member" button → modal opens
   - User fills form (name, email, phone, role, department, shift, status)
   - User clicks Save → new staff member appears in table

4. **Edit Staff**
   - User clicks edit dropdown menu → modal opens with pre-filled data
   - User updates fields → clicks Save Changes
   - Modal closes → table updates

5. **Delete Staff**
   - User clicks delete from dropdown → staff removed from table

### Data Model

```typescript
interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Care Coordinator' | 'Activities Director' | 'Dining Services Manager' | 'Nurse' | 'Administrator';
  status: 'Active' | 'Inactive';
  shift?: string;
  department?: string;
}
```

### API Endpoints Required

```typescript
// GET /api/staff?page=1&search=&role=all
// Response: { data: StaffMember[], total: number }

// GET /api/staff/:id
// Response: { data: StaffMember }

// POST /api/staff
// Body: Omit<StaffMember, 'id'>
// Response: { data: StaffMember }

// PUT /api/staff/:id
// Body: Partial<StaffMember>
// Response: { data: StaffMember }

// DELETE /api/staff/:id
// Response: { success: boolean }
```

---

## Hook Implementation Template

**Create:** `/hooks/useStaff.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Care Coordinator' | 'Activities Director' | 'Dining Services Manager' | 'Nurse' | 'Administrator';
  status: 'Active' | 'Inactive';
  shift?: string;
  department?: string;
}

interface UseStaffReturn {
  staff: StaffMember[];
  loading: boolean;
  error: string | null;
  fetchStaff: (params?: { search?: string; role?: string }) => Promise<void>;
  getStaffMember: (id: string) => Promise<StaffMember | null>;
  createStaffMember: (data: Omit<StaffMember, 'id'>) => Promise<StaffMember | null>;
  updateStaffMember: (id: string, data: Partial<StaffMember>) => Promise<StaffMember | null>;
  deleteStaffMember: (id: string) => Promise<boolean>;
}

export function useStaff(): UseStaffReturn {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Copilot: Implement fetchStaff function
  // - Make GET request to /api/staff with query params
  // - Update staff state with response data
  const fetchStaff = useCallback(async (params?: { search?: string; role?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  }, []);

  // Copilot: Implement getStaffMember function
  const getStaffMember = useCallback(async (id: string): Promise<StaffMember | null> => {
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch staff member');
      return null;
    }
  }, []);

  // Copilot: Implement createStaffMember function
  const createStaffMember = useCallback(async (data: Omit<StaffMember, 'id'>): Promise<StaffMember | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create staff member');
      return null;
    } finally {
      setLoading(false);
    }
  }, [staff]);

  // Copilot: Implement updateStaffMember function
  const updateStaffMember = useCallback(async (id: string, data: Partial<StaffMember>): Promise<StaffMember | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update staff member');
      return null;
    } finally {
      setLoading(false);
    }
  }, [staff]);

  // Copilot: Implement deleteStaffMember function
  const deleteStaffMember = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete staff member');
      return false;
    } finally {
      setLoading(false);
    }
  }, [staff]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    loading,
    error,
    fetchStaff,
    getStaffMember,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
  };
}
```

---

## Copilot Prompts for Staff Module

### Prompt 1: Create Staff Service
```
Create a service file at /services/staff.ts that:
- Exports a staffService object with methods: getAll, getById, create, update, delete
- Each method makes a fetch request to /api/staff endpoints
- getAll accepts optional query params: search, role
- Handle errors and return typed responses using StaffMember interface
```

### Prompt 2: Complete useStaff Hook
```
Complete the useStaff hook at /hooks/useStaff.ts by:
- Implementing all TODO comments with actual API calls using staffService
- Properly managing loading and error states
- Optimistically updating the staff array for all mutations
- Adding proper error handling and logging
```

### Prompt 3: Integrate Hook into StaffPage
```
Update /components/StaffPage.tsx to:
- Import and use the useStaff hook
- Replace local state management with hook data
- Use hook methods for all CRUD operations
- Display loading state with skeleton or spinner
- Show error messages with toast or alert component
```

---

# Vendors Module

## Screen Overview

**File:** `/components/VendorsPage.tsx`

### User Workflow

1. **View Vendors Table**
   - User lands on page → sees table of vendor companies
   - Table shows: name, type, contact person, email, phone, address, status
   - Click dropdown for actions

2. **Search & Filter**
   - User types in search box → filters by name, contact, or address
   - User selects vendor type → shows only matching vendors
   - Results update in real-time

3. **Add Vendor**
   - User clicks "Add Vendor" button → modal opens
   - User fills form (name, type, contact info, address, status, notes)
   - User clicks Save → new vendor appears in table

4. **Edit Vendor**
   - User clicks edit from dropdown → modal opens with pre-filled data
   - User updates fields → clicks Save Changes
   - Modal closes → table updates

5. **Delete Vendor**
   - User clicks delete from dropdown → vendor removed from table

### Data Model

```typescript
interface Vendor {
  id: string;
  name: string;
  type: 'Home Health Agency' | 'Hospice' | 'Pharmacy' | 'Medical Equipment' | 'Therapy Services' | 'Transportation' | 'Lab Services' | 'Other';
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
  notes?: string;
}
```

### API Endpoints Required

```typescript
// GET /api/vendors?search=&type=all
// Response: { data: Vendor[], total: number }

// GET /api/vendors/:id
// Response: { data: Vendor }

// POST /api/vendors
// Body: Omit<Vendor, 'id'>
// Response: { data: Vendor }

// PUT /api/vendors/:id
// Body: Partial<Vendor>
// Response: { data: Vendor }

// DELETE /api/vendors/:id
// Response: { success: boolean }
```

---

## Hook Implementation Template

**Create:** `/hooks/useVendors.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';

interface Vendor {
  id: string;
  name: string;
  type: 'Home Health Agency' | 'Hospice' | 'Pharmacy' | 'Medical Equipment' | 'Therapy Services' | 'Transportation' | 'Lab Services' | 'Other';
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
  notes?: string;
}

interface UseVendorsReturn {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  fetchVendors: (params?: { search?: string; type?: string }) => Promise<void>;
  getVendor: (id: string) => Promise<Vendor | null>;
  createVendor: (data: Omit<Vendor, 'id'>) => Promise<Vendor | null>;
  updateVendor: (id: string, data: Partial<Vendor>) => Promise<Vendor | null>;
  deleteVendor: (id: string) => Promise<boolean>;
}

export function useVendors(): UseVendorsReturn {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Copilot: Implement fetchVendors function
  const fetchVendors = useCallback(async (params?: { search?: string; type?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  }, []);

  // Copilot: Implement getVendor function
  const getVendor = useCallback(async (id: string): Promise<Vendor | null> => {
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendor');
      return null;
    }
  }, []);

  // Copilot: Implement createVendor function
  const createVendor = useCallback(async (data: Omit<Vendor, 'id'>): Promise<Vendor | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vendor');
      return null;
    } finally {
      setLoading(false);
    }
  }, [vendors]);

  // Copilot: Implement updateVendor function
  const updateVendor = useCallback(async (id: string, data: Partial<Vendor>): Promise<Vendor | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vendor');
      return null;
    } finally {
      setLoading(false);
    }
  }, [vendors]);

  // Copilot: Implement deleteVendor function
  const deleteVendor = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vendor');
      return false;
    } finally {
      setLoading(false);
    }
  }, [vendors]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    vendors,
    loading,
    error,
    fetchVendors,
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor,
  };
}
```

---

# Users Module

## Screen Overview

**File:** `/components/UsersPage.tsx`

### User Workflow

1. **View Users Table**
   - User lands on page → sees table of external care providers
   - Table shows: name, role (Doctor), organization, specialty, contact info, status
   - Currently only Doctor role, expandable for other external providers

2. **Search & Filter**
   - User types in search box → filters by name, email, or organization
   - User selects role filter → shows only matching users
   - Results update in real-time

3. **Add User**
   - User clicks "Add User" button → modal opens
   - User fills form (name, email, phone, role, organization, specialty, status)
   - User clicks Save → new user appears in table

4. **Edit User**
   - User clicks edit from dropdown → modal opens with pre-filled data
   - User updates fields → clicks Save Changes
   - Modal closes → table updates

5. **Delete User**
   - User clicks delete from dropdown → user removed from table

### Data Model

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Doctor';  // Expandable to include Nurse, Therapist, etc.
  status: 'Active' | 'Inactive';
  organization?: string;
  specialty?: string;
}
```

### API Endpoints Required

```typescript
// GET /api/users?search=&role=all
// Response: { data: User[], total: number }

// GET /api/users/:id
// Response: { data: User }

// POST /api/users
// Body: Omit<User, 'id'>
// Response: { data: User }

// PUT /api/users/:id
// Body: Partial<User>
// Response: { data: User }

// DELETE /api/users/:id
// Response: { success: boolean }
```

---

## Hook Implementation Template

**Create:** `/hooks/useUsers.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Doctor';
  status: 'Active' | 'Inactive';
  organization?: string;
  specialty?: string;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (params?: { search?: string; role?: string }) => Promise<void>;
  getUser: (id: string) => Promise<User | null>;
  createUser: (data: Omit<User, 'id'>) => Promise<User | null>;
  updateUser: (id: string, data: Partial<User>) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Copilot: Implement fetchUsers function
  const fetchUsers = useCallback(async (params?: { search?: string; role?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Copilot: Implement getUser function
  const getUser = useCallback(async (id: string): Promise<User | null> => {
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      return null;
    }
  }, []);

  // Copilot: Implement createUser function
  const createUser = useCallback(async (data: Omit<User, 'id'>): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      return null;
    } finally {
      setLoading(false);
    }
  }, [users]);

  // Copilot: Implement updateUser function
  const updateUser = useCallback(async (id: string, data: Partial<User>): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      return null;
    } finally {
      setLoading(false);
    }
  }, [users]);

  // Copilot: Implement deleteUser function
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      return false;
    } finally {
      setLoading(false);
    }
  }, [users]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
}
```

---

# Messaging Module

## Screen Overview

**Files:** 
- `/components/MessagingPage.tsx` (Admin view)
- `/components/NormalUserMessagingPage.tsx` (Family view)
- `/components/ConversationList.tsx`
- `/components/ChatView.tsx`

### User Workflow

#### Admin View
1. **View Conversations**
   - User lands on messaging page → sees list of conversations on left
   - Each conversation shows: resident name, participants, last message, unread count
   - Conversations grouped by resident

2. **Select Conversation**
   - User clicks conversation → chat view opens on right
   - Shows full message history with timestamps
   - Messages color-coded by sender role (Staff, Nurse, Doctor, etc.)

3. **Send Message**
   - User types in message input → clicks send
   - Message appears immediately in chat
   - Updates last message in conversation list

4. **Start New Conversation**
   - User clicks "New Conversation" → modal opens
   - User selects resident and participants
   - User sends first message → new conversation created

#### Family View
1. **View Conversations**
   - Family member sees their conversations only
   - Featured partner banner at top (vendor marketing)
   - Conversations about their loved one

2. **Send/Receive Messages**
   - Same as admin view but filtered to family's conversations

### Data Models

```typescript
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface Participant {
  id: string;
  name: string;
  role: 'staff' | 'home-health' | 'nurse' | 'hospice' | 'pharmacy' | 'doctor';
  avatar?: string;
}

interface Conversation {
  id: string;
  residentId?: string;
  residentName?: string;
  participants: Participant[];
  lastMessage: Message;
  unreadCount: number;
}

interface ConversationDetails extends Conversation {
  messages: Message[];
}
```

### API Endpoints Required

```typescript
// GET /api/conversations?userId=current
// Response: { data: Conversation[] }

// GET /api/conversations/:id
// Response: { data: ConversationDetails }

// POST /api/conversations
// Body: { residentId: string, participantIds: string[], initialMessage: string }
// Response: { data: Conversation }

// POST /api/conversations/:id/messages
// Body: { text: string, senderId: string, senderName: string }
// Response: { data: Message }

// PATCH /api/conversations/:id/read
// Response: { success: boolean }

// WebSocket endpoint (optional for real-time)
// ws://api/messages
```

---

## Hook Implementation Template

**Create:** `/hooks/useConversations.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface Participant {
  id: string;
  name: string;
  role: 'staff' | 'home-health' | 'nurse' | 'hospice' | 'pharmacy' | 'doctor';
  avatar?: string;
}

interface Conversation {
  id: string;
  residentId?: string;
  residentName?: string;
  participants: Participant[];
  lastMessage: Message;
  unreadCount: number;
}

interface ConversationDetails extends Conversation {
  messages: Message[];
}

interface UseConversationsReturn {
  conversations: Conversation[];
  activeConversation: ConversationDetails | null;
  loading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  getConversation: (id: string) => Promise<void>;
  createConversation: (data: { residentId: string; participantIds: string[]; initialMessage: string }) => Promise<Conversation | null>;
  sendMessage: (conversationId: string, text: string) => Promise<Message | null>;
  markAsRead: (conversationId: string) => Promise<void>;
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Copilot: Implement fetchConversations function
  // - Make GET request to /api/conversations
  // - Update conversations state
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Copilot: Implement getConversation function
  // - Make GET request to /api/conversations/:id
  // - Update activeConversation state with full message history
  const getConversation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversation');
    } finally {
      setLoading(false);
    }
  }, []);

  // Copilot: Implement createConversation function
  // - Make POST request to /api/conversations
  // - Add new conversation to conversations list
  const createConversation = useCallback(async (data: { residentId: string; participantIds: string[]; initialMessage: string }): Promise<Conversation | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
      return null;
    } finally {
      setLoading(false);
    }
  }, [conversations]);

  // Copilot: Implement sendMessage function
  // - Make POST request to /api/conversations/:id/messages
  // - Optimistically add message to activeConversation
  // - Update lastMessage in conversations list
  const sendMessage = useCallback(async (conversationId: string, text: string): Promise<Message | null> => {
    if (!activeConversation) return null;
    
    setError(null);
    
    try {
      // TODO: Implement API call
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return null;
    }
  }, [activeConversation, conversations]);

  // Copilot: Implement markAsRead function
  // - Make PATCH request to /api/conversations/:id/read
  // - Update unreadCount in conversations list
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      // TODO: Implement API call
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  }, [conversations]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    activeConversation,
    loading,
    error,
    fetchConversations,
    getConversation,
    createConversation,
    sendMessage,
    markAsRead,
  };
}
```

---

# Setup Instructions

## Step 1: Create Directory Structure

```bash
mkdir -p hooks services types
```

## Step 2: Create Base Types File

**Create:** `/types/index.ts`

```typescript
// Copilot: Export all interfaces from component files to this central location
// Include: Resident, StaffMember, Vendor, User, Message, Conversation, Participant

export interface Resident {
  // Copy from ResidentsPage.tsx
}

export interface StaffMember {
  // Copy from StaffPage.tsx
}

export interface Vendor {
  // Copy from VendorsPage.tsx
}

export interface User {
  // Copy from UsersPage.tsx
}

export interface Message {
  // Copy from MessagingPage.tsx
}

export interface Conversation {
  // Copy from MessagingPage.tsx
}

export interface Participant {
  // Copy from MessagingPage.tsx
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

## Step 3: Create Base API Service

**Create:** `/services/api.ts`

```typescript
// Copilot: Create a base API service class with methods: get, post, put, delete
// - Use fetch API
// - Handle JSON parsing
// - Handle errors with proper error messages
// - Add authorization header if token exists
// - Base URL should come from environment variable or default to /api

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    // TODO: Implement request method
    throw new Error('Not implemented');
  }

  async get<T>(endpoint: string): Promise<T> {
    // TODO: Implement GET
    throw new Error('Not implemented');
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    // TODO: Implement POST
    throw new Error('Not implemented');
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    // TODO: Implement PUT
    throw new Error('Not implemented');
  }

  async delete<T>(endpoint: string): Promise<T> {
    // TODO: Implement DELETE
    throw new Error('Not implemented');
  }
}

export const api = new ApiService();
```

## Step 4: Create Service Files

Use the templates provided above to create:
- `/services/residents.ts`
- `/services/staff.ts`
- `/services/vendors.ts`
- `/services/users.ts`
- `/services/messaging.ts`

## Step 5: Create Hook Files

Use the templates provided above to create:
- `/hooks/useResidents.ts`
- `/hooks/useStaff.ts`
- `/hooks/useVendors.ts`
- `/hooks/useUsers.ts`
- `/hooks/useConversations.ts`

## Step 6: Update Component Files

For each page component, replace local state with hooks:

```typescript
// Before
const [residents, setResidents] = useState<Resident[]>(mockResidents);

// After
import { useResidents } from '../hooks/useResidents';
const { residents, loading, error, createResident, updateResident, deleteResident } = useResidents();
```

---

# Copilot Master Prompts

## Prompt 1: Generate All Service Files
```
Generate complete service files for residents, staff, vendors, users, and messaging modules.
Each service should:
1. Import the api service from /services/api.ts
2. Import types from /types/index.ts
3. Export a service object with methods: getAll, getById, create, update, delete
4. Build query strings for getAll methods using URLSearchParams
5. Handle errors properly with try/catch
6. Return typed responses using TypeScript generics

Use this pattern for each service:
- residentsService with endpoints /api/residents
- staffService with endpoints /api/staff
- vendorsService with endpoints /api/vendors
- usersService with endpoints /api/users
- messagingService with endpoints /api/conversations
```

## Prompt 2: Complete All Hooks
```
Complete all TODO comments in the hook files:
- /hooks/useResidents.ts
- /hooks/useStaff.ts
- /hooks/useVendors.ts
- /hooks/useUsers.ts
- /hooks/useConversations.ts

For each hook:
1. Import the corresponding service
2. Implement fetch functions that call service.getAll()
3. Implement create functions that call service.create() and update state optimistically
4. Implement update functions that call service.update() and update state optimistically
5. Implement delete functions that call service.delete() and update state optimistically
6. Handle loading states properly (setLoading before/after API calls)
7. Handle error states with meaningful messages
8. Use useCallback for all functions to prevent unnecessary re-renders
```

## Prompt 3: Integrate Hooks into Pages
```
Update all page components to use the custom hooks instead of local state:

For /components/ResidentsPage.tsx:
1. Import useResidents hook
2. Destructure all needed values and functions
3. Replace handleAddResident to use createResident from hook
4. Replace handleEditResident to use updateResident from hook
5. Replace handleDeleteResident to use deleteResident from hook
6. Replace handleSearch to use fetchResidents with search params
7. Add loading spinner when loading is true
8. Display error message when error is not null

Repeat this pattern for:
- /components/StaffPage.tsx with useStaff
- /components/VendorsPage.tsx with useVendors
- /components/UsersPage.tsx with useUsers
- /components/MessagingPage.tsx with useConversations
```

## Prompt 4: Add Loading States
```
Add loading states to all page components:

1. Create a LoadingSpinner component in /components/LoadingSpinner.tsx
2. For each page, show LoadingSpinner when loading is true
3. Use skeleton loading for table rows when appropriate
4. Disable form submit buttons when loading is true
5. Show "Saving..." text on submit buttons during save operation
```

## Prompt 5: Add Error Handling
```
Add comprehensive error handling:

1. Install and configure sonner for toast notifications
2. Show success toasts on successful create/update/delete operations
3. Show error toasts when API calls fail
4. Add error boundary component for catching React errors
5. Log errors to console for debugging
6. For conversation messages, implement optimistic updates with rollback on error
```

## Prompt 6: Add Real-time Messaging
```
Implement WebSocket connection for real-time messaging:

1. Create /services/websocket.ts with WebSocket client
2. Connect to ws://api/messages on component mount
3. Listen for new message events
4. Update conversation list when new messages arrive
5. Update active conversation when message is for current chat
6. Handle connection errors and reconnection logic
7. Clean up WebSocket connection on component unmount
```

---

# Testing Checklist

## Unit Testing
- [ ] Test each service method with mock fetch
- [ ] Test hook state updates
- [ ] Test error handling in hooks
- [ ] Test optimistic updates and rollback

## Integration Testing
- [ ] Test complete CRUD flow for each module
- [ ] Test search and filter functionality
- [ ] Test pagination
- [ ] Test conversation creation and messaging
- [ ] Test error scenarios (network failures, validation errors)

## Manual Testing
- [ ] Create a resident and verify it appears in the grid
- [ ] Edit a resident and verify changes persist
- [ ] Delete a resident and verify it's removed
- [ ] Search residents and verify results
- [ ] Repeat for Staff, Vendors, Users
- [ ] Send a message and verify it appears in conversation
- [ ] Create new conversation and send message
- [ ] Test with slow network (throttling)
- [ ] Test with network errors

---

# Environment Variables

Create `.env` file:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

For production:
```
VITE_API_BASE_URL=https://api.valencia-living.com/api
VITE_WS_URL=wss://api.valencia-living.com
```

---

# API Response Examples

## Residents List
```json
{
  "data": [
    {
      "id": "1",
      "firstName": "Margaret",
      "lastName": "Anderson",
      "roomNumber": "101A",
      "careLevel": "Assisted",
      ...
    }
  ],
  "total": 45,
  "page": 1,
  "pageSize": 12
}
```

## Single Resident
```json
{
  "data": {
    "id": "1",
    "firstName": "Margaret",
    "lastName": "Anderson",
    "emergencyContacts": [...],
    "medications": [...],
    ...
  }
}
```

## Conversations List
```json
{
  "data": [
    {
      "id": "conv-1",
      "residentId": "1",
      "residentName": "Margaret Anderson",
      "participants": [
        { "id": "u1", "name": "Jennifer Lee", "role": "staff" }
      ],
      "lastMessage": {
        "id": "msg-1",
        "text": "Latest message",
        "timestamp": "2025-11-07T10:00:00Z"
      },
      "unreadCount": 2
    }
  ]
}
```

## Messages in Conversation
```json
{
  "data": {
    "id": "conv-1",
    "residentId": "1",
    "messages": [
      {
        "id": "msg-1",
        "senderId": "u1",
        "senderName": "Jennifer Lee",
        "text": "How is she doing today?",
        "timestamp": "2025-11-07T09:00:00Z"
      },
      {
        "id": "msg-2",
        "senderId": "u2",
        "senderName": "Sarah Johnson",
        "text": "She's doing great!",
        "timestamp": "2025-11-07T09:15:00Z"
      }
    ],
    ...
  }
}
```

---

# Final Integration Steps

1. **Create all files** using templates above
2. **Run Copilot prompts** in sequence to generate implementations
3. **Test each module** individually
4. **Add error handling and loading states**
5. **Test end-to-end workflows**
6. **Deploy to staging** with real backend
7. **Conduct user acceptance testing**

---

This guide provides everything needed for GitHub Copilot to build a complete API integration layer. Use the prompts in sequence for best results.
