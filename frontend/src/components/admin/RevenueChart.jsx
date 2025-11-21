import PropTypes from 'prop-types';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './RevenueChart.css';

const RevenueChart = ({ data, loading, granularity }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    
    if (granularity === 'monthly') {
      return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    } else if (granularity === 'weekly') {
      return `Week ${Math.ceil(date.getDate() / 7)}`;
    } else {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{formatDate(payload[0].payload.date)}</p>
          <p className="tooltip-revenue">
            Revenue: <strong>{formatCurrency(payload[0].value)}</strong>
          </p>
          <p className="tooltip-orders">
            Orders: <strong>{payload[1]?.value || 0}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="revenue-chart-container">
        <div className="chart-header">
          <h3>Revenue Trends</h3>
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
      <div className="revenue-chart-container">
        <div className="chart-header">
          <h3>Revenue Trends</h3>
        </div>
        <div className="chart-empty">
          <p>No data available for the selected period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="revenue-chart-container">
      <div className="chart-header">
        <h3>Revenue Trends</h3>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot revenue"></span>
            Revenue
          </span>
          <span className="legend-item">
            <span className="legend-dot orders"></span>
            Orders
          </span>
        </div>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#43e97b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#43e97b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={formatCurrency}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="revenue" 
              stroke="#43e97b" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="orders" 
              stroke="#667eea" 
              strokeWidth={2}
              dot={{ fill: '#667eea', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

RevenueChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    revenue: PropTypes.number.isRequired,
    orders: PropTypes.number.isRequired
  })),
  loading: PropTypes.bool,
  granularity: PropTypes.oneOf(['daily', 'weekly', 'monthly'])
};

RevenueChart.defaultProps = {
  loading: false,
  granularity: 'daily'
};

export default RevenueChart;
