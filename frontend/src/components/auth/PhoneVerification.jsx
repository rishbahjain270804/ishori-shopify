import React, { useState, useEffect } from 'react';
import OTPInput from './OTPInput';
import './PhoneVerification.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PhoneVerification = ({ phoneNumber, onVerified, onBack }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOTPComplete = async (otpValue) => {
    setOtp(otpValue);
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Phone number verified successfully!');
        setTimeout(() => {
          onVerified(phoneNumber);
        }, 1000);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resendCooldown > 0) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('OTP resent successfully!');
        setTimeLeft(120);
        setCanResend(false);
        setResendCooldown(30);
      } else {
        if (data.remainingTime) {
          setResendCooldown(data.remainingTime);
        }
        setError(data.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="phone-verification-container">
      <div className="verification-header">
        <button onClick={onBack} className="back-button" disabled={loading}>
          ← Back
        </button>
        <h2>Verify Phone Number</h2>
        <p className="phone-display">
          We've sent a 6-digit code to <strong>{phoneNumber}</strong>
        </p>
      </div>

      <div className="verification-content">
        <OTPInput
          length={6}
          onComplete={handleOTPComplete}
          disabled={loading}
        />

        {error && (
          <div className="message error-message">
            <span className="icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            <span className="icon">✓</span>
            {success}
          </div>
        )}

        <div className="timer-section">
          {timeLeft > 0 ? (
            <p className="timer">
              Code expires in <strong>{formatTime(timeLeft)}</strong>
            </p>
          ) : (
            <p className="timer expired">Code expired</p>
          )}
        </div>

        <div className="resend-section">
          {resendCooldown > 0 ? (
            <p className="resend-info">
              Resend available in {resendCooldown} seconds
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={!canResend || loading}
              className={`resend-button ${canResend && !loading ? 'active' : ''}`}
            >
              {loading ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>

        <div className="help-text">
          <p>Didn't receive the code?</p>
          <ul>
            <li>Check if your phone number is correct</li>
            <li>Wait for the SMS to arrive (may take up to 1 minute)</li>
            <li>Check your spam/junk folder</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
