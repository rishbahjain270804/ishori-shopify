import { useState } from 'react';
import axios from 'axios';

const AddressForm = ({ address, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(address || {
    type: 'home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (address) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/addresses/${address._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/addresses`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      {error && <div className="error">{error}</div>}
      
      <div className="form-row">
        <div className="form-group">
          <label>Address Type *</label>
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required>
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Full Name *</label>
          <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Phone *</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
        </div>
      </div>

      <div className="form-group">
        <label>Address Line 1 *</label>
        <input type="text" value={formData.addressLine1} onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} required />
      </div>

      <div className="form-group">
        <label>Address Line 2</label>
        <input type="text" value={formData.addressLine2} onChange={(e) => setFormData({...formData, addressLine2: e.target.value})} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City *</label>
          <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>State *</label>
          <input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Pincode *</label>
          <input type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Country *</label>
          <input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} required />
        </div>
      </div>

      <div className="form-group">
        <label>
          <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})} />
          Set as default address
        </label>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
