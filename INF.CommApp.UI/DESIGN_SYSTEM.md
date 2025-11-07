# ALC CommApp Design System & Style Guide

## 🎨 Brand Colors

### Primary Brand Colors (from ALC Logo)
- **Facility Primary**: `hsl(200, 25%, 55%)` - Teal Blue (#5A8FA3)
- **Facility Secondary**: `hsl(83, 18%, 65%)` - Sage Green (#A4B494)  
- **Facility Light**: `hsl(200, 50%, 97%)` - Light Teal Background
- **Facility Border**: `hsl(200, 25%, 45%)` - Darker Teal for borders

### Semantic Colors
- **Success**: `hsl(142, 76%, 36%)` - Green (#10b981)
- **Warning**: `hsl(38, 92%, 50%)` - Amber (#f59e0b)
- **Error**: `hsl(0, 84%, 60%)` - Red (#ef4444)

## 🔧 CSS Custom Properties Usage

### ✅ DO - Use CSS Custom Properties
```css
/* Good - Uses design system */
.nav-button-active {
  background-color: hsl(var(--facility-light));
  color: hsl(var(--facility-primary));
  border-left: 4px solid hsl(var(--facility-primary));
}
```

### ❌ DON'T - Use Hardcoded Colors
```css
/* Bad - Hardcoded colors */
.nav-button-active {
  background-color: #eff6ff;
  color: #2563eb;
}
```

## 🧩 Component Patterns

### Navigation Buttons
```tsx
// Consistent navigation button styling
const navButtonClass = cn(
  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left border-l-4",
  isActive
    ? "bg-[hsl(var(--facility-light))] text-[hsl(var(--facility-primary))] border-[hsl(var(--facility-primary))] font-medium shadow-sm"
    : "text-gray-600 hover:bg-gray-50 hover:text-[hsl(var(--facility-primary))] border-transparent"
);
```

### Action Buttons
```tsx
// Primary action button
<Button variant="default" className="bg-[hsl(var(--facility-primary))]">
  Save Changes
</Button>

// Secondary action button  
<Button variant="outline">
  Cancel
</Button>

// Danger action button
<Button variant="destructive">
  Delete
</Button>
```

## 📏 Spacing Scale

Use consistent spacing throughout the app:
- **xs**: `0.5rem` (8px)
- **sm**: `0.75rem` (12px) 
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)
- **2xl**: `3rem` (48px)

## 🏗️ Best Practices

### 1. Use Existing shadcn/ui Components
✅ Leverage the existing component library for consistency
```tsx
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
```

### 2. Consistent State Styling
✅ All interactive elements should have consistent states:
- **Default**: Neutral colors
- **Hover**: Subtle background change + facility primary color
- **Active/Selected**: Facility light background + facility primary text + left border
- **Focus**: Ring with facility primary color
- **Disabled**: Reduced opacity

### 3. Use CSS Custom Properties
✅ Always use CSS custom properties for colors:
```css
color: hsl(var(--facility-primary));
background-color: hsl(var(--facility-light));
```

### 4. Consistent Transitions
✅ Use `transition-all` for smooth interactions:
```css
transition-all duration-200 ease-in-out
```

### 5. Border Accents for Active States
✅ Use left border to indicate active navigation items:
```css
border-left: 4px solid hsl(var(--facility-primary));
```

## 🎯 Implementation Checklist

- [x] CSS custom properties defined in index.css
- [x] Navigation buttons use consistent facility branding  
- [x] Active states have left border accent
- [x] Hover states use facility primary color
- [x] Smooth transitions on all interactive elements
- [x] Primary action buttons use facility branding (Add Resident, Add Staff, Add Vendor, Add User)
- [x] Avatar fallbacks use consistent facility colors
- [x] Selection banners use facility branding
- [ ] Form components use facility branding
- [ ] All modal buttons follow consistent patterns
- [ ] All pages implement consistent design system

## 🔄 Migration Strategy

1. **Phase 1**: Update navigation components (✅ Complete)
2. **Phase 2**: Update form components and inputs
3. **Phase 3**: Update action buttons and CTAs
4. **Phase 4**: Update cards, modals, and data displays
5. **Phase 5**: Ensure all pages follow the design system

This design system ensures consistent branding and user experience across the entire ALC CommApp platform.