import { Facility } from '../types/facility';

export const getFacilityTheme = (facility: Facility) => {
  return {
    primaryColor: facility.settings.primaryColor,
    secondaryColor: facility.settings.secondaryColor,
    theme: facility.settings.theme,
    
    // CSS custom properties for the facility theme
    cssVariables: {
      '--facility-primary': facility.settings.primaryColor,
      '--facility-secondary': facility.settings.secondaryColor,
    },
    
    // Tailwind-compatible color classes
    tailwindClasses: {
      primary: `[color:${facility.settings.primaryColor}]`,
      secondary: `[color:${facility.settings.secondaryColor}]`,
      primaryBg: `[background-color:${facility.settings.primaryColor}]`,
      secondaryBg: `[background-color:${facility.settings.secondaryColor}]`,
    }
  };
};

export const formatFacilityAddress = (facility: Facility) => {
  const { street, city, state, zipCode } = facility.address;
  return {
    full: `${street}, ${city}, ${state} ${zipCode}`,
    short: `${city}, ${state}`,
    cityState: `${city}, ${state}`,
    withZip: `${city}, ${state} ${zipCode}`
  };
};

export const formatFacilityContact = (facility: Facility) => {
  const { phone, email, website } = facility.contact;
  return {
    phone,
    email,
    website,
    phoneFormatted: phone, // Could add phone formatting logic here
    emailLink: `mailto:${email}`,
    websiteLink: website || '#'
  };
};