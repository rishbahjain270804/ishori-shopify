import twilio from 'twilio';
import OTP from '../models/otp.model.js';

class SMSService {
  constructor() {
    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
      this.isConfigured = true;
    } else {
      console.warn('⚠️  Twilio credentials not configured. SMS service will run in mock mode.');
      this.isConfigured = false;
    }
  }

  /**
   * Generate a 6-digit random OTP
   * @returns {string} 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Check if phone number is rate limited
   * @param {string} phoneNumber - Phone number to check
   * @returns {Promise<{isLimited: boolean, remainingTime: number}>}
   */
  async isRateLimited(phoneNumber) {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      // Count OTP requests in the last hour
      const recentOTPs = await OTP.countDocuments({
        phoneNumber,
        createdAt: { $gte: oneHourAgo }
      });

      if (recentOTPs >= 3) {
        // Find the oldest OTP to calculate remaining time
        const oldestOTP = await OTP.findOne({
          phoneNumber,
          createdAt: { $gte: oneHourAgo }
        }).sort({ createdAt: 1 });

        const remainingTime = oldestOTP 
          ? Math.ceil((oldestOTP.createdAt.getTime() + 60 * 60 * 1000 - Date.now()) / 1000)
          : 0;

        return {
          isLimited: true,
          remainingTime,
          message: `Too many OTP requests. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`
        };
      }

      return { isLimited: false, remainingTime: 0 };
    } catch (error) {
      console.error('Rate limit check error:', error);
      throw error;
    }
  }

  /**
   * Send OTP via SMS
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} otp - OTP to send (optional, will generate if not provided)
   * @returns {Promise<{success: boolean, otp: string, expiresAt: Date}>}
   */
  async sendOTP(phoneNumber, otp = null) {
    try {
      // Check rate limiting
      const rateLimitCheck = await this.isRateLimited(phoneNumber);
      if (rateLimitCheck.isLimited) {
        throw new Error(rateLimitCheck.message);
      }

      // Generate OTP if not provided
      const generatedOTP = otp || this.generateOTP();
      
      // Set expiry to 120 seconds (2 minutes)
      const expiresAt = new Date(Date.now() + 120 * 1000);

      // Delete any existing OTPs for this phone number
      await OTP.deleteMany({ phoneNumber, verified: false });

      // Store OTP in database
      const otpDoc = await OTP.create({
        phoneNumber,
        otp: generatedOTP,
        expiresAt,
        attempts: 0,
        verified: false
      });

      // Send SMS via Twilio
      const message = `Your Ishori verification code is: ${generatedOTP}. Valid for 2 minutes. Do not share this code with anyone.`;
      
      if (this.isConfigured) {
        try {
          await this.client.messages.create({
            body: message,
            from: this.phoneNumber,
            to: phoneNumber
          });
          console.log(`✅ OTP sent to ${phoneNumber}`);
        } catch (twilioError) {
          console.error('Twilio SMS error:', twilioError);
          // Don't throw error, continue in mock mode
          console.log(`📱 Mock SMS: ${message}`);
        }
      } else {
        // Mock mode for development
        console.log(`📱 Mock SMS to ${phoneNumber}: ${message}`);
      }

      return {
        success: true,
        otp: process.env.NODE_ENV === 'development' ? generatedOTP : undefined, // Only return OTP in dev mode
        expiresAt,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  /**
   * Verify OTP
   * @param {string} phoneNumber - Phone number
   * @param {string} otp - OTP to verify
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifyOTP(phoneNumber, otp) {
    try {
      // Find the most recent OTP for this phone number
      const otpDoc = await OTP.findOne({
        phoneNumber,
        verified: false
      }).sort({ createdAt: -1 });

      if (!otpDoc) {
        return {
          success: false,
          message: 'No OTP found. Please request a new one.'
        };
      }

      // Check if OTP is expired
      if (otpDoc.isExpired()) {
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.'
        };
      }

      // Check if too many attempts
      if (otpDoc.attempts >= 5) {
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.'
        };
      }

      // Verify OTP
      if (otpDoc.otp !== otp) {
        await otpDoc.incrementAttempts();
        return {
          success: false,
          message: `Invalid OTP. ${5 - otpDoc.attempts} attempts remaining.`
        };
      }

      // Mark as verified
      otpDoc.verified = true;
      await otpDoc.save();

      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  /**
   * Check if phone number can resend OTP (30 second cooldown)
   * @param {string} phoneNumber - Phone number to check
   * @returns {Promise<{canResend: boolean, remainingTime: number}>}
   */
  async canResendOTP(phoneNumber) {
    try {
      const lastOTP = await OTP.findOne({ phoneNumber })
        .sort({ createdAt: -1 });

      if (!lastOTP) {
        return { canResend: true, remainingTime: 0 };
      }

      const timeSinceLastOTP = Date.now() - lastOTP.createdAt.getTime();
      const cooldownPeriod = 30 * 1000; // 30 seconds

      if (timeSinceLastOTP < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastOTP) / 1000);
        return {
          canResend: false,
          remainingTime,
          message: `Please wait ${remainingTime} seconds before requesting a new OTP.`
        };
      }

      return { canResend: true, remainingTime: 0 };
    } catch (error) {
      console.error('Can resend check error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new SMSService();
