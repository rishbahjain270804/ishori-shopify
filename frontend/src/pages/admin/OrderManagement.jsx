import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderManagement.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 20;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, sortBy, sortOrder, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: ordersPerPage,
          status: statusFilter,
          sortBy,
          sortOrder,
          search
        }
      });
      
      setOrders(response.data.orders || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchOrders();
      alert('Order status updated successfully');
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || 'status-default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="order-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>Order Management</h1>
        <p>Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="createdAt">Date</option>
            <option value="totalAmount">Amount</option>
            <option value="status">Status</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-button"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-button">
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders found</p>
        </div>
      ) : (
        <>
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="order-id">#{order.orderNumber || order._id.slice(-8)}</td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">
                          {order.user?.firstName} {order.user?.lastName}
                        </div>
                        <div className="customer-email">{order.user?.email}</div>
                      </div>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.items?.length || 0}</td>
                    <td className="amount">{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <span className={`payment-badge ${order.paymentStatus}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`status-select ${getStatusBadgeClass(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailsModal(true);
                        }}
                        className="view-button"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="order-details">
                <div className="detail-section">
                  <h3>Order Information</h3>
                  <p><strong>Order ID:</strong> #{selectedOrder.orderNumber || selectedOrder._id.slice(-8)}</p>
                  <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p><strong>Status:</strong> <span className={getStatusBadgeClass(selectedOrder.status)}>{selectedOrder.status}</span></p>
                  <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                </div>

                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <p><strong>Name:</strong> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                </div>

                <div className="detail-section">
                  <h3>Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress?.street}</p>
                  <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                </div>

                <div className="detail-section">
                  <h3>Order Items</h3>
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <p><strong>{item.product?.name}</strong></p>
                      <p>Quantity: {item.quantity} × {formatCurrency(item.price)}</p>
                      <p>Subtotal: {formatCurrency(item.quantity * item.price)}</p>
                    </div>
                  ))}
                </div>

                <div className="detail-section">
                  <h3>Order Summary</h3>
                  <p><strong>Subtotal:</strong> {formatCurrency(selectedOrder.subtotal || selectedOrder.totalAmount)}</p>
                  <p><strong>Shipping:</strong> {formatCurrency(selectedOrder.shippingCost || 0)}</p>
                  <p><strong>Tax:</strong> {formatCurrency(selectedOrder.tax || 0)}</p>
                  <p className="total"><strong>Total:</strong> {formatCurrency(selectedOrder.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
