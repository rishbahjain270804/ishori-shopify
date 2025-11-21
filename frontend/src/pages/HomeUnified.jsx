import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import MainLayout from '../layouts/MainLayout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import './HomeUnified.css'

// Import assets
import collection1 from '../assets/collection1.avif'
import collection2 from '../assets/collection2.avif'
import collection4 from '../assets/collection4.avif'
import collection12 from '../assets/collection12.avif'
import bgVideo from '../assets/bgsaree_video.mp4'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const HomeUnified = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const categories = [
    { name: 'Silk Sarees', image: collection1, slug: 'silk-sarees', description: 'Timeless elegance' },
    { name: 'Cotton Sarees', image: collection2, slug: 'cotton-sarees', description: 'Comfortable luxury' },
    { name: 'Designer Sarees', image: collection4, slug: 'designer-sarees', description: 'Contemporary style' },
    { name: 'Bridal Collection', image: collection12, slug: 'bridal-collection', description: 'Your special day' },
  ]

  const testimonials = [
    {
      text: "The quality and craftsmanship are exceptional. I received so many compliments at my sister's wedding!",
      author: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
    },
    {
      text: "Beautiful sarees with authentic designs. The fabric quality is outstanding and worth every rupee.",
      author: "Anjali Mehta",
      location: "Delhi",
      rating: 5,
    },
    {
      text: "Excellent service and gorgeous collection. Will definitely shop again for my next occasion.",
      author: "Kavita Reddy",
      location: "Bangalore",
      rating: 5,
    },
  ]

  useEffect(() => {
    fetchProducts()
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.log('Fetching products from:', API_BASE_URL)
      
      // Fetch featured products
      const featuredRes = await axios.get(`${API_BASE_URL}/products?featured=true&limit=8`)
      console.log('Featured products:', featuredRes.data)
      setFeaturedProducts(featuredRes.data.products || [])

      // Fetch new arrivals
      const newRes = await axios.get(`${API_BASE_URL}/products?sort=-createdAt&limit=8`)
      console.log('New arrivals:', newRes.data)
      setNewArrivals(newRes.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      console.error('Error details:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url || product.images[0]
    }
    return 'https://via.placeholder.com/400x500/f5f5f5/999?text=No+Image'
  }

  return (
    <MainLayout>
      {/* Hero Section - Full Video Showcase */}
      <section className="hero-section">
        <div className="hero-background">
          <video autoPlay loop muted playsInline className="hero-video">
            <source src={bgVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-scroll-indicator">
          <span>Explore Our Collection</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 14l-6-6h12z" />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-description">
              Discover our curated collections of authentic Indian sarees
            </p>
          </div>

          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/collections?category=${category.slug}`}
                className="category-card"
              >
                <div className="category-image-wrapper">
                  <img src={category.image} alt={category.name} className="category-image" />
                  <div className="category-overlay">
                    <span className="category-description">{category.description}</span>
                  </div>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <span className="category-link">Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Collection</h2>
            <p className="section-description">
              Handpicked sarees that showcase the finest craftsmanship
            </p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="products-grid">
                {featuredProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="product-card"
                  >
                    <div className="product-image-wrapper">
                      <img 
                        src={getImageUrl(product)} 
                        alt={product.name} 
                        className="product-image"
                        loading="lazy"
                      />
                      <button 
                        className="product-wishlist-btn" 
                        onClick={(e) => {
                          e.preventDefault()
                          // Add to wishlist logic
                        }}
                        aria-label="Add to wishlist"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 18.35l-1.45-1.32C3.4 12.36 0 9.28 0 5.5 0 2.42 2.42 0 5.5 0 7.24 0 8.91 0.81 10 2.09 11.09 0.81 12.76 0 14.5 0 17.58 0 20 2.42 20 5.5c0 3.78-3.4 6.86-8.55 11.54L10 18.35z" />
                        </svg>
                      </button>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <div className="product-price">
                        <span className="product-price-current">{formatPrice(product.discountPrice || product.price)}</span>
                        {product.discountPrice && (
                          <span className="product-price-original">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="section-cta">
                <Button size="lg" as={Link} to="/collections">
                  View All Products
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="section new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-description">
              Fresh additions to our collection
            </p>
          </div>

          {!loading && newArrivals.length > 0 && (
            <div className="products-grid">
              {newArrivals.slice(0, 4).map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="product-card"
                >
                  <div className="product-image-wrapper">
                    <img 
                      src={getImageUrl(product)} 
                      alt={product.name} 
                      className="product-image"
                      loading="lazy"
                    />
                    <span className="product-badge">New</span>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price">
                      <span className="product-price-current">{formatPrice(product.discountPrice || product.price)}</span>
                      {product.discountPrice && (
                        <span className="product-price-original">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Ishori</h2>
            <p className="section-description">
              Experience the difference of authentic craftsmanship
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Authentic Handloom</h3>
              <p className="feature-description">
                Each saree is handwoven by skilled artisans using traditional techniques passed down through generations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Unique Designs</h3>
              <p className="feature-description">
                Exclusive patterns and motifs that blend traditional artistry with contemporary aesthetics.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <h3 className="feature-title">Sustainable Fashion</h3>
              <p className="feature-description">
                Eco-friendly materials and processes that support local artisans and preserve our environment.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-description">
                Complimentary shipping across India with secure packaging and timely delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Customer Reviews</h2>
            <p className="section-description">
              Hear from our satisfied customers
            </p>
          </div>

          <div className="testimonials-wrapper">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="testimonial-text">"{testimonials[activeTestimonial].text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {testimonials[activeTestimonial].author.charAt(0)}
                </div>
                <div>
                  <p className="testimonial-name">{testimonials[activeTestimonial].author}</p>
                  <p className="testimonial-location">{testimonials[activeTestimonial].location}</p>
                </div>
              </div>
            </div>

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`testimonial-dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

export default HomeUnified
