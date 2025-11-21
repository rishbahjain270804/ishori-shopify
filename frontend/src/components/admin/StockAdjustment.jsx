import { useState } from 'react';
import axios from 'axios';
import './StockAdjustment.css';

const StockAdjustment = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    size: Object.keys(product.stock || {})[0] || '',
    quantity: '',
    type: 'add',
    reason: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.size || !formData.quantity || !formData.reason) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/inventory/${product._id}/stock`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adjust Stock - {product.name}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="stock-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Size *</label>
            <select
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              required
            >
              {Object.keys(product.stock || {}).map(size => (
                <option key={size} value={size}>
                  {size} (Current: {product.stock[size]})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
            >
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason *</label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="e.g., Restocking, Damaged goods, etc."
              required
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes (optional)"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Updating...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustment;
