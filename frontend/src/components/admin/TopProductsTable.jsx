import PropTypes from 'prop-types';
import './TopProductsTable.css';

const TopProductsTable = ({ products, loading }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="top-products-container">
        <div className="table-header">
          <h3>Top Selling Products</h3>
        </div>
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="top-products-container">
        <div className="table-header">
          <h3>Top Selling Products</h3>
        </div>
        <div className="table-empty">
          <p>No sales data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="top-products-container">
      <div className="table-header">
        <h3>Top Selling Products</h3>
        <span className="table-subtitle">{products.length} products</span>
      </div>
      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product</th>
              <th>Category</th>
              <th className="text-right">Units Sold</th>
              <th className="text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>
                  <div className="rank-badge">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                </td>
                <td>
                  <div className="product-cell">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <span className="product-name">{product.name}</span>
                  </div>
                </td>
                <td>
                  <span className="category-badge">{product.category || 'N/A'}</span>
                </td>
                <td className="text-right">
                  <span className="units-sold">{product.totalSold}</span>
                </td>
                <td className="text-right">
                  <span className="revenue-value">{formatCurrency(product.totalRevenue)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TopProductsTable.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    category: PropTypes.string,
    totalSold: PropTypes.number.isRequired,
    totalRevenue: PropTypes.number.isRequired
  })),
  loading: PropTypes.bool
};

TopProductsTable.defaultProps = {
  loading: false
};

export default TopProductsTable;
