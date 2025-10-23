# Ishori Design System Documentation

## Overview

The Ishori design system combines **glassmorphism** and **neumorphism** design patterns with a carefully curated color palette that celebrates femininity and elegance.

## Design Philosophy

### Core Principles
1. **Elegance First** - Every design element should exude sophistication
2. **Women-Centric** - Colors and aesthetics that resonate with our target audience
3. **Cultural Heritage** - Respect for traditional Indian aesthetics
4. **Modern Touch** - Contemporary UI patterns with glass and soft shadows

## Color System

### Primary Colors
```css
--color-primary-white: #FFFFFF;
--color-primary-black: #0A0A0A;
--color-off-white: #F8F8F8;
--color-charcoal: #2C2C2C;
```

### Women-centric Accent Colors
```css
--color-rose-gold: #B76E79;      /* Primary accent */
--color-blush: #FFC2D1;          /* Soft pink */
--color-mauve: #E0B0FF;          /* Elegant purple */
--color-lavender: #E6E6FA;       /* Light purple */
--color-peach: #FFE5B4;          /* Warm peach */
--color-coral: #FF6B9D;          /* Vibrant coral */
--color-burgundy: #800020;       /* Deep red */
--color-champagne: #F7E7CE;      /* Subtle gold */
```

### Traditional Indian Colors
```css
--color-saffron: #FF9933;
--color-vermillion: #E34234;
--color-turmeric: #FFC72C;
--color-mehendi: #6B8E23;
--color-royal: #4B0082;
--color-peacock: #009B77;
```

## Typography

### Font Families
- **Playfair Display** - Luxury serif for headings
- **Inter** - Modern sans-serif for body text
- **Cormorant Garamond** - Decorative serif for special elements
- **Noto Sans Devanagari** - For Hindi/Devanagari text

### Type Scale
```
H1: 64px / 40px (mobile) - Bold 700
H2: 48px / 32px (mobile) - Bold 700
H3: 36px / 28px (mobile) - Semibold 600
H4: 28px / 24px (mobile) - Semibold 600
Body: 16px - Regular 400
Caption: 12px - Regular 400
```

## Glassmorphism

### Properties
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
```

### Use Cases
- Navigation bars
- Cards and overlays
- Buttons (secondary actions)
- Modal backgrounds
- Search bars

### Implementation
```jsx
<div className="glass-card">
  {/* Content */}
</div>
```

## Neumorphism

### Light Theme
```css
background: #F8F8F8;
box-shadow: 
  8px 8px 16px rgba(0, 0, 0, 0.1),
  -8px -8px 16px rgba(255, 255, 255, 0.9);
```

### Use Cases
- Form inputs
- Feature cards
- Settings panels
- Elevated surfaces

### Implementation
```jsx
<div className="neumorphic-card">
  {/* Content */}
</div>
```

## Spacing System

Based on 4px unit:
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
4xl: 96px
```

## Border Radius
```
xs: 4px   - Small elements
sm: 8px   - Buttons, inputs
md: 12px  - Cards
lg: 16px  - Larger cards
xl: 24px  - Hero sections
2xl: 32px - Special surfaces
full: 9999px - Pills, circular
```

## Animation Guidelines

### Transition Speeds
```
fast: 150ms    - Hover states, small interactions
normal: 300ms  - Standard transitions
slow: 500ms    - Page transitions, large movements
```

### Easing Functions
```
ease-in: cubic-bezier(0.4, 0, 1, 1)
ease-out: cubic-bezier(0, 0, 0.2, 1)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

## Component Patterns

### Glass Button
```css
.glass-button {
  background: rgba(183, 110, 121, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(183, 110, 121, 0.3);
  padding: 14px 32px;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(183, 110, 121, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(183, 110, 121, 0.3);
}
```

### Neumorphic Card
```css
.neumorphic-card {
  background: #F8F8F8;
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
}
```

### Text Gradient
```css
.text-gradient {
  background: linear-gradient(135deg, #B76E79 0%, #E0B0FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## Responsive Breakpoints

```
mobile: 320px   - Small phones
tablet: 768px   - Tablets
desktop: 1024px - Laptops
wide: 1440px    - Large screens
```

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Minimum contrast ratio: 4.5:1 for body text
- Minimum contrast ratio: 3:1 for large text

### Focus States
```css
:focus {
  outline: none;
  border-color: rgba(183, 110, 121, 0.5);
  box-shadow: 0 0 0 3px rgba(183, 110, 121, 0.1);
}
```

## Usage Examples

### Creating a Product Card
```jsx
<div className="glass-card" style={{ padding: '24px' }}>
  <img src={productImage} alt={productName} />
  <h3 className="card-title">{productName}</h3>
  <p className="card-price text-gradient">₹{price}</p>
  <button className="glass-button">Add to Cart</button>
</div>
```

### Hero Section
```jsx
<section className="hero">
  <h1 className="hero-title">
    Embrace <span className="text-gradient">Timeless Elegance</span>
  </h1>
  <p className="hero-subtitle">Discover our collection</p>
  <button className="btn-primary glass-button">Explore</button>
</section>
```

## Best Practices

1. **Consistency** - Use design tokens consistently across the application
2. **Performance** - Use backdrop-filter sparingly (it's GPU-intensive)
3. **Hierarchy** - Maintain clear visual hierarchy with size and weight
4. **Spacing** - Use the spacing system for consistent layouts
5. **Testing** - Test glassmorphism effects on different backgrounds
6. **Accessibility** - Always ensure sufficient contrast

## Resources

- Google Fonts: [fonts.google.com](https://fonts.google.com)
- Color Palette: Use the defined color system
- Icons: React Icons library
- Images: Optimize all images for web

---

**Design System Version:** 1.0.0  
**Last Updated:** October 2024  
**Maintained by:** Ishori Design Team
