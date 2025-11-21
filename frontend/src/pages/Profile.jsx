import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.data);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(formData);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.firstName} />
              ) : (
                <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
              )}
            </div>
            <div className="profile-info">
              <h2>{user?.firstName} {user?.lastName}</h2>
              <p>{user?.email}</p>
              {user?.phone && <p>{user.phone}</p>}
            </div>
            <button onClick={() => setEditing(!editing)} className="btn-edit">
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-primary">Save Changes</button>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{user?.phone || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Member Since:</span>
                <span className="value">{new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="profile-links">
          <Link to="/orders" className="link-card">
            <i className="fas fa-shopping-bag"></i>
            <h3>My Orders</h3>
            <p>View and track your orders</p>
          </Link>
          <Link to="/addresses" className="link-card">
            <i className="fas fa-map-marker-alt"></i>
            <h3>Addresses</h3>
            <p>Manage shipping addresses</p>
          </Link>
          <Link to="/wishlist" className="link-card">
            <i className="fas fa-heart"></i>
            <h3>Wishlist</h3>
            <p>View saved items</p>
          </Link>
          <Link to="/notifications" className="link-card">
            <i className="fas fa-bell"></i>
            <h3>Notifications</h3>
            <p>Manage preferences</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
