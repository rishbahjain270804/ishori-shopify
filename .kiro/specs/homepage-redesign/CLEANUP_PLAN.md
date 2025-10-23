# Project Cleanup & Optimization Plan

## Files to Delete (Old Homepage)

### Pages
- ✅ `frontend/src/pages/Home.jsx` - Old homepage (replaced by HomeRedesign.jsx)
- ✅ `frontend/src/pages/Home.css` - Old homepage styles
- ✅ `frontend/src/pages/HomeNew.css` - Unused intermediate styles

### Status
These files are no longer needed as HomeRedesign.jsx is the new homepage.

## MongoDB Integration Tasks

### Backend API Endpoints Needed
1. `GET /api/products?featured=true&limit=8` - Featured products
2. `GET /api/collections?featured=true&limit=6` - Featured collections  
3. `POST /api/newsletter/subscribe` - Newsletter subscription

### Image Handling
- Images stored in MongoDB GridFS or as file references
- Use `getImageUrl()` utility from apiClient.js
- Already implemented in components

## Color System Optimization

### Current Colors (from BRAND_COLORS.md)
- Primary: Blood Red (#D00000), Deep Burgundy (#680C09)
- Neutrals: Off-White (#F7F3EF), Beige (#DACBB7)
- Accents: Blush Pink (#EDDADA), Dusty Rose (#CB8587)
- Modern: Yimm Blue (#2EAC88)

### Actions Needed
1. Create centralized CSS variables file
2. Update all components to use CSS variables
3. Remove hardcoded colors
4. Ensure consistency across all components

## Next Steps
1. Delete old files
2. Create centralized color system
3. Update App.jsx routing
4. Verify MongoDB connections
5. Test all components

---
**Date**: 2025-10-23
**Status**: In Progress
