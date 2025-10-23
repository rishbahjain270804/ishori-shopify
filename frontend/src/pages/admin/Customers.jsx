import { useState } from 'react';
import './Customers.css';

const Customers = () => {
  const [customers] = useState([]);
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(search.toLowerCase()) ||
    customer.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-customers">
      <div className="customers-header">
        <h1>Customers Management</h1>
        <div className="customers-stats">
          <span className="stat-badge">Total: {customers.length}</span>
        </div>
      </div>

      <div className="customers-controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <p>No customers yet</p>
          <small>Customers will appear here when they register on your site</small>
        </div>
      ) : (
        <div className="customers-grid">
          {filteredCustomers.map((customer) => (
            <div key={customer._id} className="customer-card">
              <div className="customer-avatar">
                {customer.name?.charAt(0).toUpperCase()}
              </div>
              <div className="customer-info">
                <h3>{customer.name}</h3>
                <p className="customer-email">{customer.email}</p>
                <div className="customer-meta">
                  <span>{customer.orders || 0} Orders</span>
                  <span>₹{customer.totalSpent || 0} Spent</span>
                </div>
                <p className="customer-joined">
                  Joined {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="customer-actions">
                <button className="btn-icon" title="View Details">View</button>
                <button className="btn-icon" title="Send Email">Email</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;
