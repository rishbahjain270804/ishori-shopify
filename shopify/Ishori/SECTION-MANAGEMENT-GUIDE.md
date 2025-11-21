# Ishori Theme - Section Management Guide

## Overview
Complete guide to managing spacing, sizing, and styling for all sections in your Ishori Shopify theme.

---

## 📏 Spacing System

### Spacing Scale
- **XS**: 8px - Tight spacing
- **SM**: 12px - Small spacing
- **MD**: 20px - Medium spacing (default)
- **LG**: 32px - Large spacing
- **XL**: 48px - Extra large spacing
- **2XL**: 64px - Section spacing
- **3XL**: 80px - Hero section spacing

---

## 🎬 Video Section

### Height Options
- **Small**: 50vh (400px minimum)
- **Medium**: 65vh (500px minimum)
- **Large**: 80vh (600px minimum)
- **Full**: 100vh (Full viewport height)

### Aspect Ratios
- **16:9** - Standard widescreen (recommended for YouTube/Vimeo)
- **21:9** - Ultra-wide cinematic
- **4:3** - Traditional video format

### Best Practices
- Use 16:9 for hero videos
- Minimum video quality: 1920x1080 (Full HD)
- Recommended: 3840x2160 (4K) for large displays
- Keep file size under 10MB for web performance

### Shopify Admin Controls
```
Settings → Sections → Video
- Enable video looping: ✓
- Full width: ✓ (for hero)
- Padding top: 0px (for hero)
- Padding bottom: 0px (for hero)
```

---

## 🛍️ Featured Collection (Product Grid)

### Product Card Dimensions

#### Image Aspect Ratios
- **Square (1:1)** - 600x600px
  - Best for: Consistent grid layout
  - Use case: Modern, minimalist stores
  
- **Portrait (3:4)** - 600x800px
  - Best for: Sarees, fashion items
  - Use case: **Recommended for Ishori**
  - Shows full product length
  
- **Landscape (4:3)** - 800x600px
  - Best for: Wide products, accessories
  
- **Wide (16:9)** - 960x540px
  - Best for: Banners, lifestyle shots

#### Recommended Settings for Sarees
```
Image ratio: Portrait (3:4)
Image size: 800x1066px
Products to show: 8-12
Columns (Desktop): 4
Columns (Mobile): 2
Gap: Medium (20px)
Border radius: 8px
```

### Grid Layout
- **2 Columns**: Large product focus, minimal inventory
- **3 Columns**: Balanced, good for medium inventory
- **4 Columns**: Standard e-commerce (recommended)
- **5 Columns**: Dense layout, large inventory
- **6 Columns**: Maximum density

### Spacing Controls
```
Padding Top: 60px (standard)
Padding Bottom: 60px (standard)
Gap between products: 20px (adjustable)
Card padding: 12-20px
```

---

## 📂 Collection List

### Collection Card Dimensions

#### Image Aspect Ratios
- **Square (1:1)** - 800x800px
  - Best for: Icon-style collections
  
- **Portrait (3:4)** - 800x1066px
  - Best for: Fashion collections
  - **Recommended for Ishori**
  
- **Landscape (4:3)** - 800x600px
  - Best for: Wide collection banners

#### Recommended Settings
```
Image ratio: Portrait (3:4)
Image size: 1000x1333px
Number of collections: 3-4
Columns (Desktop): 3-4
Columns (Mobile): 2
Border radius: 12px
```

### Collection Card Sizing
- **Small**: 300x400px (mobile)
- **Medium**: 400x533px (tablet)
- **Large**: 500x666px (desktop)

---

## 🎨 Image Banner

### Banner Heights
- **Small**: 300px minimum
- **Medium**: 450px minimum (recommended for promotional banners)
- **Large**: 600px minimum (hero alternative)
- **XL**: 750px minimum (full-screen impact)

### Aspect Ratios
- **16:9** - 1920x1080px - Standard hero banner
- **21:9** - 2560x1080px - Ultra-wide banner
- **4:3** - 1600x1200px - Traditional banner
- **3:2** - 1800x1200px - Photography-friendly

### Recommended Banner Sizes
```
Desktop Hero: 1920x1080px (16:9)
Promotional Banner: 1920x600px (16:5)
Sale Banner: 1600x500px
Mobile Banner: 750x1000px (portrait)
```

### Content Positioning
- Top Left / Top Center / Top Right
- Middle Left / **Middle Center (recommended)** / Middle Right
- Bottom Left / Bottom Center / Bottom Right

---

## 📱 Multicolumn Section

### Column Layouts
- **2 Columns**: Side-by-side features
- **3 Columns**: Why Choose Us, Features
- **4 Columns**: Services, Benefits, Instagram feed
- **5 Columns**: Icon grid, Trust badges

### Icon/Image Sizing
```
Icon size: 60-80px
Feature image: 400x400px (square)
Instagram posts: 640x640px (square)
```

### Spacing
```
Gap between columns:
- Small: 12px
- Medium: 20px (recommended)
- Large: 32px
- XL: 40px

Column padding: 20-32px
```

---

## 🎠 Slideshow/Gallery

### Slide Dimensions
```
Desktop: 1920x800px (recommended)
Tablet: 1024x600px
Mobile: 750x1000px (portrait)
```

