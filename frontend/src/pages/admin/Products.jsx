import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, getImageUrl } from '../../utils/apiClient';
import './Products.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [page, filter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });
      
      if (filter !== 'all') {
        params.append('category', filter);
      }

      console.log('Fetching products from:', `${BASE_URL}/api/products?${params}`);
      const res = await apiGet(`/api/products?${params}`);
      console.log('Products response:', res);
      
      if (res.success) {
        setProducts(res.data);
        setPagination(res.pagination);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        loadProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Products Management</h1>
        <Link to="/admin/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>

      <div className="products-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="Silk Saree">Silk Saree</option>
          <option value="Cotton Saree">Cotton Saree</option>
          <option value="Designer Saree">Designer Saree</option>
          <option value="Party Wear">Party Wear</option>
          <option value="Bridal Saree">Bridal Saree</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading products...</div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadProducts} className="btn-primary">Retry</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found</p>
          <Link to="/admin/products/new" className="btn-primary">
            Create your first product
          </Link>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img
                    src={getImageUrl(product.images?.[0]) || 'https://via.placeholder.com/300'}
                    alt={product.name}
                  />
                  {product.featured && <span className="featured-badge">Featured</span>}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-meta">
                    <span className="product-price">₹{product.price}</span>
                    <span className="product-stock">
                      Stock: {typeof product.stock === 'object' 
                        ? `S:${product.stock.S || 0} M:${product.stock.M || 0} L:${product.stock.L || 0} XL:${product.stock.XL || 0}`
                        : product.stock || 0
                      }
                    </span>
                  </div>
                  <div className="product-actions">
                    <Link to={`/collections/${product._id}`} className="btn-view" target="_blank">
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="page-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasNext}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
