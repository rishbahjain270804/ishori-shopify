import { useNavigate } from 'react-router-dom';
import WishlistButton from '../product/WishlistButton';
import RatingStars from '../product/RatingStars';
import './SearchResults.css';

const SearchResults = ({ 
  products = [], 
  loading = false, 
  viewMode = 'grid',
  pagination = {},
  onPageChange 
}) => {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSkeleton viewMode={viewMode} />;
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="search-results">
      <div className={`products-${viewMode}`}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            viewMode={viewMode}
            onClick={() => navigate(`/product/${product._id}`)}
          />
        ))}
      </div>

      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, viewMode, onClick }) => {
  const primaryImage = product.images?.[0];
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const totalStock = product.totalStock || 
    (product.stock?.S || 0) + 
    (product.stock?.M || 0) + 
    (product.stock?.L || 0) + 
    (product.stock?.XL || 0);

  const isOutOfStock = totalStock === 0;

  return (
    <article className={`product-card ${viewMode}`} onClick={onClick}>
      <div className="product-image-wrapper">
        <img
          src={primaryImage?.url || '/placeholder.jpg'}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="product-badges">
          {product.featured && <span className="badge featured">Featured</span>}
          {hasDiscount && <span className="badge discount">-{discountPercent}%</span>}
          {isOutOfStock && <span className="badge out-of-stock">Out of Stock</span>}
        </div>

        {/* Quick Actions */}
        <div className="product-actions">
          <WishlistButton 
            productId={product._id} 
            size="medium"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {viewMode === 'list' && product.description && (
          <p className="product-description">
            {product.description.substring(0, 150)}
            {product.description.length > 150 ? '...' : ''}
          </p>
        )}

        <div className="product-meta">
          {product.category && (
            <span className="product-category">{product.category}</span>
          )}
          {product.fabric && (
            <span className="product-fabric">{product.fabric}</span>
          )}
        </div>

        <div className="product-footer">
          <div className="product-pricing">
            <span className="product-price">
              ₹{(hasDiscount ? product.discountPrice : product.price).toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="product-original-price">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product.ratings && product.ratings.count > 0 && (
            <div className="product-rating">
              <RatingStars 
                rating={product.ratings.average} 
                size="small"
                showCount={true}
                count={product.ratings.count}
              />
            </div>
          )}
        </div>

        {viewMode === 'list' && (
          <div className="product-details">
            {product.color && (
              <span className="detail-item">
                <i className="fas fa-palette"></i> {product.color}
              </span>
            )}
            {!isOutOfStock ? (
              <span className="detail-item in-stock">
                <i className="fas fa-check-circle"></i> In Stock
              </span>
            ) : (
              <span className="detail-item out-of-stock">
                <i className="fas fa-times-circle"></i> Out of Stock
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = ({ viewMode }) => {
  return (
    <div className={`products-${viewMode}`}>
      {[...Array(12)].map((_, index) => (
        <div key={index} className={`product-card-skeleton ${viewMode}`}>
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-price"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty State Component
const EmptyState = () => {
  return (
    <div className="empty-state">
      <i className="fas fa-search"></i>
      <h3>No products found</h3>
      <p>Try adjusting your search or filters to find what you're looking for</p>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left"></i>
        Previous
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={index} className="pagination-ellipsis">...</span>
          ) : (
            <button
              key={index}
              className={`pagination-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default SearchResults;
