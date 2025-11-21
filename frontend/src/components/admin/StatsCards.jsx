import PropTypes from 'prop-types';
import './StatsCards.css';

const StatsCards = ({ stats, loading }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatGrowth = (growth) => {
    if (!growth || growth === 0) return null;
    const isPositive = growth > 0;
    return (
      <span className={`growth ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
      </span>
    );
  };

  const cards = [
    {
      title: 'Total Revenue',
      value: loading ? '...' : formatCurrency(stats?.revenue?.current || 0),
      growth: stats?.revenue?.growth,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)'
    },
    {
      title: 'Total Orders',
      value: loading ? '...' : (stats?.orders?.current || 0).toLocaleString(),
      growth: stats?.orders?.growth,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
    },
    {
      title: 'New Customers',
      value: loading ? '...' : (stats?.customers?.current || 0).toLocaleString(),
      growth: stats?.customers?.growth,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M20 8v6M23 11h-6" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
    },
    {
      title: 'Avg Order Value',
      value: loading ? '...' : formatCurrency(stats?.avgOrderValue || 0),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
    }
  ];

  return (
    <div className="stats-cards-grid">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon" style={{ background: card.gradient }}>
            {card.icon}
          </div>
          <div className="stat-content">
            <h3>{card.title}</h3>
            <div className="stat-value-row">
              <p className="stat-value">{card.value}</p>
              {card.growth !== undefined && formatGrowth(card.growth)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

StatsCards.propTypes = {
  stats: PropTypes.shape({
    revenue: PropTypes.shape({
      current: PropTypes.number,
      previous: PropTypes.number,
      growth: PropTypes.number
    }),
    orders: PropTypes.shape({
      current: PropTypes.number,
      previous: PropTypes.number,
      growth: PropTypes.number
    }),
    customers: PropTypes.shape({
      current: PropTypes.number,
      previous: PropTypes.number,
      growth: PropTypes.number
    }),
    avgOrderValue: PropTypes.number
  }),
  loading: PropTypes.bool
};

export default StatsCards;
