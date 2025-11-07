// Design system configuration for consistent styling across the app

export const theme = {
  colors: {
    // Primary brand colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
    
    // Facility brand colors (from ALC branding)
    facility: {
      primary: '#5A8FA3',    // Teal blue from logo
      secondary: '#A4B494',  // Sage green from logo
      light: '#f0f7fa',     // Light teal background
    },
    
    // Semantic colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
  },
  
  borderRadius: {
    sm: '0.25rem',  // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem',   // 8px
    xl: '0.75rem',  // 12px
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  }
};

// Component variants for consistent styling
export const variants = {
  button: {
    // Primary navigation button (active state)
    navActive: `
      bg-[${theme.colors.facility.light}] 
      text-[${theme.colors.facility.primary}] 
      border-l-4 
      border-[${theme.colors.facility.primary}]
      font-medium
    `,
    
    // Primary navigation button (inactive state)  
    navInactive: `
      text-[${theme.colors.gray[600]}] 
      hover:bg-[${theme.colors.gray[50]}] 
      hover:text-[${theme.colors.facility.primary}]
      border-l-4 
      border-transparent
    `,
    
    // Primary action button
    primary: `
      bg-[${theme.colors.facility.primary}] 
      text-white 
      hover:bg-[#4a7c95] 
      shadow-sm
      font-medium
    `,
    
    // Secondary action button
    secondary: `
      bg-white 
      text-[${theme.colors.gray[700]}] 
      border 
      border-[${theme.colors.gray[300]}] 
      hover:bg-[${theme.colors.gray[50]}]
      shadow-sm
    `,
    
    // Danger/delete button
    danger: `
      bg-[${theme.colors.error}] 
      text-white 
      hover:bg-red-600
      shadow-sm
      font-medium
    `,
  },
  
  input: {
    default: `
      border 
      border-[${theme.colors.gray[300]}] 
      rounded-[${theme.borderRadius.md}] 
      px-3 
      py-2 
      focus:outline-none 
      focus:ring-2 
      focus:ring-[${theme.colors.facility.primary}] 
      focus:border-transparent
    `
  },
  
  card: {
    default: `
      bg-white 
      rounded-[${theme.borderRadius.lg}] 
      shadow-[${theme.shadows.sm}] 
      border 
      border-[${theme.colors.gray[200]}]
    `
  }
};