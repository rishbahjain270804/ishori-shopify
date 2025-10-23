import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/Sidebar'
import AdminHeader from '../components/admin/Header'
import './AdminLayout.css'

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
