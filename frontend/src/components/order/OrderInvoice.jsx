import React, { useState } from 'react'
import axios from 'axios'
import './OrderInvoice.css'

const OrderInvoice = ({ orderId, invoice }) => {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true)
      setError('')

      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/invoice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      )

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${invoice?.invoiceNumber || orderId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download invoice error:', err)
      setError('Failed to download invoice. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="order-invoice">
      <div className="invoice-header">
        <div className="invoice-icon">📄</div>
        <div className="invoice-info">
          <h4>Invoice</h4>
          {invoice?.invoiceNumber && (
            <p className="invoice-number">Invoice #{invoice.invoiceNumber}</p>
          )}
          {invoice?.generatedAt && (
            <p className="invoice-date">
              Generated on {new Date(invoice.generatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <button
        className="download-invoice-btn"
        onClick={handleDownloadInvoice}
        disabled={downloading}
      >
        {downloading ? (
          <>
            <span className="spinner"></span>
            Downloading...
          </>
        ) : (
          <>
            <span className="download-icon">⬇️</span>
            Download Invoice
          </>
        )}
      </button>

      {error && <div className="invoice-error">{error}</div>}
    </div>
  )
}

export default OrderInvoice
