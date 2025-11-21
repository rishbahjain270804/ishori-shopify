import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CouponForm from '../../components/admin/CouponForm';
import CouponList from '../../components/admin/CouponList';
import './CouponManagement.css';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchCoupons();
  }, [statusFilter, searchTerm]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get(`${API_URL}/admin/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setCoupons(response.data.coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (couponData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/admin/coupons`,
        couponData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Coupon created successfully');
      setShowForm(false);
      fetchCoupons();
      return { success: true };
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to create coupon');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const handleUpdateCoupon = async (id, couponData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/admin/coupons/${id}`,
        couponData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Coupon updated successfully');
      setShowForm(false);
      setEditingCoupon(null);
      fetchCoupons();
      return { success: true };
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to update coupon');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_URL}/admin/coupons/${id}/status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(response.data.message);
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      toast.error('Failed to toggle coupon status');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  return (
    <div className="coupon-management">
      <div className="coupon-management-header">
        <h1>Coupon Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Create New Coupon
        </button>
      </div>

      {showForm && (
        <div className="coupon-form-modal">
          <div className="modal-overlay" onClick={handleCancelForm}></div>
          <div className="modal-content">
            <CouponForm
              coupon={editingCoupon}
              onSubmit={editingCoupon ? 
                (data) => handleUpdateCoupon(editingCoupon._id, data) : 
                handleCreateCoupon
              }
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      <div className="coupon-filters">
        <input
          type="text"
          placeholder="Search coupons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading coupons...</div>
      ) : (
        <CouponList
          coupons={coupons}
          onEdit={handleEdit}
          onDelete={handleDeleteCoupon}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};

export default CouponManagement;
