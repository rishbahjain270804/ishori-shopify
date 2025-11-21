import './CustomerTable.css';

const CustomerTable = ({ customers, onViewDetails, onStatusChange, sortBy, sortOrder, onSortChange }) => {
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <i className="fas fa-sort"></i>;
    return sortOrder === 'asc' 
      ? <i className="fas fa-sort-up"></i> 
      : <i className="fas fa-sort-down"></i>;
  };

  return (
    <div className="customer-table-container">
      <table className="customer-table">
        <thead>
          <tr>
            <th onClick={() => onSortChange('firstName')}>
              Customer {getSortIcon('firstName')}
            </th>
            <th onClick={() => onSortChange('email')}>
              Email {getSortIcon('email')}
            </th>
            <th>Phone</th>
            <th onClick={() => onSortChange('createdAt')}>
              Joined {getSortIcon('createdAt')}
            </th>
            <th>Total Orders</th>
            <th>Lifetime Value</th>
            <th>Last Order</th>
            <th onClick={() => onSortChange('status')}>
              Status {getSortIcon('status')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>
                <div className="customer-info">
                  <div className="customer-avatar">
                    {customer.avatar?.url ? (
                      <img src={customer.avatar.url} alt={customer.firstName} />
                    ) : (
                      <span>{customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="customer-name">
                    <strong>{customer.firstName} {customer.lastName}</strong>
                  </div>
                </div>
              </td>
              <td>
                <a href={`mailto:${customer.email}`} className="email-link">
                  {customer.email}
                </a>
              </td>
              <td>{customer.phone || 'N/A'}</td>
              <td>{formatDate(customer.createdAt)}</td>
              <td>
                <span className="order-count">{customer.stats?.totalOrders || 0}</span>
              </td>
              <td>
                <strong>{formatCurrency(customer.stats?.lifetimeValue || 0)}</strong>
              </td>
              <td>
                {customer.stats?.lastOrderDate 
                  ? formatDate(customer.stats.lastOrderDate)
                  : 'Never'}
              </td>
              <td>
                <span className={getStatusBadgeClass(customer.status)}>
                  {customer.status}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => onViewDetails(customer._id)}
                    className="btn-icon"
                    title="View Details"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  
                  <div className="dropdown">
                    <button className="btn-icon" title="Change Status">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <div className="dropdown-menu">
                      <button
                        onClick={() => onStatusChange(customer._id, 'active')}
                        disabled={customer.status === 'active'}
                      >
                        <i className="fas fa-check-circle"></i> Set Active
                      </button>
                      <button
                        onClick={() => onStatusChange(customer._id, 'inactive')}
                        disabled={customer.status === 'inactive'}
                      >
                        <i className="fas fa-pause-circle"></i> Set Inactive
                      </button>
                      <button
                        onClick={() => onStatusChange(customer._id, 'suspended')}
                        disabled={customer.status === 'suspended'}
                        className="danger"
                      >
                        <i className="fas fa-ban"></i> Suspend
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
