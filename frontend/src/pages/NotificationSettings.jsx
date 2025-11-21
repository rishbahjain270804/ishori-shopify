import { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationSettings.css';

const NotificationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [preferences, setPreferences] = useState({
    newsletter: true,
    notifications: {
      email: true,
      sms: false
    }
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/notification-preferences`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load notification preferences'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/notification-preferences`,
        preferences,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Notification preferences saved successfully!'
        });
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save preferences'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (category, type = null) => {
    if (type) {
      setPreferences(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [type]: !prev[category][type]
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    }
  };

  if (loading) {
    return (
      <div className="notification-settings">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-settings">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Notification Settings</h1>
          <p>Manage how you receive notifications from Ishori Sarees</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <div className="settings-sections">
          {/* Email Notifications */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-icon email">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="section-info">
                <h2>Email Notifications</h2>
                <p>Receive updates about your orders and account via email</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.notifications?.email}
                  onChange={() => handleToggle('notifications', 'email')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {preferences.notifications?.email && (
              <div className="section-details">
                <div className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Order Confirmations</strong>
                    <p>Get notified when your order is confirmed</p>
                  </div>
                </div>
                <div className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Order Status Updates</strong>
                    <p>Track your order with status change notifications</p>
                  </div>
                </div>
                <div className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Delivery Notifications</strong>
                    <p>Know when your order is delivered</p>
                  </div>
                </div>
                <div className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Account Security</strong>
                    <p>Important updates about your account security</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SMS Notifications */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-icon sms">
                <i className="fas fa-sms"></i>
              </div>
              <div className="section-info">
                <h2>SMS Notifications</h2>
                <p>Get important updates via text message</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.notifications?.sms}
                  onChange={() => handleToggle('notifications', 'sms')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {preferences.notifications?.sms && (
              <div className="section-details">
                <div className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Order Shipped</strong>
                    <p>SMS when your order is shipped</p>
                  </div>
                </div>
                <div className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Out for Delivery</strong>
                    <p>SMS when your order is out for delivery</p>
                  </div>
                </div>
                <div className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Delivered</strong>
                    <p>SMS confirmation when order is delivered</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-icon newsletter">
                <i className="fas fa-newspaper"></i>
              </div>
              <div className="section-info">
                <h2>Newsletter & Promotions</h2>
                <p>Stay updated with new collections, offers, and exclusive deals</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.newsletter}
                  onChange={() => handleToggle('newsletter')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {preferences.newsletter && (
              <div className="section-details">
                <div className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>New Arrivals</strong>
                    <p>Be the first to know about new saree collections</p>
                  </div>
                </div>
                <div className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Special Offers</strong>
                    <p>Exclusive discounts and promotional offers</p>
                  </div>
                </div>
                <div className="notification-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Seasonal Sales</strong>
                    <p>Early access to festive and seasonal sales</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-save"
          >
            {saving ? (
              <>
                <span className="spinner-small"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save Preferences
              </>
            )}
          </button>
        </div>

        <div className="settings-note">
          <i className="fas fa-info-circle"></i>
          <p>
            <strong>Note:</strong> You can change these preferences anytime. 
            Some notifications like order confirmations and security alerts cannot be disabled 
            as they are essential for your account security and order tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
