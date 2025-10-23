import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FiX } from 'react-icons/fi'
import { getImageUrl } from '@/utils/apiClient'
import './QuickViewModal.css'

const QuickViewModal = ({ isOpen, onClose, product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      setSelectedImageIndex(0) // Reset to first image when modal opens
      setSelectedSize('') // Reset size selection
      setQuantity(1) // Reset quantity
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const newQuantity = prev + delta
      return Math.max(1, Math.min(10, newQuantity))
    })
  }

  const handleAddToCart = async () => {
    // Validate size selection if sizes are available
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size')
      return
    }

    setIsAddingToCart(true)

    try {
      // TODO: Integrate with actual cart API
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Show success message (you can replace with a toast notification)
      alert('Added to cart!')
      
      // Optionally close modal after successful add
      onClose()
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (!isOpen || !product) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const images = product.images || []
  const selectedImage = images[selectedImageIndex] || images[0]

  return (
    <div className="quick-view-overlay" onClick={handleOverlayClick}>
      <div className="quick-view-modal">
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FiX className="close-icon" />
        </button>
        
        <div className="modal-content">
          <div className="modal-layout">
            {/* Image Gallery Section */}
            <div className="modal-image-section">
              <div className="main-image-container">
                <img
                  src={getImageUrl(selectedImage)}
                  alt={product.name}
                  className="main-product-image"
                />
              </div>
              
              {images.length > 1 && (
                <div className="thumbnail-strip">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} view ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="modal-details-section">
              <div className="product-header">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-modal-price">₹{product.price.toLocaleString('en-IN')}</p>
              </div>

              {product.description && (
                <p className="product-description">{product.description}</p>
              )}

              <div className="product-stock">
                {product.inStock !== false ? (
                  <span className="in-stock">In Stock</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="size-selector">
                  <label className="selector-label">Size</label>
                  <select
                    className="size-select"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    <option value="">Select Size</option>
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="quantity-selector">
                <label className="selector-label">Quantity</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      setQuantity(Math.max(1, Math.min(10, val)))
                    }}
                    min="1"
                    max="10"
                  />
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="add-to-cart-button"
                disabled={product.inStock === false || isAddingToCart}
                onClick={handleAddToCart}
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

QuickViewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string,
    sizes: PropTypes.arrayOf(PropTypes.string),
    inStock: PropTypes.bool,
  }),
}

export default QuickViewModal
