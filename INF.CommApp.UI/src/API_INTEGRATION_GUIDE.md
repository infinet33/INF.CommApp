# API Integration Guide
## Valencia Assisted Living Dashboard

---

## Executive Summary

The application is well-structured with consistent patterns across all modules. All core features are implemented with mock data and ready for API integration. This guide outlines the current architecture and provides specific recommendations for backend integration.

---

## Current Architecture Overview

### ✅ Implemented Features

1. **Residents Management** - Full CRUD with comprehensive profiles
2. **Staff Management** - Full CRUD with role-based organization
3. **Vendors Management** - Full CRUD with vendor type categorization
4. **Users Management** - Full CRUD for external care providers (Doctors)
5. **Messaging System** - Two-way communication (Admin and Family views)
6. **Search & Filtering** - Implemented across all modules
7. **Responsive Design** - Mobile and desktop support

---

## Data Models Reference

### 1. Resident Interface
**Location:** `/components/ResidentsPage.tsx` (lines 18-63)

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
  lastActivity: string;
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

**API Endpoints Needed:**
- `GET /api/residents` - List residents with pagination, search, and filters
- `GET /api/residents/:id` - Get single resident details
- `POST /api/residents` - Create new resident
- `PUT /api/residents/:id` - Update resident
- `DELETE /api/residents/:id` - Delete resident

---

### 2. Staff Interface
**Location:** `/components/StaffPage.tsx` (lines 15-24)

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

**API Endpoints Needed:**
- `GET /api/staff` - List staff with pagination, search, and filters
- `GET /api/staff/:id` - Get single staff member
- `POST /api/staff` - Create new staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member

---

### 3. Vendor Interface
**Location:** `/components/VendorsPage.tsx` (lines 16-26)

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

**API Endpoints Needed:**
- `GET /api/vendors` - List vendors with pagination, search, and filters
- `GET /api/vendors/:id` - Get single vendor
- `POST /api/vendors` - Create new vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

---

### 4. User Interface
**Location:** `/components/UsersPage.tsx` (lines 15-24)

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Doctor';  // Expandable for other external roles
  status: 'Active' | 'Inactive';
  organization?: string;
  specialty?: string;
}
```

**API Endpoints Needed:**
- `GET /api/users` - List users with pagination, search, and filters
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

### 5. Messaging Interfaces
**Location:** `/components/MessagingPage.tsx` (lines 6-35)

```typescript
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  residentId?: string;
  residentName?: string;
  participants: Array<{
    id: string;
    name: string;
    role: 'staff' | 'home-health' | 'nurse' | 'hospice' | 'pharmacy' | 'doctor';
    avatar?: string;
  }>;
  lastMessage: Message;
  unreadCount: number;
}
```

**API Endpoints Needed:**
- `GET /api/conversations` - List conversations for current user
- `GET /api/conversations/:id` - Get conversation details
- `GET /api/conversations/:id/messages` - Get messages for conversation
- `POST /api/conversations` - Create new conversation
- `POST /api/conversations/:id/messages` - Send message in conversation
- `PATCH /api/conversations/:id/read` - Mark conversation as read

---

## Recommended Refactoring for API Integration

### Phase 1: Type Definitions (Priority: HIGH)

**Action:** Create centralized type definitions

**Create:** `/types/index.ts`

```typescript
// Export all interfaces from a central location
export interface Resident {
  // Move from ResidentsPage.tsx
}

export interface StaffMember {
  // Move from StaffPage.tsx
}

export interface Vendor {
  // Move from VendorsPage.tsx
}

export interface User {
  // Move from UsersPage.tsx
}

export interface Message {
  // Move from MessagingPage.tsx
}

export interface Conversation {
  // Move from MessagingPage.tsx
}

// Add API response types
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

---

### Phase 2: API Service Layer (Priority: HIGH)

**Action:** Create API service abstraction

**Create:** `/services/api.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
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

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
```

---

**Create:** `/services/residents.ts`

