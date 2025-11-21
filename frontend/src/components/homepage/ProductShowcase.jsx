import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import './ProductShowcase.css';

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: 'Royal Banarasi Silk Saree',
          category: 'Silk',
          price: 45000,
          originalPrice: 55000,
          image: '/src/assets/collection1.avif',
          badge: 'new',
          slug: 'royal-banarasi-silk'
        },
        {
          id: 2,
          name: 'Emerald Green Kanjivaram',
          category: 'Kanjivaram',
          price: 38000,
          image: '/src/assets/collection1.avif',
          badge: 'exclusive',
          slug: 'emerald-kanjivaram'
        },
        {
          id: 3,
          name: 'Burgundy Bridal Collection',
          category: 'Bridal',
          price: 65000,
          originalPrice: 75000,
          image: '/src/assets/collection1.avif',
          badge: 'limited',
          slug: 'burgundy-bridal'
        },
        {
          id: 4,
          name: 'Golden Zari Work Saree',
          category: 'Designer',
          price: 42000,
          image: '/src/assets/collection1.avif',
          slug: 'golden-zari'
        },
        {
          id: 5,
          name: 'Sapphire Blue Silk',
          category: 'Silk',
          price: 35000,
          image: '/src/assets/collection1.avif',
          badge: 'new',
          slug: 'sapphire-silk'
        },
        {
          id: 6,
          name: 'Heritage Patola Saree',
          category: 'Heritage',
          price: 52000,
          image: '/src/assets/collection1.avif',
          slug: 'heritage-patola'
        },
        {
          id: 7,
          name: 'Crimson Wedding Special',
          category: 'Bridal',
          price: 58000,
          originalPrice: 68000,
          image: '/src/assets/collection1.avif',
          badge: 'exclusive',
          slug: 'crimson-wedding'
        },
        {
          id: 8,
          name: 'Pearl White Elegance',
          category: 'Designer',
          price: 48000,
          image: '/src/assets/collection1.avif',
          slug: 'pearl-elegance'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <section className="product-showcase">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Handpicked Excellence</span>
            <h2 className="section-title">Featured Sarees</h2>
          </div>
          <div className="products-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="product-skeleton">
                <div className="product-skeleton-image"></div>
                <div className="product-skeleton-info">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="product-showcase">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Handpicked Excellence</span>
          <h2 className="section-title">Featured Sarees</h2>
          <p className="section-description">
            Discover our finest selection of handcrafted sarees, each a masterpiece of tradition and luxury
          </p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.slug}`} className="product-image-wrapper">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                />
                
                {product.badge && (
                  <div className="product-badges">
                    <span className={`product-badge badge-${product.badge}`}>
                      {product.badge}
                    </span>
                  </div>
                )}

                <button 
                  className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product.id);
                  }}
                  aria-label="Add to wishlist"
                >
                  {wishlist.includes(product.id) ? <FaHeart /> : <FiHeart />}
                </button>

                <button className="quick-view-btn">
                  Quick View
                </button>
              </Link>

              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-wrapper">
                  <span className="product-price">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="product-price-original">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-wrapper">
          <Link to="/collections" className="btn-view-all">
            View All Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
