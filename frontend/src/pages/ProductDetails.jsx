import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, getImageUrl } from '@/utils/apiClient';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    if (!id) {
      setError('Product ID is missing');
      setLoading(false);
      return;
    }

    apiGet(`/api/products/${id}`)
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setProduct(data.data);
          // Set first available size as default
          const sizes = Object.entries(data.data.stock || {});
          const availableSize = sizes.find(([_, qty]) => qty > 0);
          if (availableSize) {
            setSelectedSize(availableSize[0]);
          }
        } else {
          setError(data.message || 'Failed to load product');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Error fetching product');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="container">
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <button className="btn-primary" onClick={() => navigate('/collections')}>
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    // TODO: Implement add to cart functionality
    alert(`Added ${product.name} (Size: ${selectedSize}) to cart!`);
  };

  return (
    <div className="page-container">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/collections')}>
          ← Back to Collections
        </button>

        <div className="product-details-grid">
          {/* Image Gallery */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={getImageUrl(product.images?.[selectedImage])} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x800?text=No+Image';
                }}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img 
                      src={getImageUrl(img)} 
                      alt={`${product.name} ${idx + 1}`}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <span className="category">{product.category}</span>
              <span className="separator">•</span>
              <span className="fabric">{product.fabric}</span>
              <span className="separator">•</span>
              <span className="color">{product.color}</span>
            </div>

            <div className="product-price">
              {product.discountPrice ? (
                <>
                  <span className="price-original">₹{product.price}</span>
                  <span className="price-discounted">₹{product.discountPrice}</span>
                  <span className="discount-badge">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="price-current">₹{product.price}</span>
              )}
            </div>

            {product.ratings && product.ratings.count > 0 && (
              <div className="product-rating">
                <span className="rating-value">⭐ {product.ratings.average.toFixed(1)}</span>
                <span className="rating-count">({product.ratings.count} reviews)</span>
              </div>
            )}

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="size-selection">
              <h3>Select Size</h3>
              <div className="size-options">
                {Object.entries(product.stock || {}).map(([size, qty]) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''} ${qty === 0 ? 'disabled' : ''}`}
                    onClick={() => qty > 0 && setSelectedSize(size)}
                    disabled={qty === 0}
                  >
                    {size}
                    {qty === 0 && <span className="out-of-stock">Out of Stock</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                className="btn-primary add-to-cart"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                Add to Cart
              </button>
              <button className="btn-secondary buy-now">
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            {product.featured && (
              <div className="featured-badge">
                ⭐ Featured Product
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
