# Quick Figma Sync Changes

## 🔥 CRITICAL FIXES NEEDED

### 1. **Button Text Color Fix**
**Problem**: All primary blue buttons currently show dark/black text  
**Fix**: Change text color to **white (#ffffff)** on all blue buttons

**Specific buttons to update**:
- "Add New Resident" 
- "Add Staff Member"
- "Add Vendor" 
- "Add User"
- All "Save Changes" buttons in modals
- All "Add [Item]" buttons in dialogs

**Color spec**: `background: #2563eb` + `text: #ffffff` (white)

### 2. **Logo Area Branding**
**Problem**: Generic placeholder branding  
**Fix**: Update sidebar logo area only

**Replace with**:
- Logo: "ALC" 
- Text: "Valencia Assisted Living of Cottonwood"
- Subtitle: "Cottonwood, AZ"

**IMPORTANT**: Only change the logo area - keep ALL navigation colors as original Figma blue

### 3. **Enhanced Button States**
**Problem**: Missing hover states  
**Fix**: Add hover state to primary buttons

**Hover color**: `#1d4ed8` (darker blue)

---

## ✅ What to Keep UNCHANGED

- All navigation menu colors (stay Figma blue #2563eb)
- All active/hover states for navigation items
- All other UI colors and styling
- Overall layout and spacing

---

## 🎯 Result Check

After changes:
- [ ] Blue buttons have white text (easily readable)
- [ ] Logo shows ALC branding 
- [ ] Navigation stays original Figma blue
- [ ] Buttons have proper hover states

That's it! Just these 3 specific changes to sync with our implementation.