# Implementation Plan

## Overview

This implementation plan breaks down the homepage redesign into discrete, actionable coding tasks. Each task builds incrementally on previous work, ensuring the homepage comes together systematically. All tasks reference specific requirements and design specifications from the requirements.md and design.md documents.

---

- [x] 1. Setup and Foundation


  - Create new homepage component structure and establish base styling with design system tokens
  - Create `frontend/src/pages/HomeNew.jsx` as the new homepage component
  - Create `frontend/src/pages/HomeNew.css` for homepage-specific styles
  - Import design system tokens from `design-system/index.js` and apply CSS custom properties
  - Set up base layout structure with semantic HTML5 elements (main, section)
  - Implement responsive container with max-width 1320px and proper padding
  - _Requirements: 9.1, 9.4, 10.1_

- [x] 2. Hero Section Implementation


  - Implement the hero section with full-width imagery, glassmorphism overlay, and call-to-action buttons
  
- [x] 2.1 Create HeroSection component structure


  - Create `frontend/src/components/homepage/HeroSection.jsx`
  - Create `frontend/src/components/homepage/HeroSection.css`
  - Implement component with props interface for heroImage, tagline, subtitle, primaryCTA, secondaryCTA
  - Set up full-width container with 85vh height on desktop, 70vh on mobile
  - Add hero image with object-fit cover and lazy loading
  - _Requirements: 1.1, 1.2_

- [x] 2.2 Implement hero content overlay and glassmorphism styling

  - Create centered content container with gradient backdrop (linear-gradient transparent to rgba(0,0,0,0.3))
  - Implement glassmorphism card with backdrop-filter blur(14px) and rgba(255,255,255,0.15) background
  - Style tagline with Playfair Display 64px on desktop, 48px on mobile
  - Add subtitle with Cormorant Garamond 20px
  - Apply responsive padding and max-width constraints
  - _Requirements: 1.2, 1.5, 9.2, 9.3_