### Heights
- **Small**: 400px - Compact gallery
- **Medium**: 550px - Standard slideshow
- **Large**: 700px - Featured gallery
- **Full**: 100vh - Full-screen experience

### Recommended Settings
```
Auto-rotate: ✓
Change slides speed: 5 seconds
Slider visual: Dots (for 3-5 slides)
Number of slides: 3-5 (optimal)
Border radius: 8-12px
```

---

## 📧 Newsletter Section

### Form Width
- **Narrow**: 640px - Focused signup
- **Medium**: 768px - Standard (recommended)
- **Wide**: 1024px - Spacious layout

### Spacing
```
Section padding:
- Compact: 32px top/bottom
- Standard: 64px top/bottom (recommended)
- Spacious: 80px top/bottom

Input height: 48px
Button height: 48px
Border radius: 8px
```

---

## 📝 Rich Text/Brand Story

### Content Width
- **Narrow**: 640px - Blog posts, long-form
- **Medium**: 768px - Standard (recommended)
- **Wide**: 1024px - Editorial content

### Typography Spacing
```
Heading margin-bottom: 20px
Paragraph spacing: 12px
Section padding: 64px top/bottom
```

---

## 📐 Recommended Dimensions Summary

### Hero Section
```
Video: 1920x1080px (16:9)
Height: 80vh (600px minimum)
Padding: 0px top/bottom
```

### Product Cards
```
Images: 800x1066px (3:4 portrait)
Card width: Auto (grid-based)
Gap: 20px
Border radius: 8px
```

### Collection Cards
```
Images: 1000x1333px (3:4 portrait)
Card width: Auto (grid-based)
Gap: 20px
Border radius: 12px
```

### Banners
```
Hero: 1920x1080px (16:9)
Promotional: 1920x600px
Sale: 1600x500px
Height: 450-600px
Border radius: 8-12px
```

### Instagram Feed
```
Posts: 640x640px (1:1 square)
Columns: 4
Gap: 20px
Border radius: 8px
```

---

## 🎯 Best Practices

### Image Optimization
1. **Always use WebP format** when possible
2. **Compress images** before upload (TinyPNG, ShortPixel)
3. **Use appropriate dimensions** - don't upload 4000px images for 600px display
4. **Alt text** - Always add descriptive alt text

### Aspect Ratio Guidelines
- **Sarees/Fashion**: Use 3:4 portrait
- **Accessories**: Use 1:1 square
- **Lifestyle**: Use 16:9 or 4:3
- **Banners**: Use 16:9 for consistency

### Spacing Guidelines
- **Section padding**: 60-80px for desktop, 40-48px for mobile
- **Grid gaps**: 20px standard, 32px for spacious layouts
- **Card padding**: 16-20px inside cards
- **Margin between elements**: 12-20px

### Performance Tips
1. **Limit products per section** to 12-16
2. **Use lazy loading** for below-fold images
3. **Optimize video** - compress to under 10MB
4. **Consistent aspect ratios** reduce layout shift

---

## 🔧 Shopify Admin Quick Access

### To Adjust Section Settings:
1. Go to: **Online Store → Themes → Customize**
2. Click on any section
3. Right panel shows all controls:
   - Padding top/bottom
   - Image ratio
   - Columns
   - Colors
   - Border radius (via custom classes)

### To Add Custom Classes:
Some advanced controls require adding CSS classes:
```liquid
<div class="section--padding-lg rounded-xl">
  <!-- Your content -->
</div>
```

---

## 📱 Responsive Breakpoints

### Desktop
- Width: 990px and above
- Product columns: 4-6
- Collection columns: 3-4
- Multicolumn: 3-4

### Tablet
- Width: 750px - 989px
- Product columns: 2-3
- Collection columns: 2-3
- Multicolumn: 2-3

### Mobile
- Width: Below 750px
- Product columns: 2
- Collection columns: 2
- Multicolumn: 1-2

---

## 🎨 Custom Sizing Examples

### Tight Layout (Dense)
```
Product gap: 12px (--gap-sm)
Section padding: 32px (--spacing-lg)
Card padding: 12px
Border radius: 4px (--radius-sm)
```

### Standard Layout (Recommended)
```
Product gap: 20px (--gap-md)
Section padding: 60px
Card padding: 16px
Border radius: 8px (--radius-md)
```

### Spacious Layout (Luxury)
```
Product gap: 32px (--gap-lg)
Section padding: 80px (--spacing-3xl)
Card padding: 24px
Border radius: 12px (--radius-lg)
```

---

## 💡 Pro Tips

1. **Maintain consistency** - Use same aspect ratio across similar sections
2. **Test on mobile** - 60% of traffic is mobile
3. **White space is good** - Don't cram too much content
4. **Hierarchy** - Larger spacing for section breaks, smaller for related items
5. **Brand alignment** - Ishori is luxury, use spacious layouts

---

## 📞 Support

For custom sizing needs or advanced modifications, refer to:
- `assets/section-management.css` - All spacing/sizing variables
- `assets/moora-inspired-enhancements.css` - Brand-specific styles
- `assets/performance-optimizations.css` - Layout optimization

---

**Last Updated**: November 22, 2025  
**Version**: 1.0  
**Theme**: Ishori Shopify (Refresh v15.4.0)
