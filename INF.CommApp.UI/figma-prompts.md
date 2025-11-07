# Figma Make Prompts - INF CommApp Healthcare UI

## 🏥 Healthcare Dashboard Prompts

### 1. Main Dashboard Layout
```
Create a modern healthcare facility dashboard UI in Figma with the following specifications:

LAYOUT:
- Clean, professional medical interface design
- Left sidebar navigation with healthcare icons (🏥 Facilities, 👥 Residents, 👨‍⚕️ Staff, 📢 Notifications, 📊 Dashboard)
- Top header with notification bell, user avatar, and facility name
- Main content area with cards and widgets
- Color scheme: Primary blue (#2563eb), success green (#16a34a), warning orange (#d97706), danger red (#dc2626)
- Typography: Clean, readable sans-serif (Inter or similar)
- White background with subtle gray (#f9fafb) sections

DASHBOARD CONTENT:


HEALTHCARE SPECIFIC:
- Professional medical color paletteCan 
- Clear visual hierarchy for critical information
- Emergency alert styling with red accents
- Accessibility-focused design elements
- Clean, sterile aesthetic appropriate for healthcare environments
```

### 3. Emergency Notification System
```
Create an emergency alert and notification center UI for healthcare facilities:

NOTIFICATION CENTER:
- Priority-based notification list with color coding:
  - High Priority (Red): Emergency alerts, fall detection, medical emergencies
  - Medium Priority (Orange): Medication reminders, appointment alerts
  - Low Priority (Blue): System updates, general information
- Real-time notification badges with unread counts
- Filter options by priority, facility, time
- Clear notification timestamp and facility location

EMERGENCY ALERT MODAL:
- Full-screen emergency alert overlay
- Large, clear emergency message
- Resident information (name, room number, medical conditions)
- Quick action buttons: "Respond", "Assign Staff", "Call Family"
- Emergency contact information
- Severity level indicators
- Audio/visual alert indicators

DESIGN ELEMENTS:
- High contrast for emergency situations
- Large, readable text for quick scanning
- Clear call-to-action buttons
- Medical emergency iconography
- Professional healthcare color scheme
```

### 4. Staff Management Dashboard
```
Design a healthcare staff management and scheduling interface:

STAFF OVERVIEW:
- Staff directory with photos, names, roles, certifications
- Shift schedule calendar view
- On-duty/off-duty status indicators
- Quick contact information
- Role-based color coding (Nurses: blue, CNAs: green, Doctors: purple, Admin: gray)

SCHEDULING INTERFACE:
- Weekly/daily calendar view
- Drag-and-drop shift assignment
- Staff availability indicators
- Shift coverage alerts for understaffing
- Emergency staff call list
- Overtime tracking

STAFF CARDS:
- Professional headshot placeholders
- Name, title, credentials
- Current assignment (facility/residents)
- Contact information (phone, pager)
- Emergency availability status
- Performance indicators or certifications due
```

### 5. Resident Care Management
```
Create a resident management interface for healthcare facilities:

RESIDENT DIRECTORY:
- Resident profile cards with photos, room numbers, care levels
- Medical alert indicators (allergies, fall risk, medication needs)
- Care team assignments
- Family contact information
- Emergency medical information

CARE TRACKING:
- Daily care checklist interface
- Medication administration records
- Vital signs tracking charts
- Incident report forms
- Family communication log
- Care plan timeline

DESIGN SPECIFICATIONS:
- HIPAA-compliant information display
- Privacy-focused design with blur options
- Medical chart-inspired layout
- Clear medical information hierarchy
- Emergency medical alert styling
- Professional healthcare aesthetics
```

## 📱 Mobile-First Prompts

### 6. Mobile Healthcare App
```
Design a mobile-first healthcare communication app interface:

MOBILE LAYOUT:
- Bottom tab navigation with healthcare icons
- Swipe-able emergency alert cards
- Quick action floating button for emergencies
- Touch-friendly button sizes (44px minimum)
- Dark mode support for night shifts

EMERGENCY FEATURES:
- Large emergency call button
- One-tap staff communication
- Location-based facility alerts
- Push notification designs
- Offline mode indicators

ACCESSIBILITY:
- High contrast mode
- Large text options
- Voice control indicators
- Screen reader optimized layouts
- Emergency accessibility features
```

## 🎨 Design System Prompts

### 7. Healthcare Design System
```
Create a comprehensive healthcare design system in Figma:

COMPONENTS:
- Button variants (Primary, Secondary, Emergency, Success, Warning, Danger)
- Input fields for medical data entry
- Alert banners with priority levels
- Navigation components
- Card layouts for different content types
- Modal dialogs for critical actions

COLOR PALETTE:
- Primary: Professional blues (#1d4ed8, #2563eb, #3b82f6)
- Success: Medical greens (#065f46, #047857, #059669)
- Warning: Attention oranges (#92400e, #b45309, #d97706)
- Danger: Emergency reds (#991b1b, #dc2626, #ef4444)
- Neutral: Clean grays (#1f2937, #374151, #6b7280, #9ca3af)

TYPOGRAPHY:
- Headings: Bold, clear hierarchy
- Body text: Highly readable, medical-grade legibility
- Emergency text: High contrast, large sizes
- Data labels: Consistent, scannable format

ICONOGRAPHY:
- Healthcare-specific icons
- Emergency and medical symbols
- Facility and location indicators
- Status and priority indicators
```

