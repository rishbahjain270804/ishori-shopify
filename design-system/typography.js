/**
 * Ishori Design System - Typography
 * 
 * Elegant typography for luxury saree brand
 */

export const typography = {
  // Font Families
  fonts: {
    primary: "'Playfair Display', serif", // Elegant, luxury feel
    secondary: "'Inter', sans-serif", // Modern, clean
    hindi: "'Noto Sans Devanagari', sans-serif", // For Hindi text
    accent: "'Cormorant Garamond', serif", // For special headings
  },

  // Font Sizes
  sizes: {
    // Desktop
    h1: '64px',
    h2: '48px',
    h3: '36px',
    h4: '28px',
    h5: '24px',
    h6: '20px',
    body: '16px',
    bodyLarge: '18px',
    bodySmall: '14px',
    caption: '12px',
    button: '16px',

    // Mobile
    mobile: {
      h1: '40px',
      h2: '32px',
      h3: '28px',
      h4: '24px',
      h5: '20px',
      h6: '18px',
      body: '16px',
      bodyLarge: '17px',
      bodySmall: '14px',
      caption: '12px',
    },
  },

  // Font Weights
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Styles
  styles: {
    h1: {
      fontSize: '64px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      fontFamily: "'Playfair Display', serif",
    },
    h2: {
      fontSize: '48px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      fontFamily: "'Playfair Display', serif",
    },
    h3: {
      fontSize: '36px',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: "'Playfair Display', serif",
    },
    h4: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: "'Playfair Display', serif",
    },
    body: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: "'Inter', sans-serif",
    },
    bodyLarge: {
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: "'Inter', sans-serif",
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.025em',
      fontFamily: "'Inter', sans-serif",
    },
    button: {
      fontSize: '16px',
      fontWeight: 500,
      letterSpacing: '0.025em',
      fontFamily: "'Inter', sans-serif",
    },
  },
};

export default typography;
