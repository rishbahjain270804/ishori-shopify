import nodemailer from 'nodemailer'

class EmailService {
  constructor() {
    this.transporter = null
    this.initializeTransporter()
  }

  initializeTransporter() {
    // Check if email configuration exists
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.warn('Email service not configured. Emails will not be sent.')
      return
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      console.log('Email service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize email service:', error)
    }
  }

  async sendEmail(to, subject, html) {
    if (!this.transporter) {
      console.log('Email service not configured. Skipping email:', { to, subject })
      return { success: false, message: 'Email service not configured' }
    }

    try {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Ishori Sarees'}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      }

      const info = await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('Failed to send email:', error)
      return { success: false, message: error.message }
    }
  }

  async sendOrderCancellationEmail(order, user) {
    const subject = `Order Cancelled - ${order._id}`
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
          .content { padding: 20px 0; }
          .order-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Your order has been cancelled as requested.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹${order.totalPrice.toFixed(2)}</p>
              <p><strong>Cancellation Reason:</strong> ${order.cancellation.reason}</p>
              ${order.cancellation.refundStatus ? `<p><strong>Refund Status:</strong> ${order.cancellation.refundStatus}</p>` : ''}
              ${order.cancellation.refundAmount ? `<p><strong>Refund Amount:</strong> ₹${order.cancellation.refundAmount.toFixed(2)}</p>` : ''}
            </div>

            ${order.isPaid ? '<p>Your refund will be processed within 5-7 business days to your original payment method.</p>' : ''}
            
            <p>If you have any questions, please contact our customer support.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Ishori Sarees. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail(user.email, subject, html)
  }

  async sendOrderConfirmationEmail(order, user) {
    const subject = `Order Confirmation - ${order._id}`
    
    const itemsHtml = order.orderItems
      .map(
        item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .content { padding: 20px 0; }
          .order-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f8f9fa; }
          .total { font-size: 18px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Thank you for your order! We're processing it now.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              
              <h4>Items Ordered:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <p><strong>Subtotal:</strong> ₹${order.itemsPrice.toFixed(2)}</p>
              <p><strong>Shipping:</strong> ₹${order.shippingPrice.toFixed(2)}</p>
              <p><strong>Tax:</strong> ₹${order.taxPrice.toFixed(2)}</p>
              ${order.coupon?.discount ? `<p><strong>Discount:</strong> -₹${order.coupon.discount.toFixed(2)}</p>` : ''}
              <p class="total"><strong>Total:</strong> ₹${order.totalPrice.toFixed(2)}</p>
              
              <h4>Shipping Address:</h4>
              <p>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
                ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}<br>
                Phone: ${order.shippingAddress.phone}
              </p>
            </div>
            
            <p>We'll send you another email when your order ships.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Ishori Sarees. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail(user.email, subject, html)
  }

  async sendOrderStatusUpdateEmail(order, user, newStatus) {
    const subject = `Order ${newStatus} - ${order._id}`
    
    const statusMessages = {
      Processing: 'Your order is being processed and will be shipped soon.',
      Shipped: 'Your order has been shipped and is on its way!',
      Delivered: 'Your order has been delivered. We hope you enjoy your purchase!',
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .content { padding: 20px 0; }
          .order-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Update</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>${statusMessages[newStatus] || `Your order status has been updated to ${newStatus}.`}</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Status:</strong> ${newStatus}</p>
              <p><strong>Total Amount:</strong> ₹${order.totalPrice.toFixed(2)}</p>
            </div>
            
            <p>You can track your order status anytime by logging into your account.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Ishori Sarees. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail(user.email, subject, html)
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Ishori Sarees!'
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 5px; }
          .content { padding: 30px 0; }
          .features { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .feature-item { margin: 15px 0; padding-left: 25px; position: relative; }
          .feature-item:before { content: "✓"; position: absolute; left: 0; color: #28a745; font-weight: bold; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Ishori Sarees!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your journey to elegant sarees begins here</p>
          </div>
          <div class="content">
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>Thank you for joining Ishori Sarees! We're thrilled to have you as part of our family.</p>
            
            <div class="features">
              <h3 style="margin-top: 0;">What you can do with your account:</h3>
              <div class="feature-item">Browse our exclusive collection of traditional and designer sarees</div>
              <div class="feature-item">Save your favorite items to your wishlist</div>
              <div class="feature-item">Track your orders in real-time</div>
              <div class="feature-item">Manage multiple shipping addresses</div>
              <div class="feature-item">Get exclusive offers and early access to new collections</div>
              <div class="feature-item">Write reviews and share your experience</div>
            </div>

            <p>Ready to explore? Start shopping now and discover the perfect saree for every occasion.</p>
            
            <center>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/collections" class="button">Start Shopping</a>
            </center>

            <p style="margin-top: 30px;">If you have any questions, our customer support team is always here to help.</p>
            
            <p>Happy Shopping!<br>The Ishori Sarees Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Ishori Sarees. All rights reserved.</p>
            <p>You're receiving this email because you created an account on our website.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail(user.email, subject, html)
  }

  async sendPasswordResetEmail(user, resetToken) {
    const subject = 'Password Reset Request - Ishori Sarees'
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .content { padding: 20px 0; }
          .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; margin-top: 30px; }
          .code-box { background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 14px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>We received a request to reset your password for your Ishori Sarees account.</p>
            
            <div class="alert-box">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>

            <p>To reset your password, click the button below:</p>
            
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>

            <p>Or copy and paste this link into your browser:</p>
            <div class="code-box">${resetUrl}</div>

            <p><strong>This link will expire in 1 hour</strong> for security reasons.</p>

            <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
            
            <p>Best regards,<br>The Ishori Sarees Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Ishori Sarees. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail(user.email, subject, html)
  }

  async sendStockAlertEmail(product, adminEmail) {
    const subject = `Low Stock Alert - ${product.name}`
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ffc107; color: #333; padding: 20px; text-align: center; border-radius: 5px; }
          .content { padding: 20px 0; }
          .product-box { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; display: flex; gap: 20px; align-items: center; }
          .product-image { width: 100px; height: 100px; object-fit: cover; border-radius: 5px; }
          .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .stock-info { margin: 15px 0; }
          .stock-item { padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Low Stock Alert</h1>
          </div>
          <div class="content">
            <p>Hello Admin,</p>
            <p>This is an automated alert to inform you that the following product is running low on stock:</p>
            
            <div class="product-box">
              ${product.images && product.images[0] ? `<img src="${product.images[0]}" alt="${product.name}" class="product-image">` : ''}
              <div>
                <h3 style="margin: 0 0 10px 0;">${product.name}</h3>
                <p style="margin: 0; color: #666;">SKU: ${product.sku || 'N/A'}</p>
                <p style="margin: 5px 0; color: #666;">Category: ${product.category || 'N/A'}</p>
              </div>
            </div>

            <div class="alert-box">
              <strong>Current Stock Levels:</strong>
              <div class="stock-info">
                ${Object.entries(product.stock || {}).map(([size, quantity]) => `
                  <div class="stock-item">
                    <strong>${size}:</strong> ${quantity} units ${quantity <= 5 ? '⚠️' : ''}
                  </div>
                `).join('')}
              </div>
            </div>

            <p><strong>Action Required:</strong> Please restock this product to avoid running out of inventory.</p>
            
            <center>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/products" class="button">Manage Inventory</a>
            </center>

            <p>This alert is sent when stock levels fall below the threshold.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Ishori Sarees. All rights reserved.</p>
            <p>This is an automated alert from your inventory management system.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail(adminEmail, subject, html)
  }

  async sendPasswordChangedEmail(user) {
    const subject = 'Password Changed Successfully - Ishori Sarees'
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .content { padding: 20px 0; }
          .alert-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Password Changed</h1>
          </div>
          <div class="content">
            <p>Dear ${user.firstName} ${user.lastName},</p>
            
            <div class="alert-box">
              <strong>✓ Success!</strong> Your password has been changed successfully.
            </div>

            <p>This email confirms that your Ishori Sarees account password was recently changed.</p>
            
            <p><strong>Change Details:</strong></p>
            <ul>
              <li>Date: ${new Date().toLocaleString()}</li>
              <li>Account: ${user.email}</li>
            </ul>

            <div class="warning-box">
              <strong>⚠️ Didn't make this change?</strong><br>
              If you didn't change your password, please contact our support team immediately at support@ishori.com or reset your password right away.
            </div>

            <p>For your security, we recommend:</p>
            <ul>
              <li>Using a strong, unique password</li>
              <li>Not sharing your password with anyone</li>
              <li>Changing your password regularly</li>
              <li>Enabling two-factor authentication if available</li>
            </ul>
            
            <p>Thank you for keeping your account secure!</p>
            
            <p>Best regards,<br>The Ishori Sarees Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Ishori Sarees. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail(user.email, subject, html)
  }
}

export default new EmailService()
