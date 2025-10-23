import PropTypes from 'prop-types'
import { FiHeart } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { getImageUrl } from '@/utils/apiClient'
import './ProductCard.css'

const ProductCard = ({ product, onQuickView, onWishlistToggle, isInWishlist }) => {
  const primaryImage = product.images?.[0] || ''

  const handleWishlistClick = (e) => {
    e.stopPropagation()
    onWishlistToggle(product._id)
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={getImageUrl(primaryImage)}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        
        <button
          className={`wishlist-button ${isInWishlist ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist ? (
            <FaHeart className="heart-icon filled" />
          ) : (
            <FiHeart className="heart-icon" />
          )}
        </button>

        <button
          className="quick-view-button"
          onClick={(e) => {
            e.stopPropagation()
            onQuickView(product._id)
          }}
        >
          Quick View
        </button>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  onQuickView: PropTypes.func.isRequired,
  onWishlistToggle: PropTypes.func.isRequired,
  isInWishlist: PropTypes.bool,
}

ProductCard.defaultProps = {
  isInWishlist: false,
}

export default ProductCard
