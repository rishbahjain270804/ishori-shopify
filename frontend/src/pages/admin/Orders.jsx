import { useState } from 'react';
import './Orders.css';

const Orders = () => {
  const [orders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <div className="orders-stats">
          <span className="stat-badge">Total: {orders.length}</span>
        </div>
      </div>

      <div className="orders-controls">
        <input
          type="text"
          placeholder="Search by order number or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet</p>
          <small>Orders will appear here when customers make purchases</small>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="order-number">{order.orderNumber}</td>
                  <td>{order.customer}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.items.length}</td>
                  <td className="order-total">₹{order.total.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="View Details">View</button>
                      <button className="btn-icon" title="Update Status">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
