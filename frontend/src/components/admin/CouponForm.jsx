import { useState, useEffect } from 'react';
import './CouponForm.css';

const CouponForm = ({ coupon, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    startDate: '',
    expiryDate: '',
    usageLimit: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        description: coupon.description || '',
        discountType: coupon.discountType || 'percentage',
        discountValue: coupon.discountValue || '',
        minOrderValue: coupon.minOrderValue || '',
        maxDiscount: coupon.maxDiscount || '',
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
        usageLimit: coupon.usageLimit || '',
        status: coupon.status || 'active'
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Code must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) < new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    // Prepare data
    const submitData = {
      ...formData,
      code: formData.code.toUpperCase(),
      discountValue: parseFloat(formData.discountValue),
      minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : 0,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null
    };

    const result = await onSubmit(submitData);
    setSubmitting(false);

    if (result.success) {
      // Form will be closed by parent component
    }
  };

  return (
    <div className="coupon-form">
      <div className="coupon-form-header">
        <h2>{coupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="code">Coupon Code *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., SAVE20"
              maxLength={20}
              className={errors.code ? 'error' : ''}
            />
            {errors.code && <span className="error-message">{errors.code}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the coupon offer"
            rows={3}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="discountType">Discount Type *</label>
            <select
              id="discountType"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="discountValue">
              Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
            </label>
            <input
              type="number"
              id="discountValue"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder={formData.discountType === 'percentage' ? '10' : '100'}
              min="0"
              step="0.01"
              className={errors.discountValue ? 'error' : ''}
            />
            {errors.discountValue && <span className="error-message">{errors.discountValue}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="minOrderValue">Minimum Order Value (₹)</label>
            <input
              type="number"
              id="minOrderValue"
              name="minOrderValue"
              value={formData.minOrderValue}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxDiscount">Maximum Discount (₹)</label>
            <input
              type="number"
              id="maxDiscount"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
              placeholder="No limit"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date *</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={errors.expiryDate ? 'error' : ''}
            />
            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="usageLimit">Usage Limit</label>
          <input
            type="number"
            id="usageLimit"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleChange}
            placeholder="Unlimited"
            min="1"
          />
          <small>Leave empty for unlimited usage</small>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Saving...' : (coupon ? 'Update Coupon' : 'Create Coupon')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
