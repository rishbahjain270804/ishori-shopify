import { useState, useEffect } from 'react'
import axios from 'axios'
import './SalesReports.css'

const SalesReports = () => {
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState('last30days')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [reportData, setReportData] = useState(null)
  const [categoryData, setCategoryData] = useState([])
  const [paymentData, setPaymentData] = useState([])

  const getDateRange = () => {
    const end = new Date()
    let start = new Date()

    switch (dateRange) {
      case 'today':
        start.setHours(0, 0, 0, 0)
        break
      case 'last7days':
        start.setDate(end.getDate() - 7)
        break
      case 'last30days':
        start.setDate(end.getDate() - 30)
        break
      case 'thisMonth':
        start = new Date(end.getFullYear(), end.getMonth(), 1)
        break
      case 'lastMonth':
        start = new Date(end.getFullYear(), end.getMonth() - 1, 1)
        end.setDate(0) // Last day of previous month
        break
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            startDate: new Date(customStartDate).toISOString(),
            endDate: new Date(customEndDate).toISOString(),
          }
        }
        return null
      default:
        start.setDate(end.getDate() - 30)
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    }
  }

  const fetchReportData = async () => {
    const dates = getDateRange()
    if (!dates) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: dates,
      }

      const [salesRes, categoryRes, paymentRes] = await Promise.all([
        axios.get('/api/admin/reports/sales', config),
        axios.get('/api/admin/reports/category-performance', config),
        axios.get('/api/admin/reports/payment-methods', config),
      ])

      setReportData(salesRes.data.data)
      setCategoryData(categoryRes.data.data)
      setPaymentData(paymentRes.data.data)
    } catch (error) {
      console.error('Error fetching report data:', error)
      alert('Failed to fetch report data')
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async () => {
    const dates = getDateRange()
    if (!dates) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/admin/reports/sales/export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: dates,
        responseType: 'blob',
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `sales-report-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Failed to export CSV')
    }
  }

  useEffect(() => {
    fetchReportData()
  }, [dateRange, customStartDate, customEndDate])

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  return (
    <div className="sales-reports">
      <div className="reports-header">
        <h1>Sales Reports</h1>
        <button className="export-btn" onClick={handleExportCSV} disabled={loading || !reportData}>
          📥 Export CSV
        </button>
      </div>

      <div className="date-range-selector">
        <div className="range-buttons">
          <button
            className={dateRange === 'today' ? 'active' : ''}
            onClick={() => setDateRange('today')}
          >
            Today
          </button>
          <button
            className={dateRange === 'last7days' ? 'active' : ''}
            onClick={() => setDateRange('last7days')}
          >
            Last 7 Days
          </button>
          <button
            className={dateRange === 'last30days' ? 'active' : ''}
            onClick={() => setDateRange('last30days')}
          >
            Last 30 Days
          </button>
          <button
            className={dateRange === 'thisMonth' ? 'active' : ''}
            onClick={() => setDateRange('thisMonth')}
          >
            This Month
          </button>
          <button
            className={dateRange === 'lastMonth' ? 'active' : ''}
            onClick={() => setDateRange('lastMonth')}
          >
            Last Month
          </button>
          <button
            className={dateRange === 'custom' ? 'active' : ''}
            onClick={() => setDateRange('custom')}
          >
            Custom Range
          </button>
        </div>

        {dateRange === 'custom' && (
          <div className="custom-date-inputs">
            <input
              type="date"
              value={customStartDate}
              onChange={e => setCustomStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <span>to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={e => setCustomEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading report data...</div>
      ) : reportData ? (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Revenue</h3>
              <p className="value">{formatCurrency(reportData.summary.totalRevenue)}</p>
            </div>
            <div className="summary-card">
              <h3>Total Orders</h3>
              <p className="value">{reportData.summary.totalOrders}</p>
            </div>
            <div className="summary-card">
              <h3>Average Order Value</h3>
              <p className="value">{formatCurrency(reportData.summary.avgOrderValue)}</p>
            </div>
          </div>

          <div className="reports-grid">
            <div className="report-section">
              <h2>Sales by Category</h2>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Revenue</th>
                    <th>Quantity</th>
                    <th>Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.map((cat, index) => (
                    <tr key={index}>
                      <td>{cat.category}</td>
                      <td>{formatCurrency(cat.revenue)}</td>
                      <td>{cat.quantity}</td>
                      <td>{cat.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="report-section">
              <h2>Payment Methods</h2>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Count</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentData.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.method}</td>
                      <td>{payment.count}</td>
                      <td>{formatCurrency(payment.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="report-section">
              <h2>Order Status Breakdown</h2>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.statusBreakdown.map((status, index) => (
                    <tr key={index}>
                      <td>{status.status}</td>
                      <td>{status.count}</td>
                      <td>{formatCurrency(status.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="recent-orders-section">
            <h2>Recent Orders</h2>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.orders.slice(0, 20).map(order => (
                  <tr key={order.orderId}>
                    <td>{order.orderId.slice(-8)}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{order.customerName}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="no-data">No data available for the selected date range</div>
      )}
    </div>
  )
}

export default SalesReports