```typescript
import { api } from './api';
import { Resident, PaginatedResponse } from '../types';

export const residentsService = {
  getAll: (params?: {
    search?: string;
    careLevel?: string;
    page?: number;
  }) => {
    const queryString = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<Resident>>(
      `/residents?${queryString}`
    );
  },

  getById: (id: string) => {
    return api.get<Resident>(`/residents/${id}`);
  },

  create: (data: Omit<Resident, 'id'>) => {
    return api.post<Resident>('/residents', data);
  },

  update: (id: string, data: Partial<Resident>) => {
    return api.put<Resident>(`/residents/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete<void>(`/residents/${id}`);
  },
};
```

**Repeat similar pattern for:**
- `/services/staff.ts`
- `/services/vendors.ts`
- `/services/users.ts`
- `/services/messaging.ts`

---

### Phase 3: Custom Hooks (Priority: MEDIUM)

**Action:** Create reusable data fetching hooks

**Create:** `/hooks/useResidents.ts`

```typescript
import { useState, useEffect } from 'react';
import { residentsService } from '../services/residents';
import { Resident } from '../types';

export function useResidents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidents = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await residentsService.getAll(params);
      setResidents(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const createResident = async (data: Omit<Resident, 'id'>) => {
    try {
      const newResident = await residentsService.create(data);
      setResidents([...residents, newResident]);
      return newResident;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateResident = async (id: string, data: Partial<Resident>) => {
    try {
      const updated = await residentsService.update(id, data);
      setResidents(residents.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteResident = async (id: string) => {
    try {
      await residentsService.delete(id);
      setResidents(residents.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    residents,
    loading,
    error,
    fetchResidents,
    createResident,
    updateResident,
    deleteResident,
  };
}
```

**Repeat similar pattern for:**
- `/hooks/useStaff.ts`
- `/hooks/useVendors.ts`
- `/hooks/useUsers.ts`
- `/hooks/useConversations.ts`

---

### Phase 4: Add Loading & Error States (Priority: HIGH)

**Action:** Update all pages to handle loading and error states

**Example for ResidentsPage.tsx:**

```typescript
// Add loading state UI
{loading && (
  <div className="flex items-center justify-center h-64">
    <div className="text-[#64748b]">Loading residents...</div>
  </div>
)}

// Add error state UI
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
    Error: {error}
  </div>
)}
```

---

### Phase 5: Form Validation (Priority: MEDIUM)

**Action:** Add validation to all forms

**Recommended Library:** `react-hook-form` with `zod` for validation

**Example:**

```typescript
import { useForm } from 'react-hook-form@7.55.0';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const residentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format'),
  // ... more validations
});
```

---

### Phase 6: Configuration Management (Priority: LOW)

**Action:** Extract hardcoded values

**Create:** `/config/constants.ts`

```typescript
export const FACILITY_NAME = 'Valencia Assisted Living of Cottonwood';

export const COLORS = {
  primary: '#2563eb',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
};

export const CARE_LEVELS = ['Independent', 'Assisted', 'Full Care'] as const;

export const STAFF_ROLES = [
  'Care Coordinator',
  'Activities Director',
  'Dining Services Manager',
  'Nurse',
  'Administrator',
] as const;

export const VENDOR_TYPES = [
  'Home Health Agency',
  'Hospice',
  'Pharmacy',
  'Medical Equipment',
  'Therapy Services',
  'Transportation',
  'Lab Services',
  'Other',
] as const;
```

---

## API Contract Specifications

### Authentication & Authorization

**Required Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**User Context:**
Each API request should include user context to:
- Filter data by facility
- Apply role-based permissions
- Track audit logs

---

### Pagination Parameters

**Query Parameters:**
```
?page=1&pageSize=20&search=query&sortBy=field&sortOrder=asc|desc
```

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

---

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

---

## Security Considerations

### 1. Data Protection
- **PHI/PII Data:** Residents contain sensitive health information
- **Encryption:** All data transmission must use HTTPS
- **Storage:** Sensitive fields (SSN, medical records) need encryption at rest

### 2. Access Control
- **Role-Based Access:** Implement roles (Admin, Staff, Family Member)
- **Facility Isolation:** Users should only see data for their facility
- **Audit Logging:** Track all CRUD operations on resident data

### 3. Validation
- **Server-side validation** required for all inputs
- **Sanitization** of user inputs to prevent XSS
- **File uploads** (photos) need validation and virus scanning

---

## Testing Recommendations

### 1. Mock API Server
Use MSW (Mock Service Worker) for development:

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/residents', (req, res, ctx) => {
    return res(ctx.json({ data: mockResidents }));
  }),
  // ... more handlers
];
```

### 2. Integration Tests
Test API integration with actual endpoints in staging environment

### 3. Error Scenarios
Test handling of:
- Network failures
- 401/403 authentication errors
- 400 validation errors
- 500 server errors
- Timeout scenarios

---

## Performance Considerations

### 1. Pagination
- Implement server-side pagination for all list endpoints
- Current UI supports pagination controls

### 2. Caching
- Consider implementing React Query for automatic caching
- Cache conversation lists with appropriate invalidation

### 3. Optimistic Updates
- Update UI immediately for better UX
- Rollback on API failure

### 4. Debouncing
- Search inputs should debounce API calls (300-500ms)

---

## Missing Features for Production

### 1. Authentication System
- Login/Logout functionality
- Session management
- Password reset flow
- Multi-factor authentication

### 2. Real-time Updates
- WebSocket connection for live message updates
- Notifications for new messages
- Presence indicators (online/offline)

### 3. File Upload
- Resident photo upload
- Document attachments for messages
- Medical document storage

### 4. Reporting
- Export functionality (CSV/PDF)
- Analytics dashboard
- Care activity logs

### 5. Notifications
- In-app notification system (partially implemented)
- Email notifications
- SMS alerts for critical events

---

## Migration Path

### Step 1: Setup (Week 1)
1. Create types folder with all interfaces
2. Setup API service layer
3. Configure environment variables
4. Add error boundary components

### Step 2: Residents Module (Week 2)
1. Integrate residents API
2. Add loading/error states
3. Implement form validation
4. Test CRUD operations

### Step 3: Staff & Vendors (Week 3)
1. Integrate staff API
2. Integrate vendors API
3. Add loading/error states
4. Test CRUD operations

### Step 4: Users & Messaging (Week 4)
1. Integrate users API
2. Integrate messaging API
3. Add real-time messaging (WebSocket)
4. Test end-to-end flows

### Step 5: Polish & Testing (Week 5)
1. Add comprehensive error handling
2. Implement loading skeletons
3. Add success/error toasts
4. End-to-end testing
5. Performance optimization

---

## Code Quality Checklist

✅ TypeScript interfaces defined for all entities
✅ Consistent CRUD patterns across modules
✅ Reusable UI components (Button, Input, Dialog, etc.)
✅ Responsive design implemented
✅ Accessibility considerations (labels, ARIA attributes)
✅ Color scheme consistency
✅ Component separation of concerns

⚠️ Needs Improvement:
- [ ] Centralized type definitions
- [ ] API service layer
- [ ] Error handling
- [ ] Form validation
- [ ] Loading states
- [ ] Configuration management
- [ ] Unit tests
- [ ] Integration tests

---

## Contact for Questions

**Frontend Implementation:** Review completed
**Backend API Spec:** Based on interfaces defined in this document
**Security Review:** Required before production deployment
**Performance Testing:** Required with real data volumes

---

## Appendix: Current Mock Data Locations

- Residents: `/components/ResidentsPage.tsx` (lines 65-190)
- Staff: `/components/StaffPage.tsx` (lines 28-76)
- Vendors: `/components/VendorsPage.tsx` (lines 28-81)
- Users: `/components/UsersPage.tsx` (lines 26-56)
- Conversations: `/components/MessagingPage.tsx` (lines 37-124)

All mock data should be removed once API integration is complete.
