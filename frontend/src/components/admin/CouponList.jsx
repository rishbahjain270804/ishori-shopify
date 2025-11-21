import './CouponList.css';

const CouponList = ({ coupons, onEdit, onDelete, onToggleStatus }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDiscountText = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    } else {
      return `₹${coupon.discountValue}`;
    }
  };

  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

  const getUsagePercentage = (coupon) => {
    if (!coupon.usageLimit) return 0;
    return (coupon.usedCount / coupon.usageLimit) * 100;
  };

  if (coupons.length === 0) {
    return (
      <div className="empty-state">
        <p>No coupons found</p>
      </div>
    );
  }

  return (
    <div className="coupon-list">
      <div className="coupon-table">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Discount</th>
              <th>Min Order</th>
              <th>Expiry Date</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className={isExpired(coupon.expiryDate) ? 'expired' : ''}>
                <td>
                  <span className="coupon-code-badge">{coupon.code}</span>
                </td>
                <td>
                  <div className="coupon-description">{coupon.description}</div>
                </td>
                <td>
                  <span className="discount-value">{getDiscountText(coupon)}</span>
                  {coupon.maxDiscount && (
                    <div className="max-discount">Max: ₹{coupon.maxDiscount}</div>
                  )}
                </td>
                <td>₹{coupon.minOrderValue || 0}</td>
                <td>
                  <div className={isExpired(coupon.expiryDate) ? 'date-expired' : ''}>
                    {formatDate(coupon.expiryDate)}
                  </div>
                  {isExpired(coupon.expiryDate) && (
                    <span className="expired-badge">Expired</span>
                  )}
                </td>
                <td>
                  <div className="usage-info">
                    <span className="usage-count">
                      {coupon.usedCount} / {coupon.usageLimit || '∞'}
                    </span>
                    {coupon.usageLimit && (
                      <div className="usage-bar">
                        <div 
                          className="usage-fill" 
                          style={{ width: `${getUsagePercentage(coupon)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <button
                    className={`status-badge ${coupon.status}`}
                    onClick={() => onToggleStatus(coupon._id)}
                    title={`Click to ${coupon.status === 'active' ? 'deactivate' : 'activate'}`}
                  >
                    {coupon.status}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(coupon)}
                      title="Edit coupon"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(coupon._id)}
                      title="Delete coupon"
                      disabled={coupon.usedCount > 0}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.33301 4.00004V2.66671C5.33301 2.31309 5.47348 1.97395 5.72353 1.7239C5.97358 1.47385 6.31272 1.33337 6.66634 1.33337H9.33301C9.68663 1.33337 10.0258 1.47385 10.2758 1.7239C10.5259 1.97395 10.6663 2.31309 10.6663 2.66671V4.00004M12.6663 4.00004V13.3334C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3334V4.00004H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponList;
