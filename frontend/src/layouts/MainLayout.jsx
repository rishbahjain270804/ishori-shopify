import NavbarEnhanced from '../components/NavbarEnhanced'
import FooterUnified from '../components/FooterUnified'
import './MainLayout.css'

const MainLayout = ({ children, className = '' }) => {
  return (
    <div className="main-layout">
      <NavbarEnhanced />
      <main className={`main-content ${className}`}>
        {children}
      </main>
      <FooterUnified />
    </div>
  )
}

export default MainLayout
