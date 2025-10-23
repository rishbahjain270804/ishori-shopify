import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiPackage, FiShoppingCart, FiUsers, FiSettings, FiImage } from 'react-icons/fi'
import './Sidebar.css'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiHome /> },
    { name: 'Products', path: '/admin/products', icon: <FiPackage /> },
    { name: 'Media', path: '/admin/media', icon: <FiImage /> },
    { name: 'Orders', path: '/admin/orders', icon: <FiShoppingCart /> },
    { name: 'Customers', path: '/admin/customers', icon: <FiUsers /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
  ]

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="admin-sidebar glass-card">
      <div className="sidebar-logo">
        <h2 className="text-gradient">Ishori Admin</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
