import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import WishlistButton from '../components/product/WishlistButton';
import { getImageUrl } from '../utils/apiClient';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleMoveToCart = async (product) => {
    const result = await addToCart(product._id, 1);
    if (result.success) {
      // Optionally remove from wishlist after adding to cart
      // await removeFromWishlist(product._id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-empty">
            <h2>Please Login</h2>
            <p>You need to be logged in to view your wishlist</p>
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-loading">
            <div className="spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-empty">
            <h2>Your Wishlist is Empty</h2>
            <p>Save your favorite sarees to your wishlist</p>
            <Link to="/collections" className="btn-primary">
              Browse Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p className="wishlist-count">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product._id} className="wishlist-item">
              <div className="wishlist-item-image">
                <Link to={`/product/${product.slug || product._id}`}>
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    loading="lazy"
                  />
                </Link>
                <div className="wishlist-item-actions">
                  <WishlistButton productId={product._id} size="medium" />
                </div>
                {product.stock === 0 && (
                  <div className="out-of-stock-badge">Out of Stock</div>
                )}
              </div>

              <div className="wishlist-item-details">
                <Link to={`/product/${product.slug || product._id}`} className="wishlist-item-name">
                  {product.name}
                </Link>
                
                {product.category && (
                  <p className="wishlist-item-category">{product.category}</p>
                )}

                <div className="wishlist-item-meta">
                  {product.fabric && <span className="meta-tag">{product.fabric}</span>}
                  {product.color && <span className="meta-tag">{product.color}</span>}
                </div>

                <div className="wishlist-item-footer">
                  <p className="wishlist-item-price">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </p>
                  
                  {product.stock > 0 ? (
                    <button
                      className="btn-add-to-cart"
                      onClick={() => handleMoveToCart(product)}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button className="btn-notify" disabled>
                      Notify Me
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
