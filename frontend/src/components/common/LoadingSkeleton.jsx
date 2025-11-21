import './LoadingSkeleton.css';

export const ProductCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-price"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array(columns).fill(0).map((_, i) => (
        <div key={i} className="skeleton-line"></div>
      ))}
    </div>
    {Array(rows).fill(0).map((_, i) => (
      <div key={i} className="skeleton-table-row">
        {Array(columns).fill(0).map((_, j) => (
          <div key={j} className="skeleton-line"></div>
        ))}
      </div>
    ))}
  </div>
);

export const FormSkeleton = () => (
  <div className="skeleton-form">
    {Array(4).fill(0).map((_, i) => (
      <div key={i} className="skeleton-form-group">
        <div className="skeleton-line skeleton-label"></div>
        <div className="skeleton-line skeleton-input"></div>
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="skeleton-dashboard">
    <div className="skeleton-stats">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="skeleton-stat-card">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
        </div>
      ))}
    </div>
    <div className="skeleton-chart"></div>
  </div>
);

const LoadingSkeleton = ({ type = 'card', ...props }) => {
  switch (type) {
    case 'product':
      return <ProductCardSkeleton {...props} />;
    case 'table':
      return <TableSkeleton {...props} />;
    case 'form':
      return <FormSkeleton {...props} />;
    case 'dashboard':
      return <DashboardSkeleton {...props} />;
    default:
      return <div className="skeleton-default"></div>;
  }
};

export default LoadingSkeleton;