### 8. Data Visualization Components
```
Design healthcare data visualization components:

CHARTS AND GRAPHS:
- Resident occupancy trends
- Staff scheduling heat maps
- Emergency response time charts
- Medication compliance tracking
- Facility performance metrics

DASHBOARD WIDGETS:
- Real-time status indicators
- Key performance metric cards
- Alert summary panels
- Quick action tiles
- Progress tracking components

SPECIFICATIONS:
- Color-blind friendly palettes
- Clear data labeling
- Interactive hover states
- Mobile-responsive sizing
- Professional medical styling
```

## 💡 Usage Instructions

### For Each Prompt:
1. **Copy the prompt** exactly as written
2. **Paste into Figma Make** or your AI design tool
3. **Specify additional requirements** like:
   - Exact dimensions (1920x1080 for desktop, 375x812 for mobile)
   - Specific brand colors if you have them
   - Additional features unique to your facilities

### Customization Tips:
- Replace color codes with your brand colors
- Add your facility names and actual data
- Include your logo and branding elements
- Adjust terminology for your specific healthcare focus

### Integration with React Project:
- Use these designs to create components in `src/components/`
- Map Figma colors to your Tailwind CSS classes
- Extract spacing and typography for consistent implementation
- Create reusable component patterns

## 🔄 Iterative Design Process

1. **Start with Dashboard** - Core functionality first
2. **Add Emergency Features** - Critical healthcare needs
3. **Build Staff Tools** - Operational efficiency
4. **Design Mobile Views** - Accessibility and mobility
5. **Create Design System** - Consistency and scalability

Each prompt is designed to generate production-ready mockups that will translate seamlessly into your React + TypeScript codebase!

## 🏥 **SPECIALIZED PROMPT: Residents Management System**

