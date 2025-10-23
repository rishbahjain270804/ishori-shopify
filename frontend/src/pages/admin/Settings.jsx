import { useState, useEffect } from 'react';
import { apiGet } from '../../utils/apiClient';
import './Settings.css';

const Settings = () => {
  const [features, setFeatures] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const res = await apiGet('/api/features');
      if (res.success) {
        setFeatures(res.features);
      }
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings">
      <h1>Settings</h1>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="card-header">
            <h2>🚀 Feature Flags</h2>
          </div>
          <div className="card-content">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-info">
                    <h4>GPT-5 Integration</h4>
                    <p>Enable AI-powered product recommendations</p>
                  </div>
                  <div className={`feature-status ${features.gpt5Enabled ? 'active' : ''}`}>
                    {features.gpt5Enabled ? '✅ Enabled' : '❌ Disabled'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <h2>🌐 Site Configuration</h2>
          </div>
          <div className="card-content">
            <div className="setting-item">
              <label>Site Name</label>
              <input type="text" value="Ishori" readOnly className="setting-input" />
            </div>
            <div className="setting-item">
              <label>Admin Email</label>
              <input type="email" value="admin@ishori.com" readOnly className="setting-input" />
            </div>
            <div className="setting-item">
              <label>Currency</label>
              <select className="setting-input" defaultValue="INR">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <h2>MongoDB Storage</h2>
          </div>
          <div className="card-content">
            <div className="storage-info">
              <div className="info-item">
                <span className="info-label">Images Stored:</span>
                <span className="info-value">GridFS</span>
              </div>
              <div className="info-item">
                <span className="info-label">Videos Stored:</span>
                <span className="info-value">GridFS</span>
              </div>
              <div className="info-item">
                <span className="info-label">Database:</span>
                <span className="info-value">MongoDB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <h2>🔧 Admin Profile</h2>
          </div>
          <div className="card-content">
            <div className="setting-item">
              <label>Name</label>
              <input type="text" placeholder="Admin Name" className="setting-input" />
            </div>
            <div className="setting-item">
              <label>Email</label>
              <input type="email" placeholder="admin@example.com" className="setting-input" />
            </div>
            <div className="setting-item">
              <label>Password</label>
              <input type="password" placeholder="••••••••" className="setting-input" />
            </div>
            <button className="btn-save">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
