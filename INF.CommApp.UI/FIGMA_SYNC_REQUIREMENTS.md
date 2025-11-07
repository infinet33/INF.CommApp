# Figma Sync Requirements

## Summary
This document outlines the changes needed in the Figma design to stay synchronized with our current implementation. Our codebase has evolved beyond the original Figma design with facility branding, enhanced navigation, and improved styling consistency.

## 🏥 Facility Branding Integration

### 1. **Logo and Branding**
- **Current Implementation**: ALC (Assisted Living Center) logo with "Valencia Assisted Living of Cottonwood"
- **Figma Needs**: Update sidebar logo area to show facility-specific branding
- **Files Affected**: `src/types/facility.ts`, `src/services/facilityService.ts`
- **Components**: `Sidebar.tsx`, `NormalUserSidebar.tsx`

### 2. **Color Scheme Updates**
- **Current Implementation**: Facility-specific color variables
  ```css
  --facility-primary: #5A8FA3 (Soft teal-blue)
  --facility-secondary: #A4B494 (Sage green) 
  --facility-light: #F8FAFB (Very light blue-gray)
  ```
- **Figma Needs**: Create facility branding color tokens and apply to navigation elements
- **Usage**: Sidebar active states, accent colors, facility-specific UI elements

## 🎨 Navigation Enhancements

### 3. **Sidebar Active States**
- **Current Implementation**: 
  - Left border accent (`border-l-4 border-[var(--facility-primary)]`)
  - Facility-colored backgrounds for active nav items
  - Smooth transitions and hover effects
- **Figma Needs**: Update sidebar components with:
  - Active state indicators with facility colors
  - Hover state designs
  - Transition specifications

### 4. **Navigation Typography**
- **Current Implementation**: Consistent text hierarchy with facility branding
- **Figma Needs**: Update text styles to match implemented typography scale

## 🔘 Button Styling Consistency

### 5. **Primary Action Buttons**
- **Current Implementation**: 
  ```css
  bg-[#2563eb] hover:bg-[#1d4ed8] text-white
  ```
- **Figma Needs**: Ensure all primary buttons show:
  - Blue background (#2563eb)
  - **White text** (this was recently added)
  - Darker blue hover state (#1d4ed8)
- **Affected Pages**: ResidentsPage, StaffPage, VendorsPage, UsersPage
- **Button Types**: "Add New Resident", "Add Staff Member", "Add Vendor", "Add User"

### 6. **Button Component Library**
- **Current Implementation**: `PrimaryButton` component created for consistency
- **Figma Needs**: Create reusable button components in Figma component library
- **File**: `src/components/ui/primary-button.tsx`

## 📋 Data Structure Updates

### 7. **Enhanced Data Models**
- **Current Implementation**: Comprehensive interfaces for:
  - `Resident`: 25+ properties including medical alerts, emergency contacts
  - `StaffMember`: Role-based with department/shift information
  - `Vendor`: Service type categorization with detailed contact info
  - `User`: Doctor-focused with specialty and organization fields
- **Figma Needs**: Update mockups to reflect rich data structure
- **Files**: Component interfaces in each page file

### 8. **Medical Alert System**
- **Current Implementation**: Visual indicators for fall risk, allergies, dietary restrictions
- **Figma Needs**: Design medical alert badge system and color coding
- **Component**: `ResidentCard.tsx` medical alerts display

## 🎯 Layout and Spacing

### 9. **Responsive Grid Systems**
- **Current Implementation**: 
  - Responsive resident cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
  - Consistent 6-unit spacing (`space-y-6`, `gap-6`)
- **Figma Needs**: Update layouts to show responsive breakpoints

### 10. **Modal and Dialog Consistency**
- **Current Implementation**: Standardized dialog patterns across all pages
- **Figma Needs**: Create consistent modal component library
- **Components**: Add/Edit dialogs for all entity types

## 🔧 Component Architecture

### 11. **Search and Filter Components**
- **Current Implementation**: `SearchFilters` component with advanced filtering
- **Figma Needs**: Design comprehensive search/filter UI patterns
- **File**: `src/components/SearchFilters.tsx`

### 12. **Pagination System**
- **Current Implementation**: shadcn/ui pagination with 8 items per page
- **Figma Needs**: Design pagination component states and variations
- **Component**: Used in `ResidentsPage.tsx`

## 📊 Status and Priority Indicators

### 13. **Status Badge System**
- **Current Implementation**: Color-coded status badges
  - Active: Green (`bg-[#dcfce7] text-[#16a34a]`)
  - Inactive: Gray (`bg-[#f1f5f9] text-[#64748b]`)
- **Figma Needs**: Create status badge component library

### 14. **Role-Based Color Coding**
- **Current Implementation**: Different colors for different roles/types
- **Figma Needs**: Document color system for role categorization

## 🚀 Implementation Priority

### High Priority (Critical for Design Sync)
1. **Button text color** - All primary buttons should show white text
2. **Facility branding integration** - Logo and color scheme updates
3. **Navigation active states** - Left border accents and facility colors

### Medium Priority (Enhanced UX)
4. **Data structure updates** - Rich content in mockups
5. **Medical alert system** - Badge design and color coding
6. **Responsive layouts** - Breakpoint specifications

### Low Priority (Nice to Have)
7. **Component library standardization** - Reusable Figma components
8. **Advanced filtering UI** - Complex search interface designs

## 📁 Key Files for Reference

### Design System
- `DESIGN_SYSTEM.md` - Complete style guide
- `src/index.css` - CSS custom properties

### Facility Integration
- `src/types/facility.ts` - Facility data structure
- `src/services/facilityService.ts` - Facility service layer

### Component Examples
- `src/components/Sidebar.tsx` - Enhanced navigation
- `src/components/ResidentsPage.tsx` - Complete page example
- `src/components/ui/primary-button.tsx` - Consistent button styling

## 💡 Recommendations

1. **Create Figma Tokens**: Use design tokens for facility colors and consistent styling
2. **Component Library**: Build reusable Figma components matching our React components
3. **Documentation**: Maintain design-development sync documentation
4. **Regular Reviews**: Schedule periodic design-code alignment reviews

---

**Last Updated**: November 6, 2025  
**Status**: Active - Implementation ahead of design  
**Next Action**: Review with design team for prioritization