import './Auth.css'

const Register = () => {
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card glass-card">
          <h1 className="auth-title text-gradient">Create Account</h1>
          <form className="auth-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" required />
            </div>
            <button type="submit" className="auth-btn">Register</button>
          </form>
          <p className="auth-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
