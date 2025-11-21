import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './OrderStatusPieChart.css';

const OrderStatusPieChart = ({ data, loading }) => {
  const COLORS = {
    'Pending': '#f59e0b',
    'Processing': '#3b82f6',
    'Shipped': '#8b5cf6',
    'Delivered': '#10b981',
    'Cancelled': '#ef4444'
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="pie-tooltip">
          <p className="tooltip-status">{data.status}</p>
          <p className="tooltip-count">Orders: <strong>{data.count}</strong></p>
          <p className="tooltip-value">Value: <strong>{formatCurrency(data.totalValue)}</strong></p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="order-status-chart-container">
        <div className="chart-header">
          <h3>Order Status Distribution</h3>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="order-status-chart-container">
        <div className="chart-header">
          <h3>Order Status Distribution</h3>
        </div>
        <div className="chart-empty">
          <p>No order data available</p>
        </div>
      </div>
    );
  }

  const totalOrders = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="order-status-chart-container">
      <div className="chart-header">
        <h3>Order Status Distribution</h3>
        <span className="total-orders">{totalOrders} total orders</span>
      </div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#6b7280'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="status-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: COLORS[item.status] || '#6b7280' }}
              ></div>
              <div className="legend-details">
                <span className="legend-status">{item.status}</span>
                <span className="legend-count">{item.count} orders</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

OrderStatusPieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    status: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    totalValue: PropTypes.number.isRequired
  })),
  loading: PropTypes.bool
};

OrderStatusPieChart.defaultProps = {
  loading: false
};

export default OrderStatusPieChart;
