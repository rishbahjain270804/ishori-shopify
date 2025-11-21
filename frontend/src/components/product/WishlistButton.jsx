import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../context/AuthContext';
import './WishlistButton.css';

const WishlistButton = ({ productId, className = '', size = 'medium' }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Could redirect to login or show modal
      return;
    }

    setIsAnimating(true);
    await toggleWishlist(productId);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <button
      className={`wishlist-button ${className} ${size} ${inWishlist ? 'active' : ''} ${isAnimating ? 'animating' : ''}`}
      onClick={handleClick}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {inWishlist ? (
        <FaHeart className="wishlist-icon filled" />
      ) : (
        <FiHeart className="wishlist-icon outline" />
      )}
    </button>
  );
};

export default WishlistButton;
