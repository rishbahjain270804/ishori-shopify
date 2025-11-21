import { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryManagement.css';
import StockAdjustment from '../../components/admin/StockAdjustment';
import StockHistory from '../../components/admin/StockHistory';

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [summaryRes, lowStockRes, outOfStockRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/inventory/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/inventory/low-stock?threshold=5`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/inventory/out-of-stock`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSummary(summaryRes.data.data);
      setLowStockProducts(lowStockRes.data.data);
      setOutOfStockProducts(outOfStockRes.data.data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = (product) => {
    setSelectedProduct(product);
    setShowAdjustmentModal(true);
  };

  const handleViewHistory = (product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  };

  const handleStockUpdated = () => {
    fetchInventoryData();
    setShowAdjustmentModal(false);
  };

  if (loading) {
    return (
      <div className="inventory-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-management">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <p>Monitor and manage product stock levels</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="inventory-stats">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-boxes"></i>
            </div>
            <div className="stat-content">
              <h3>{summary.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stock">
              <i className="fas fa-warehouse"></i>
            </div>
            <div className="stat-content">
              <h3>{summary.totalStock}</h3>
              <p>Total Stock Units</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon low">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-content">
              <h3>{summary.lowStockCount}</h3>
              <p>Low Stock Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon out">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{summary.outOfStockCount}</h3>
              <p>Out of Stock</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'low-stock' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('low-stock')}
        >
          Low Stock ({lowStockProducts.length})
        </button>
        <button
          className={activeTab === 'out-of-stock' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('out-of-stock')}
        >
          Out of Stock ({outOfStockProducts.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="alert-section">
              <h3>⚠️ Attention Required</h3>
              <p>{lowStockProducts.length} products need restocking</p>
              <p>{outOfStockProducts.length} products are out of stock</p>
            </div>
          </div>
        )}

        {activeTab === 'low-stock' && (
          <div className="products-grid">
            {lowStockProducts.map((product) => (
              <div key={product._id} className="product-card low-stock">
                <div className="product-image">
                  {product.images?.[0] && (
                    <img src={product.images[0]} alt={product.name} />
                  )}
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="product-sku">SKU: {product.sku || 'N/A'}</p>
                  <div className="stock-levels">
                    {Object.entries(product.lowStockSizes || {}).map(([size, qty]) => (
                      <div key={size} className="stock-item warning">
                        <span className="size">{size}:</span>
                        <span className="quantity">{qty} units</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="product-actions">
                  <button
                    onClick={() => handleAdjustStock(product)}
                    className="btn-primary"
                  >
                    <i className="fas fa-edit"></i> Adjust Stock
                  </button>
                  <button
                    onClick={() => handleViewHistory(product)}
                    className="btn-secondary"
                  >
                    <i className="fas fa-history"></i> History
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'out-of-stock' && (
          <div className="products-grid">
            {outOfStockProducts.map((product) => (
              <div key={product._id} className="product-card out-of-stock">
                <div className="product-image">
                  {product.images?.[0] && (
                    <img src={product.images[0]} alt={product.name} />
                  )}
                  <div className="out-badge">OUT OF STOCK</div>
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="product-sku">SKU: {product.sku || 'N/A'}</p>
                  <div className="stock-levels">
                    {Object.entries(product.stock || {}).map(([size, qty]) => (
                      <div key={size} className="stock-item danger">
                        <span className="size">{size}:</span>
                        <span className="quantity">{qty} units</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="product-actions">
                  <button
                    onClick={() => handleAdjustStock(product)}
                    className="btn-primary"
                  >
                    <i className="fas fa-plus"></i> Add Stock
                  </button>
                  <button
                    onClick={() => handleViewHistory(product)}
                    className="btn-secondary"
                  >
                    <i className="fas fa-history"></i> History
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAdjustmentModal && selectedProduct && (
        <StockAdjustment
          product={selectedProduct}
          onClose={() => setShowAdjustmentModal(false)}
          onSuccess={handleStockUpdated}
        />
      )}

      {showHistoryModal && selectedProduct && (
        <StockHistory
          product={selectedProduct}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
};

export default InventoryManagement;
