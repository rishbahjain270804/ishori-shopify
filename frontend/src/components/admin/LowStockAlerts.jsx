import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../../utils/apiClient';
import './LowStockAlerts.css';

const LowStockAlerts = ({ threshold = 5, compact = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLowStockProducts();
  }, [threshold]);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGet(`/api/admin/inventory/low-stock?threshold=${threshold}`);
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching low stock products:', err);
      setError('Failed to load low stock products');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStockLevel = (stock) => {
    if (stock === 0) return 'critical';
    if (stock <= 2) return 'very-low';
    if (stock <= threshold) return 'low';
    return 'normal';
  };

  if (loading) {
    return (
      <div className={`low-stock-alerts ${compact ? 'compact' : ''}`}>
        <div className="alerts-header">
          <h3>
            <span className="alert-icon">⚠️</span>
            Low Stock Alerts
          </h3>
        </div>
        <div className="alerts-loading">
          <div className="loading-spinner"></div>
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`low-stock-alerts ${compact ? 'compact' : ''}`}>
        <div className="alerts-header">
          <h3>
            <span className="alert-icon">⚠️</span>
            Low Stock Alerts
          </h3>
        </div>
        <div className="alerts-error">
          <p>{error}</p>
          <button onClick={fetchLowStockProducts} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`low-stock-alerts ${compact ? 'compact' : ''}`}>
        <div className="alerts-header">
          <h3>
            <span className="alert-icon">✅</span>
            Low Stock Alerts
          </h3>
          <span className="alert-count success">All Good</span>
        </div>
        <div className="alerts-empty">
          <p>No low stock products. All inventory levels are healthy!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`low-stock-alerts ${compact ? 'compact' : ''}`}>
      <div className="alerts-header">
        <h3>
          <span className="alert-icon">⚠️</span>
          Low Stock Alerts
        </h3>
        <span className="alert-count warning">{products.length} products</span>
      </div>
      
      <div className="alerts-list">
        {products.slice(0, compact ? 5 : products.length).map((product) => (
          <div key={product._id} className="alert-item">
            <div className="alert-product">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="alert-product-image"
                />
              ) : (
                <div className="alert-product-image-placeholder">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              <div className="alert-product-info">
                <h4>{product.name}</h4>
                <span className="alert-product-category">{product.category}</span>
              </div>
            </div>
            
            <div className="alert-stock">
              <div className={`stock-badge ${getStockLevel(product.totalStock)}`}>
                {product.totalStock} units
              </div>
              {!compact && (
                <div className="stock-sizes">
                  {Object.entries(product.stockBySize || {}).map(([size, qty]) => (
                    qty > 0 && (
                      <span key={size} className="size-badge">
                        {size}: {qty}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
            
            {!compact && (
              <div className="alert-actions">
                <Link 
                  to={`/admin/products/edit/${product._id}`}
                  className="action-link"
                >
                  Update Stock
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {compact && products.length > 5 && (
        <div className="alerts-footer">
          <Link to="/admin/inventory" className="view-all-link">
            View all {products.length} products →
          </Link>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;
