import { FiBell, FiLogOut, FiUser } from 'react-icons/fi'
import './Header.css'

const Header = () => {
  return (
    <header className="admin-header glass-card">
      <div className="admin-header-content">
        <h1 className="admin-header-title">Welcome back, Admin</h1>
        <div className="admin-header-actions">
          <button className="admin-icon-btn glass-button">
            <FiBell />
          </button>
          <button className="admin-icon-btn glass-button">
            <FiUser />
          </button>
          <button className="admin-icon-btn glass-button">
            <FiLogOut />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
