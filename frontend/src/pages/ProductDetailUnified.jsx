import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import './ProductDetailUnified.css'

const ProductDetailUnified = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${slug}`)
      const data = await response.json()
      setProduct(data.product)
      if (data.product?.stock) {
        setSelectedSize(Object.keys(data.product.stock)[0])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    console.log('Adding to cart:', { product, selectedSize, quantity })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="product-detail-loading">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </MainLayout>
    )
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/collections')}>Browse Collections</Button>
        </div>
      </MainLayout>
    )
  }

  const images = product.images || ['/placeholder.jpg']
  const sizes = product.stock ? Object.keys(product.stock) : []
  const relatedProducts = []

  return (
    <MainLayout>
      <div className="product-detail-unified">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/collections">Collections</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </nav>

          {/* Product Main Section */}
          <div className="product-main">
            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="gallery-main">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="main-image animate-fade-in"
                />
                <button
                  className="wishlist-btn-large"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Add to wishlist"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
              <div className="gallery-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info-section">
              <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                <div className="product-rating">
                  <div className="rating-stars">★★★★★</div>
                  <span className="rating-count">(24 reviews)</span>
                </div>
              </div>

              <div className="product-price-section">
                <div className="price-main">₹{product.price?.toLocaleString()}</div>
                {product.originalPrice && (
                  <>
                    <div className="price-original">₹{product.originalPrice.toLocaleString()}</div>
                    <div className="price-discount">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  </>
                )}
              </div>

              <div className="product-description-short">
                <p>{product.description}</p>
              </div>

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="product-option">
                  <label className="option-label">Select Size</label>
                  <div className="size-options">
                    {sizes.map(size => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'active' : ''} ${
                          product.stock[size] === 0 ? 'disabled' : ''
                        }`}
                        onClick={() => setSelectedSize(size)}
                        disabled={product.stock[size] === 0}
                      >
                        {size}
                        {product.stock[size] === 0 && <span className="out-of-stock-label">Out</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="product-option">
                <label className="option-label">Quantity</label>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-actions">
                <Button
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  className="add-to-cart-btn-main"
                >
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  fullWidth
                  variant="outline"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </div>

              {/* Product Features */}
              <div className="product-features">
                <div className="feature-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2l2 6 6 .5-5 4 1.5 6-4.5-3-4.5 3 1.5-6-5-4 6-.5 2-6z" />
                  </svg>
                  <span>Premium Quality</span>
                </div>
                <div className="feature-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2C5 2 2 5 2 10s3 8 8 8 8-3 8-8-3-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
                  </svg>
                  <span>Free Shipping</span>
                </div>
                <div className="feature-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2l8 8-8 8-8-8 8-8z" />
                  </svg>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="product-tabs-section">
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews (24)
              </button>
              <button
                className={`tab-btn ${activeTab === 'care' ? 'active' : ''}`}
                onClick={() => setActiveTab('care')}
              >
                Care Instructions
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === 'description' && (
                <div className="tab-panel animate-fade-in">
                  <h3>Product Description</h3>
                  <p>{product.description}</p>
                  <p>
                    This exquisite saree is handcrafted by skilled artisans using traditional techniques
                    passed down through generations. Each piece is unique and celebrates the rich heritage
                    of Indian textile craftsmanship.
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="tab-panel animate-fade-in">
                  <h3>Specifications</h3>
                  <table className="specs-table">
                    <tbody>
                      <tr>
                        <td>Fabric</td>
                        <td>{product.fabric || 'Silk'}</td>
                      </tr>
                      <tr>
                        <td>Color</td>
                        <td>{product.color || 'As shown'}</td>
                      </tr>
                      <tr>
                        <td>Length</td>
                        <td>5.5 meters</td>
                      </tr>
                      <tr>
                        <td>Blouse</td>
                        <td>0.8 meters</td>
                      </tr>
                      <tr>
                        <td>Care</td>
                        <td>Dry clean only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-panel animate-fade-in">
                  <h3>Customer Reviews</h3>
                  <div className="reviews-summary">
                    <div className="rating-large">4.8</div>
                    <div className="rating-details">
                      <div className="rating-stars-large">★★★★★</div>
                      <p>Based on 24 reviews</p>
                    </div>
                  </div>
                  <div className="reviews-list">
                    <div className="review-item">
                      <div className="review-header">
                        <div className="reviewer-name">Priya Sharma</div>
                        <div className="review-rating">★★★★★</div>
                      </div>
                      <p className="review-text">
                        Absolutely beautiful saree! The quality is exceptional and the colors are vibrant.
                        Received many compliments at the wedding.
                      </p>
                      <div className="review-date">2 weeks ago</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="tab-panel animate-fade-in">
                  <h3>Care Instructions</h3>
                  <ul className="care-list">
                    <li>Dry clean only for best results</li>
                    <li>Store in a cool, dry place away from direct sunlight</li>
                    <li>Avoid contact with perfumes and deodorants</li>
                    <li>Iron on low heat with a cloth between the iron and fabric</li>
                    <li>Fold carefully to avoid creases</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products-section">
              <h2 className="section-title">You May Also Like</h2>
              <div className="related-products-grid">
                {relatedProducts.map((item, index) => (
                  <Card key={index} hover className="related-product-card">
                    <Link to={`/product/${item.slug}`}>
                      <img src={item.image} alt={item.name} />
                      <h4>{item.name}</h4>
                      <div className="price">₹{item.price.toLocaleString()}</div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default ProductDetailUnified
