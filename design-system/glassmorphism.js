/**
 * Ishori Design System - Glassmorphism Styles
 * 
 * Beautiful glass morphism effects for modern UI
 */

export const glassmorphism = {
  // Glass Cards
  card: {
    light: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    },
    dark: {
      background: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
    },
    accent: {
      background: 'rgba(183, 110, 121, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(183, 110, 121, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(183, 110, 121, 0.15)',
    },
  },

  // Buttons
  button: {
    primary: {
      background: 'rgba(183, 110, 121, 0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(183, 110, 121, 0.3)',
      boxShadow: '0 4px 16px 0 rgba(183, 110, 121, 0.2)',
      hover: {
        background: 'rgba(183, 110, 121, 0.3)',
        boxShadow: '0 6px 20px 0 rgba(183, 110, 121, 0.3)',
      },
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 16px 0 rgba(255, 255, 255, 0.1)',
      hover: {
        background: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 6px 20px 0 rgba(255, 255, 255, 0.2)',
      },
    },
  },

  // Inputs
  input: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    focus: {
      border: '1px solid rgba(183, 110, 121, 0.5)',
      boxShadow: '0 0 0 3px rgba(183, 110, 121, 0.1)',
    },
  },

  // Navigation
  nav: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  },

  // Modal/Overlay
  modal: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  },
};

export default glassmorphism;
