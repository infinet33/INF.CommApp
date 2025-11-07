# Figma Update Prompt

## 🎯 Objective
Update the Figma design to sync with our current React implementation. Our codebase has evolved with facility branding, enhanced navigation, and improved styling that needs to be reflected in the design system.

## 📋 Specific Changes Required

### 🔥 **CRITICAL UPDATES (Must Complete)**

#### 1. **Fix Primary Button Text Color**
```
CURRENT FIGMA: Blue buttons likely show dark/black text
REQUIRED CHANGE: All primary action buttons must show WHITE text on blue background

Buttons to Update:
- "Add New Resident" button (ResidentsPage)
- "Add Staff Member" button (StaffPage) 
- "Add Vendor" button (VendorsPage)
- "Add User" button (UsersPage)
- All modal "Save" and "Add" buttons

Color Specification:
- Background: #2563eb
- Text: #ffffff (white)
- Hover state: #1d4ed8
```

#### 2. **Add Facility Branding System**
```
CURRENT FIGMA: Generic/placeholder branding
REQUIRED CHANGE: Implement ALC facility-specific branding in LOGO AREA ONLY

Logo & Text (for sidebar header only):
- Company: "ALC" (Assisted Living Center)
- Facility: "Valencia Assisted Living of Cottonwood"
- Location: "Cottonwood, AZ"

Facility Color Palette (ONLY for logo/facility name area):
- Primary: #5A8FA3 (Soft teal-blue)
- Secondary: #A4B494 (Sage green)
- Light: #F8FAFB (Very light blue-gray)

IMPORTANT: Keep all other UI elements (navigation, buttons, etc.) in original Figma colors
```

#### 3. **Enhanced Navigation Sidebar**
```
CURRENT FIGMA: Basic sidebar states
REQUIRED CHANGE: Add facility branding in logo area ONLY, keep original navigation colors

Updates Needed:
- Logo area: Show ALC logo + facility name text
- Active states: Keep original Figma blue colors (#2563eb) - DO NOT use facility colors
- Active background: Keep original Figma blue tint
- Hover states: Keep original Figma design
- Typography: Add facility name below logo, but keep navigation items in original colors
- IMPORTANT: Only the logo/facility name should use facility branding, navigation should stay Figma blue
```

### 🎨 **MEDIUM PRIORITY UPDATES**

#### 4. **Enhanced Data Display**
```
Add richer content to show our comprehensive data models:

Resident Cards:
- Medical alert badges (fall risk, allergies, dietary)
- Emergency contact information
- Detailed medical information
- Room assignments with care levels

Staff/Vendor/User Tables:
- Role-based color coding
- Department/specialty information
- Comprehensive contact details
- Status indicators with proper colors
```

#### 5. **Status Badge System**
```
Create consistent status badge components:

Active Status:
- Background: #dcfce7 (light green)
- Text: #16a34a (dark green)

Inactive Status:
- Background: #f1f5f9 (light gray)
- Text: #64748b (dark gray)

Role Badges (varied colors):
- Care Coordinator: #2563eb border/text
- Nurse: #8b5cf6 border/text
- Doctor: #dc2626 border/text
- Administrator: #dc2626 border/text
```

#### 6. **Responsive Grid System**
```
Update layouts to show responsive behavior:

Resident Cards Grid:
- Mobile: 1 column
- Tablet: 2 columns  
- Desktop: 3 columns
- Large: 4 columns

Consistent spacing: 24px gaps (gap-6)
```

### 🔧 **COMPONENT LIBRARY UPDATES**

#### 7. **Create Reusable Components**
```
Build Figma component library matching our React components:

Primary Button Component:
- Default state: Blue background, white text
- Hover state: Darker blue
- Disabled state: Gray
- Various sizes: sm, default, lg

Modal Component:
- Consistent header styling
- Form layouts
- Button arrangements
- Responsive behavior

Badge Components:
- Status badges (active/inactive)
- Role badges (color-coded)
- Medical alert badges
```

## 🎯 **Testing & Validation**

After making changes, please verify:

1. **Button Contrast**: All blue buttons have white text that's clearly readable
2. **Facility Branding**: ALC logo and facility name in sidebar header only (not navigation colors)
3. **Navigation**: Active states maintain original Figma blue colors
4. **Component Consistency**: All similar elements use the same styling
5. **Responsive Behavior**: Layouts work across different screen sizes

## 📤 **Export Requirements**

Once changes are complete, please export:

1. **Development Assets**:
   - Updated design tokens/variables
   - Component specifications
   - Color palette documentation

2. **Design System Documentation**:
   - Component library guide
   - Spacing and typography scales
   - Color usage guidelines

3. **Implementation Reference**:
   - Annotated screens showing measurements
   - Component states (hover, active, disabled)
   - Responsive breakpoint specifications

## 🔍 **Review Checklist**

Before considering complete, ensure:

- [ ] All primary buttons show white text on blue background
- [ ] ALC facility branding is integrated in logo area only (navigation stays Figma blue)
- [ ] Navigation sidebar shows enhanced active states with original Figma blue colors
- [ ] Status badges use correct color coding
- [ ] Component library includes all major UI elements
- [ ] Responsive layouts are properly specified
- [ ] Medical alert system is designed and color-coded
- [ ] Modal/dialog patterns are consistent across all pages

## 📞 **Questions/Clarifications**

If any specifications need clarification:

1. **Reference Implementation**: Check our React components for exact styling
2. **Color Codes**: All colors are provided in hex format above
3. **Component Behavior**: Focus on visual states, transitions can be basic
4. **Priority**: Complete Critical Updates first, then Medium Priority items

## 🚀 **Success Criteria**

The update will be successful when:
- Design and implementation are visually aligned
- Facility branding is applied only to logo/facility name area
- Navigation maintains original Figma blue colors
- Button text is properly readable (white on blue)
- Component library supports our current features
- Export provides clear implementation guidance

---

**Timeline**: Please prioritize Critical Updates first
**Next Step**: Export updated design system for development team review