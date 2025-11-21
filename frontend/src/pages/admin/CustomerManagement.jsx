import { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerManagement.css';
import CustomerTable from '../../components/admin/CustomerTable';
import CustomerDetailsModal from '../../components/admin/CustomerDetailsModal';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const limit = 20;

  // Stats
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    suspendedCustomers: 0,
    newCustomersThisMonth: 0
  });

  // Fetch customer stats
  useEffect(() => {
    fetchCustomerStats();
  }, []);

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, [currentPage, search, statusFilter, sortBy, sortOrder]);

  const fetchCustomerStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/customers/stats/summary`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching customer stats:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        limit,
        search,
        status: statusFilter,
        sortBy,
        sortOrder
      };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/customers`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      );

      if (response.data.success) {
        setCustomers(response.data.data);
        setTotalPages(response.data.pagination.pages);
        setTotalCustomers(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError(error.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (customerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/customers/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSelectedCustomer(response.data.data);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      alert('Failed to fetch customer details');
    }
  };

  const handleStatusChange = async (customerId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/customers/${customerId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Refresh customers list
        fetchCustomers();
        fetchCustomerStats();
        
        // Update modal if open
        if (selectedCustomer && selectedCustomer.customer._id === customerId) {
          setSelectedCustomer({
            ...selectedCustomer,
            customer: { ...selectedCustomer.customer, status: newStatus }
          });
        }
        
        alert(`Customer status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
      alert(error.response?.data?.message || 'Failed to update customer status');
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="customer-management">
      <div className="page-header">
        <h1>Customer Management</h1>
        <p>Manage and view customer information</p>
      </div>

      {/* Stats Cards */}
      <div className="customer-stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.activeCustomers}</h3>
            <p>Active Customers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon new">
            <i className="fas fa-user-plus"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.newCustomersThisMonth}</h3>
            <p>New This Month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon suspended">
            <i className="fas fa-user-slash"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.suspendedCustomers}</h3>
            <p>Suspended</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="customer-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>

        <button 
          className="btn-secondary"
          onClick={() => {
            setSearch('');
            setStatusFilter('');
            setCurrentPage(1);
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Customer Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading customers...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={fetchCustomers} className="btn-primary">
            Retry
          </button>
        </div>
      ) : customers.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-users"></i>
          <h3>No customers found</h3>
          <p>
            {search || statusFilter
              ? 'Try adjusting your filters'
              : 'Customers will appear here when they register'}
          </p>
        </div>
      ) : (
        <>
          <CustomerTable
            customers={customers}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>

              <div className="pagination-info">
                Page {currentPage} of {totalPages} ({totalCustomers} total customers)
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedCustomer(null);
          }}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default CustomerManagement;