### 9. Complete Residents Management Interface
```
Create a comprehensive healthcare residents management system UI in Figma with full CRUD functionality:

=== MAIN RESIDENTS GRID VIEW ===

LAYOUT STRUCTURE:
- Header: "Residents" title with "Add New Resident" button (primary blue)
- Search/Filter bar with: Name search, Room number filter, Care level filter, Facility filter, Medical alert filter
- Grid view with 4-5 residents per row on desktop, responsive for mobile
- Pagination controls at bottom
- Export to PDF/Excel buttons
- Bulk action checkboxes for selected residents

RESIDENT CARDS IN GRID:
Each card displays:
- Profile photo placeholder (circular, 80px)
- Full name (FirstName LastName) - prominent heading
- Room number badge (top-right corner)
- Age and Date of Birth
- Care level indicator (Low, Medium, High care needs - color coded)
- Medical alert icons (🚨 fall risk, 💊 allergies, ⚠️ dietary restrictions)
- Assigned facility name
- Primary care team member
- Last activity/check-in timestamp
- Quick action buttons: "View Details", "Edit", "Emergency Contact"

VISUAL INDICATORS:
- Care Level: Green (Independent), Yellow (Assisted), Red (Full Care)
- Medical Alerts: Red warning icons with tooltips
- Room Status: Available (green), Occupied (blue), Maintenance (orange)
- Active/Inactive status indicator

=== SEARCH & FILTER INTERFACE ===

ADVANCED SEARCH BAR:
- Global search field (searches name, room, medical record number)
- Filter dropdowns:
  * Facility (multi-select)
  * Care Level (Independent, Assisted, Full Care)
  * Medical Alerts (Fall Risk, Allergies, Dietary, Medication)
  * Age Range slider
  * Room Number range
  * Admission Date range
- Clear all filters button
- Save filter presets functionality

=== RESIDENT DETAILS MODAL/PAGE ===

COMPREHENSIVE RESIDENT PROFILE:
Layout: Full-screen modal or dedicated page with tabs

TAB 1: PERSONAL INFORMATION
- Large profile photo (150px, editable)
- Personal Details:
  * Full Name (First, Middle, Last)
  * Preferred Name/Nickname
  * Date of Birth & Age (calculated)
  * Gender & Pronouns
  * Social Security Number (masked for privacy)
  * Medical Record Number
- Contact Information:
  * Phone Numbers (Primary, Secondary)
  * Email Address
  * Preferred Communication Method
- Address Information:
  * Previous Address
  * Emergency Contact Address

TAB 2: HEALTHCARE INFORMATION
- Medical Details:
  * Primary Care Physician
  * Medical Conditions (chronic conditions list)
  * Current Medications (name, dosage, frequency, prescribing doctor)
  * Allergies & Reactions (medications, food, environmental)
  * Dietary Restrictions & Preferences
  * Mobility Level & Assistive Devices
  * Cognitive Status Assessment
- Care Plan:
  * Care Level (Independent, Assisted, Memory Care, Skilled Nursing)
  * Daily Care Requirements
  * Special Instructions
  * Last Health Assessment Date

TAB 3: FACILITY & HOUSING
- Current Facility Assignment
- Room Information:
  * Room Number & Type (private, semi-private, shared)
  * Bed Assignment
  * Roommate Information (if applicable)
  * Room Amenities & Accommodations
- Admission Information:
  * Admission Date
  * Admission Source (hospital, home, other facility)
  * Admission Reason

TAB 4: CARE TEAM & FAMILY
- Assigned Care Team:
  * Primary Nurse
  * CNA Assignments (by shift)
  * Physical Therapist
  * Social Worker
  * Activities Coordinator
- Emergency Contacts:
  * Primary Contact (name, relationship, phone, email)
  * Secondary Contact
  * Medical Decision Maker/Power of Attorney
  * Financial Responsible Party
- Family Information:
  * Next of Kin
  * Visitor Preferences & Restrictions
  * Family Communication Preferences

TAB 5: FINANCIAL & INSURANCE
- Payment Information:
  * Primary Insurance (Medicare, Medicaid, Private)
  * Secondary Insurance
  * Payment Method & Billing Contact
  * Monthly Care Cost
  * Outstanding Balance
- Financial Contact Information

TAB 6: ACTIVITY & CARE LOGS
- Recent Activity Log (last 30 days)
- Incident Reports
- Medication Administration Records
- Vital Signs Tracking
- Care Notes from staff
- Family Visit Log

=== ADD/EDIT RESIDENT FORM ===

MULTI-STEP FORM WIZARD:

STEP 1: Basic Information
- Profile photo upload
- Full name fields
- Date of birth (date picker)
- Gender selection
- Contact information
- Emergency contact (primary)

STEP 2: Medical Information
- Medical conditions (searchable multi-select)
- Current medications (add/remove list)
- Allergies (add/remove with severity levels)
- Dietary restrictions
- Mobility assessment

STEP 3: Care Requirements
- Care level selection (radio buttons with descriptions)
- Special care instructions (textarea)
- Required assistive devices
- Cognitive assessment scores

STEP 4: Facility Assignment
- Facility selection (dropdown)
- Room assignment (available rooms only)
- Admission date
- Care team assignments

STEP 5: Insurance & Payment
- Insurance information forms
- Financial responsibility
- Billing preferences

STEP 6: Review & Submit
- Summary of all entered information
- Edit buttons for each section
- Submit button to save resident

=== DESIGN SPECIFICATIONS ===

COLOR SCHEME:
- Primary Blue (#2563eb) for main actions
- Success Green (#16a34a) for positive indicators
- Warning Orange (#d97706) for attention items
- Danger Red (#dc2626) for medical alerts and emergencies
- Gray (#6b7280) for secondary information

TYPOGRAPHY:
- Headers: Inter Bold, 24px for page titles, 18px for section titles
- Body text: Inter Regular, 14px for general text
- Labels: Inter Medium, 12px for form labels
- Emergency text: Inter Bold, 16px with red color

ACCESSIBILITY:
- High contrast for all medical information
- Large touch targets (44px minimum)
- Screen reader friendly labels
- Keyboard navigation support
- HIPAA compliant privacy considerations

RESPONSIVE DESIGN:
- Desktop: 4-5 cards per row
- Tablet: 2-3 cards per row
- Mobile: 1 card per row, stacked layout
- Modal forms adapt to screen size
- Touch-friendly interface for mobile staff use

HEALTHCARE SPECIFIC ELEMENTS:
- Medical alert badges with clear iconography
- Privacy blur options for sensitive information
- Emergency contact quick-access buttons
- Care level visual indicators
- HIPAA compliance indicators
- Print-friendly layouts for reports

DATA INTEGRATION NOTES:
- All fields map to typical healthcare resident database schemas
- Support for external ID fields (ExternalId UUID)
- Audit trail for all changes
- Integration points for care management systems
- Export capabilities for reporting
```

=== USAGE INSTRUCTIONS FOR RESIDENTS PROMPT ===

1. **Copy the complete prompt above** into Figma Make
2. **Specify canvas size**: 1920x1080 for desktop views, 375x812 for mobile
3. **Add your specific requirements**:
   - Your facility names and branding
   - Specific medical conditions relevant to your facilities
   - Custom care levels if different from standard
4. **Generate in phases**:
   - Start with the main grid view
   - Then create the detailed modal/page
   - Finally design the add/edit forms

This prompt will generate a complete resident management system that integrates perfectly with your existing React + TypeScript healthcare application!