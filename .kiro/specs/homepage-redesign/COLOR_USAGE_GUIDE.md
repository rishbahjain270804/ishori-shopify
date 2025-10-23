# Color System Usage Guide

## Quick Reference

### Primary Colors
```css
var(--brand-blood-red)      /* #D00000 - Primary CTA, accents */
var(--brand-deep-burgundy)  /* #680C09 - Text accents, pricing */
var(--brand-vanilla)        /* #FFD8D9 - Secondary buttons */
```

### Semantic Aliases (Recommended)
```css
var(--color-primary)        /* Primary action color */
var(--color-primary-hover)  /* Hover state */
var(--color-text-primary)   /* Main text */
var(--color-bg-primary)     /* Main background */
```

### Glassmorphism
```css
background: var(--glass-bg-medium);
backdrop-filter: var(--glass-blur);
border: 1px solid var(--glass-border);
box-shadow: var(--glass-shadow);
```

### Spacing
```css
padding: var(--spacing-md);     /* 16px */
margin: var(--spacing-lg);      /* 24px */
gap: var(--spacing-xl);         /* 32px */
```

### Transitions
```css
transition: all var(--transition-normal);  /* 300ms */
```

## Examples

### Button
```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-2xl);
  transition: all var(--transition-normal);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}
```

### Card
```css
.card {
  background: var(--glass-bg-heavy);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--glass-shadow);
}
```

### Text
```css
.heading {
  color: var(--color-text-primary);
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
}

.body-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}
```

## All Available Variables

See `frontend/src/styles/colors.css` for the complete list of 100+ variables!
