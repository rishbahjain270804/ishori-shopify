/**
 * Ishori Design System
 * 
 * Complete design system for Ishori saree brand
 * Combining glassmorphism and neumorphism with women-centric aesthetics
 */

import colors from './colors.js';
import glassmorphism from './glassmorphism.js';
import neumorphism from './neumorphism.js';
import typography from './typography.js';
import spacing from './spacing.js';

export const theme = {
  colors,
  glassmorphism,
  neumorphism,
  typography,
  spacing,

  // Breakpoints
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },

  // Animations
  animations: {
    transition: {
      fast: '150ms ease-in-out',
      normal: '300ms ease-in-out',
      slow: '500ms ease-in-out',
    },
    ease: {
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Z-Index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export default theme;

// Brand Information
export const brandInfo = {
  name: 'Ishori',
  tagline: 'Elegance Redefined',
  contact: {
    email: 'connectishori@gmail.com',
    phone: ['+91 8306038989', '+91 8107708989'],
    address: 'Near old nagar Palika, Kotputli 303108',
  },
  domain: 'ishori.com',
};
