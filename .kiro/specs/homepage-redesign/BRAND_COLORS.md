# Ishori Brand Colors - Updated from Brand Guidelines

## Primary Brand Colors

### Blood Red / Rosso Corsa
- **Hex**: #D00000
- **Usage**: Primary CTA buttons, error states, accent elements
- **Description**: Bold, confident red representing passion and tradition

### Lava Falls (Deep Red)
- **Hex**: #A52A2A
- **Pantone**: 18-1552 TCX
- **Usage**: Hover states, secondary accents
- **Description**: Rich, deep red for depth and sophistication

### Deep Burgundy
- **Hex**: #680C09
- **Usage**: Text accents, pricing, important information
- **Description**: Dark, luxurious burgundy for premium feel

## Neutral Colors

### Vanilla / Peach Schnapps
- **Hex**: #FFD8D9
- **Usage**: Soft backgrounds, secondary buttons, highlights
- **Description**: Soft, warm peachy tone for feminine elegance

### Off-White
- **Hex**: #F7F3EF
- **Usage**: Main backgrounds, card backgrounds
- **Description**: Warm off-white for soft, inviting feel

### Beige
- **Hex**: #DACBB7
- **Usage**: Secondary backgrounds, borders, subtle accents
- **Description**: Warm beige for earthy, natural aesthetic

### Black
- **Hex**: #010101
- **Usage**: Primary text, strong contrast elements
- **Description**: Deep black for clarity and readability

## Spring Palette (Accent Colors)

### Olive
- **Hex**: #8E8B63
- **Usage**: Natural accents, category icons
- **Description**: Earthy olive for organic, traditional feel

### Sage
- **Hex**: #D6D4AD
- **Usage**: Soft backgrounds, subtle highlights
- **Description**: Soft sage green for calm, natural aesthetic

### Blush Pink
- **Hex**: #EDDADA
- **Usage**: Feminine accents, soft overlays
- **Description**: Delicate blush for romantic, elegant touch

### Dusty Rose
- **Hex**: #CB8587
- **Usage**: Secondary accents, hover states
- **Description**: Muted rose for sophisticated femininity

## Modern Accent Colors

### Yimm Blue
- **Hex**: #2EAC88
- **Usage**: Success states, info messages, modern accents
- **Description**: Fresh teal for contemporary touch

### Old Lace
- **Hex**: #FFF3E1
- **Usage**: Warm backgrounds, card highlights
- **Description**: Creamy off-white for vintage elegance

### Accent Red
- **Hex**: #FA2D1A
- **Usage**: Urgent CTAs, sale badges, attention elements
- **Description**: Bright red for high-impact moments

## Color Usage Guidelines

### Primary Actions
- Use **Blood Red (#D00000)** for primary CTAs
- Use **Vanilla (#FFD8D9)** for secondary CTAs
- Ensure white text on red buttons for contrast

### Product Cards
- Background: Off-white (#F7F3EF) with glassmorphism
- Price: Deep Burgundy (#680C09)
- Hover accent: Blood Red (#D00000)

### Text Hierarchy
- Headings: Black (#010101)
- Body text: Black (#010101) with 0.85 opacity
- Secondary text: Beige (#DACBB7) or muted tones
- Price/Important: Deep Burgundy (#680C09)

### Backgrounds
- Main: Off-white (#F7F3EF)
- Sections: Gradient from Vanilla to Old Lace
- Cards: Glassmorphism with rgba(255,255,255,0.6)

### Accents & Highlights
- Spring palette for seasonal collections
- Dusty Rose for feminine touches
- Olive/Sage for traditional/handcrafted sections

## Accessibility Notes

- Blood Red (#D00000) on white meets WCAG AA (4.5:1 contrast)
- Deep Burgundy (#680C09) on off-white meets WCAG AA
- Always test color combinations for sufficient contrast
- Use text labels in addition to color for important information

## Implementation in CSS

```css
:root {
  /* Primary Brand */
  --brand-blood-red: #D00000;
  --brand-lava-falls: #A52A2A;
  --brand-deep-burgundy: #680C09;
  --brand-vanilla: #FFD8D9;
  
  /* Neutrals */
  --neutral-off-white: #F7F3EF;
  --neutral-beige: #DACBB7;
  --neutral-black: #010101;
  
  /* Spring Palette */
  --accent-olive: #8E8B63;
  --accent-sage: #D6D4AD;
  --accent-blush-pink: #EDDADA;
  --accent-dusty-rose: #CB8587;
  
  /* Modern */
  --accent-yimm-blue: #2EAC88;
  --accent-old-lace: #FFF3E1;
  --accent-red: #FA2D1A;
}
```

This color system replaces the previous rose gold/lavender palette with a more sophisticated, traditional Indian aesthetic that aligns with the brand guidelines.
