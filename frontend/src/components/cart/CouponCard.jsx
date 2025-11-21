import './CouponCard.css';

const CouponCard = ({ coupon, onRemove }) => {
  const getDiscountText = () => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `₹${coupon.discountValue} OFF`;
    }
  };

  return (
    <div className="coupon-card">
      <div className="coupon-card-content">
        <div className="coupon-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10H3M21 10C21.5523 10 22 10.4477 22 11V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V11C2 10.4477 2.44772 10 3 10M21 10V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="15.5" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <div className="coupon-details">
          <div className="coupon-code-badge">{coupon.code}</div>
          <p className="coupon-description">{coupon.description || 'Coupon applied'}</p>
          <div className="coupon-discount-info">
            <span className="discount-badge">{getDiscountText()}</span>
            <span className="discount-amount">You save ₹{coupon.discount?.toFixed(2)}</span>
          </div>
        </div>
        <button 
          className="coupon-remove-btn" 
          onClick={onRemove}
          title="Remove coupon"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CouponCard;
