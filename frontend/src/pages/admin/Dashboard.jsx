import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../../utils/apiClient';
import StatsCards from '../../components/admin/StatsCards';
import RevenueChart from '../../components/admin/RevenueChart';
import TopProductsTable from '../../components/admin/TopProductsTable';
import OrderStatusPieChart from '../../components/admin/OrderStatusPieChart';
import DateRangePicker from '../../components/admin/DateRangePicker';
import LowStockAlerts from '../../components/admin/LowStockAlerts';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ period: 'month' });
  const [granularity, setGranularity] = useState('daily');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams(dateRange);
      
      // Fetch all analytics data in parallel
      const [dashboardRes, trendsRes, productsRes, statusRes] = await Promise.all([
        apiGet(`/api/admin/analytics/dashboard?${params}`),
        apiGet(`/api/admin/analytics/revenue-trends?${params}&granularity=${granularity}`),
        apiGet(`/api/admin/analytics/top-products?${params}&limit=10`),
        apiGet(`/api/admin/analytics/order-status?${params}`)
      ]);

      setStats(dashboardRes.data);
      setRevenueTrends(trendsRes.data.trends || []);
      setTopProducts(productsRes.data.products || []);
      setOrderStatus(statusRes.data.distribution || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    
    // Adjust granularity based on date range
    if (newRange.period === 'today' || newRange.period === 'week') {
      setGranularity('daily');
    } else if (newRange.period === 'month') {
      setGranularity('daily');
    } else if (newRange.period === 'year') {
      setGranularity('monthly');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <Link to="/admin/products/new" className="btn-primary">+ New Product</Link>
      </div>

      <DateRangePicker 
        onDateRangeChange={handleDateRangeChange}
        defaultPeriod="month"
      />

      <StatsCards stats={stats} loading={loading} />

      <RevenueChart 
        data={revenueTrends} 
        loading={loading}
        granularity={granularity}
      />

      <div className="dashboard-grid-two">
        <TopProductsTable products={topProducts} loading={loading} />
        <OrderStatusPieChart data={orderStatus} loading={loading} />
      </div>

      <LowStockAlerts threshold={5} compact={true} />

      <div className="dashboard-card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="card-content">
          <div className="quick-actions">
            <Link to="/admin/products/new" className="action-btn">
              <span className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
              <span>Add Product</span>
            </Link>
            <Link to="/admin/media" className="action-btn">
              <span className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </span>
              <span>Upload Media</span>
            </Link>
            <Link to="/admin/orders" className="action-btn">
              <span className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
              </span>
              <span>View Orders</span>
            </Link>
            <Link to="/admin/coupons" className="action-btn">
              <span className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </span>
              <span>Manage Coupons</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
