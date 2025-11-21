import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
    { path: '/admin/orders', icon: 'fa-shopping-cart', label: 'Orders' },
    { path: '/admin/products', icon: 'fa-box', label: 'Products' },
    { path: '/admin/customers', icon: 'fa-users', label: 'Customers' },
    { path: '/admin/inventory', icon: 'fa-warehouse', label: 'Inventory' },
    { path: '/admin/coupons', icon: 'fa-ticket-alt', label: 'Coupons' },
    { path: '/admin/reports', icon: 'fa-file-alt', label: 'Reports' },
    { path: '/admin/settings', icon: 'fa-cog', label: 'Settings' },
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? 'I' : 'Ishori Admin'}</h2>
        <button onClick={() => setCollapsed(!collapsed)} className="toggle-btn">
          <i className={`fas fa-${collapsed ? 'angle-right' : 'angle-left'}`}></i>
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <i className={`fas ${item.icon}`}></i>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn" title={collapsed ? 'Logout' : ''}>
          <i className="fas fa-sign-out-alt"></i>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
