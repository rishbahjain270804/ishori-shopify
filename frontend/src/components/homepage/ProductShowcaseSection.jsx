import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import QuickViewModal from './QuickViewModal'
import { apiGet } from '@/utils/apiClient'
import './ProductShowcaseSection.css'

const ProductShowcaseSection = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [wishlist, setWishlist] = useState(new Set())

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiGet('/api/products?featured=true&limit=8')
        const productsData = data.products || data || []
        setProducts(Array.isArray(productsData) ? productsData : [])
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError('Unable to load products. Please try again.')
        setProducts([]) // Ensure products is always an array
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleQuickView = (productId) => {
    const product = products.find(p => p._id === productId)
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  const handleWishlistToggle = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev)
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId)
      } else {
        newWishlist.add(productId)
      }
      return newWishlist
    })
  }

  return (
    <section className="product-showcase-section">
      <div className="section-container">
        <h2 className="section-title">Featured Products</h2>
        
        {loading && (
          <div className="products-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="product-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="products-error">
            <p className="error-message">{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={handleQuickView}
                  onWishlistToggle={handleWishlistToggle}
                  isInWishlist={wishlist.has(product._id)}
                />
              ))}
            </div>
            
            <div className="view-all-container">
              <a href="/collections" className="view-all-button">
                View All Products
              </a>
            </div>
          </>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
      />
    </section>
  )
}

export default ProductShowcaseSection
