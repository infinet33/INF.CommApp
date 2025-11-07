# Figma to React Project Mapping Guide

## 📁 File Structure Mapping

This document establishes the repeatable process for integrating Figma designs into our React project.

### Source: Figma Extracted Components
**Location:** `C:\Users\jeato\OneDrive\Source\INF.CommApp\INF.CommApp.UI\Figma\extracted\src\components\`

### Target: React Project Structure
**Location:** `C:\Users\jeato\OneDrive\Source\INF.CommApp\INF.CommApp.UI\src\`

## 🗺️ Component Mapping

### Pages (Main Views)
| Figma Component | Target Location | Status | Description |
|----------------|-----------------|--------|-------------|
| `ResidentsPage.tsx` | `src/pages/Residents.tsx` | ✅ COMPLETED | Professional resident management with SearchFilters, bulk actions, pagination |
| `MessagingPage.tsx` | `src/pages/Messages.tsx` | 🔄 TO COPY | **Replaces Notifications.tsx** - Professional messaging interface |
| `StaffPage.tsx` | `src/pages/Staff.tsx` | 🔄 TO COPY | Staff management with professional UI |
| `VendorsPage.tsx` | `src/pages/Vendors.tsx` | 🔄 TO COPY | Vendor management (new page) |
| `UsersPage.tsx` | `src/pages/Users.tsx` | 🔄 TO COPY | User management (new page) |

### Modals & Overlays
| Figma Component | Target Location | Status | Description |
|----------------|-----------------|--------|-------------|
| `AddResidentModal.tsx` | `src/components/modals/AddResidentModal.tsx` | 🔄 TO COPY | Professional add resident form |
| `ResidentDetailsModal.tsx` | `src/components/modals/ResidentDetailsModal.tsx` | 🔄 TO COPY | Professional resident details view |
| `NewConversationModal.tsx` | `src/components/modals/NewConversationModal.tsx` | 🔄 TO COPY | Message conversation creation |

### Supporting Components
| Figma Component | Target Location | Status | Description |
|----------------|-----------------|--------|-------------|
| `SearchFilters.tsx` | `src/components/SearchFilters.tsx` | ✅ COMPLETED | Advanced filtering system |
| `ResidentCard.tsx` | `src/components/cards/ResidentCard.tsx` | 🔄 TO UPDATE | Professional resident card |
| `ChatView.tsx` | `src/components/messaging/ChatView.tsx` | 🔄 TO COPY | Message chat interface |
| `ConversationList.tsx` | `src/components/messaging/ConversationList.tsx` | 🔄 TO COPY | Conversation list |
| `Header.tsx` | `src/components/layout/Header.tsx` | 🔄 TO COPY | Professional header |
| `Sidebar.tsx` | `src/components/layout/Sidebar.tsx` | 🔄 TO COPY | Professional sidebar |
| `StatCard.tsx` | `src/components/cards/StatCard.tsx` | 🔄 TO COPY | Dashboard statistics |
| `NotificationPanel.tsx` | `src/components/notifications/NotificationPanel.tsx` | 🔄 TO COPY | Notification system |
| `QuickActions.tsx` | `src/components/QuickActions.tsx` | 🔄 TO COPY | Quick action buttons |

### UI Components (Already Created)
| Component | Location | Status | Description |
|-----------|----------|--------|-------------|
| `pagination.tsx` | `src/components/ui/pagination.tsx` | ✅ CREATED | Professional pagination |
| `checkbox.tsx` | `src/components/ui/checkbox.tsx` | ✅ CREATED | Checkbox component |
| `input.tsx` | `src/components/ui/input.tsx` | ✅ CREATED | Input component |
| `select.tsx` | `src/components/ui/select.tsx` | ✅ CREATED | Select dropdown |
| `popover.tsx` | `src/components/ui/popover.tsx` | ✅ CREATED | Popover component |
| `slider.tsx` | `src/components/ui/slider.tsx` | ✅ CREATED | Range slider |
| `badge.tsx` | `src/components/ui/badge.tsx` | ✅ CREATED | Badge component |

## 🔄 Repeatable Process

### 1. Pre-Copy Analysis
- [ ] Examine Figma component dependencies
- [ ] Identify required UI components
- [ ] Check for new types/interfaces needed
- [ ] Map API integration points

### 2. Copy Process
```bash
# Step 1: Copy the main component
cp "Figma/extracted/src/components/[ComponentName].tsx" "src/pages/[PageName].tsx"

# Step 2: Copy supporting components
cp "Figma/extracted/src/components/[SupportComponent].tsx" "src/components/[category]/[SupportComponent].tsx"

# Step 3: Copy any new UI components to src/components/ui/
```

### 3. Integration Steps
- [ ] Update imports to match our project structure
- [ ] Replace mock data with API hooks (useResidents, useStaff, etc.)
- [ ] Update routing in App.tsx
- [ ] Ensure TypeScript compilation
- [ ] Test professional features

### 4. Quality Assurance
- [ ] Build successfully (`npm run build`)
- [ ] All TypeScript errors resolved
- [ ] Professional UI features working
- [ ] API integration functional
- [ ] Responsive design verified

## 📋 Current Project Structure

```
src/
├── pages/
│   ├── Dashboard.tsx
│   ├── Facilities.tsx
│   ├── Login.tsx
│   ├── Residents.tsx ✅ (Professional Figma version)
│   ├── Staff.tsx (to be replaced)
│   └── Notifications.tsx (to be replaced with Messages.tsx)
├── components/
│   ├── ui/ ✅ (Complete UI library)
│   ├── cards/ (to be created)
│   ├── messaging/ (to be created)
│   ├── modals/ (to be created)
│   ├── layout/ (to be created)
│   └── notifications/ (to be created)
├── hooks/ ✅ (Complete API hooks)
├── services/ ✅ (Complete API services)
├── types/ ✅ (Complete type definitions)
└── lib/ ✅ (Utilities)
```

## 🎯 Benefits of This Structure

1. **Repeatable Process**: Clear mapping for future Figma updates
2. **Professional Consistency**: All pages follow same design system
3. **Component Reusability**: Organized by category for easy maintenance
4. **API Integration**: Clear separation between UI and business logic
5. **TypeScript Safety**: Proper type definitions throughout

## 🔄 Future Figma Updates

When new Figma designs are provided:

1. Extract to `Figma/extracted/` directory
2. Follow this mapping guide to copy components
3. Apply integration steps systematically
4. Update this document with any new mappings
5. Test and validate professional features

This approach ensures that future design changes can be integrated quickly and consistently while maintaining our professional API integration layer.