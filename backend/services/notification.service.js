import emailService from './email.service.js';
import smsService from './sms.service.js';

class NotificationService {
  /**
   * Send welcome notification (email only)
   */
  async sendWelcomeNotification(user) {
    try {
      // Send welcome email
      await emailService.sendWelcomeEmail(user);
      
      console.log(`Welcome notification sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to send welcome notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order confirmation notification (email + SMS)
   */
  async sendOrderConfirmationNotification(order, user) {
    try {
      const results = {
        email: null,
        sms: null
      };

      // Send email
      try {
        results.email = await emailService.sendOrderConfirmationEmail(order, user);
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        results.email = { success: false, error: emailError.message };
      }

      // Send SMS if user has phone and SMS notifications enabled
      if (user.phone && user.preferences?.notifications?.sms) {
        try {
          const smsMessage = `Your Ishori order ${order._id.toString().slice(-6)} has been confirmed! Total: ₹${order.totalPrice}. Track your order at ${process.env.CLIENT_URL}/orders/${order._id}`;
          
          if (smsService.client) {
            await smsService.client.messages.create({
              body: smsMessage,
              from: smsService.phoneNumber,
              to: user.phone
            });
            results.sms = { success: true };
            console.log(`Order confirmation SMS sent to ${user.phone}`);
          }
        } catch (smsError) {
          console.error('Failed to send order confirmation SMS:', smsError);
          results.sms = { success: false, error: smsError.message };
        }
      }

      return { success: true, results };
    } catch (error) {
      console.error('Failed to send order confirmation notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order status update notification (email + SMS for shipped/delivered)
   */
  async sendOrderStatusUpdateNotification(order, user, newStatus) {
    try {
      const results = {
        email: null,
        sms: null
      };

      // Send email
      try {
        results.email = await emailService.sendOrderStatusUpdateEmail(order, user, newStatus);
      } catch (emailError) {
        console.error('Failed to send order status update email:', emailError);
        results.email = { success: false, error: emailError.message };
      }

      // Send SMS for important status updates
      if (user.phone && user.preferences?.notifications?.sms && ['Shipped', 'Delivered'].includes(newStatus)) {
        try {
          const smsMessages = {
            'Shipped': `Your Ishori order ${order._id.toString().slice(-6)} has been shipped and is on its way!`,
            'Delivered': `Your Ishori order ${order._id.toString().slice(-6)} has been delivered. Thank you for shopping with us!`
          };
          
          if (smsService.client) {
            await smsService.client.messages.create({
              body: smsMessages[newStatus],
              from: smsService.phoneNumber,
              to: user.phone
            });
            results.sms = { success: true };
            console.log(`Order status SMS sent to ${user.phone}`);
          }
        } catch (smsError) {
          console.error('Failed to send order status SMS:', smsError);
          results.sms = { success: false, error: smsError.message };
        }
      }

      return { success: true, results };
    } catch (error) {
      console.error('Failed to send order status update notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order cancellation notification (email + SMS)
   */
  async sendOrderCancellationNotification(order, user) {
    try {
      const results = {
        email: null,
        sms: null
      };

      // Send email
      try {
        results.email = await emailService.sendOrderCancellationEmail(order, user);
      } catch (emailError) {
        console.error('Failed to send order cancellation email:', emailError);
        results.email = { success: false, error: emailError.message };
      }

      // Send SMS if user has phone and SMS notifications enabled
      if (user.phone && user.preferences?.notifications?.sms) {
        try {
          const smsMessage = `Your Ishori order ${order._id.toString().slice(-6)} has been cancelled. ${order.isPaid ? 'Refund will be processed within 5-7 business days.' : ''}`;
          
          if (smsService.client) {
            await smsService.client.messages.create({
              body: smsMessage,
              from: smsService.phoneNumber,
              to: user.phone
            });
            results.sms = { success: true };
            console.log(`Order cancellation SMS sent to ${user.phone}`);
          }
        } catch (smsError) {
          console.error('Failed to send order cancellation SMS:', smsError);
          results.sms = { success: false, error: smsError.message };
        }
      }

      return { success: true, results };
    } catch (error) {
      console.error('Failed to send order cancellation notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send password reset notification (email only)
   */
  async sendPasswordResetNotification(user, resetToken) {
    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
      
      console.log(`Password reset email sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to send password reset notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send password changed notification (email only)
   */
  async sendPasswordChangedNotification(user) {
    try {
      await emailService.sendPasswordChangedEmail(user);
      
      console.log(`Password changed email sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to send password changed notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send low stock alert notification (email to admin)
   */
  async sendLowStockAlertNotification(product, adminEmail) {
    try {
      await emailService.sendStockAlertEmail(product, adminEmail);
      
      console.log(`Low stock alert sent to ${adminEmail}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to send low stock alert:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send delivery alert SMS (SMS only)
   */
  async sendDeliveryAlertSMS(order, user) {
    try {
      if (!user.phone || !user.preferences?.notifications?.sms) {
        return { success: false, message: 'SMS notifications not enabled' };
      }

      const smsMessage = `Your Ishori order ${order._id.toString().slice(-6)} is out for delivery today! Please be available to receive it.`;
      
      if (smsService.client) {
        await smsService.client.messages.create({
          body: smsMessage,
          from: smsService.phoneNumber,
          to: user.phone
        });
        console.log(`Delivery alert SMS sent to ${user.phone}`);
        return { success: true };
      }

      return { success: false, message: 'SMS service not configured' };
    } catch (error) {
      console.error('Failed to send delivery alert SMS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send generic email
   */
  async sendEmail(to, subject, html) {
    try {
      return await emailService.sendEmail(to, subject, html);
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send generic SMS
   */
  async sendSMS(to, message) {
    try {
      if (!smsService.client) {
        return { success: false, message: 'SMS service not configured' };
      }

      await smsService.client.messages.create({
        body: message,
        from: smsService.phoneNumber,
        to: to
      });
      
      console.log(`SMS sent to ${to}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new NotificationService();
