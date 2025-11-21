import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavbarEnhanced from '../components/NavbarEnhanced';
import FooterUnified from '../components/FooterUnified';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
    
    setLoading(false);
  };

  return (
    <>
      <NavbarEnhanced />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <div className="form-footer">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-alt">
              <p>Don't have an account?</p>
              <Link to="/register" className="auth-alt-link">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
      <FooterUnified />
    </>
  );
};

export default Login;
