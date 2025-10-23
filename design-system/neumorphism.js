/**
 * Ishori Design System - Neumorphism Styles
 * 
 * Soft UI design with shadows and depth
 */

export const neumorphism = {
  // Light Theme
  light: {
    base: {
      background: '#F8F8F8',
      boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)',
    },
    pressed: {
      boxShadow: 'inset 8px 8px 16px rgba(0, 0, 0, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.9)',
    },
    flat: {
      boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)',
    },
  },

  // Dark Theme
  dark: {
    base: {
      background: '#2C2C2C',
      boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.05)',
    },
    pressed: {
      boxShadow: 'inset 8px 8px 16px rgba(0, 0, 0, 0.3), inset -8px -8px 16px rgba(255, 255, 255, 0.05)',
    },
    flat: {
      boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)',
    },
  },

  // Accent (Rose Gold)
  accent: {
    base: {
      background: '#B76E79',
      boxShadow: '8px 8px 16px rgba(183, 110, 121, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.1)',
    },
    pressed: {
      boxShadow: 'inset 8px 8px 16px rgba(183, 110, 121, 0.3), inset -8px -8px 16px rgba(255, 255, 255, 0.1)',
    },
  },

  // Component Variants
  button: {
    borderRadius: '12px',
    padding: '12px 24px',
    transition: 'all 0.3s ease',
  },

  card: {
    borderRadius: '20px',
    padding: '24px',
    transition: 'all 0.3s ease',
  },

  input: {
    borderRadius: '12px',
    padding: '12px 16px',
    transition: 'all 0.3s ease',
  },
};

export default neumorphism;
