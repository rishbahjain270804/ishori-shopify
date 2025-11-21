import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class InvoiceService {
  constructor() {
    // Create invoices directory if it doesn't exist
    this.invoicesDir = path.join(__dirname, '..', 'invoices')
    if (!fs.existsSync(this.invoicesDir)) {
      fs.mkdirSync(this.invoicesDir, { recursive: true })
    }
  }

  /**
   * Generate invoice PDF for an order
   */
  async generateInvoice(order, user) {
    return new Promise((resolve, reject) => {
      try {
        // Generate invoice number if not exists
        const invoiceNumber = order.invoice?.invoiceNumber || this.generateInvoiceNumber(order._id)
        const fileName = `invoice-${invoiceNumber}.pdf`
        const filePath = path.join(this.invoicesDir, fileName)

        // Create PDF document
        const doc = new PDFDocument({ margin: 50 })
        const stream = fs.createWriteStream(filePath)

        doc.pipe(stream)

        // Add header
        this.addHeader(doc, invoiceNumber, order)

        // Add company and customer info
        this.addCompanyInfo(doc)
        this.addCustomerInfo(doc, user, order)

        // Add order items table
        this.addItemsTable(doc, order)

        // Add totals
        this.addTotals(doc, order)

        // Add footer
        this.addFooter(doc)

        // Finalize PDF
        doc.end()

        stream.on('finish', () => {
          resolve({
            invoiceNumber,
            filePath,
            fileName,
            url: `/api/orders/${order._id}/invoice`,
          })
        })

        stream.on('error', reject)
      } catch (error) {
        reject(error)
      }
    })
  }

  generateInvoiceNumber(orderId) {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const orderIdShort = orderId.toString().slice(-6).toUpperCase()
    return `INV-${year}${month}-${orderIdShort}`
  }

  addHeader(doc, invoiceNumber, order) {
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('INVOICE', 50, 50)
      .fontSize(10)
      .font('Helvetica')
      .text(`Invoice Number: ${invoiceNumber}`, 50, 80)
      .text(`Order ID: ${order._id}`, 50, 95)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 110)
      .text(`Status: ${order.orderStatus}`, 50, 125)

    doc.moveDown(2)
  }

  addCompanyInfo(doc) {
    const startY = 170

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('From:', 50, startY)
      .fontSize(10)
      .font('Helvetica')
      .text('Ishori Sarees', 50, startY + 20)
      .text('Premium Saree Collection', 50, startY + 35)
      .text('India', 50, startY + 50)
      .text('Email: support@ishori.com', 50, startY + 65)
      .text('Phone: +91 1234567890', 50, startY + 80)
  }

  addCustomerInfo(doc, user, order) {
    const startY = 170

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Bill To:', 300, startY)
      .fontSize(10)
      .font('Helvetica')
      .text(user.name || 'Customer', 300, startY + 20)
      .text(order.shippingAddress.street, 300, startY + 35)
      .text(
        `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
        300,
        startY + 50
      )
      .text(
        `${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`,
        300,
        startY + 65
      )
      .text(`Phone: ${order.shippingAddress.phone}`, 300, startY + 80)
      .text(`Email: ${user.email}`, 300, startY + 95)

    doc.moveDown(3)
  }

  addItemsTable(doc, order) {
    const tableTop = 320
    const itemCodeX = 50
    const descriptionX = 150
    const quantityX = 350
    const priceX = 420
    const amountX = 490

    // Table header
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('#', itemCodeX, tableTop)
      .text('Description', descriptionX, tableTop)
      .text('Qty', quantityX, tableTop)
      .text('Price', priceX, tableTop)
      .text('Amount', amountX, tableTop)

    // Draw line under header
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke()

    // Table rows
    let y = tableTop + 25
    doc.font('Helvetica').fontSize(9)

    order.orderItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity

      doc
        .text(index + 1, itemCodeX, y)
        .text(item.name, descriptionX, y, { width: 180 })
        .text(item.quantity, quantityX, y)
        .text(`₹${item.price.toFixed(2)}`, priceX, y)
        .text(`₹${itemTotal.toFixed(2)}`, amountX, y)

      y += 25
    })

    // Draw line after items
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke()

    return y + 10
  }

  addTotals(doc, order) {
    const startY = 320 + (order.orderItems.length * 25) + 40
    const labelX = 400
    const valueX = 490

    doc.fontSize(10).font('Helvetica')

    // Subtotal
    doc
      .text('Subtotal:', labelX, startY)
      .text(`₹${order.itemsPrice.toFixed(2)}`, valueX, startY)

    // Shipping
    doc
      .text('Shipping:', labelX, startY + 20)
      .text(`₹${order.shippingPrice.toFixed(2)}`, valueX, startY + 20)

    // Tax
    doc
      .text('Tax:', labelX, startY + 40)
      .text(`₹${order.taxPrice.toFixed(2)}`, valueX, startY + 40)

    // Discount (if applicable)
    if (order.coupon && order.coupon.discount > 0) {
      doc
        .text('Discount:', labelX, startY + 60)
        .text(`-₹${order.coupon.discount.toFixed(2)}`, valueX, startY + 60)
    }

    // Draw line before total
    const totalY = order.coupon?.discount > 0 ? startY + 80 : startY + 60
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(400, totalY)
      .lineTo(550, totalY)
      .stroke()

    // Total
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Total:', labelX, totalY + 10)
      .text(`₹${order.totalPrice.toFixed(2)}`, valueX, totalY + 10)

    // Payment method
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Payment Method: ${order.paymentMethod}`, 50, totalY + 40)
      .text(`Payment Status: ${order.isPaid ? 'Paid' : 'Pending'}`, 50, totalY + 55)
  }

  addFooter(doc) {
    doc
      .fontSize(8)
      .font('Helvetica')
      .text(
        'Thank you for shopping with Ishori Sarees!',
        50,
        doc.page.height - 100,
        { align: 'center' }
      )
      .text(
        'For any queries, please contact us at support@ishori.com',
        50,
        doc.page.height - 85,
        { align: 'center' }
      )
      .text(
        '© ' + new Date().getFullYear() + ' Ishori Sarees. All rights reserved.',
        50,
        doc.page.height - 70,
        { align: 'center' }
      )
  }

  /**
   * Get invoice file path
   */
  getInvoicePath(invoiceNumber) {
    return path.join(this.invoicesDir, `invoice-${invoiceNumber}.pdf`)
  }

  /**
   * Check if invoice exists
   */
  invoiceExists(invoiceNumber) {
    const filePath = this.getInvoicePath(invoiceNumber)
    return fs.existsSync(filePath)
  }
}

export default new InvoiceService()
