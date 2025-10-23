import './Auth.css'

const Login = () => {
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card glass-card">
          <h1 className="auth-title text-gradient">Welcome Back</h1>
          <form className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="auth-btn">Login</button>
          </form>
          <p className="auth-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
