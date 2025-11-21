import { useState } from 'react';
import './CustomerDetailsModal.css';

const CustomerDetailsModal = ({ customer, onClose, onStatusChange }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-badge active';
      case 'inactive':
        return 'status-badge inactive';
      case 'suspended':
        return 'status-badge suspended';
      default:
        return 'status-badge';
    }
  };

  const getOrderStatusBadge = (status) => {
    const statusClasses = {
      'Pending': 'order-status pending',
      'Processing': 'order-status processing',
      'Shipped': 'order-status shipped',
      'Delivered': 'order-status delivered',
      'Cancelled': 'order-status cancelled'
    };
    return statusClasses[status] || 'order-status';
  };

  const { customer: customerData, stats, recentOrders } = customer;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content customer-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Customer Details</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {/* Customer Header */}
          <div className="customer-header">
            <div className="customer-avatar-large">
              {customerData.avatar?.url ? (
                <img src={customerData.avatar.url} alt={customerData.firstName} />
              ) : (
                <span>{customerData.firstName?.charAt(0)}{customerData.lastName?.charAt(0)}</span>
              )}
            </div>
            <div className="customer-header-info">
              <h3>{customerData.firstName} {customerData.lastName}</h3>
              <p className="customer-email">
                <i className="fas fa-envelope"></i> {customerData.email}
              </p>
              {customerData.phone && (
                <p className="customer-phone">
                  <i className="fas fa-phone"></i> {customerData.phone}
                </p>
              )}
              <div className="customer-badges">
                <span className={getStatusBadgeClass(customerData.status)}>
                  {customerData.status}
                </span>
                {customerData.emailVerified && (
                  <span className="badge verified">
                    <i className="fas fa-check-circle"></i> Email Verified
                  </span>
                )}
                {customerData.phoneVerified && (
                  <span className="badge verified">
                    <i className="fas fa-check-circle"></i> Phone Verified
                  </span>
                )}
              </div>
            </div>
            <div className="customer-actions">
              <select
                value={customerData.status}
                onChange={(e) => onStatusChange(customerData._id, e.target.value)}
                className="status-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={activeTab === 'overview' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={activeTab === 'orders' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('orders')}
            >
              Orders ({stats.totalOrders})
            </button>
            <button
              className={activeTab === 'addresses' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('addresses')}
            >
              Addresses ({customerData.addresses?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                {/* Stats Grid */}
                <div className="stats-grid">
                  <div className="stat-box">
                    <i className="fas fa-shopping-cart"></i>
                    <div>
                      <h4>{stats.totalOrders}</h4>
                      <p>Total Orders</p>
                    </div>
                  </div>
                  <div className="stat-box">
                    <i className="fas fa-rupee-sign"></i>
                    <div>
                      <h4>{formatCurrency(stats.lifetimeValue)}</h4>
                      <p>Lifetime Value</p>
                    </div>
                  </div>
                  <div className="stat-box">
                    <i className="fas fa-chart-line"></i>
                    <div>
                      <h4>{formatCurrency(stats.averageOrderValue)}</h4>
                      <p>Avg Order Value</p>
                    </div>
                  </div>
                  <div className="stat-box">
                    <i className="fas fa-calendar"></i>
                    <div>
                      <h4>{stats.lastOrderDate ? formatDate(stats.lastOrderDate).split(',')[0] : 'Never'}</h4>
                      <p>Last Order</p>
                    </div>
                  </div>
                </div>

                {/* Order Status Breakdown */}
                <div className="section">
                  <h4>Orders by Status</h4>
                  <div className="order-status-grid">
                    <div className="status-item">
                      <span className="status-label">Pending</span>
                      <span className="status-count">{stats.ordersByStatus?.pending || 0}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Processing</span>
                      <span className="status-count">{stats.ordersByStatus?.processing || 0}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Shipped</span>
                      <span className="status-count">{stats.ordersByStatus?.shipped || 0}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Delivered</span>
                      <span className="status-count">{stats.ordersByStatus?.delivered || 0}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Cancelled</span>
                      <span className="status-count">{stats.ordersByStatus?.cancelled || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="section">
                  <h4>Account Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Customer ID</span>
                      <span className="info-value">{customerData._id}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Joined</span>
                      <span className="info-value">{formatDate(customerData.createdAt)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Login</span>
                      <span className="info-value">
                        {customerData.lastLogin ? formatDate(customerData.lastLogin) : 'Never'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Newsletter</span>
                      <span className="info-value">
                        {customerData.preferences?.newsletter ? 'Subscribed' : 'Not Subscribed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-tab">
                {recentOrders && recentOrders.length > 0 ? (
                  <div className="orders-list">
                    {recentOrders.map((order) => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <div>
                            <strong>Order #{order._id.slice(-8)}</strong>
                            <span className={getOrderStatusBadge(order.orderStatus)}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <div className="order-amount">
                            {formatCurrency(order.totalPrice)}
                          </div>
                        </div>
                        <div className="order-details">
                          <p>
                            <i className="fas fa-calendar"></i>
                            {formatDate(order.createdAt)}
                          </p>
                          <p>
                            <i className="fas fa-box"></i>
                            {order.orderItems?.length || 0} items
                          </p>
                          <p>
                            <i className="fas fa-credit-card"></i>
                            {order.paymentMethod}
                          </p>
                        </div>
                        {order.orderItems && order.orderItems.length > 0 && (
                          <div className="order-items">
                            {order.orderItems.slice(0, 3).map((item, index) => (
                              <div key={index} className="order-item">
                                {item.product?.images?.[0] && (
                                  <img src={item.product.images[0]} alt={item.name} />
                                )}
                                <span>{item.name} x{item.quantity}</span>
                              </div>
                            ))}
                            {order.orderItems.length > 3 && (
                              <span className="more-items">
                                +{order.orderItems.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-shopping-cart"></i>
                    <p>No orders yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="addresses-tab">
                {customerData.addresses && customerData.addresses.length > 0 ? (
                  <div className="addresses-list">
                    {customerData.addresses.map((address) => (
                      <div key={address._id} className="address-card">
                        <div className="address-header">
                          <span className="address-type">{address.type}</span>
                          {address.isDefault && (
                            <span className="badge default">Default</span>
                          )}
                        </div>
                        <div className="address-content">
                          <p><strong>{address.fullName}</strong></p>
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>{address.city}, {address.state} {address.pincode}</p>
                          <p>{address.country}</p>
                          <p><i className="fas fa-phone"></i> {address.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-map-marker-alt"></i>
                    <p>No addresses saved</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
