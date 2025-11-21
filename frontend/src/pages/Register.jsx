import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavbarEnhanced from '../components/NavbarEnhanced';
import FooterUnified from '../components/FooterUnified';
import PhoneVerification from '../components/auth/PhoneVerification';
import './Auth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!formData.phone.trim()) {
      setErrors({ ...errors, phone: 'Phone number is required for verification' });
      return;
    }

    // Validate phone format (basic)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrors({ ...errors, phone: 'Invalid phone format. Include country code (e.g., +919876543210)' });
      return;
    }

    setLoading(true);
    setErrors({ ...errors, phone: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: formData.phone }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setShowOTPVerification(true);
      } else {
        setErrors({ ...errors, phone: data.message || 'Failed to send OTP' });
      }
    } catch (error) {
      setErrors({ ...errors, phone: 'Failed to send OTP. Please try again.' });
      console.error('Send OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerified = (verifiedPhone) => {
    setPhoneVerified(true);
    setShowOTPVerification(false);
    setFormData({ ...formData, phone: verifiedPhone });
  };

  const handleBackFromOTP = () => {
    setShowOTPVerification(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // If phone is provided but not verified, show error
    if (formData.phone && !phoneVerified) {
      setErrors({ ...errors, phone: 'Please verify your phone number' });
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register({
      ...registerData,
      phoneVerified
    });

    if (result.success) {
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <>
      <NavbarEnhanced />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            {showOTPVerification ? (
              <PhoneVerification
                phoneNumber={formData.phone}
                onVerified={handlePhoneVerified}
                onBack={handleBackFromOTP}
              />
            ) : (
              <>
                <div className="auth-header">
                  <h1>Create Account</h1>
                  <p>Join us for exclusive saree collections</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && (
                    <span className="error-message">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && (
                    <span className="error-message">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <div className="phone-input-group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+919876543210"
                    className={errors.phone ? 'error' : ''}
                    disabled={phoneVerified}
                  />
                  {!phoneVerified && formData.phone && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="verify-phone-btn"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Verify'}
                    </button>
                  )}
                  {phoneVerified && (
                    <span className="verified-badge">✓ Verified</span>
                  )}
                </div>
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
                <small className="form-hint">Include country code (e.g., +91 for India)</small>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>

              <button
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-alt">
              <p>Already have an account?</p>
              <Link to="/login" className="auth-alt-link">
                Login
              </Link>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
      <FooterUnified />
    </>
  );
};

export default Register;
