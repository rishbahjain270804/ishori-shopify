/**
 * Ishori Design System - Spacing & Layout
 * 
 * Consistent spacing system for harmonious design
 */

export const spacing = {
  // Base unit: 4px
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px',

  // Specific use cases
  component: {
    padding: {
      xs: '8px 12px',
      sm: '12px 16px',
      md: '16px 24px',
      lg: '24px 32px',
      xl: '32px 48px',
    },
    gap: {
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
  },

  // Container
  container: {
    mobile: '100%',
    tablet: '720px',
    desktop: '1140px',
    wide: '1320px',
    padding: '16px',
  },

  // Border Radius
  borderRadius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    full: '9999px',
  },
};

export default spacing;
