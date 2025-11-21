/**
 * Advanced Performance & UX Enhancements
 * Professional Shopify theme optimization
 * Version: 1.0
 */

(function() {
  'use strict';

  // ================================
  // LAZY LOADING OPTIMIZATION
  // ================================
  
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      images.forEach(img => imageObserver.observe(img));
    }
  };

  // ================================
  // DEBOUNCE UTILITY
  // ================================
  
  const debounce = (func, wait = 100) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // ================================
  // THROTTLE UTILITY
  // ================================
  
  const throttle = (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ================================
  // SMOOTH SCROLL TO TOP
  // ================================
  
  const initScrollToTop = () => {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    const toggleButton = throttle(() => {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, 200);

    window.addEventListener('scroll', toggleButton, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  // ================================
  // OPTIMIZE SCROLL PERFORMANCE
  // ================================
  
  const optimizeScrollPerformance = () => {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Perform scroll-based operations here
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  };

  // ================================
  // PREFETCH ON HOVER
  // ================================
  
  const prefetchOnHover = () => {
    const links = document.querySelectorAll('a[href^="/"]');
    const prefetched = new Set();

    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const href = link.href;
        if (href && !prefetched.has(href)) {
          const linkTag = document.createElement('link');
          linkTag.rel = 'prefetch';
          linkTag.href = href;
          document.head.appendChild(linkTag);
          prefetched.add(href);
        }
      }, { once: true });
    });
  };

  // ================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ================================
  
  const initScrollAnimations = () => {
    const elements = document.querySelectorAll('.fade-in-observer');
    
    if (!elements.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('observed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  };

  // ================================
  // OPTIMIZE IMAGES
  // ================================
  
  const optimizeImages = () => {
    // Add aspect ratio to images without dimensions
    const images = document.querySelectorAll('img:not([width])');
    
    images.forEach(img => {
      if (img.complete) {
        setImageDimensions(img);
      } else {
        img.addEventListener('load', () => setImageDimensions(img), { once: true });
      }
    });
  };

  const setImageDimensions = (img) => {
    if (!img.hasAttribute('width') && img.naturalWidth) {
      img.setAttribute('width', img.naturalWidth);
      img.setAttribute('height', img.naturalHeight);
    }
  };

  // ================================
  // CART DRAWER OPTIMIZATION
  // ================================
  
  const optimizeCartDrawer = () => {
    const cartDrawer = document.querySelector('.cart-drawer');
    if (!cartDrawer) return;

    // Lazy load cart contents
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadCartContents();
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(cartDrawer);
  };

  const loadCartContents = () => {
    // Cart loading logic handled by Shopify's cart.js
    console.log('Cart contents loaded');
  };

  // ================================
  // FORM VALIDATION OPTIMIZATION
  // ================================
  
  const optimizeFormValidation = () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        const validateInput = debounce(() => {
          if (input.validity.valid) {
            input.classList.remove('error');
            input.classList.add('valid');
          } else {
            input.classList.add('error');
            input.classList.remove('valid');
          }
        }, 300);

        input.addEventListener('input', validateInput);
        input.addEventListener('blur', validateInput);
      });
    });
  };

  // ================================
  // PREDICTIVE SEARCH OPTIMIZATION
  // ================================
  
  const optimizePredictiveSearch = () => {
    const searchInput = document.querySelector('input[type="search"]');
    if (!searchInput) return;

    let searchTimeout;
    const searchResults = document.querySelector('.predictive-search__results');

    const performSearch = debounce((query) => {
      if (query.length < 2) {
        if (searchResults) searchResults.innerHTML = '';
        return;
      }

      // Shopify predictive search API call
      fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=4`)
        .then(response => response.json())
        .then(data => {
          displaySearchResults(data);
        })
        .catch(error => console.error('Search error:', error));
    }, 300);

    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  };

  const displaySearchResults = (data) => {
    const searchResults = document.querySelector('.predictive-search__results');
    if (!searchResults) return;

    // Display results logic
    console.log('Search results:', data);
  };

  // ================================
  // VIDEO OPTIMIZATION
  // ================================
  
  const optimizeVideos = () => {
    const videos = document.querySelectorAll('video[data-src]');
    
    if (!videos.length || !('IntersectionObserver' in window)) return;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          if (video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
            video.removeAttribute('data-src');
          }
          videoObserver.unobserve(video);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.01
    });

    videos.forEach(video => videoObserver.observe(video));
  };

  // ================================
  // NETWORK STATUS DETECTION
  // ================================
  
  const handleNetworkStatus = () => {
    const updateOnlineStatus = () => {
      const banner = document.getElementById('offline-banner');
      if (!banner) return;

      if (navigator.onLine) {
        banner.style.display = 'none';
      } else {
        banner.style.display = 'block';
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  };

  // ================================
  // LOCAL STORAGE CACHE
  // ================================
  
  const cacheManager = {
    set: (key, value, ttl = 3600000) => {
      const item = {
        value: value,
        timestamp: Date.now(),
        ttl: ttl
      };
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch (e) {
        console.warn('LocalStorage is full', e);
      }
    },

    get: (key) => {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (!item) return null;

        if (Date.now() - item.timestamp > item.ttl) {
          localStorage.removeItem(key);
          return null;
        }

        return item.value;
      } catch (e) {
        return null;
      }
    },

    remove: (key) => {
      localStorage.removeItem(key);
    },

    clear: () => {
      localStorage.clear();
    }
  };

  // ================================
  // QUICK ADD TO CART
  // ================================
  
  const initQuickAddToCart = () => {
    const quickAddButtons = document.querySelectorAll('[data-quick-add]');
    
    quickAddButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const variantId = button.dataset.variantId;
        const quantity = 1;

        button.classList.add('loading');
        button.disabled = true;

        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [{
                id: variantId,
                quantity: quantity
              }]
            })
          });

          if (response.ok) {
            const cart = await response.json();
            updateCartCount(cart.item_count);
            showCartNotification();
          }
        } catch (error) {
          console.error('Add to cart error:', error);
        } finally {
          button.classList.remove('loading');
          button.disabled = false;
        }
      });
    });
  };

  const updateCartCount = (count) => {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.classList.add('updated');
      setTimeout(() => cartCount.classList.remove('updated'), 300);
    }
  };

  const showCartNotification = () => {
    const notification = document.querySelector('.cart-notification');
    if (notification) {
      notification.classList.add('active');
      setTimeout(() => notification.classList.remove('active'), 3000);
    }
  };

  // ================================
  // WISHLIST FUNCTIONALITY
  // ================================
  
  const initWishlist = () => {
    const wishlistButtons = document.querySelectorAll('[data-wishlist-toggle]');
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    wishlistButtons.forEach(button => {
      const productId = button.dataset.productId;
      
      // Set initial state
      if (wishlist.includes(productId)) {
        button.classList.add('active');
      }

      button.addEventListener('click', (e) => {
        e.preventDefault();
        toggleWishlist(productId, button);
      });
    });
  };

  const toggleWishlist = (productId, button) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
      button.classList.remove('active');
    } else {
      wishlist.push(productId);
      button.classList.add('active');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount(wishlist.length);
  };

  const updateWishlistCount = (count) => {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
      wishlistCount.textContent = count;
    }
  };

  // ================================
  // PERFORMANCE MONITORING
  // ================================
  
  const monitorPerformance = () => {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  };

  // ================================
  // INITIALIZE ALL OPTIMIZATIONS
  // ================================
  
  const init = () => {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  };

  const initAll = () => {
    lazyLoadImages();
    optimizeScrollPerformance();
    initScrollToTop();
    initScrollAnimations();
    optimizeImages();
    optimizeCartDrawer();
    optimizeFormValidation();
    optimizePredictiveSearch();
    optimizeVideos();
    handleNetworkStatus();
    initQuickAddToCart();
    initWishlist();
    
    // Prefetch on hover (after initial load)
    setTimeout(prefetchOnHover, 2000);
    
    // Monitor performance in development
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('.myshopify.com')) {
      monitorPerformance();
    }

    console.log('✨ Ishori theme optimizations loaded');
  };

  // ================================
  // EXPORT UTILITIES
  // ================================
  
  window.IshoriTheme = {
    debounce,
    throttle,
    cacheManager,
    updateCartCount,
    showCartNotification
  };

  // Start initialization
  init();

})();
