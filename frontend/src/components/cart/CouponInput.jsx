import { useState } from 'react';
import './CouponInput.css';

const CouponInput = ({ onApply, loading }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onApply(code.trim().toUpperCase());
    }
  };

  return (
    <div className="coupon-input-container">
      <form className="coupon-input-form" onSubmit={handleSubmit}>
        <div className="coupon-input-wrapper">
          <input
            type="text"
            className="coupon-input"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={loading}
            maxLength={20}
          />
          <button 
            type="submit" 
            className="coupon-apply-btn"
            disabled={loading || !code.trim()}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Apply'
            )}
          </button>
        </div>
      </form>
      <p className="coupon-hint">Have a coupon? Enter it above to get discount</p>
    </div>
  );
};

export default CouponInput;