- [x] 2.3 Create CTA buttons with hover animations

  - Implement two CTA buttons (primary and secondary) with Link components
  - Style primary button with blood red background (#D00000) and white text
  - Style secondary button with vanilla/beige tint (rgba(218,203,183,0.3))
  - Add hover animations: translateY(-2px) and shadow elevation increase
  - Implement 300ms transition with cubic-bezier(0.4, 0, 0.2, 1) easing
  - Add 16px gap between buttons using flexbox
  - _Requirements: 1.3, 1.4, 9.6_

- [x] 2.4 Add scroll indicator with pulse animation

  - Create scroll indicator component at bottom of hero section
  - Implement downward chevron icon with pulse animation
  - Add smooth scroll behavior when clicked
  - Style with glassmorphism effect
  - _Requirements: 1.1_

- [x] 2.5 Implement parallax scroll effect for hero image






  - Add scroll event listener to track scroll position
  - Apply transform translateY to hero image based on scroll position (0.5 speed multiplier)
  - Optimize performance using requestAnimationFrame
  - Clean up event listener on component unmount
  - _Requirements: 1.1_

- [x] 3. Featured Collections Section



  - Build the featured collections grid with responsive layout and collection cards

- [x] 3.1 Create CollectionCard component



  - Create `frontend/src/components/homepage/CollectionCard.jsx`
  - Create `frontend/src/components/homepage/CollectionCard.css`
  - Implement component with props interface for id, name, image, itemCount, slug
  - Set up card container with 3:4 aspect ratio and border-radius 20px
  - Add collection image with object-fit cover and lazy loading
  - Implement Link wrapper for navigation to collection detail page
  - _Requirements: 2.1, 2.6_


- [x] 3.2 Implement collection card hover overlay

  - Create overlay div with glassmorphism effect (backdrop-filter blur(8px), rgba(255,255,255,0.25))
  - Add collection name with Playfair Display 24px
  - Add item count with Inter 14px
  - Implement opacity transition from 0 to 1 on hover
  - Add scale(1.02) transform and shadow elevation on hover
  - Apply 300ms transition timing
  - _Requirements: 2.5, 9.6_

- [x] 3.3 Create FeaturedCollectionsSection component with responsive grid


  - Create `frontend/src/components/homepage/FeaturedCollectionsSection.jsx`
  - Create section header with "Featured Collections" title (Playfair Display 48px)
  - Implement CSS Grid layout for collection cards
  - Desktop (>1024px): 3 columns with 24px gap
  - Tablet (768-1023px): 2 columns with 20px gap
  - Mobile (<768px): 1 column with 16px gap
  - Map through collections array and render CollectionCard components
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3.4 Add API integration for fetching collections
  - Import apiGet utility from `@/utils/apiClient`
  - Implement useEffect hook to fetch collections on component mount
  - Call `/api/collections?featured=true&limit=6` endpoint
  - Handle loading state with skeleton placeholders
  - Handle error state with friendly error message
  - Update collections state with fetched data
  - _Requirements: 2.1_

- [ ] 4. Product Showcase Section
  - Implement the featured products grid with product cards and quick view functionality

- [x] 4.1 Create ProductCard component structure


  - Create `frontend/src/components/homepage/ProductCard.jsx`
  - Create `frontend/src/components/homepage/ProductCard.css`
  - Implement component with props interface for product, onQuickView, onWishlistToggle, isInWishlist
  - Set up glassmorphism card container (rgba(255,255,255,0.6), border-radius 20px)
  - Add product image with 280px height and object-fit cover
  - Implement lazy loading for product image
  - _Requirements: 3.1, 3.2, 9.2, 9.5_

- [x] 4.2 Add product information and pricing

  - Create product info section with 16px padding
  - Display product name with Inter Semi-bold 16px, 2-line clamp
  - Display price with Inter Bold 18px in deep burgundy color (#680C09)
  - Format price as INR currency (₹)
  - Add proper spacing between elements using design system tokens
  - _Requirements: 3.2, 9.3, 9.4_

- [x] 4.3 Implement wishlist button with toggle functionality


  - Create wishlist button with absolute positioning (top-right of card)
  - Use heart icon from react-icons (FiHeart for outline, FiHeartFill for filled)
  - Style button with glassmorphism effect
  - Implement onClick handler to call onWishlistToggle prop
  - Add fill animation when toggling wishlist state
  - Toggle between outline and filled heart based on isInWishlist prop
  - _Requirements: 3.6_

- [x] 4.4 Add Quick View button with hover reveal


  - Create Quick View button that appears on card hover
  - Position button centered at bottom of image area
  - Style with glassmorphism effect and blood red accent (#D00000)
  - Implement opacity transition from 0 to 1 on card hover
  - Add onClick handler to call onQuickView prop with product ID
  - _Requirements: 3.2, 3.3_

- [x] 4.5 Implement card hover animations


  - Add hover state with translateY(-4px) transform
  - Increase shadow elevation on hover (0 12px 28px rgba(0,0,0,0.08))
  - Apply 300ms transition with cubic-bezier easing
  - Ensure Quick View button fades in smoothly
  - _Requirements: 9.6_

- [x] 4.6 Create ProductShowcaseSection component


  - Create `frontend/src/components/homepage/ProductShowcaseSection.jsx`
  - Add section header with "Featured Products" title
  - Implement responsive grid layout for product cards (4 columns desktop, 2 tablet, 1 mobile)
  - Set up state for managing quick view modal and selected product
  - Implement onQuickView handler to open modal with selected product
  - Implement onWishlistToggle handler (integrate with global wishlist state later)
  - Map through products array and render ProductCard components
  - _Requirements: 3.1, 3.2_

- [x] 4.7 Add API integration for fetching featured products


  - Import apiGet and getImageUrl utilities from `@/utils/apiClient`
  - Implement useEffect hook to fetch products on component mount
  - Call `/api/products?featured=true&limit=8` endpoint
  - Handle loading state with skeleton placeholders matching ProductCard dimensions
  - Handle error state with retry button
  - Update products state with fetched data
  - _Requirements: 3.4, 3.5_

- [x] 4.8 Add "View All Products" button


  - Create button below product grid
  - Style with glassmorphism effect and rose gold accent
  - Link to `/collections` page
  - Center align button
  - _Requirements: 3.1_

- [ ] 5. Quick View Modal Implementation
  - Build the quick view modal for displaying product details without page navigation

- [x] 5.1 Create QuickViewModal component structure


  - Create `frontend/src/components/homepage/QuickViewModal.jsx`
  - Create `frontend/src/components/homepage/QuickViewModal.css`
  - Implement component with props interface for isOpen, onClose, product
  - Create full-screen overlay with rgba(0,0,0,0.6) and backdrop-filter blur(4px)
  - Create modal container with max-width 900px and glassmorphism styling
  - Implement conditional rendering based on isOpen prop
  - Add close button (top-right, glass button with X icon)
  - _Requirements: 3.3_

- [x] 5.2 Implement modal layout and product image gallery


  - Create two-column layout on desktop (image left 50%, details right 50%)
  - Create single-column layout on mobile (image top, details bottom)
  - Implement main product image display with 500px height
  - Add thumbnail strip below main image (4-5 thumbnails, horizontal scroll)
  - Implement thumbnail click to change main image
  - Add image zoom on hover for desktop
  - _Requirements: 3.3_

- [x] 5.3 Add product details and actions


  - Display product name with Playfair Display 32px
  - Display price with Inter Bold 24px in deep burgundy color (#680C09)
  - Show product description with 16px Inter, max 3 lines
  - Add size selector with radio buttons or dropdown
  - Add quantity selector with increment/decrement buttons
  - Create "Add to Cart" CTA button with blood red background (#D00000)
  - Display stock status (In Stock / Out of Stock)
  - _Requirements: 3.3_

- [x] 5.4 Implement modal open/close animations

  - Add fade-in animation for overlay (opacity 0 to 1, 200ms)
  - Add scale animation for modal container (scale 0.9 to 1, 300ms)
  - Implement close on overlay click (not on modal content click)
  - Implement close on Escape key press
  - Add fade-out animation when closing
  - Prevent body scroll when modal is open
  - _Requirements: 3.3_

- [x] 5.5 Integrate Add to Cart functionality



  - Implement onClick handler for Add to Cart button
  - Validate size and quantity selection
  - Call cart API or update cart state
  - Show success toast notification "Added to cart!"
  - Update cart count in navbar
  - Optionally close modal after successful add
  - _Requirements: 3.3_

- [ ] 6. Category Navigation Section
  - Create the category navigation section for browsing by product type

- [x] 6.1 Create CategoryItem component


  - Create `frontend/src/components/homepage/CategoryItem.jsx`
  - Create `frontend/src/components/homepage/CategoryItem.css`
  - Implement component with props interface for name, icon, slug
  - Create circular container (120px diameter desktop, 100px mobile)
  - Style with glassmorphism background (rgba(255,255,255,0.4), backdrop-filter blur(10px))
  - Add category icon/image centered (80% of container size)
  - Add category label below container (14px Inter Medium, centered)
  - _Requirements: 4.1, 4.4_

- [x] 6.2 Implement category item hover effects

  - Add scale(1.05) transform on hover
  - Increase shadow elevation on hover
  - Apply 300ms transition
  - Add cursor pointer
  - _Requirements: 4.1_

- [x] 6.3 Create CategoryNavigationSection component


  - Create `frontend/src/components/homepage/CategoryNavigationSection.jsx`
  - Add section header with "Shop by Category" title
  - Define categories array with 6 items: Silk Sarees, Cotton Sarees, Designer Sarees, Wedding Collection, Festive Wear, Casual Wear
  - Implement grid layout for desktop (6 columns, 16px gap)
  - Implement horizontal scroll for mobile with snap-scroll behavior (3.5 items visible)
  - Map through categories and render CategoryItem components
  - Wrap each CategoryItem with Link to `/collections?category={slug}`
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [ ] 7. Brand Story Section
  - Implement the brand story section to communicate Ishori's values and heritage

- [x] 7.1 Create BrandStorySection component


  - Create `frontend/src/components/homepage/BrandStorySection.jsx`
  - Create `frontend/src/components/homepage/BrandStorySection.css`
  - Implement two-column layout on desktop (content 50%, image 50%)
  - Implement single-column layout on mobile (content top, image bottom)
  - Add section padding and background (subtle gradient or solid color)
  - _Requirements: 5.1, 5.4_

- [x] 7.2 Add brand story content

  - Create story heading with Playfair Display 40px "Our Story"
  - Add story text (max 150 words) with Cormorant Garamond 18px
  - Include brand values and craftsmanship description
  - Add "Learn More" CTA button linking to `/about` page
  - Style button with glassmorphism effect
  - _Requirements: 5.2, 5.3, 5.5_

- [x] 7.3 Add brand story imagery

  - Display craftsmanship or artisan work image
  - Set image width to 50% on desktop, 100% on mobile
  - Add border-radius 20px
  - Implement lazy loading
  - Add subtle shadow for depth
  - _Requirements: 5.4_

- [ ] 8. Customer Testimonials Section
  - Build the testimonials section with carousel functionality

- [x] 8.1 Create TestimonialCard component








  - Create `frontend/src/components/homepage/TestimonialCard.jsx`
  - Create `frontend/src/components/homepage/TestimonialCard.css`
  - Implement component with props interface for quote, customerName, rating, customerPhoto, verified
  - Style card with glassmorphism (rgba(255,255,255,0.6), border-radius 16px, padding 24px)
  - Add decorative quote icon (top-left, mauve color, 32px)
  - Display quote text with Cormorant Garamond Italic 16px, 4-line clamp
  - _Requirements: 6.2_

- [x] 8.2 Add customer information and rating

  - Implement 5-star rating display (filled stars based on rating prop)
  - Create customer info section with flex row layout
  - Add customer photo (48px circle) if available
  - Display customer name with Inter Semi-bold 14px
  - Add verified badge (checkmark icon) if verified prop is true
  - _Requirements: 6.2_

- [x] 8.3 Create TestimonialsSection component with carousel


  - Create `frontend/src/components/homepage/TestimonialsSection.jsx`
  - Add section header with "Customer Reviews" title
  - Define testimonials array with 5-6 sample testimonials
  - Implement carousel state (activeIndex, auto-play timer)
  - Display 3 testimonials on desktop, 1 on mobile
  - Add navigation arrows (previous/next) for desktop
  - Add dot indicators at bottom synced with activeIndex
  - _Requirements: 6.1, 6.3, 6.4_

- [x] 8.4 Implement carousel auto-rotation and controls

  - Set up auto-rotation timer (5 seconds interval)
  - Implement pause on hover functionality
  - Add click handlers for navigation arrows (increment/decrement activeIndex)
  - Add click handlers for dot indicators (set activeIndex)
  - Implement swipe gestures for mobile using touch events
  - Clean up timer on component unmount
  - _Requirements: 6.5_

- [ ] 9. Newsletter Subscription Section
  - Create the newsletter signup section with form validation and API integration

- [x] 9.1 Create NewsletterSection component structure


  - Create `frontend/src/components/homepage/NewsletterSection.jsx`
  - Create `frontend/src/components/homepage/NewsletterSection.css`
  - Set up full-width section with gradient background (soft rose to lavender)
  - Create centered content container with max-width 600px
  - Add section heading with Playfair Display 32px "Stay Updated"
  - Add subtext with Inter 16px describing newsletter benefits
  - _Requirements: 7.1_

- [x] 9.2 Implement newsletter form with validation


  - Create form with email input and submit button
  - Style input with glassmorphism effect, 48px height, rounded-full
  - Style submit button with blood red background (#D00000), rounded-full, 48px height
  - Implement flex row layout on desktop, column on mobile
  - Add email format validation using regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - Add required field validation
  - Display inline error message for validation failures
  - _Requirements: 7.1, 7.5_

- [x] 9.3 Add form submission and API integration


  - Implement onSubmit handler to prevent default form submission
  - Disable input and button during submission
  - Show loading spinner in submit button during API call
  - Call POST `/api/newsletter/subscribe` with email and source: 'homepage'
  - Handle success response with toast notification "Thank you for subscribing!"
  - Handle error response with toast notification showing error message
  - Clear form input on success
  - Re-enable form on completion
  - _Requirements: 7.2, 7.3, 7.4_


- [x] 9.4 Add privacy assurance text

  - Display privacy text below form with 12px Inter, muted color
  - Text: "We respect your privacy. Unsubscribe anytime."
  - Center align text
  - _Requirements: 7.6_

- [ ] 10. Performance Optimizations
  - Implement performance enhancements for fast load times and smooth interactions

- [x] 10.1 Implement lazy loading for images

  - Add loading="lazy" attribute to all images below the fold
  - Implement Intersection Observer for custom lazy loading if needed
  - Add blur-up placeholder technique for progressive image loading
  - Preload hero section image and critical fonts
  - _Requirements: 8.2, 8.6_

- [x] 10.2 Optimize images and implement responsive images

  - Convert images to WebP format with JPEG fallback
  - Implement srcset for responsive image sizes
  - Compress images to reduce file size
  - Use appropriate image dimensions for each breakpoint
  - _Requirements: 8.1_

- [x] 10.3 Implement code splitting and lazy loading for components


  - Lazy load QuickViewModal component using React.lazy and Suspense
  - Implement route-based code splitting
  - Split vendor bundles for better caching
  - _Requirements: 8.1_

- [x] 10.4 Add loading skeletons for async content

  - Create skeleton components matching ProductCard and CollectionCard dimensions
  - Display skeletons while fetching products and collections
  - Implement shimmer animation effect for skeletons
  - _Requirements: 3.5_

- [ ]* 10.5 Implement intersection observer for scroll animations
  - Create custom hook useIntersectionObserver
  - Apply fade-in animations to sections as they scroll into view
  - Optimize performance by disconnecting observer after animation
  - _Requirements: 8.5_

- [ ] 11. Accessibility Enhancements
  - Ensure the homepage is fully accessible to all users

- [x] 11.1 Add semantic HTML and ARIA labels


  - Use semantic HTML5 elements (header, nav, main, section, article, footer)
  - Add ARIA labels for icon-only buttons (wishlist, close modal, navigation arrows)
  - Implement proper heading hierarchy (h1 for hero title, h2 for section titles, h3 for subsections)
  - Add role attributes where appropriate
  - _Requirements: 10.1, 10.4, 10.5_

- [x] 11.2 Implement keyboard navigation

  - Ensure all interactive elements are keyboard accessible (tab navigation)
  - Add visible focus indicators for all focusable elements
  - Implement logical tab order
  - Add "Skip to main content" link at top of page
  - Ensure modal traps focus when open and returns focus on close
  - _Requirements: 10.3_

- [x] 11.3 Add descriptive alt text for images

  - Write descriptive alt text for all product images
  - Write descriptive alt text for collection images
  - Write descriptive alt text for brand story imagery
  - Use empty alt="" for decorative images
  - _Requirements: 10.2_

- [x] 11.4 Ensure color contrast and visual accessibility

  - Verify all text meets WCAG AA contrast ratio (4.5:1 minimum)
  - Ensure focus indicators are visible against all backgrounds
  - Don't convey information by color alone (use icons or text)
  - Test with color blindness simulators
  - _Requirements: 1.5, 10.3_

- [ ] 12. SEO and Meta Tags
  - Implement SEO best practices for search engine visibility

- [x] 12.1 Add meta tags and Open Graph tags


  - Add page title: "Ishori - Premium Indian Sarees | Elegance Redefined"
  - Add meta description (150-160 characters) highlighting key offerings
  - Add Open Graph tags (og:title, og:description, og:image, og:url)
  - Add Twitter Card tags
  - Add canonical URL
  - _Requirements: 10.6_

- [x] 12.2 Implement structured data (JSON-LD)


  - Add Organization schema with brand information
  - Add Product schema for featured products
  - Add BreadcrumbList schema for navigation
  - Validate structured data using Google's Rich Results Test
  - _Requirements: 10.6_

- [ ]* 12.3 Optimize for Core Web Vitals
  - Measure and optimize Largest Contentful Paint (LCP) - target < 2.5s
  - Measure and optimize First Input Delay (FID) - target < 100ms
  - Measure and optimize Cumulative Layout Shift (CLS) - target < 0.1
  - Run Lighthouse audit and address issues
  - Test on real devices and network conditions
  - _Requirements: 8.1_

- [ ] 13. Integration and Testing
  - Wire up all components and ensure everything works together

- [x] 13.1 Integrate all sections into HomeNew component

  - Import all section components into HomeNew.jsx
  - Arrange sections in proper order: Hero, Collections, Products, Categories, Brand Story, Testimonials, Newsletter
  - Pass required props to each section component
  - Ensure proper spacing between sections
  - Test responsive behavior at all breakpoints
  - _Requirements: All_

- [x] 13.2 Update routing to use new homepage


  - Update App.jsx to use HomeNew component for root route
  - Test navigation from homepage to other pages
  - Ensure all links work correctly
  - Test back button behavior
  - _Requirements: All_

- [x] 13.3 Test cross-browser compatibility


  - Test on Chrome, Firefox, Safari, Edge
  - Test on mobile browsers (iOS Safari, Chrome Mobile)
  - Fix any browser-specific issues
  - Verify glassmorphism effects work across browsers
  - _Requirements: All_

- [ ]* 13.4 Perform manual testing of all interactions
  - Test all CTAs and navigation links
  - Test Quick View modal open/close
  - Test wishlist toggle functionality
  - Test newsletter form submission
  - Test carousel navigation and auto-rotation
  - Test responsive behavior on different devices
  - Test keyboard navigation
  - Test with screen reader
  - _Requirements: All_

---

## Notes

- Tasks marked with `*` are optional and focus on enhancements beyond core functionality
- Each task references specific requirements from requirements.md
- Tasks are designed to be completed sequentially, with each building on previous work
- All components should use the existing design system tokens from `design-system/index.js`
- API endpoints assume backend is already set up with product and collection endpoints
- Testing tasks are optional but recommended for production-ready code
